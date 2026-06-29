'use client';

import { useState } from 'react';
import Link from 'next/link';

type Period = 'monthly' | 'annual';

const PLANS = [
  {
    id: 'starter', name: 'Starter', color: '#6b7280',
    price: { monthly: 0, annual: 0 },
    features: ['7 días de prueba', '1 evento activo', '50 videos', 'Marca de agua G-SPIN'],
  },
  {
    id: 'pro', name: 'Pro', color: '#9D7CFF',
    price: { monthly: 1499, annual: 1199 },
    features: ['30 días de acceso', 'Eventos ilimitados', 'Sin marca de agua', 'Intros/outros', 'Música personalizada'],
  },
  {
    id: 'business', name: 'Business', color: '#FF7300',
    price: { monthly: 3999, annual: 3199 },
    features: ['Todo en Pro', 'Filtros premium', 'Multi-operador', 'Galería marca blanca', 'API access'],
  },
];

const HISTORY = [
  { date: '17 Jun 2026', plan: 'Pro', amount: '$1,499', method: 'Stripe', status: 'Pagado' },
  { date: '17 May 2026', plan: 'Pro', amount: '$1,499', method: 'Stripe', status: 'Pagado' },
  { date: '17 Abr 2026', plan: 'Pro', amount: '$1,499', method: 'Stripe', status: 'Pagado' },
];

export default function SubscriptionPage() {
  const [period, setPeriod] = useState<Period>('monthly');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1280px' }}>

      {/* Title */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: '0 0 4px' }}>Membresía</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Gestiona tu plan de acceso y facturación.</p>
      </div>

      {/* Current plan card — blob is safely contained inside position:relative + overflow:hidden */}
      <div
        style={{
          padding: '24px',
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(157,124,255,0.12) 0%, rgba(124,92,219,0.06) 100%)',
          border: '1px solid rgba(157,124,255,0.25)',
        }}
      >
        {/* Decorative blob — z-index 0, clipped by overflow:hidden above */}
        <div
          className="blob"
          style={{ width: '200px', height: '200px', right: '-40px', top: '-40px', background: '#9D7CFF', opacity: 0.12, zIndex: 0 }}
        />

        {/* Content — z-index 1, sits above blob */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          {/* Left: plan info */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9D7CFF', marginBottom: '4px' }}>
              Plan actual
            </p>
            <h2 style={{ fontSize: '30px', fontWeight: 900, color: '#ffffff', marginBottom: '4px' }}>Pro</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
              Próxima renovación: <strong style={{ color: '#ffffff' }}>17 Jul 2026</strong>
            </p>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>Días restantes</span>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>18 / 30</span>
              </div>
              <div style={{ height: '6px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)' }}>
                <div style={{ height: '100%', width: '60%', borderRadius: '9999px', background: 'linear-gradient(90deg, #9D7CFF, #7C5CDB)' }} />
              </div>
            </div>
          </div>

          {/* Right: quick stats + renew */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
              {[{ v: '24', l: 'Eventos' }, { v: '1,847', l: 'Videos' }, { v: '∞', l: 'Almac.' }].map((s) => (
                <div key={s.l} style={{ padding: '12px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: '0 0 2px' }}>{s.v}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>{s.l}</p>
                </div>
              ))}
            </div>
            <button
              style={{
                width: '100%', padding: '12px',
                borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: '#ffffff',
                background: '#9D7CFF', boxShadow: '0 0 20px rgba(157,124,255,0.3)',
                border: 'none', cursor: 'pointer',
              }}
            >
              Renovar ahora
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade plans */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Cambiar plan</h2>
          <div style={{ display: 'flex', padding: '4px', borderRadius: '12px', background: '#0F0F1A', border: '1px solid #1E1E35' }}>
            {([['monthly', 'Mensual'], ['annual', 'Anual -20%']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: period === key ? '#9D7CFF' : 'transparent',
                  color:      period === key ? '#ffffff' : 'rgba(255,255,255,0.4)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {PLANS.map((plan) => {
            const isCurrent = plan.id === 'pro';
            const price     = plan.price[period];
            return (
              <div
                key={plan.id}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: isCurrent ? '#13112A' : '#0F0F1A',
                  border: `1px solid ${isCurrent ? plan.color + '50' : '#1E1E35'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>{plan.name}</p>
                  {isCurrent && (
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '8px', background: 'rgba(157,124,255,0.15)', color: '#9D7CFF' }}>
                      Actual
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '24px', fontWeight: 900, marginBottom: '16px', color: plan.color }}>
                  {price === 0 ? 'Gratis' : `$${price.toLocaleString()}`}
                  {price > 0 && <span style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginLeft: '4px' }}>/mes</span>}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                  {plan.features.map((f) => (
                    <p key={f} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>✓ {f}</p>
                  ))}
                </div>

                <button
                  disabled={isCurrent}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: isCurrent ? 'default' : 'pointer',
                    opacity: isCurrent ? 0.6 : 1,
                    background: isCurrent ? 'transparent' : plan.color,
                    color:  isCurrent ? plan.color : '#ffffff',
                    border: isCurrent ? `1px solid ${plan.color}40` : 'none',
                  }}
                >
                  {isCurrent ? 'Plan activo' : plan.id === 'starter' ? 'Bajar a Starter' : 'Actualizar'}
                </button>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: '12px', marginTop: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>
          Integración con Stripe y MercadoPago disponible próximamente. Contacta a soporte para gestionar manualmente.
        </p>
      </div>

      {/* Billing history */}
      <div>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>Historial de pagos</h2>
        <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#0F0F1A', border: '1px solid #1E1E35' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1E1E35' }}>
                  {['Fecha', 'Plan', 'Monto', 'Método', 'Estado'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HISTORY.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < HISTORY.length - 1 ? '1px solid rgba(30,30,53,0.5)' : 'none' }}>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{row.date}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 500, color: '#ffffff' }}>{row.plan}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{row.amount} MXN</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{row.method}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
