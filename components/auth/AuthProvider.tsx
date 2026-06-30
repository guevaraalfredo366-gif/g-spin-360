'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
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
  // Trial accounts created before the expiryDate field was introduced: assume 7 days.
  if (!profile.expiryDate) return profile.licenseStatus === 'trial' ? 7 : 0;
  const ms = profile.expiryDate.toDate().getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export function isLicenseExpired(profile: UserProfile | null): boolean {
  if (!profile) return true;
  if (profile.licenseStatus === 'lifetime') return false;
  // Trial without expiryDate: not expired (legacy account or fresh signup).
  if (!profile.expiryDate) return profile.licenseStatus !== 'trial';
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
    // Holds the Firestore real-time listener so it can be torn down on sign-out.
    let profileUnsub: (() => void) | null = null;

    const authUnsub = onAuthStateChanged(auth, (u) => {
      // Tear down the previous user's Firestore listener
      profileUnsub?.();
      profileUnsub = null;

      if (!u) {
        setProfile(null);
        setIsAdmin(false);
        setUser(null);
        return;
      }

      // onSnapshot keeps the profile live — dashboard updates immediately after
      // a Stripe webhook or the migration API writes to Firestore.
      profileUnsub = onSnapshot(
        doc(db, 'users', u.uid),
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setProfile(data);
            setIsAdmin(data.role === 'admin');

            // Fire-and-forget: backfill expiryDate for legacy trial accounts.
            // Uses the Admin SDK route so it bypasses client Firestore rules.
            // When the write completes, onSnapshot fires again with the new date.
            if (data.licenseStatus === 'trial' && !data.expiryDate) {
              u.getIdToken()
                .then((token) =>
                  fetch('/api/migrate-trial', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                  })
                )
                .catch(() => {});
            }
          } else {
            setProfile(null);
            setIsAdmin(false);
          }
          // loading stays true (user === undefined) until the first snapshot arrives
          setUser(u);
        },
        () => {
          // Network error or rules denial — degrade gracefully, don't block auth
          setProfile(null);
          setIsAdmin(false);
          setUser(u);
        }
      );
    });

    return () => {
      authUnsub();
      profileUnsub?.();
    };
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
