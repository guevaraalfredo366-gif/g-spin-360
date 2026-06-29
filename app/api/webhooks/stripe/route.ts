import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
});

// Must use raw body — NOT req.json() — so Stripe can verify the HMAC signature
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    // Invalid signature — reject the request to block spoofed events
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const uid  = session.metadata?.firebaseUid;
    const plan = (session.metadata?.plan ?? 'pro') as 'pro' | 'business';

    if (!uid) {
      return NextResponse.json({ error: 'Missing firebaseUid in session metadata' }, { status: 400 });
    }

    // Write happens server-side via Admin SDK — clients can never elevate their own plan
    await adminDb.collection('users').doc(uid).update({
      plan,
      subscriptionStatus: 'active',
      stripeCustomerId:   session.customer   ?? null,
      stripeSessionId:    session.id,
      activatedAt:        new Date(),
    });
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const uid = (sub.metadata as Record<string, string>)?.firebaseUid;
    if (uid) {
      await adminDb.collection('users').doc(uid).update({
        subscriptionStatus: 'canceled',
      });
    }
  }

  return NextResponse.json({ received: true });
}
