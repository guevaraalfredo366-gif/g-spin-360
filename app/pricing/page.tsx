'use client';

import Link from 'next/link';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import { LICENSES, formatPriceMXN } from '@/lib/licenses';

export default function PricingPage() {
  return (
    <div style={{ background: '#080810', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      {/* ── Hero + licenses ── */}
      <section style={{ paddingTop: '128px', paddingBottom: '80px', padding: '128px 24px 80px' }}>

        {/* Title */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9D7CFF', marginBottom: '12px' }}>
            Licencias de acceso total
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: '#ffffff', marginBottom: '16px', lineHeight: 1.1 }}>
            Elige tu licencia G-Spin
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Pago único, sin renovación automática. Acceso total a la plataforma durante el periodo elegido. Precios en MXN.
          </p>
        </div>

        {/* License cards */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '64px',
            alignItems: 'start',
          }}
        >
          {LICENSES.map((license) => {
            const highlighted = license.id === 'standard';

            return (
              <div
                key={license.id}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '24px',
                  borderRadius: '24px',
                  background: highlighted ? '#13112A' : '#0F0F1A',
                  border: `1px solid ${highlighted ? license.color + '60' : '#1E1E35'}`,
                  boxShadow: highlighted ? `0 0 60px ${license.color}20` : 'none',
                  marginTop: highlighted ? '16px' : '0',
                }}
              >
                {highlighted && (
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
                        background: license.color,
                      }}
                    >
                      Más popular
                    </span>
                  </div>
                )}

                {/* License header */}
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '40px', height: '40px',
                      borderRadius: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `${license.color}18`,
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: license.color }} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', marginBottom: '4px' }}>{license.name}</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{license.tagline}</p>
                </div>

                {/* Price */}
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '32px', fontWeight: 900, color: license.color, margin: 0 }}>
                    {formatPriceMXN(license.priceCents)}
                  </p>
                  <p style={{ fontSize: '12px', marginTop: '4px', color: 'rgba(255,255,255,0.4)' }}>
                    {license.priceCents === 0 ? '7 días de prueba' : 'pago único'}
                  </p>
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
                    transition: 'opacity 0.2s',
                    background: highlighted ? license.color : 'transparent',
                    color:      highlighted ? '#ffffff' : license.color,
                    border:     `1px solid ${license.color}60`,
                    boxSizing:  'border-box',
                  }}
                >
                  {license.id === 'starter' ? 'Empezar gratis' : 'Seleccionar licencia'}
                </Link>
              </div>
            );
          })}
        </div>

        {/* What's included */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', marginBottom: '64px' }}>
          <div
            style={{
              padding: '32px',
              borderRadius: '16px',
              background: '#0F0F1A',
              border: '1px solid #1E1E35',
            }}
          >
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
              Todas las licencias de pago incluyen
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {[
                'Eventos y videos ilimitados',
                'Sin marca de agua',
                'Intros y outros personalizados',
                'Marcos PNG animados',
                'Música personalizada',
                'Conexión con la app de grabación G-SPIN 360',
                'QR de descarga para invitados',
                'Soporte prioritario',
              ].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg viewBox="0 0 20 20" fill="none" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                    <circle cx="10" cy="10" r="10" fill="rgba(157,124,255,0.2)" />
                    <path d="M6 10l3 3 5-5" stroke="#9D7CFF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
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
              Aceptamos tarjetas, OXXO y SPEI vía Stripe.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {['Stripe', 'OXXO', 'SPEI', 'Tarjetas'].map((m) => (
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
