'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const [saved,   setSaved]   = useState(false);
  const [name,    setName]    = useState(user?.displayName ?? '');
  const [phone,   setPhone]   = useState('');
  const [company, setCompany] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '672px' }}>

      {/* Title */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: '0 0 4px' }}>Mi Perfil</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Gestiona tu información personal y seguridad.
        </p>
      </div>

      {/* Avatar + membership card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '24px',
          borderRadius: '16px',
          background: '#0F0F1A',
          border: '1px solid #1E1E35',
        }}
      >
        <div
          style={{
            width: '64px', height: '64px',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 900, color: '#ffffff',
            background: 'linear-gradient(135deg, #9D7CFF, #7C5CDB)',
            flexShrink: 0,
          }}
        >
          {user?.email?.[0]?.toUpperCase() ?? 'U'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.displayName || 'Operador G-SPIN'}
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: 'rgba(157,124,255,0.12)', color: '#9D7CFF', border: '1px solid rgba(157,124,255,0.2)' }}>
              Plan Pro
            </span>
            <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>
              18 días restantes
            </span>
          </div>
        </div>

        <Link href="/dashboard/subscription" style={{ fontSize: '12px', fontWeight: 500, color: '#9D7CFF', textDecoration: 'none', flexShrink: 0 }}>
          Gestionar →
        </Link>
      </div>

      {/* Info form */}
      <form
        onSubmit={handleSave}
        style={{
          padding: '24px',
          borderRadius: '16px',
          background: '#0F0F1A',
          border: '1px solid #1E1E35',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Información personal</h2>

        {/* Name + Phone row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.45)' }}>
              Nombre completo
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#9D7CFF')}
              onBlur={(e)  => (e.currentTarget.style.borderColor = '#1E1E35')}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.45)' }}>
              Teléfono
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+52 81 1234 5678"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#9D7CFF')}
              onBlur={(e)  => (e.currentTarget.style.borderColor = '#1E1E35')}
            />
          </div>
        </div>

        {/* Email (disabled) */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.45)' }}>
            Correo electrónico
          </label>
          <input
            value={user?.email ?? ''}
            disabled
            style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }}
          />
          <p style={{ fontSize: '10px', marginTop: '4px', color: 'rgba(255,255,255,0.25)' }}>El correo no se puede cambiar desde aquí.</p>
        </div>

        {/* Company */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.45)' }}>
            Empresa / Nombre de negocio
          </label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Ej. Eventos Élite Regio"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#9D7CFF')}
            onBlur={(e)  => (e.currentTarget.style.borderColor = '#1E1E35')}
          />
        </div>

        {/* Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '4px' }}>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#ffffff',
              background: '#9D7CFF',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Guardar cambios
          </button>
          {saved && (
            <span style={{ fontSize: '13px', color: '#22C55E' }}>✓ Cambios guardados</span>
          )}
        </div>
      </form>

      {/* Security */}
      <div
        style={{
          padding: '24px',
          borderRadius: '16px',
          background: '#0F0F1A',
          border: '1px solid #1E1E35',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>Seguridad</h2>
        <button
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderRadius: '12px',
            background: '#16162A',
            border: '1px solid #1E1E35',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#9D7CFF" strokeWidth={1.6} style={{ width: '20px', height: '20px', flexShrink: 0 }}>
              <path strokeLinecap="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff', margin: '0 0 2px' }}>Cambiar contraseña</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>Se enviará un enlace a tu correo</p>
            </div>
          </div>
          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
