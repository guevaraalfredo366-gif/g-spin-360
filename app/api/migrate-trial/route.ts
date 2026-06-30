import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const db = getAdminDb();
  const userRef = db.collection('users').doc(uid);
  const snap = await userRef.get();

  if (!snap.exists) {
    return NextResponse.json({ error: 'User document not found' }, { status: 404 });
  }

  const data = snap.data()!;

  // Only act on trial accounts that genuinely have no expiryDate yet
  if (data.licenseStatus !== 'trial' || data.expiryDate != null) {
    return NextResponse.json({ migrated: false });
  }

  // Anchor expiryDate to createdAt when available so the trial starts from signup,
  // not from when the migration first ran.
  const baseMs: number = data.createdAt?.toMillis?.() ?? Date.now();
  const expiryDate = new Date(baseMs + 7 * 24 * 60 * 60 * 1000);

  await userRef.update({ expiryDate });

  return NextResponse.json({ migrated: true });
}
