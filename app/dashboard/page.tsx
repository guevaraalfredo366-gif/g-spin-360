'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth, daysRemaining as computeDaysRemaining, isLicenseExpired } from '@/components/auth/AuthProvider';
import { LICENSE_MAP } from '@/lib/licenses';
import StatsCard from '@/components/dashboard/StatsCard';
import CreateEventButton from '@/components/dashboard/CreateEventButton';
import Link from 'next/link';

interface FirestoreEvent {
  id: string;
  name: string;
  date: Timestamp;
  createdAt?: Timestamp;
  location?: string;
  videoCount?: number;
  status: string;
}

function formatTs(ts: Timestamp | undefined): string {
  if (!ts?.toDate) return '—';
  return ts.toDate().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [events, setEvents]         = useState<FirestoreEvent[]>([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [evLoading, setEvLoading]   = useState(true);

  const license       = LICENSE_MAP[profile?.licenseId ?? 'starter'];
  const isLifetime     = profile?.licenseStatus === 'lifetime';
  const isTrial        = profile?.licenseStatus === 'trial';
  const expired        = isLicenseExpired(profile);
  const days           = computeDaysRemaining(profile);
  const displayName    = profile?.displayName || user?.displayName || 'Operador';

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'events'), where('operatorId', '==', user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as FirestoreEvent))
          .sort((a, b) => {
            // Sort descending by createdAt, fall back to date
            const aMs = a.createdAt?.toMillis?.() ?? a.date?.toMillis?.() ?? 0;
            const bMs = b.createdAt?.toMillis?.() ?? b.date?.toMillis?.() ?? 0;
            return bMs - aMs;
          });
        setEvents(docs);
        setTotalVideos(docs.reduce((sum, e) => sum + (e.videoCount ?? 0), 0));
        setEvLoading(false);
      },
      () => setEvLoading(false)
    );
    return unsub;
  }, [user]);

  const recentEvents = events.slice(0, 5);

  // Expiry date formatted for display
  const expiryFormatted = profile?.expiryDate?.toDate
    ? profile.expiryDate.toDate().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', maxWidth: '1280px' }}>

      {/* Welcome */}
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', margin: '0 0 6px' }}>
          Bienvenido, {displayName} 👋
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Aquí está el resumen de tu cuenta G-SPIN 360.
        </p>
      </div>

      {/* Stats grid — CSS Grid inline for reliable responsiveness in Tailwind v4 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <StatsCard
          title="Eventos totales"
          value={evLoading ? '—' : String(events.length)}
          subtitle="Registrados en tu cuenta"
          accent="#9D7CFF"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatsCard
          title="Videos generados"
          value={evLoading ? '—' : totalVideos.toLocaleString('es-MX')}
          subtitle="Total acumulado"
          accent="#FF7300"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.89L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          }
        />
        <StatsCard
          title="Días restantes"
          value={isLifetime ? '∞' : expired ? 'Expirada' : String(days)}
          subtitle={
            isLifetime ? 'Acceso vitalicio' :
            expired    ? 'Renueva tu licencia' :
            isTrial    ? `Prueba gratuita${expiryFormatted ? ` · vence el ${expiryFormatted}` : ''}` :
                         `Vence el ${expiryFormatted ?? '—'}`
          }
          accent={expired ? '#EF4444' : isTrial ? '#F59E0B' : '#22C55E'}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Licencia actual"
          value={license.name}
          subtitle={
            isTrial    ? 'En prueba — 7 días gratis' :
            isLifetime ? 'Vitalicia' :
            expired    ? 'Expirada — requiere compra' :
                         'Activa'
          }
          accent={license.color}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        />
      </div>

      {/* Recent events */}
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Eventos recientes</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <CreateEventButton expired={expired} />
            <Link href="/dashboard/events" style={{ fontSize: '12px', fontWeight: 500, color: '#9D7CFF', textDecoration: 'none' }}>
              Ver todos →
            </Link>
          </div>
        </div>

        <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #1E1E35', background: '#0F0F1A' }}>
          {evLoading ? (
            <div style={{ padding: '48px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.25)' }}>
              Cargando eventos…
            </div>
          ) : recentEvents.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>
                Aún no tienes eventos registrados.
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)' }}>
                Los eventos se crean desde la app G-SPIN 360.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1E1E35' }}>
                    {['Evento', 'Fecha', 'Ubicación', 'Videos', 'Estado'].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'left', padding: '14px 20px',
                          fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em',
                          textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((ev, i) => (
                    <tr
                      key={ev.id}
                      style={{ borderBottom: i < recentEvents.length - 1 ? '1px solid rgba(30,30,53,0.6)' : 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 500, color: '#ffffff', whiteSpace: 'nowrap' }}>{ev.name}</td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{formatTs(ev.date)}</td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{ev.location ?? '—'}</td>
                      <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{ev.videoCount ?? 0}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex', padding: '4px 10px', borderRadius: '8px',
                            fontSize: '10px', fontWeight: 700,
                            ...(ev.status === 'Completado'
                              ? { background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }
                              : { background: 'rgba(157,124,255,0.1)', color: '#9D7CFF', border: '1px solid rgba(157,124,255,0.2)' }),
                          }}
                        >
                          {ev.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>Acciones rápidas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Ver mis eventos',     href: '/dashboard/events',       color: '#9D7CFF', desc: 'Gestiona todos tus videos 360°' },
            { label: 'Gestionar membresía', href: '/dashboard/subscription', color: '#FF7300', desc: 'Planes y facturación' },
            { label: 'Editar perfil',       href: '/dashboard/profile',      color: '#22C55E', desc: 'Actualiza tu información' },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              style={{
                display: 'block', padding: '20px', borderRadius: '16px',
                background: '#0F0F1A', border: '1px solid #1E1E35',
                textDecoration: 'none', transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(157,124,255,0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1E1E35')}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.color, marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>{a.label}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
