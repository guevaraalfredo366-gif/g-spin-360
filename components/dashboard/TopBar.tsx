'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

const TITLES: Record<string, string> = {
  '/dashboard':              'Dashboard',
  '/dashboard/events':       'Mis Eventos',
  '/dashboard/subscription': 'Membresía',
  '/dashboard/profile':      'Mi Perfil',
  '/admin':                  'Admin — Panel Central',
  '/admin/users':            'Admin — Usuarios',
};

export default function TopBar() {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const title    = TITLES[pathname] ?? 'Dashboard';

  const displayName    = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Operador';
  const avatarInitial  = displayName[0]?.toUpperCase() ?? 'U';

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        height: '64px',
        flexShrink: 0,
        background: '#080810',
        borderBottom: '1px solid #1E1E35',
      }}
    >
      <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', margin: 0 }}>{title}</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Notification bell */}
        <button
          style={{
            width: '36px', height: '36px',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#0F0F1A', border: '1px solid #1E1E35',
            color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} style={{ width: '16px', height: '16px' }}>
            <path strokeLinecap="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* User chip */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            paddingLeft: '8px', paddingRight: '12px', height: '36px',
            borderRadius: '10px',
            background: '#0F0F1A', border: '1px solid #1E1E35',
          }}
        >
          <div
            style={{
              width: '24px', height: '24px', borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 900, color: '#ffffff',
              background: 'linear-gradient(135deg, #9D7CFF, #7C5CDB)',
              flexShrink: 0,
            }}
          >
            {avatarInitial}
          </div>
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
            {displayName}
          </span>
        </div>
      </div>
    </header>
  );
}
