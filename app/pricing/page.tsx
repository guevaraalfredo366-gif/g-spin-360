'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

type Period = 'daily' | 'monthly' | 'annual';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    desc: 'Ideal para probar la plataforma.',
    color: '#6b7280',
    price: { daily: 0, monthly: 0, annual: 0 },
    badge: null,
    features: [
      '7 días de acceso de prueba',
      '1 evento activo',
      'Hasta 50 videos por evento',
      'Marca de agua G-SPIN',
      'QR de descarga para invitados',
      'Soporte por email',
    ],
    missing: ['Sin marca de agua', 'Filtros premium', 'Intros/outros personalizados', 'Soporte prioritario'],
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: 'Para operadores activos y profesionales del evento.',
    color: '#9D7CFF',
    price: { daily: 299, monthly: 1499, annual: 1199 },
    badge: 'Más popular',
    features: [
      '30 días de acceso',
      'Eventos ilimitados',
      'Videos ilimitados',
      'Sin marca de agua',
      'Intros y outros personalizados',
      'Marcos PNG animados',
      'Música personalizada',
      'Soporte prioritario 24/7',
    ],
    missing: ['Filtros premium avanzados', 'API access'],
  },
  {
    id: 'business',
    name: 'Business',
    desc: 'Para agencias y empresas con alto volumen de eventos.',
    color: '#FF7300',
    price: { daily: 499, monthly: 3999, annual: 3199 },
    badge: null,
    features: [
      'Todo lo incluido en Pro',
      'Filtros y efectos premium',
      'Multi-usuario (hasta 5 operadores)',
      'Galería de marca blanca',
      'API de integración',
      'Dashboard analytics avanzado',
      'Soporte dedicado',
      'SLA garantizado',
    ],
    missing: [],
  },
];

const PERIOD_LABELS: Record<Period, string> = {
  daily:   'Por evento (día)',
  monthly: 'Mensual',
  annual:  'Anual (-20%)',
};

const PERIOD_SUFFIX: Record<Period, string> = {
  daily:   '/evento',
  monthly: '/mes',
  annual:  '/mes',
};

export default function PricingPage() {
  const [period, setPeriod] = useState<Period>('monthly');

  return (
    <div style={{ background: '#080810', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      {/* ── Hero + plans ── */}
      <section style={{ paddingTop: '128px', paddingBottom: '80px', padding: '128px 24px 80px' }}>

        {/* Title */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9D7CFF', marginBottom: '12px' }}>
            Planes y precios
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: '#ffffff', marginBottom: '16px', lineHeight: 1.1 }}>
            Elige tu plan
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', maxWidth: '440px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Sin contratos. Cancela cuando quieras. Precios en MXN.
          </p>

          {/* Period toggle */}
          <div
            style={{
              display: 'inline-flex',
              padding: '4px',
              borderRadius: '16px',
              background: '#0F0F1A',
              border: '1px solid #1E1E35',
            }}
          >
            {(Object.entries(PERIOD_LABELS) as [Period, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: period === key ? '#9D7CFF' : 'transparent',
                  color:      period === key ? '#ffffff' : 'rgba(255,255,255,0.45)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '64px',
            alignItems: 'start',
          }}
        >
          {PLANS.map((plan) => {
            const price       = plan.price[period];
            const highlighted = plan.id === 'pro';

            return (
              <div
                key={plan.id}
                style={{
                  position: 'relative',           /* required for badge absolute positioning */
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '24px',
                  borderRadius: '24px',
                  background: highlighted ? '#13112A' : '#0F0F1A',
                  border: `1px solid ${highlighted ? plan.color + '60' : '#1E1E35'}`,
                  boxShadow: highlighted ? `0 0 60px ${plan.color}20` : 'none',
                  marginTop: plan.badge ? '16px' : '0',
                }}
              >
                {/* Popular badge — absolutely positioned above card */}
                {plan.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 14px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#ffffff',
                        background: plan.color,
                      }}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '40px', height: '40px',
                      borderRadius: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `${plan.color}18`,
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: plan.color }} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', marginBottom: '4px' }}>{plan.name}</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{plan.desc}</p>
                </div>

                {/* Price */}
                <div style={{ marginBottom: '20px' }}>
                  {price === 0 ? (
                    <p style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', margin: 0 }}>Gratis</p>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                      <p style={{ fontSize: '36px', fontWeight: 900, color: plan.color, margin: 0 }}>
                        ${price.toLocaleString()}
                      </p>
                      <p style={{ fontSize: '13px', marginBottom: '6px', color: 'rgba(255,255,255,0.4)' }}>
                        MXN{PERIOD_SUFFIX[period]}
                      </p>
                    </div>
                  )}
                  {period === 'annual' && price > 0 && (
                    <p style={{ fontSize: '12px', marginTop: '4px', color: '#22C55E' }}>
                      Ahorra ${((plan.price.monthly - price) * 12).toLocaleString()} MXN al año
                    </p>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href="/register"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    textAlign: 'center',
                    textDecoration: 'none',
                    marginBottom: '20px',
                    transition: 'opacity 0.2s',
                    background: highlighted ? plan.color : 'transparent',
                    color:      highlighted ? '#ffffff' : plan.color,
                    border:     `1px solid ${plan.color}60`,
                    boxSizing:  'border-box',
                  }}
                >
                  {plan.id === 'starter' ? 'Empezar gratis' : 'Seleccionar plan'}
                </Link>

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '4px' }}>
                    Incluido
                  </p>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg viewBox="0 0 20 20" fill="none" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                        <circle cx="10" cy="10" r="10" fill={`${plan.color}20`} />
                        <path d="M6 10l3 3 5-5" stroke={plan.color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{f}</span>
                    </div>
                  ))}
                  {plan.missing.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.35 }}>
                      <svg viewBox="0 0 20 20" fill="none" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                        <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.05)" />
                        <path d="M7 13l6-6M7 7l6 6" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} strokeLinecap="round" />
                      </svg>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment integrations */}
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              padding: '24px',
              borderRadius: '16px',
              textAlign: 'center',
              background: '#0F0F1A',
              border: '1px solid #1E1E35',
            }}
          >
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
              Métodos de pago aceptados
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
              Aceptamos tarjetas vía Stripe, y pagos con MercadoPago (OXXO, SPEI, tarjetas).
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {['Stripe', 'MercadoPago', 'OXXO', 'SPEI'].map((m) => (
                <span
                  key={m}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 500,
                    background: '#16162A',
                    border: '1px solid #1E1E35',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
