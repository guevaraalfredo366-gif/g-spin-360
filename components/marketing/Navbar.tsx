'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(8,8,16,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(30,30,53,0.8)' : '1px solid transparent',
      }}
    >
      <div
        style={{
          maxWidth: '1152px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', padding: '4px 0' }}>
          <Image
            src="/img/Logo.png"
            alt="G-SPIN 360"
            width={168}
            height={56}
            className="rounded-2xl"
            style={{ objectFit: 'contain', height: '52px', width: 'auto' }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="hidden md:flex">
          {[
            { label: 'Inicio',          href: '/'          },
            { label: 'Características', href: '/#features' },
            { label: 'Precios',         href: '/pricing'   },
            { label: 'App',             href: '/#app'      },
            { label: 'Contacto',        href: '/contact'   },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs + social icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="hidden md:flex">
          <Link
            href="/login"
            style={{
              padding: '8px 16px', fontSize: '14px', fontWeight: 500,
              color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
              borderRadius: '12px',
            }}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            style={{
              padding: '8px 16px', fontSize: '14px', fontWeight: 700,
              color: '#ffffff', textDecoration: 'none',
              background: '#9D7CFF', borderRadius: '12px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#7C5CDB')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#9D7CFF')}
          >
            Registrarse
          </Link>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: '6px', paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.1)', marginLeft: '2px' }}>
            <a
              href="https://www.instagram.com/sonido.sogue?igsh=MXZ4ZGI0OXIxZWJjbg=="
              target="_blank"
              rel="noreferrer"
              style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#E1306C'; e.currentTarget.style.background = 'rgba(225,48,108,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '15px', height: '15px' }}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/share/1B82XZPjCe/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#1877F2'; e.currentTarget.style.background = 'rgba(24,119,242,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '15px', height: '15px' }}>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} style={{ width: '20px', height: '20px' }}>
            {open
              ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{ background: 'rgba(8,8,16,0.97)', padding: '0 24px 16px' }} className="md:hidden">
          {[{ label: 'Características', href: '/#features' }, { label: 'Precios', href: '/pricing' }, { label: 'App', href: '/#app' }, { label: 'Contacto', href: '/contact' }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '10px 0', fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ paddingTop: '12px', display: 'flex', gap: '12px' }}>
            <Link
              href="/login"
              style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.6)', border: '1px solid #1E1E35', textDecoration: 'none' }}
            >
              Entrar
            </Link>
            <Link
              href="/register"
              style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: '#ffffff', background: '#9D7CFF', textDecoration: 'none' }}
            >
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
