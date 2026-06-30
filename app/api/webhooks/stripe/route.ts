import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAdminDb } from '@/lib/firebase-admin';
import { LICENSE_MAP, isValidLicenseId } from '@/lib/licenses';

// Prevent Next.js from pre-rendering or statically analyzing this route at build time.
// Without this, the build tries to instantiate the module and fails because
// STRIPE_SECRET_KEY / FIREBASE_ADMIN_SERVICE_ACCOUNT are only available at runtime.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Missing env var: STRIPE_SECRET_KEY');
  return new Stripe(key, { apiVersion: '2026-06-24.dahlia' });
}

export async function POST(req: NextRequest) {
  // req.text() is always safe to call on a NextRequest, but guard anyway
  const body = await req.text();
  if (!body) {
    return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  const db = getAdminDb();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const uid = session.metadata?.firebaseUid;
    const licenseIdRaw = session.metadata?.licenseId ?? '';

    if (!uid || !isValidLicenseId(licenseIdRaw)) {
      return NextResponse.json({ error: 'Missing or invalid metadata in session' }, { status: 400 });
    }

    const license = LICENSE_MAP[licenseIdRaw];
    const now = new Date();
    const userRef = db.collection('users').doc(uid);

    // Stack the purchased days on top of any remaining time — buying early extends, never wastes, the current license.
    const snap = await userRef.get();
    const existingExpiry: Date | undefined = snap.exists ? snap.data()?.expiryDate?.toDate?.() : undefined;
    const base = existingExpiry && existingExpiry.getTime() > now.getTime() ? existingExpiry : now;

    const update: Record<string, unknown> = {
      licenseId: license.id,
      stripeCustomerId: session.customer ?? null,
      stripeSessionId: session.id,
      lastPurchaseAt: now,
    };

    if (license.days === null) {
      // Lifetime license — no expiry to track.
      update.licenseStatus = 'lifetime';
      update.expiryDate = null;
    } else {
      update.licenseStatus = 'active';
      // Snap to 23:59:59.999 UTC so the license covers the full last day,
      // regardless of what time of day the purchase was made.
      const exp = new Date(base.getTime() + license.days * 86_400_000);
      exp.setUTCHours(23, 59, 59, 999);
      update.expiryDate = exp;
    }

    await userRef.update(update);

    // Record payment in subcollection for billing history display
    await userRef.collection('payments').doc(session.id).set({
      date: now,
      licenseId: license.id,
      amount: session.amount_total ?? license.priceCents,
      currency: session.currency ?? 'mxn',
      status: 'completed',
      stripeSessionId: session.id,
      stripeCustomerId: session.customer ?? null,
    });
  }

  return NextResponse.json({ received: true });
}
