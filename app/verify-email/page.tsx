'use client';

import { useEffect, useState } from 'react';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/auth/AuthProvider';

export default function VerifyEmailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sent,     setSent]     = useState(false);
  const [busy,     setBusy]     = useState(false);
  const [checking, setChecking] = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.emailVerified) { router.replace('/dashboard'); }
  }, [user, loading, router]);

  const resend = async () => {
    if (!user || busy || sent) return;
    setBusy(true);
    setError('');
    try {
      await sendEmailVerification(user);
      setSent(true);
    } catch (e: any) {
      if (e.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Espera unos minutos antes de reenviar.');
      } else {
        setError('No se pudo enviar. Intenta de nuevo.');
      }
    } finally {
      setBusy(false);
    }
  };

  const checkVerification = async () => {
    if (!user || checking) return;
    setChecking(true);
    setError('');
    try {
      await user.reload();
      if (auth.currentUser?.emailVerified) {
        router.replace('/dashboard');
      } else {
        setError('Tu correo aún no está verificado. Revisa tu bandeja de entrada (o spam).');
      }
    } catch {
      setError('No se pudo verificar el estado. Intenta de nuevo.');
    } finally {
      setChecking(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#080810', padding: '24px',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div className="blob" style={{ width: '360px', height: '360px', top: '-80px', right: '-80px', background: '#9D7CFF', opacity: 0.10, zIndex: 0 }} />
      <div className="blob" style={{ width: '240px', height: '240px', bottom: '40px', left: '-40px', background: '#FF7300', opacity: 0.07, animationDelay: '3s', zIndex: 0 }} />
      <div className="grid-overlay" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', textAlign: 'center' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'inline-block', marginBottom: '36px' }}>
          <Image
            src="/img/Logo.png" alt="G-SPIN 360"
            width={160} height={48}
            className="rounded-2xl"
            style={{ objectFit: 'contain', width: '160px', height: 'auto' }}
            priority
          />
        </Link>

        {/* Mail icon */}
        <div
          style={{
            width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 24px',
            background: 'rgba(157,124,255,0.12)', border: '1px solid rgba(157,124,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9D7CFF',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: '34px', height: '34px' }}>
            <path strokeLinecap="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', marginBottom: '12px' }}>
          Verifica tu correo
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: '32px', maxWidth: '360px', margin: '0 auto 32px' }}>
          Enviamos un enlace de verificación a{' '}
          <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{user.email}</strong>.
          {' '}Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={checkVerification}
            disabled={checking}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              fontSize: '14px', fontWeight: 700, color: '#ffffff',
              background: '#9D7CFF', boxShadow: '0 0 30px rgba(157,124,255,0.3)',
              border: 'none', cursor: checking ? 'not-allowed' : 'pointer',
              opacity: checking ? 0.6 : 1,
            }}
          >
            {checking ? 'Verificando…' : 'Ya verifiqué mi correo →'}
          </button>

          <button
            onClick={resend}
            disabled={busy || sent}
            style={{
              width: '100%', padding: '12px', borderRadius: '12px',
              fontSize: '13px', fontWeight: 500,
              color: sent ? '#25D366' : 'rgba(255,255,255,0.5)',
              background: 'transparent', border: '1px solid #1E1E35',
              cursor: (busy || sent) ? 'default' : 'pointer',
            }}
          >
            {sent ? '✓ Correo reenviado' : busy ? 'Enviando…' : 'Reenviar correo de verificación'}
          </button>
        </div>

        {error && (
          <p
            style={{
              marginTop: '16px', fontSize: '12px', padding: '10px 14px',
              borderRadius: '10px', background: 'rgba(239,68,68,0.08)',
              color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            {error}
          </p>
        )}

        <p style={{ marginTop: '28px', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
          ¿No es tu cuenta?{' '}
          <button
            onClick={() => signOut(auth).then(() => router.replace('/login'))}
            style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}
          >
            Cerrar sesión
          </button>
        </p>
      </div>
    </div>
  );
}
