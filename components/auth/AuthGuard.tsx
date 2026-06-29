'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';

function Spinner({ color = '#9D7CFF', label = 'Verificando acceso…' }: { color?: string; label?: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080810' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: `2px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#080810' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router            = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user)                { router.replace('/login');        return; }
    if (!user.emailVerified)  { router.replace('/verify-email'); return; }
  }, [user, loading, router]);

  if (loading || !user || !user.emailVerified) return <Spinner />;

  return <DashboardShell>{children}</DashboardShell>;
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const router                     = useRouter();
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user)               { router.replace('/login');     return; }
    if (!user.emailVerified) { router.replace('/verify-email'); return; }
    if (!isAdmin)            { router.replace('/dashboard'); return; }
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !user.emailVerified || !isAdmin) {
    return <Spinner color="#FF7300" />;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
