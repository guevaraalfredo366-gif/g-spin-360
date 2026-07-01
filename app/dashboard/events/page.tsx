'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth, isLicenseExpired } from '@/components/auth/AuthProvider';
import CreateEventButton from '@/components/dashboard/CreateEventButton';
import ShareModal from '@/components/dashboard/ShareModal';
import EventModal, { EventData } from '@/components/dashboard/EventModal';

// ── Types ─────────────────────────────────────────────────────────────────────

interface FirestoreEvent extends EventData {
  date?:       Timestamp;
  videoCount?: number;
}

type ViewMode = 'grid' | 'list';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTs(ts: Timestamp | undefined): string {
  if (!ts?.toDate) return '—';
  return ts.toDate().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatEventDate(ev: FirestoreEvent): string {
  const ts = ev.eventDate ?? ev.date;
  return ts ? formatTs(ts) : '—';
}

// ── Sub-components ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => (
  <span
    style={{
      display: 'inline-flex', padding: '4px 10px',
      borderRadius: '8px', fontSize: '10px', fontWeight: 700,
      ...(status === 'Completado'
        ? { background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }
        : { background: 'rgba(157,124,255,0.1)', color: '#9D7CFF', border: '1px solid rgba(157,124,255,0.2)' }),
    }}
  >
    {status}
  </span>
);

const IconBtn = ({ label, onClick, color = '#9D7CFF' }: { label: string; onClick: () => void; color?: string }) => (
  <button
    onClick={onClick}
    style={{
      padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
      color, border: `1px solid ${color}40`,
      background: 'transparent', cursor: 'pointer',
    }}
  >
    {label}
  </button>
);

// ── Main page ─────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const { user, profile } = useAuth();
  const expired = isLicenseExpired(profile);

  const [events,      setEvents]      = useState<FirestoreEvent[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [view,        setView]        = useState<ViewMode>('grid');
  const [search,      setSearch]      = useState('');
  const [shareEvent,  setShareEvent]  = useState<{ id: string; name: string } | null>(null);
  const [editEvent,   setEditEvent]   = useState<FirestoreEvent | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<FirestoreEvent | null>(null);
  const [deleting,    setDeleting]    = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'events'), where('operatorId', '==', user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as FirestoreEvent))
          .sort((a, b) => {
            const aMs = a.createdAt?.toMillis?.() ?? a.date?.toMillis?.() ?? 0;
            const bMs = b.createdAt?.toMillis?.() ?? b.date?.toMillis?.() ?? 0;
            return bMs - aMs;
          });
        setEvents(docs);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, [user]);

  async function handleDelete(ev: FirestoreEvent) {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'events', ev.id));
      setConfirmDelete(null);
    } catch {
      // onSnapshot handles list update on success
    } finally {
      setDeleting(false);
    }
  }

  const safeSearch = search.trim().toLowerCase();
  const filtered   = safeSearch
    ? events.filter(
        (e) =>
          e.name.toLowerCase().includes(safeSearch) ||
          (e.eventLocation ?? e.id).toLowerCase().includes(safeSearch),
      )
    : events;

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: '0 0 4px' }}>Mis Eventos</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {loading ? 'Cargando…' : `${events.length} evento${events.length !== 1 ? 's' : ''} en el sistema`}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CreateEventButton expired={expired} />
          {/* Grid / List toggle */}
          <div style={{ display: 'flex', padding: '4px', borderRadius: '12px', background: '#0F0F1A', border: '1px solid #1E1E35' }}>
            {([
              ['grid', (
                <svg key="g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: '16px', height: '16px' }}>
                  <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              )],
              ['list', (
                <svg key="l" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: '16px', height: '16px' }}>
                  <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )],
            ] as [ViewMode, React.ReactNode][]).map(([key, icon]) => (
              <button
                key={key}
                onClick={() => setView(key)}
                style={{
                  padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                  background: view === key ? 'rgba(157,124,255,0.15)' : 'transparent',
                  color:      view === key ? '#9D7CFF' : 'rgba(255,255,255,0.35)',
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expired license banner */}
      {expired && (
        <div style={{ padding: '14px 20px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <span>⚠ Tu licencia ha expirado. No puedes crear eventos ni conectar la app de grabación hasta renovar.</span>
          <a href="/dashboard/subscription" style={{ color: '#EF4444', textDecoration: 'underline', whiteSpace: 'nowrap' }}>Renovar ahora →</a>
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }}
        >
          <path strokeLinecap="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar eventos…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxLength={100}
          style={{ width: '100%', paddingLeft: '44px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', borderRadius: '12px', fontSize: '14px', color: '#ffffff', background: '#0F0F1A', border: '1px solid #1E1E35', outline: 'none', boxSizing: 'border-box' }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#9D7CFF')}
          onBlur={(e)  => (e.currentTarget.style.borderColor = '#1E1E35')}
        />
      </div>

      {loading && (
        <div style={{ padding: '64px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.25)' }}>Cargando eventos…</div>
      )}

      {!loading && events.length === 0 && (
        <div style={{ padding: '64px', textAlign: 'center', borderRadius: '16px', background: '#0F0F1A', border: '1px solid #1E1E35' }}>
          <p style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Aún no tienes eventos registrados.</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>Crea tu primer evento con el botón de arriba.</p>
        </div>
      )}

      {!loading && events.length > 0 && filtered.length === 0 && (
        <div style={{ padding: '48px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>
          Sin resultados para "{search}"
        </div>
      )}

      {/* Grid view */}
      {!loading && filtered.length > 0 && view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filtered.map((ev) => (
            <div
              key={ev.id}
              style={{ padding: '24px', borderRadius: '16px', background: '#0F0F1A', border: '1px solid #1E1E35', transition: 'border-color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(157,124,255,0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1E1E35')}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', background: 'rgba(157,124,255,0.1)' }}>
                  🎭
                </div>
                <StatusBadge status={ev.status ?? 'Activo'} />
              </div>

              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>{ev.name}</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>{formatEventDate(ev)}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginBottom: '20px' }}>{ev.eventLocation ?? '—'}</p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #1E1E35' }}>
                <div>
                  <p style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: 0 }}>{ev.videoCount ?? 0}</p>
                  <p style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: 0 }}>Videos</p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <IconBtn label="Editar" onClick={() => setEditEvent(ev)} color="#9D7CFF" />
                  <IconBtn label="Compartir" onClick={() => setShareEvent({ id: ev.id, name: ev.name })} color="#FF7300" />
                  <IconBtn label="Eliminar" onClick={() => setConfirmDelete(ev)} color="#EF4444" />
                </div>
              </div>

              <a
                href={`/evento/${ev.id}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'block', marginTop: '12px', padding: '8px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, color: '#9D7CFF', border: '1px solid rgba(157,124,255,0.2)', textDecoration: 'none', textAlign: 'center' }}
              >
                Ver galería →
              </a>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {!loading && filtered.length > 0 && view === 'list' && (
        <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#0F0F1A', border: '1px solid #1E1E35' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1E1E35' }}>
                  {['Evento', 'Fecha', 'Ubicación', 'Videos', 'Estado', 'Acciones'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((ev, i) => (
                  <tr
                    key={ev.id}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(30,30,53,0.5)' : 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 500, color: '#ffffff', whiteSpace: 'nowrap' }}>{ev.name}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{formatEventDate(ev)}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{ev.eventLocation ?? '—'}</td>
                    <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{ev.videoCount ?? 0}</td>
                    <td style={{ padding: '14px 20px' }}><StatusBadge status={ev.status ?? 'Activo'} /></td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IconBtn label="Editar" onClick={() => setEditEvent(ev)} color="#9D7CFF" />
                        <IconBtn label="Compartir" onClick={() => setShareEvent({ id: ev.id, name: ev.name })} color="#FF7300" />
                        <a href={`/evento/${ev.id}`} target="_blank" rel="noreferrer" style={{ fontSize: '13px', fontWeight: 500, color: '#9D7CFF', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                          Ver galería →
                        </a>
                        <IconBtn label="Eliminar" onClick={() => setConfirmDelete(ev)} color="#EF4444" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>

    {/* ── Modals ─────────────────────────────────────────────────────────────── */}

    {shareEvent && (
      <ShareModal
        eventId={shareEvent.id}
        eventName={shareEvent.name}
        onClose={() => setShareEvent(null)}
      />
    )}

    {editEvent && (
      <EventModal
        mode="edit"
        event={editEvent}
        onClose={() => setEditEvent(null)}
      />
    )}

    {/* Delete confirmation overlay */}
    {confirmDelete && (
      <div
        onClick={() => setConfirmDelete(null)}
        style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ width: '100%', maxWidth: '380px', borderRadius: '20px', background: '#0F0F1A', border: '1px solid rgba(239,68,68,0.3)', padding: '28px' }}
        >
          <p style={{ fontSize: '22px', textAlign: 'center', marginBottom: '8px' }}>🗑️</p>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', textAlign: 'center', marginBottom: '10px' }}>Eliminar evento</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '24px', lineHeight: 1.6 }}>
            ¿Eliminar <strong style={{ color: '#ffffff' }}>{confirmDelete.name}</strong>?
            <br />
            Esta acción no se puede deshacer.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setConfirmDelete(null)}
              style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, background: 'transparent', border: '1px solid #1E1E35', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              onClick={() => handleDelete(confirmDelete)}
              disabled={deleting}
              style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, border: 'none', color: '#ffffff', cursor: deleting ? 'default' : 'pointer', background: deleting ? 'rgba(239,68,68,0.5)' : '#EF4444' }}
            >
              {deleting ? 'Eliminando…' : 'Sí, eliminar'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
