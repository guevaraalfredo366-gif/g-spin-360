import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Lazy singleton — initialization is deferred to first call at runtime,
// not at module import time (which would fail during Next.js build analysis).
let _db: Firestore | null = null;

export function getAdminDb(): Firestore {
  if (_db) return _db;

  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error('Missing env var: FIREBASE_ADMIN_SERVICE_ACCOUNT');
  }

  const serviceAccount = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));

  const app =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({ credential: cert(serviceAccount) });

  _db = getFirestore(app);
  return _db;
}
