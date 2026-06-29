'use client';

import { useState } from 'react';

const USERS = [
  { name: 'Carlos Ruiz',     email: 'ops1@gspin.mx',          plan: 'Pro',      days: 18, events: 8,  videos: 342,  status: 'Activo',     joined: '01 Ene 2026' },
  { name: 'María García',    email: 'eventos@corporativo.mx',  plan: 'Business', days: 22, events: 15, videos: 890,  status: 'Activo',     joined: '15 Feb 2026' },
  { name: 'Demo User',       email: 'demo@gspin.mx',           plan: 'Starter',  days: 3,  events: 2,  videos: 47,   status: 'Por vencer', joined: '01 Jun 2026' },
  { name: 'Ana López',       email: 'nuevo@cliente.mx',        plan: 'Pro',      days: 30, events: 0,  videos: 0,    status: 'Nuevo',      joined: '25 Jun 2026' },
  { name: 'Roberto Sánchez', email: 'roberto@eventospro.com',  plan: 'Business', days: 14, events: 22, videos: 1204, status: 'Activo',     joined: '10 Mar 2026' },
  { name: 'Lucía Morales',   email: 'lucia@celebrations.mx',   plan: 'Pro',      days: 0,  events: 5,  videos: 178,  status: 'Expirado',   joined: '15 Abr 2026' },
];

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  'Activo':     { background: 'rgba(34,197,94,0.1)',   color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' },
  'Por vencer': { background: 'rgba(245,158,11,0.1)',  color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' },
  'Nuevo':      { background: 'rgba(157,124,255,0.1)', color: '#9D7CFF', border: '1px solid rgba(157,124,255,0.2)' },
  'Expirado':   { background: 'rgba(239,68,68,0.1)',   color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' },
};

const PLAN_COLOR: Record<string, string> = { Starter: '#6b7280', Pro: '#9D7CFF', Business: '#FF7300' };

export default function AdminUsersPage() {
  const [search,     setSearch]     = useState('');
  const [planFilter, setPlanFilter] = useState('Todos');

  const filtered = USERS.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan   = planFilter === 'Todos' || u.plan === planFilter;
    return matchSearch && matchPlan;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: '0 0 4px' }}>Gestión de Usuarios</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{USERS.length} operadores registrados en la plataforma</p>
        </div>
        <button
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#ffffff',
            background: '#9D7CFF',
            boxShadow: '0 0 20px rgba(157,124,255,0.3)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          + Nuevo operador
        </button>
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {/* Search — position:relative (inline) so icon is correctly placed */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <svg
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              width: '16px', height: '16px', color: 'rgba(255,255,255,0.3)',
              pointerEvents: 'none',
            }}
          >
            <path strokeLinecap="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre o correo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '44px', paddingRight: '16px',
              paddingTop: '12px', paddingBottom: '12px',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#ffffff',
              background: '#0F0F1A',
              border: '1px solid #1E1E35',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#9D7CFF')}
            onBlur={(e)  => (e.currentTarget.style.borderColor = '#1E1E35')}
          />
        </div>

        {/* Plan filter tabs */}
        <div style={{ display: 'flex', padding: '4px', borderRadius: '12px', background: '#0F0F1A', border: '1px solid #1E1E35', flexShrink: 0 }}>
          {['Todos', 'Starter', 'Pro', 'Business'].map((p) => (
            <button
              key={p}
              onClick={() => setPlanFilter(p)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: planFilter === p ? 'rgba(157,124,255,0.15)' : 'transparent',
                color:       planFilter === p ? '#9D7CFF' : 'rgba(255,255,255,0.4)',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#0F0F1A', border: '1px solid #1E1E35' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1E1E35' }}>
                {['Operador', 'Plan', 'Días restantes', 'Eventos', 'Videos', 'Estado', 'Miembro desde', 'Acciones'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr
                  key={user.email}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(30,30,53,0.5)' : 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Operador */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, color: '#ffffff', background: 'linear-gradient(135deg, #9D7CFF, #7C5CDB)', flexShrink: 0 }}>
                        {user.name[0]}
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff', margin: '0 0 2px', whiteSpace: 'nowrap' }}>{user.name}</p>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Plan */}
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: PLAN_COLOR[user.plan] }}>{user.plan}</span>
                  </td>

                  {/* Days */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '56px', height: '6px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }}>
                        <div style={{ height: '100%', borderRadius: '9999px', width: `${Math.min(100, (user.days / 30) * 100)}%`, background: user.days <= 5 ? '#F59E0B' : '#9D7CFF' }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: user.days <= 5 ? '#F59E0B' : '#ffffff', whiteSpace: 'nowrap' }}>{user.days}d</span>
                    </div>
                  </td>

                  <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{user.events}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{user.videos.toLocaleString()}</td>

                  {/* Status */}
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap', ...(STATUS_STYLE[user.status] ?? {}) }}>
                      {user.status}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px', fontSize: '12px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{user.joined}</td>

                  {/* Actions */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#9D7CFF', background: 'transparent', border: '1px solid rgba(157,124,255,0.3)', transition: 'background 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(157,124,255,0.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        Editar
                      </button>
                      <button
                        style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: 'rgba(255,255,255,0.3)', background: 'transparent', border: '1px solid #1E1E35', transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.borderColor = '#1E1E35'; }}
                      >
                        Revocar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ fontSize: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
        {filtered.length} de {USERS.length} usuarios · Conectar a Firestore para datos reales
      </p>
    </div>
  );
}
