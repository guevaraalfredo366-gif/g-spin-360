'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const router            = useRouter();
  const { user, loading } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [busy,     setBusy]     = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/dashboard');
    } catch {
      setError('Correo o contraseña incorrectos. Intenta de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        background: '#080810',
      }}
    >
      {/* Blobs — z-index 0, contained by overflow:hidden on parent */}
      <div
        className="blob"
        style={{ width: '320px', height: '320px', top: '-80px', left: '-80px', background: '#9D7CFF', opacity: 0.12, zIndex: 0 }}
      />
      <div
        className="blob"
        style={{ width: '256px', height: '256px', bottom: 0, right: 0, background: '#FF7300', opacity: 0.08, animationDelay: '5s', zIndex: 0 }}
      />
      <div className="grid-overlay" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Card — z-index 1, floats above blobs */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '360px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ display: 'inline-block', marginBottom: '28px' }}>
            <Image
              src="/img/Logo.png"
              alt="G-SPIN 360"
              width={200}
              height={60}
              className="rounded-3xl"
              style={{ objectFit: 'contain', width: '200px', height: 'auto' }}
              priority
            />
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: '0 0 6px' }}>
            Bienvenido de vuelta
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Ingresa a tu cuenta de operador
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '24px',
            borderRadius: '24px',
            background: '#0F0F1A',
            border: '1px solid #1E1E35',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                color: '#ffffff',
                background: '#16162A',
                border: '1px solid #1E1E35',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e)  => (e.currentTarget.style.borderColor = '#9D7CFF')}
              onBlur={(e)   => (e.currentTarget.style.borderColor = '#1E1E35')}
            />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Contraseña</label>
              <Link href="#" style={{ fontSize: '12px', color: '#9D7CFF', textDecoration: 'none' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                color: '#ffffff',
                background: '#16162A',
                border: '1px solid #1E1E35',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e)  => (e.currentTarget.style.borderColor = '#9D7CFF')}
              onBlur={(e)   => (e.currentTarget.style.borderColor = '#1E1E35')}
            />
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                fontSize: '12px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(239,68,68,0.1)',
                color: '#EF4444',
                border: '1px solid rgba(239,68,68,0.2)',
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

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
              opacity: busy ? 0.5 : 1,
            }}
          >
            {busy ? 'Verificando…' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '24px', color: 'rgba(255,255,255,0.35)' }}>
          ¿No tienes cuenta?{' '}
          <Link href="/register" style={{ fontWeight: 600, color: '#9D7CFF', textDecoration: 'none' }}>
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
