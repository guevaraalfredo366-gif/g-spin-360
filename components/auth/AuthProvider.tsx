'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { LicenseId } from '@/lib/licenses';

export interface UserProfile {
  role: 'operator' | 'admin';
  licenseId: LicenseId;
  /** null = no active license OR lifetime (see licenseStatus). */
  expiryDate?: Timestamp | null;
  licenseStatus: 'trial' | 'active' | 'expired' | 'lifetime';
  displayName?: string;
  phone?: string;
  company?: string;
  stripeCustomerId?: string;
  activatedAt?: { toDate(): Date } | null;
}

/** Days left on the current license. Infinity for lifetime, 0 if expired/missing. */
export function daysRemaining(profile: UserProfile | null): number {
  if (!profile) return 0;
  if (profile.licenseStatus === 'lifetime') return Infinity;
  if (!profile.expiryDate) return 0;
  const ms = profile.expiryDate.toDate().getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export function isLicenseExpired(profile: UserProfile | null): boolean {
  if (!profile) return true;
  if (profile.licenseStatus === 'lifetime') return false;
  if (!profile.expiryDate) return true;
  return profile.expiryDate.toDate().getTime() < Date.now();
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  profile: UserProfile | null;
}

const AuthCtx = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isAdmin: false,
  profile: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // undefined = auth state not yet resolved; null = signed out; User = signed in
  const [user,    setUser]    = useState<User | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const snap = await getDoc(doc(db, 'users', u.uid));
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setProfile(data);
            setIsAdmin(data.role === 'admin');
          } else {
            setProfile(null);
            setIsAdmin(false);
          }
        } catch {
          // Network error or rules denial — degrade gracefully, don't block auth
          setProfile(null);
          setIsAdmin(false);
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      // Set user AFTER profile fetch so loading stays true until both are ready
      setUser(u ?? null);
    });
    return unsub;
  }, []);

  return (
    <AuthCtx.Provider value={{
      user:    user ?? null,
      loading: user === undefined,
      isAdmin,
      profile,
    }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
