'use client';

import StatsCard from '@/components/dashboard/StatsCard';
import Link from 'next/link';
import { LICENSE_MAP } from '@/lib/licenses';

const RECENT_USERS = [
  { name: 'Carlos Ruiz',  email: 'ops1@gspin.mx',          licenseId: 'pro'      as const, days: 18,  status: 'Activo' },
  { name: 'María García', email: 'eventos@corporativo.mx', licenseId: 'elite'    as const, days: 240, status: 'Activo' },
  { name: 'Demo User',    email: 'demo@gspin.mx',          licenseId: 'starter'  as const, days: 3,   status: 'Por vencer' },
  { name: 'Ana López',    email: 'nuevo@cliente.mx',       licenseId: 'standard' as const, days: 58,  status: 'Nuevo' },
];

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  'Activo':     { background: 'rgba(34,197,94,0.1)',   color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' },
  'Por vencer': { background: 'rgba(245,158,11,0.1)',  color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' },
  'Nuevo':      { background: 'rgba(157,124,255,0.1)', color: '#9D7CFF', border: '1px solid rgba(157,124,255,0.2)' },
};

export default function AdminPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1280px' }}>

      {/* Title */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: '0 0 4px' }}>Panel de Administración</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Visión global de la plataforma G-SPIN 360.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatsCard title="Usuarios activos" value="48" subtitle="4 nuevos esta semana" accent="#9D7CFF"
          trend={{ value: '+8.3%', up: true }}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5"><path strokeLinecap="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatsCard title="Licencias activas" value="31" subtitle="Standard: 14 · Elite: 9 · Pro: 8" accent="#FF7300"
          trend={{ value: '+12%', up: true }}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5"><path strokeLinecap="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
        />
        <StatsCard title="Ingresos del mes" value="$68,432" subtitle="MXN · Jun 2026" accent="#22C55E"
          trend={{ value: '+24%', up: true }}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5"><path strokeLinecap="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatsCard title="Videos generados" value="12,847" subtitle="Total plataforma" accent="#9D7CFF"
          trend={{ value: '+1,204 mes', up: true }}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5"><path strokeLinecap="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.89L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>}
        />
      </div>

      {/* Recent users */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Usuarios recientes</h2>
          <Link href="/admin/users" style={{ fontSize: '12px', fontWeight: 500, color: '#FF7300', textDecoration: 'none' }}>
            Ver todos →
          </Link>
        </div>

        <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#0F0F1A', border: '1px solid #1E1E35' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1E1E35' }}>
                  {['Operador', 'Licencia', 'Días restantes', 'Estado'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_USERS.map((u, i) => (
                  <tr
                    key={u.email}
                    style={{ borderBottom: i < RECENT_USERS.length - 1 ? '1px solid rgba(30,30,53,0.5)' : 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, color: '#ffffff', background: 'linear-gradient(135deg, #9D7CFF, #7C5CDB)', flexShrink: 0 }}>
                          {u.name[0]}
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff', margin: '0 0 2px', whiteSpace: 'nowrap' }}>{u.name}</p>
                          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: LICENSE_MAP[u.licenseId].color }}>{LICENSE_MAP[u.licenseId].name}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '64px', height: '6px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }}>
                          <div style={{ height: '100%', borderRadius: '9999px', width: `${Math.min(100, (u.days / (LICENSE_MAP[u.licenseId].days ?? u.days)) * 100)}%`, background: u.days <= 5 ? '#F59E0B' : '#9D7CFF' }} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: u.days <= 5 ? '#F59E0B' : '#ffffff', whiteSpace: 'nowrap' }}>{u.days}d</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, ...STATUS_STYLE[u.status] }}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Revenue breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Ingreso G-Spin Standard', value: '$11,886', detail: '14 licencias', color: LICENSE_MAP.standard.color },
          { label: 'Ingreso G-Spin Elite',    value: '$35,991', detail: '9 licencias',  color: LICENSE_MAP.elite.color },
          { label: 'Pagos pendientes',        value: '$3,200',  detail: '2 facturas',   color: '#F59E0B' },
        ].map((item) => (
          <div
            key={item.label}
            style={{ padding: '20px', borderRadius: '16px', background: '#0F0F1A', border: '1px solid #1E1E35' }}
          >
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: '0 0 4px' }}>{item.label}</p>
            <p style={{ fontSize: '24px', fontWeight: 900, color: item.color, margin: '0 0 4px' }}>{item.value}</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
