'use client';

import Link from 'next/link';

export default function LicenseExpiredModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '420px', borderRadius: '20px',
          background: '#0F0F1A', border: '1px solid rgba(239,68,68,0.3)',
          padding: '28px', textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(239,68,68,0.1)', color: '#EF4444',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} style={{ width: '28px', height: '28px' }}>
            <path strokeLinecap="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.502-3.032-1.502-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>Licencia expirada</h2>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px', lineHeight: 1.5 }}>
          Tu licencia G-Spin ha expirado. Renueva tu acceso para crear nuevos eventos y conectar la app de grabación.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
              background: 'transparent', border: '1px solid #1E1E35', color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
          <Link
            href="/dashboard/subscription"
            style={{
              flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
              background: '#9D7CFF', color: '#ffffff', textAlign: 'center', textDecoration: 'none',
            }}
          >
            Ver licencias
          </Link>
        </div>
      </div>
    </div>
  );
}
