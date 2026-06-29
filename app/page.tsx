'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.89L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    ),
    title: 'Grabación 360° HD',
    desc: 'Captura videos panorámicos de alta definición con la app de operador para iOS. Hasta 5 segundos de experiencia pura.',
    color: '#9D7CFF',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" d="M12 4v1m6.364 1.636l-.707.707M20 12h-1M17.657 17.657l-.707-.707M12 19v1M6.343 17.657l-.707.707M4 12H3m3.343-5.657l-.707-.707M9 12a3 3 0 106 0 3 3 0 00-6 0z" />
      </svg>
    ),
    title: 'Compartir con QR al instante',
    desc: 'Genera un código QR único por video. Tus invitados escanean y descargan su recuerdo en segundos, sin apps adicionales.',
    color: '#FF7300',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" d="M5 3l14 9-14 9V3z" />
      </svg>
    ),
    title: 'Transformaciones Automáticas',
    desc: 'Añade intros, outros, marcos animados y música personalizada a cada clip. Todo procesado en la nube con Cloudinary.',
    color: '#9D7CFF',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Dashboard Completo',
    desc: 'Gestiona todos tus eventos, usuarios y métricas desde un panel de administración profesional en tiempo real.',
    color: '#FF7300',
  },
];

const STATS = [
  { value: '2,000+', label: 'Videos generados' },
  { value: '150+',   label: 'Eventos realizados' },
  { value: '98%',    label: 'Clientes satisfechos' },
  { value: '< 5s',   label: 'Tiempo de entrega' },
];

const PLANS = [
  { name: 'Starter',  price: 'Gratis',  period: '',     desc: '7 días de acceso de prueba',           color: '#6b7280', badge: undefined },
  { name: 'Pro',      price: '$1,499',  period: '/mes', desc: '30 días · Sin marca de agua',          color: '#9D7CFF', badge: 'Popular' },
  { name: 'Business', price: '$3,999',  period: '/mes', desc: 'Eventos ilimitados · Filtros premium', color: '#FF7300', badge: undefined },
];

export default function LandingPage() {
  return (
    /* Page wrapper — overflowX hidden prevents blobs from creating horizontal scroll */
    <div style={{ background: '#080810', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '80px',    /* clears fixed navbar (64px) + breathing room */
          paddingBottom: '80px',
        }}
      >
        {/* Decorative blobs — z-index 0 so they sit BELOW all content */}
        <div
          className="blob"
          style={{
            width: '420px', height: '420px',
            top: '60px', left: '-80px',
            background: '#9D7CFF', opacity: 0.15,
            zIndex: 0,
          }}
        />
        <div
          className="blob"
          style={{
            width: '320px', height: '320px',
            bottom: '80px', right: '-40px',
            background: '#FF7300', opacity: 0.10,
            animationDelay: '4s',
            zIndex: 0,
          }}
        />

        {/* Grid overlay — z-index 0 */}
        <div
          className="grid-overlay"
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        />

        {/* Content — z-index 1 ensures it floats above blobs */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '1152px',
            margin: '0 auto',
            padding: '40px 24px',
          }}
        >
          {/* Two-column layout: text left, logo right — stacks on mobile via auto-fit */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'start',
            }}
          >
            {/* Left: text content */}
            <div>
              {/* Badge */}
              <div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '6px 14px', borderRadius: '9999px', marginBottom: '24px',
                  background: 'rgba(157,124,255,0.1)',
                  border: '1px solid rgba(157,124,255,0.2)',
                  color: '#9D7CFF', fontSize: '12px', fontWeight: 500,
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9D7CFF', animation: 'pulse 2s infinite' }} />
                Nueva versión disponible — v2.0
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.05,
                  marginBottom: '24px',
                  letterSpacing: '-0.02em',
                }}
              >
                La cabina{' '}
                <span className="gradient-text">360°</span>
                <br />más potente para
                <br />tus eventos
              </h1>

              <p
                style={{
                  fontSize: '1.125rem',
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.7,
                  marginBottom: '36px',
                  maxWidth: '520px',
                }}
              >
                Capta momentos únicos, comparte al instante con códigos QR y deslumbra a tus invitados con experiencias visuales de 360° totalmente personalizadas.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <Link
                  href="/register"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '14px 28px', borderRadius: '16px',
                    background: '#9D7CFF', boxShadow: '0 0 40px rgba(157,124,255,0.35)',
                    color: '#ffffff', fontWeight: 700, fontSize: '14px',
                    textDecoration: 'none',
                  }}
                >
                  Comenzar gratis
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/pricing"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '14px 28px', borderRadius: '16px',
                    border: '1px solid #1E1E35',
                    color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '14px',
                    background: 'rgba(255,255,255,0.03)',
                    textDecoration: 'none',
                  }}
                >
                  Ver planes y precios
                </Link>
              </div>

              {/* Stats bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '24px',
                  marginTop: '56px',
                  paddingTop: '32px',
                  borderTop: '1px solid #1E1E35',
                }}
              >
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>{s.value}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: hero logo — paddingTop aligns logo visually with the h1 title */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '52px' }}>
              <Image
                src="/img/Logo.png"
                alt="G-SPIN 360"
                width={520}
                height={200}
                className="rounded-3xl"
                style={{ objectFit: 'contain', width: '100%', maxWidth: '480px', height: 'auto' }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── FEATURES ─────────────────────────── */}
      <section
        id="features"
        style={{
          padding: '96px 24px',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p
              style={{
                fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: '#9D7CFF', marginBottom: '12px',
              }}
            >
              Por qué G-Spin 360
            </p>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900, color: '#ffffff',
                lineHeight: 1.1, marginBottom: '16px',
              }}
            >
              Todo lo que necesitas<br />en un solo lugar
            </h2>
            <p
              style={{
                fontSize: '15px', color: 'rgba(255,255,255,0.45)',
                maxWidth: '480px', margin: '0 auto', lineHeight: 1.7,
              }}
            >
              Diseñado para operadores de eventos que exigen calidad profesional y flujos de trabajo ágiles.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: '#0F0F1A',
                  border: '1px solid #1E1E35',
                }}
              >
                <div
                  style={{
                    width: '48px', height: '48px',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${f.color}18`,
                    color: f.color,
                    marginBottom: '16px',
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── PRICING TEASER ─────────────────────────── */}
      <section
        style={{
          padding: '96px 24px',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          {/* Card wrapper with its OWN relative+overflow-hidden so blob stays inside */}
          <div
            style={{
              borderRadius: '24px',
              padding: 'clamp(40px, 5vw, 64px)',
              position: 'relative',
              overflow: 'hidden',
              background: '#0F0F1A',
              border: '1px solid #1E1E35',
            }}
          >
            {/* Blob inside card — contained by overflow:hidden above */}
            <div
              className="blob"
              style={{
                width: '280px', height: '280px',
                top: '-60px', right: '-60px',
                background: '#9D7CFF', opacity: 0.08,
                zIndex: 0,
              }}
            />

            {/* Card content — above blob */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '40px',
                alignItems: 'center',
              }}
            >
              {/* Left: copy */}
              <div>
                <p
                  style={{
                    fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.3em', textTransform: 'uppercase',
                    color: '#FF7300', marginBottom: '12px',
                  }}
                >
                  Planes flexibles
                </p>
                <h2
                  style={{
                    fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                    fontWeight: 900, color: '#ffffff',
                    lineHeight: 1.15, marginBottom: '16px',
                  }}
                >
                  Desde eventos únicos hasta negocios en crecimiento
                </h2>
                <p
                  style={{
                    fontSize: '13px', color: 'rgba(255,255,255,0.45)',
                    lineHeight: 1.75, marginBottom: '28px',
                  }}
                >
                  Escoge el plan que se adapte a tu ritmo. Desde acceso diario para un evento específico hasta suscripciones anuales con todas las funciones premium desbloqueadas.
                </p>
                <Link
                  href="/pricing"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '12px 24px', borderRadius: '16px',
                    background: '#FF7300', boxShadow: '0 0 30px rgba(255,115,0,0.3)',
                    color: '#ffffff', fontWeight: 700, fontSize: '13px',
                    textDecoration: 'none',
                  }}
                >
                  Ver todos los planes
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '14px', height: '14px' }}>
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>

              {/* Right: plan list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {PLANS.map((plan) => (
                  <div
                    key={plan.name}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 20px', borderRadius: '16px',
                      background: '#16162A',
                      border: `1px solid ${plan.color}30`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: plan.color, flexShrink: 0 }} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <p style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: 0 }}>{plan.name}</p>
                          {plan.badge && (
                            <span
                              style={{
                                fontSize: '10px', fontWeight: 700,
                                padding: '2px 6px', borderRadius: '6px',
                                background: 'rgba(157,124,255,0.15)', color: '#9D7CFF',
                              }}
                            >
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>{plan.desc}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: '15px', fontWeight: 900, color: plan.color, margin: 0 }}>{plan.price}</p>
                      {plan.period && (
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{plan.period}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── APP STORE ─────────────────────────── */}
      <section
        id="app"
        style={{ padding: '96px 24px', position: 'relative' }}
      >
        <div style={{ maxWidth: '1152px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px', borderRadius: '9999px', marginBottom: '24px',
              background: 'rgba(255,115,0,0.1)',
              border: '1px solid rgba(255,115,0,0.2)',
              color: '#FF7300', fontSize: '12px', fontWeight: 500,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px' }}>
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            App de Operador — Disponible en iOS
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900, color: '#ffffff',
              lineHeight: 1.1, marginBottom: '16px',
            }}
          >
            Lleva tu cabina 360°<br />a cualquier evento
          </h2>

          <p
            style={{
              fontSize: '15px', color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.7, maxWidth: '440px', margin: '0 auto 40px',
            }}
          >
            Descarga la app de operador en tu iPhone o iPad y empieza a crear experiencias únicas en bodas, quinceañeras, corporativos y más.
          </p>

          <a
            href="#"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              padding: '16px 24px', borderRadius: '16px',
              background: '#16162A', border: '1px solid #1E1E35',
              color: '#ffffff', textDecoration: 'none',
            }}
          >
            <svg viewBox="0 0 24 24" fill="white" style={{ width: '24px', height: '24px' }}>
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Disponible en el</p>
              <p style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>App Store</p>
            </div>
          </a>
        </div>
      </section>

      {/* ─────────────────────────── CTA FINAL ─────────────────────────── */}
      <section
        style={{ padding: '96px 24px', position: 'relative' }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900, color: '#ffffff',
              lineHeight: 1.1, marginBottom: '16px',
            }}
          >
            ¿Listo para empezar?
          </h2>
          <p
            style={{
              fontSize: '15px', color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.7, marginBottom: '32px',
            }}
          >
            Crea tu cuenta gratis y accede a 7 días de prueba sin tarjeta de crédito.
          </p>
          <Link
            href="/register"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '16px 36px', borderRadius: '16px',
              background: '#9D7CFF', boxShadow: '0 0 50px rgba(157,124,255,0.4)',
              color: '#ffffff', fontWeight: 700, fontSize: '16px',
              textDecoration: 'none',
            }}
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
