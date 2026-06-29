'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy,  setBusy]  = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden.'); return; }
    if (form.password.length < 6)       { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      await updateProfile(cred.user, { displayName: form.name.trim() });

      // Send verification email before writing to Firestore
      await sendEmailVerification(cred.user);

      // Payment fields (role, plan, subscriptionStatus) are set here on creation
      // but can NEVER be updated by the client again — Firestore rules enforce this
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid:                cred.user.uid,
        email:              cred.user.email,
        displayName:        form.name.trim(),
        role:               'operator',
        plan:               'starter',
        subscriptionStatus: 'trial',
        daysRemaining:      7,
        totalEvents:        0,
        totalVideos:        0,
        createdAt:          serverTimestamp(),
      });
      router.replace('/verify-email');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setError('Este correo ya está registrado.');
      else setError('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  const FIELDS = [
    { label: 'Nombre completo',     key: 'name'     as const, type: 'text',     ph: 'Tu nombre' },
    { label: 'Correo electrónico',  key: 'email'    as const, type: 'email',    ph: 'tu@correo.com' },
    { label: 'Contraseña',          key: 'password' as const, type: 'password', ph: '••••••••' },
    { label: 'Confirmar contraseña',key: 'confirm'  as const, type: 'password', ph: '••••••••' },
  ];

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
      {/* Blobs */}
      <div
        className="blob"
        style={{ width: '320px', height: '320px', top: '-80px', right: '-80px', background: '#9D7CFF', opacity: 0.12, zIndex: 0 }}
      />
      <div
        className="blob"
        style={{ width: '256px', height: '256px', bottom: '40px', left: '-40px', background: '#FF7300', opacity: 0.08, animationDelay: '3s', zIndex: 0 }}
      />
      <div className="grid-overlay" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Card */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px' }}>
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
            Crea tu cuenta
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            7 días gratis · Sin tarjeta de crédito
          </p>
        </div>

        {/* Form */}
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
          {FIELDS.map(({ label, key, type, ph }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={set(key)}
                placeholder={ph}
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
                onFocus={(e) => (e.currentTarget.style.borderColor = '#9D7CFF')}
                onBlur={(e)  => (e.currentTarget.style.borderColor = '#1E1E35')}
              />
            </div>
          ))}

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
            {busy ? 'Creando cuenta…' : 'Crear cuenta gratis'}
          </button>

          <p style={{ fontSize: '11px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', margin: 0 }}>
            Al registrarte aceptas nuestros{' '}
            <Link href="#" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline' }}>Términos</Link>{' '}
            y{' '}
            <Link href="#" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline' }}>Política de privacidad</Link>.
          </p>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '24px', color: 'rgba(255,255,255,0.35)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" style={{ fontWeight: 600, color: '#9D7CFF', textDecoration: 'none' }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
