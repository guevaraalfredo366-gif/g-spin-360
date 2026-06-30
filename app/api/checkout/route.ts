import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAdminAuth } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Valid values — guard against arbitrary input before using as object keys
const VALID_PLANS   = new Set(['pro', 'business']);
const VALID_PERIODS = new Set(['monthly', 'annual']);

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Missing env var: STRIPE_SECRET_KEY');
  return new Stripe(key, { apiVersion: '2026-06-24.dahlia' });
}

function getPriceId(plan: string, period: string): string {
  // All four price IDs must be configured as env vars in Vercel
  const map: Record<string, Record<string, string | undefined>> = {
    pro: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
      annual:  process.env.STRIPE_PRICE_PRO_ANNUAL,
    },
    business: {
      monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
      annual:  process.env.STRIPE_PRICE_BUSINESS_ANNUAL,
    },
  };
  const priceId = map[plan]?.[period];
  if (!priceId) throw new Error(`Price ID not configured for ${plan}/${period}`);
  return priceId;
}

export async function POST(req: NextRequest) {
  // Verify Firebase ID token — every checkout must come from an authenticated user
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await getAdminAuth().verifyIdToken(authHeader.slice(7));
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  // Parse and validate body
  let plan = '', period = '';
  try {
    const body = await req.json() as { plan?: unknown; period?: unknown };
    plan   = typeof body.plan   === 'string' ? body.plan.trim()   : '';
    period = typeof body.period === 'string' ? body.period.trim() : '';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!VALID_PLANS.has(plan)) {
    return NextResponse.json({ error: 'Invalid plan. Must be "pro" or "business".' }, { status: 400 });
  }
  if (!VALID_PERIODS.has(period)) {
    return NextResponse.json({ error: 'Invalid period. Must be "monthly" or "annual".' }, { status: 400 });
  }

  let priceId: string;
  try {
    priceId = getPriceId(plan, period);
  } catch {
    return NextResponse.json(
      { error: 'Este plan aún no está configurado. Contacta a soporte.' },
      { status: 503 }
    );
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://g-spin-360.netlify.app').replace(/\/$/, '');

  try {
    const session = await getStripe().checkout.sessions.create({
      mode:       'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      // firebaseUid in metadata is consumed by the Stripe webhook to update Firestore
      metadata:   { firebaseUid: uid, plan },
      success_url: `${appUrl}/dashboard/subscription?success=1`,
      cancel_url:  `${appUrl}/dashboard/subscription?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
