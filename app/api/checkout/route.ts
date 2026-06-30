import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAdminAuth } from '@/lib/firebase-admin';
import { LICENSE_MAP, isValidLicenseId } from '@/lib/licenses';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Missing env var: STRIPE_SECRET_KEY');
  return new Stripe(key, { apiVersion: '2026-06-24.dahlia' });
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

  let licenseIdRaw = '';
  try {
    const body = await req.json() as { licenseId?: unknown };
    licenseIdRaw = typeof body.licenseId === 'string' ? body.licenseId.trim() : '';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!isValidLicenseId(licenseIdRaw)) {
    return NextResponse.json({ error: 'Licencia inválida.' }, { status: 400 });
  }

  // Price and duration always come from the server-side catalog — never trust the client.
  const license = LICENSE_MAP[licenseIdRaw];
  if (!license.purchasable) {
    return NextResponse.json({ error: 'Esta licencia no está disponible para compra.' }, { status: 400 });
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://g-spin-360.netlify.app').replace(/\/$/, '');

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'mxn',
          unit_amount: license.priceCents,
          product_data: { name: license.name, description: license.tagline },
        },
        quantity: 1,
      }],
      // firebaseUid + licenseId in metadata are consumed by the Stripe webhook to extend the license
      metadata: { firebaseUid: uid, licenseId: license.id },
      success_url: `${appUrl}/dashboard/subscription?success=1`,
      cancel_url: `${appUrl}/dashboard/subscription?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
