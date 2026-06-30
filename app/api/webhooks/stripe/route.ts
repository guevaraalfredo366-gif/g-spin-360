import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAdminDb } from '@/lib/firebase-admin';

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
    const uid  = session.metadata?.firebaseUid;
    const plan = (session.metadata?.plan ?? 'pro') as 'pro' | 'business';

    if (!uid) {
      return NextResponse.json({ error: 'Missing firebaseUid in session metadata' }, { status: 400 });
    }

    await db.collection('users').doc(uid).update({
      plan,
      subscriptionStatus: 'active',
      stripeCustomerId:   session.customer ?? null,
      stripeSessionId:    session.id,
      activatedAt:        new Date(),
    });
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const uid = (sub.metadata as Record<string, string>)?.firebaseUid;
    if (uid) {
      await db.collection('users').doc(uid).update({
        subscriptionStatus: 'canceled',
      });
    }
  }

  return NextResponse.json({ received: true });
}
