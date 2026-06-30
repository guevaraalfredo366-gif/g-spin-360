'use client';

import { useState, useEffect } from 'react';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { useAuth, daysRemaining, isLicenseExpired } from '@/components/auth/AuthProvider';
import { LICENSE_MAP } from '@/lib/licenses';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [company, setCompany] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText,     setConfirmText]     = useState('');
  const [deleting,        setDeleting]        = useState(false);
  const [deleteError,     setDeleteError]     = useState('');

  // Initialize form from profile/user once loaded
  useEffect(() => {
    setName(profile?.displayName ?? user?.displayName ?? '');
    setPhone(profile?.phone ?? '');
    setCompany(profile?.company ?? '');
  }, [profile, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError('');

    // Sanitize: trim whitespace, enforce length limits
    const cleanName    = name.trim().slice(0, 100);
    const cleanPhone   = phone.trim().replace(/[^\d\s+\-(). ]/g, '').slice(0, 30);
    const cleanCompany = company.trim().slice(0, 100);

    try {
      // Update Firebase Auth displayName
      await updateProfile(user, { displayName: cleanName || null });
      // Update Firestore profile — merge so other fields (role, plan, etc.) are preserved
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: cleanName,
        phone:       cleanPhone,
        company:     cleanCompany,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('No se pudieron guardar los cambios. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || confirmText !== 'ELIMINAR') return;
    setDeleting(true);
    setDeleteError('');
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? 'Error al eliminar');
      }
      router.replace('/register');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'No se pudo eliminar la cuenta. Intenta de nuevo.');
      setDeleting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetSent(true);
    } catch {
      setError('No se pudo enviar el correo de restablecimiento.');
    }
  };

  const currentLicense = LICENSE_MAP[profile?.licenseId ?? 'starter'];
  const expired        = isLicenseExpired(profile);
  const days           = daysRemaining(profile);
  const displayName    = profile?.displayName || user?.displayName || 'Operador';
  const avatarInitial  = displayName[0]?.toUpperCase() ?? 'U';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    fontSize: '14px', color: '#ffffff', background: '#16162A',
    border: '1px solid #1E1E35', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '672px' }}>

      {/* Title */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: '0 0 4px' }}>Mi Perfil</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Gestiona tu información personal y seguridad.
        </p>
      </div>

      {/* Avatar + membership card */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', borderRadius: '16px', background: '#0F0F1A', border: '1px solid #1E1E35' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 900, color: '#ffffff', background: 'linear-gradient(135deg, #9D7CFF, #7C5CDB)', flexShrink: 0 }}>
          {avatarInitial}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {displayName}
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: `${currentLicense.color}1F`, color: currentLicense.color, border: `1px solid ${currentLicense.color}33` }}>
              {currentLicense.name}
            </span>
            {expired ? (
              <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                Expirada
              </span>
            ) : profile?.licenseStatus === 'lifetime' ? (
              <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>
                Vitalicia
              </span>
            ) : days > 0 && (
              <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>
                {days} días restantes
              </span>
            )}
          </div>
        </div>

        <Link href="/dashboard/subscription" style={{ fontSize: '12px', fontWeight: 500, color: '#9D7CFF', textDecoration: 'none', flexShrink: 0 }}>
          Gestionar →
        </Link>
      </div>

      {/* Info form */}
      <form
        onSubmit={handleSave}
        style={{ padding: '24px', borderRadius: '16px', background: '#0F0F1A', border: '1px solid #1E1E35', display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Información personal</h2>

        {/* Name + Phone */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.45)' }}>
              Nombre completo
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              maxLength={100}
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
              maxLength={30}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#9D7CFF')}
              onBlur={(e)  => (e.currentTarget.style.borderColor = '#1E1E35')}
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.45)' }}>
            Correo electrónico
          </label>
          <input
            value={user?.email ?? ''}
            disabled
            readOnly
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
            maxLength={100}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#9D7CFF')}
            onBlur={(e)  => (e.currentTarget.style.borderColor = '#1E1E35')}
          />
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontSize: '13px', color: '#EF4444', margin: 0 }}>{error}</p>
        )}

        {/* Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '4px' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
              color: '#ffffff', background: saving ? 'rgba(157,124,255,0.5)' : '#9D7CFF',
              border: 'none', cursor: saving ? 'default' : 'pointer',
            }}
          >
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
          {saved && <span style={{ fontSize: '13px', color: '#22C55E' }}>✓ Cambios guardados</span>}
        </div>
      </form>

      {/* Security */}
      <div style={{ padding: '24px', borderRadius: '16px', background: '#0F0F1A', border: '1px solid #1E1E35' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>Seguridad</h2>
        <button
          onClick={handlePasswordReset}
          disabled={resetSent}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: '12px',
            background: '#16162A', border: '1px solid #1E1E35', cursor: resetSent ? 'default' : 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#9D7CFF" strokeWidth={1.6} style={{ width: '20px', height: '20px', flexShrink: 0 }}>
              <path strokeLinecap="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff', margin: '0 0 2px' }}>
                {resetSent ? '✓ Enlace enviado' : 'Cambiar contraseña'}
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                {resetSent ? `Revisa tu bandeja: ${user?.email}` : 'Se enviará un enlace a tu correo'}
              </p>
            </div>
          </div>
          {!resetSent && (
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Danger zone */}
      <div style={{ padding: '24px', borderRadius: '16px', background: '#0F0F1A', border: '1px solid rgba(239,68,68,0.22)' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#EF4444', marginBottom: '8px' }}>Zona de peligro</h2>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 16px', lineHeight: 1.6 }}>
          Al eliminar tu cuenta se borrarán permanentemente tus datos y perderás acceso a G-SPIN 360.
        </p>
        <button
          onClick={() => { setShowDeleteModal(true); setConfirmText(''); setDeleteError(''); }}
          style={{
            padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
            color: '#EF4444', background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.28)', cursor: 'pointer',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.16)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
        >
          Eliminar cuenta
        </button>
      </div>
    </div>

    {/* Delete confirmation modal */}
    {showDeleteModal && (
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) { setShowDeleteModal(false); setConfirmText(''); } }}
      >
        <div style={{
          background: '#0F0F1A', border: '1px solid #1E1E35', borderRadius: '20px',
          padding: '32px', maxWidth: '440px', width: '100%', margin: '16px',
        }}>
          {/* Warning icon */}
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={1.6} style={{ width: '24px', height: '24px' }}>
              <path strokeLinecap="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', margin: '0 0 8px' }}>
            ¿Eliminar cuenta?
          </h3>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 24px', lineHeight: 1.6 }}>
            Esta acción es permanente e irreversible. Se eliminarán todos tus datos, eventos y acceso a G-SPIN 360.
          </p>

          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.45)' }}>
            Escribe <strong style={{ color: '#EF4444' }}>ELIMINAR</strong> para confirmar
          </label>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="ELIMINAR"
            autoComplete="off"
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '12px', boxSizing: 'border-box',
              fontSize: '14px', color: '#ffffff', background: '#16162A', outline: 'none',
              border: `1px solid ${confirmText === 'ELIMINAR' ? 'rgba(239,68,68,0.6)' : '#1E1E35'}`,
              marginBottom: '16px',
            }}
          />

          {deleteError && (
            <p style={{ fontSize: '13px', color: '#EF4444', marginBottom: '16px' }}>{deleteError}</p>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => { setShowDeleteModal(false); setConfirmText(''); setDeleteError(''); }}
              disabled={deleting}
              style={{
                flex: 1, padding: '11px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                color: 'rgba(255,255,255,0.6)', background: '#16162A',
                border: '1px solid #1E1E35', cursor: deleting ? 'default' : 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting || confirmText !== 'ELIMINAR'}
              style={{
                flex: 1, padding: '11px', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
                color: '#ffffff', border: 'none',
                background: deleting || confirmText !== 'ELIMINAR' ? 'rgba(239,68,68,0.3)' : '#EF4444',
                cursor: deleting || confirmText !== 'ELIMINAR' ? 'default' : 'pointer',
              }}
            >
              {deleting ? 'Eliminando…' : 'Confirmar eliminación'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
