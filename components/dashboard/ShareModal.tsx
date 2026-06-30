'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface Props {
  eventId: string;
  eventName: string;
  onClose: () => void;
}

export default function ShareModal({ eventId, eventName, onClose }: Props) {
  const galleryUrl =
    (typeof window !== 'undefined' ? window.location.origin : 'https://g-spin-360.netlify.app') +
    `/evento/${eventId}`;

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied,    setCopied]    = useState(false);

  useEffect(() => {
    QRCode.toDataURL(galleryUrl, {
      width:  280,
      margin: 2,
      color:  { dark: '#9D7CFF', light: '#0F0F1A' },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [galleryUrl]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(galleryUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href     = qrDataUrl;
    a.download = `qr-gspin360-${eventId}.png`;
    a.click();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#0F0F1A', border: '1px solid #1E1E35', borderRadius: '20px',
          padding: '32px', maxWidth: '380px', width: '100%', margin: '16px',
        }}
      >
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
            Compartir galería
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: '4px', lineHeight: 1 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: '18px', height: '18px' }}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', margin: '0 0 24px' }}>
          {eventName}
        </p>

        {/* QR */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR de galería"
              style={{ width: '200px', height: '200px', borderRadius: '12px', display: 'block' }}
            />
          ) : (
            <div
              style={{
                width: '200px', height: '200px', borderRadius: '12px',
                background: '#16162A', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  border: '3px solid rgba(157,124,255,0.25)', borderTop: '3px solid #9D7CFF',
                  animation: 'spin 0.9s linear infinite',
                }}
              />
            </div>
          )}
        </div>

        {/* URL + copy */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            readOnly
            value={galleryUrl}
            style={{
              flex: 1, padding: '10px 12px', borderRadius: '10px',
              fontSize: '12px', color: 'rgba(255,255,255,0.55)', background: '#16162A',
              border: '1px solid #1E1E35', outline: 'none',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={copyLink}
            style={{
              padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
              flexShrink: 0, cursor: 'pointer', border: 'none',
              color:      copied ? '#22C55E' : '#9D7CFF',
              background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(157,124,255,0.12)',
            }}
          >
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>

        {/* Download QR */}
        <button
          onClick={downloadQR}
          disabled={!qrDataUrl}
          style={{
            width: '100%', padding: '12px', borderRadius: '12px',
            fontSize: '14px', fontWeight: 700, border: 'none',
            color: '#ffffff',
            background: qrDataUrl ? '#9D7CFF' : 'rgba(157,124,255,0.3)',
            cursor: qrDataUrl ? 'pointer' : 'default',
          }}
        >
          Descargar QR
        </button>
      </div>
    </div>
  );
}
