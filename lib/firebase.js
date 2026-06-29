import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            'AIzaSyDgEfJ2XO1FhF4IX35xSUaLDoDnmQuTtrA',
  authDomain:        'g-spin-360.firebaseapp.com',
  projectId:         'g-spin-360',
  storageBucket:     'g-spin-360.firebasestorage.app',
  messagingSenderId: '303219218996',
  appId:             '1:303219218996:web:35efae183e0257aed00861',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db  = getFirestore(app);
export const auth = getAuth(app);
