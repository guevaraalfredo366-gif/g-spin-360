'use client';

import { useState } from 'react';
import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth/AuthProvider';
import LicenseExpiredModal from './LicenseExpiredModal';

function slugify(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '-')
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, 40);
}

export default function CreateEventButton({ expired }: { expired: boolean }) {
  const { user } = useAuth();
  const [showExpired, setShowExpired] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<string | null>(null);

  const openCreate = () => {
    if (expired) { setShowExpired(true); return; }
    setShowForm(true);
  };

  const reset = () => {
    setShowForm(false);
    setName('');
    setLocation('');
    setDate('');
    setError('');
    setCreated(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const cleanName = name.trim().slice(0, 100);
    if (!cleanName) { setError('Escribe un nombre para el evento.'); return; }

    const idEvento = `${slugify(cleanName)}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
    const cleanLocation = location.trim().slice(0, 100);

    setSaving(true);
    setError('');
    try {
      // Doc ID = idEvento so it matches the code the operator types into the gspin-app recording app.
      await setDoc(doc(db, 'events', idEvento), {
        idEvento,
        name: cleanName,
        operatorId: user.uid,
        location: cleanLocation || null,
        date: date ? Timestamp.fromDate(new Date(date)) : serverTimestamp(),
        status: 'Activo',
        videoCount: 0,
        createdAt: serverTimestamp(),
      });
      setCreated(idEvento);
    } catch {
      setError('No se pudo crear el evento. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={openCreate}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
          background: '#9D7CFF', color: '#ffffff', border: 'none', cursor: 'pointer',
        }}
      >
        + Crear evento
      </button>

      {showExpired && <LicenseExpiredModal onClose={() => setShowExpired(false)} />}

      {showForm && (
        <div
          onClick={reset}
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
              background: '#0F0F1A', border: '1px solid #1E1E35', padding: '24px',
            }}
          >
            {!created ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Nuevo evento</h2>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.45)' }}>
                    Nombre del evento
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Boda Alfredo & María"
                    maxLength={100}
                    autoFocus
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', color: '#ffffff', background: '#16162A', border: '1px solid #1E1E35', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.45)' }}>
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', color: '#ffffff', background: '#16162A', border: '1px solid #1E1E35', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.45)' }}>
                      Ubicación
                    </label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Opcional"
                      maxLength={100}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', color: '#ffffff', background: '#16162A', border: '1px solid #1E1E35', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {error && <p style={{ fontSize: '12px', color: '#EF4444', margin: 0 }}>{error}</p>}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={reset}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, background: 'transparent', border: '1px solid #1E1E35', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, background: saving ? 'rgba(157,124,255,0.5)' : '#9D7CFF', border: 'none', color: '#ffffff', cursor: saving ? 'default' : 'pointer' }}
                  >
                    {saving ? 'Creando…' : 'Crear evento'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>✓ Evento creado</h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', lineHeight: 1.5 }}>
                  Abre la app G-SPIN 360 en el dispositivo de grabación y escribe este código para conectarte al evento:
                </p>
                <div style={{ padding: '14px', borderRadius: '12px', background: '#16162A', border: '1px solid rgba(157,124,255,0.3)', fontSize: '16px', fontWeight: 800, letterSpacing: '0.08em', color: '#9D7CFF', marginBottom: '20px', wordBreak: 'break-all' }}>
                  {created}
                </div>
                <button
                  onClick={reset}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, background: '#9D7CFF', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                >
                  Listo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
