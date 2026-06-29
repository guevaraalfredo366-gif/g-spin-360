'use client';

import Link from 'next/link';
import Image from 'next/image';

const PRODUCT_LINKS = [
  { label: 'Inicio',          href: '/'          },
  { label: 'Características', href: '/#features' },
  { label: 'Precios',         href: '/pricing'   },
  { label: 'App iOS',         href: '/#app'      },
];

const COMPANY_LINKS = [
  { label: 'Contacto',  href: '/contact' },
  { label: 'Privacidad', href: '#'       },
  { label: 'Términos',  href: '#'        },
];

const IG_PATH  = 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z';
const FB_PATH  = 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z';
const WA_PATH  = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';

export default function Footer() {
  return (
    <footer
      style={{
        background: '#080810',
        borderTop: '1px solid #1E1E35',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: '1152px',
          margin: '0 auto',
          padding: '64px 24px 48px',
        }}
      >
        {/* Top grid: Brand + Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '48px',
            marginBottom: '48px',
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <Link href="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
              <Image
                src="/img/Logo.png"
                alt="G-SPIN 360"
                width={140}
                height={44}
                className="rounded-xl"
                style={{ objectFit: 'contain', height: '44px', width: 'auto' }}
              />
            </Link>
            <p
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.7,
                maxWidth: '280px',
                marginBottom: '20px',
              }}
            >
              La plataforma líder para cabinas 360° en eventos. Capta, transforma y comparte momentos únicos con tus invitados.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/sonido.sogue?igsh=MXZ4ZGI0OXIxZWJjbg=="
                target="_blank"
                rel="noreferrer"
                title="Instagram"
                style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.2s', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#E1306C'; e.currentTarget.style.background = 'rgba(225,48,108,0.15)'; e.currentTarget.style.borderColor = 'rgba(225,48,108,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                  <path d={IG_PATH} />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1B82XZPjCe/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                title="Facebook"
                style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.2s', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#1877F2'; e.currentTarget.style.background = 'rgba(24,119,242,0.15)'; e.currentTarget.style.borderColor = 'rgba(24,119,242,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                  <path d={FB_PATH} />
                </svg>
              </a>

              {/* WhatsApp — icon + text */}
              <a
                href="https://wa.me/522293696795"
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '0 12px', height: '36px', borderRadius: '10px', color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', fontWeight: 500, transition: 'all 0.2s', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#25D366'; e.currentTarget.style.background = 'rgba(37,211,102,0.1)'; e.currentTarget.style.borderColor = 'rgba(37,211,102,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                  <path d={WA_PATH} />
                </svg>
                WhatsApp: 229 369 6795
              </a>
            </div>
          </div>

          {/* Producto */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '16px' }}>
              Producto
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PRODUCT_LINKS.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#9D7CFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Empresa */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '16px' }}>
              Empresa
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {COMPANY_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#9D7CFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingTop: '24px',
            borderTop: '1px solid #1E1E35',
          }}
        >
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            © 2026 G-Spin 360. Todos los derechos reservados.
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            Hecho con ❤️ en México
          </p>
        </div>
      </div>
    </footer>
  );
}
