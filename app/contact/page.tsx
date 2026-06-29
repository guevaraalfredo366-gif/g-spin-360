'use client';

import { useState } from 'react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

const IG_PATH = 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z';
const FB_PATH = 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z';
const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';

const CONTACTS = [
  {
    label: 'Instagram',
    handle: '@sonido.sogue',
    href: 'https://www.instagram.com/sonido.sogue?igsh=MXZ4ZGI0OXIxZWJjbg==',
    color: '#E1306C',
    bg: 'rgba(225,48,108,0.1)',
    borderHover: 'rgba(225,48,108,0.3)',
    iconPath: IG_PATH,
  },
  {
    label: 'Facebook',
    handle: 'G-Spin 360',
    href: 'https://www.facebook.com/share/1B82XZPjCe/?mibextid=wwXIfr',
    color: '#1877F2',
    bg: 'rgba(24,119,242,0.1)',
    borderHover: 'rgba(24,119,242,0.3)',
    iconPath: FB_PATH,
  },
  {
    label: 'WhatsApp',
    handle: '229 369 6795',
    href: 'https://wa.me/522293696795',
    color: '#25D366',
    bg: 'rgba(37,211,102,0.1)',
    borderHover: 'rgba(37,211,102,0.3)',
    iconPath: WA_PATH,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent]  = useState(false);
  const [busy, setBusy]  = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    setSent(true);
    setBusy(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#ffffff',
    background: '#16162A',
    border: '1px solid #1E1E35',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ background: '#080810', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      <section style={{ padding: '128px 24px 80px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 14px', borderRadius: '9999px', marginBottom: '20px',
                background: 'rgba(157,124,255,0.1)', border: '1px solid rgba(157,124,255,0.2)',
                color: '#9D7CFF', fontSize: '12px', fontWeight: 500,
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9D7CFF', animation: 'pulse 2s infinite' }} />
              Estamos aquí para ayudarte
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.1,
                marginBottom: '16px',
              }}
            >
              ¿Tienes dudas?{' '}
              <span className="gradient-text">Contáctanos</span>
            </h1>

            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
              Escríbenos por el canal que prefieras o usa el formulario. Te respondemos a la brevedad.
            </p>
          </div>

          {/* Two-column: contact cards + form */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {/* Left: contact channels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: '0 0 4px' }}>
                Redes y contacto directo
              </h2>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', margin: '0 0 8px', lineHeight: 1.6 }}>
                Respuesta típica en menos de 24 horas por cualquier canal.
              </p>

              {CONTACTS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    background: '#0F0F1A',
                    border: '1px solid #1E1E35',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = c.borderHover;
                    e.currentTarget.style.background   = c.bg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#1E1E35';
                    e.currentTarget.style.background   = '#0F0F1A';
                  }}
                >
                  <div
                    style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: c.bg, color: c.color, flexShrink: 0,
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                      <path d={c.iconPath} />
                    </svg>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: '0 0 2px' }}>
                      {c.label}
                    </p>
                    <p style={{ fontSize: '13px', color: c.color, margin: 0 }}>{c.handle}</p>
                  </div>

                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              ))}
            </div>

            {/* Right: form or success */}
            {sent ? (
              <div
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '56px 24px',
                  borderRadius: '20px',
                  background: '#0F0F1A',
                  border: '1px solid rgba(34,197,94,0.25)',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.12)', marginBottom: '20px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth={2.5} style={{ width: '28px', height: '28px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
                  ¡Mensaje enviado!
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '24px', maxWidth: '280px', lineHeight: 1.6 }}>
                  Te responderemos pronto al correo que proporcionaste.
                </p>
                <button
                  onClick={() => { setForm({ name: '', email: '', message: '' }); setSent(false); }}
                  style={{
                    padding: '10px 24px', borderRadius: '12px',
                    fontSize: '14px', fontWeight: 700, color: '#ffffff',
                    background: '#9D7CFF', border: 'none', cursor: 'pointer',
                  }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  padding: '28px',
                  borderRadius: '20px',
                  background: '#0F0F1A',
                  border: '1px solid #1E1E35',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  Formulario de contacto
                </h2>

                {/* Nombre */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.45)' }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Tu nombre completo"
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#9D7CFF')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = '#1E1E35')}
                  />
                </div>

                {/* Correo */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.45)' }}>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="tu@correo.com"
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#9D7CFF')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = '#1E1E35')}
                  />
                </div>

                {/* Mensaje */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.45)' }}>
                    Mensaje
                  </label>
                  <textarea
                    value={form.message}
                    onChange={set('message')}
                    placeholder="¿En qué podemos ayudarte?"
                    rows={5}
                    required
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#9D7CFF')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = '#1E1E35')}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={busy}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: '#9D7CFF',
                    boxShadow: '0 0 30px rgba(157,124,255,0.3)',
                    border: 'none',
                    cursor: busy ? 'not-allowed' : 'pointer',
                    opacity: busy ? 0.6 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {busy ? 'Enviando…' : 'Enviar mensaje'}
                </button>

                <p style={{ fontSize: '11px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
                  También puedes escribirnos directamente a través de nuestras redes.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
