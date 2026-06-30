import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

// Lazy singleton — all three getters share one App instance initialized on first call.
// This prevents Firebase from crashing during Next.js build-time static analysis,
// which runs with empty env vars.
let _app:  App       | null = null;
let _db:   Firestore | null = null;
let _auth: Auth      | null = null;

function getAdminApp(): App {
  if (_app) return _app;
  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
  if (!raw) throw new Error('Missing env var: FIREBASE_ADMIN_SERVICE_ACCOUNT');
  const serviceAccount = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
  _app = getApps().length > 0 ? getApps()[0] : initializeApp({ credential: cert(serviceAccount) });
  return _app;
}

export function getAdminDb(): Firestore {
  if (_db) return _db;
  _db = getFirestore(getAdminApp());
  return _db;
}

export function getAdminAuth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(getAdminApp());
  return _auth;
}
