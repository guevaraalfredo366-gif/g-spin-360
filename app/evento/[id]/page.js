'use client';

import { use, useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default function EventoPage({ params }) {
  const { id: idEvento } = use(params);

  const [event,    setEvent]    = useState(null);
  const [videos,   setVideos]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [active,   setActive]   = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [access,   setAccess]   = useState(null); // null=checking, 'open', 'closed', 'not-started', 'ended'

  useEffect(() => {
    (async () => {
      try {
        // ── Load event ────────────────────────────────────────────────────
        const eventSnap = await getDoc(doc(db, 'events', idEvento));
        if (!eventSnap.exists()) {
          setAccess('closed');
          setLoading(false);
          return;
        }
        const eventData = eventSnap.data();
        setEvent(eventData);

        // ── Access gate 1: gallery open flag ─────────────────────────────
        if (!eventData.isGalleryOpen) {
          setAccess('closed');
          setLoading(false);
          return;
        }

        // ── Access gate 2: time window ────────────────────────────────────
        const now = new Date();
        if (eventData.startTime) {
          const start = eventData.startTime?.toDate
            ? eventData.startTime.toDate()
            : new Date(eventData.startTime);
          if (now < start) {
            setAccess('not-started');
            setLoading(false);
            return;
          }
        }
        if (eventData.endTime) {
          const end = eventData.endTime?.toDate
            ? eventData.endTime.toDate()
            : new Date(eventData.endTime);
          if (now > end) {
            setAccess('ended');
            setLoading(false);
            return;
          }
        }

        setAccess('open');

        // ── Load visible videos only ──────────────────────────────────────
        const q = query(
          collection(db, 'videos'),
          where('idEvento', '==', idEvento),
          where('isHidden', '==', false),
          orderBy('createdAt', 'desc'),
        );
        const snap = await getDocs(q);
        setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
        setAccess('open'); // don't block on Firestore errors
      } finally {
        setLoading(false);
      }
    })();
  }, [idEvento]);

  const downloadUrl = (videoUrl, videoId) => {
    const filename = `gspin360_${idEvento}_${videoId}.mp4`;
    return `/api/download?url=${encodeURIComponent(videoUrl)}&name=${encodeURIComponent(filename)}`;
  };

  const shareVideo = async (v) => {
    const videoPageUrl = `${window.location.origin}/video/${v.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi video G-SPIN 360',
          text:  `Mira mi video del evento ${event?.name ?? ''}`,
          url:   videoPageUrl,
        });
        return;
      } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(videoPageUrl);
      setCopiedId(v.id);
      setTimeout(() => setCopiedId(id => id === v.id ? null : id), 2500);
    } catch { /* clipboard denied */ }
  };

  const eventDate = event?.date?.toDate
    ? event.date.toDate().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const metaLine = [eventDate, event?.location].filter(Boolean).join(' · ');

  // ── Blocked states ────────────────────────────────────────────────────────

  if (!loading && access === 'closed') {
    return (
      <div style={s.page}>
        <div style={s.header}>
          <h1 style={s.brand}>G-SPIN 360</h1>
          <h2 style={s.eventName}>{event?.name ?? idEvento}</h2>
        </div>
        <div style={s.gateBox}>
          <div style={s.gateIcon}>◎</div>
          <p style={s.gateTitle}>Galería cerrada</p>
          <p style={s.gateDesc}>
            Este evento está cerrado actualmente.{' '}
            Espera a que el anfitrión abra la galería.
          </p>
        </div>
        <p style={s.footer}>G-SPIN 360 · Galería del evento</p>
      </div>
    );
  }

  if (!loading && access === 'not-started') {
    const start = event?.startTime?.toDate?.()?.toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    return (
      <div style={s.page}>
        <div style={s.header}>
          <h1 style={s.brand}>G-SPIN 360</h1>
          <h2 style={s.eventName}>{event?.name ?? idEvento}</h2>
        </div>
        <div style={s.gateBox}>
          <div style={s.gateIcon}>◈</div>
          <p style={s.gateTitle}>El evento aún no ha comenzado</p>
          <p style={s.gateDesc}>
            La galería estará disponible a partir del {start ?? 'la fecha de inicio del evento'}.
          </p>
        </div>
        <p style={s.footer}>G-SPIN 360 · Galería del evento</p>
      </div>
    );
  }

  if (!loading && access === 'ended') {
    return (
      <div style={s.page}>
        <div style={s.header}>
          <h1 style={s.brand}>G-SPIN 360</h1>
          <h2 style={s.eventName}>{event?.name ?? idEvento}</h2>
        </div>
        <div style={s.gateBox}>
          <div style={s.gateIcon}>◉</div>
          <p style={s.gateTitle}>Evento finalizado</p>
          <p style={s.gateDesc}>
            La galería de este evento ya no está disponible al público.
          </p>
        </div>
        <p style={s.footer}>G-SPIN 360 · Galería del evento</p>
      </div>
    );
  }

  // ── Open gallery ──────────────────────────────────────────────────────────

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <h1 style={s.brand}>G-SPIN 360</h1>
        <h2 style={s.eventName}>{event?.name ?? idEvento}</h2>
        {metaLine && <p style={s.eventMeta}>{metaLine}</p>}
        <p style={s.countLabel}>
          {loading ? '…' : `${videos.length} video${videos.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div style={s.center}>
          <div style={s.spinner} />
          <p style={s.loadingText}>Cargando la galería…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && videos.length === 0 && (
        <div style={s.center}>
          <p style={s.emptyText}>Aún no hay videos en este evento.</p>
        </div>
      )}

      {/* Playback modal */}
      {active && (
        <div style={s.modal} onClick={() => setActive(null)}>
          <div style={s.modalInner} onClick={e => e.stopPropagation()}>
            <video
              src={active.url}
              controls
              autoPlay
              playsInline
              style={s.modalVideo}
            />
            <div style={s.modalActions}>
              <a href={downloadUrl(active.url, active.id)} style={s.dlBtn}>
                ⬇ Descargar
              </a>
              <button style={s.shareBtn} onClick={() => shareVideo(active)}>
                {copiedId === active.id ? '✓ Copiado' : '↗ Compartir'}
              </button>
              <button style={s.closeBtn} onClick={() => setActive(null)}>✕</button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {!loading && videos.length > 0 && (
        <div style={s.grid}>
          {videos.map(v => (
            <div key={v.id} style={s.card}>
              <div style={s.thumb} onClick={() => setActive(v)}>
                <video
                  src={v.url}
                  muted
                  playsInline
                  preload="metadata"
                  style={s.thumbVideo}
                  onMouseEnter={e => e.target.play()}
                  onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }}
                />
                <div style={s.playOverlay}>▶</div>
              </div>
              <div style={s.cardFooter}>
                <a href={downloadUrl(v.url, v.id)} style={s.cardDl}>
                  ⬇ Descargar
                </a>
                <button onClick={() => shareVideo(v)} style={s.cardShare}>
                  {copiedId === v.id ? '✓' : '↗'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={s.footer}>G-SPIN 360 · Galería del evento</p>
    </div>
  );
}

const s = {
  page: {
    minHeight:       '100dvh',
    backgroundColor: '#0B0B0E',
    padding:         '0 16px 64px',
  },
  header: {
    textAlign:     'center',
    paddingTop:    48,
    paddingBottom: 32,
  },
  brand: {
    fontSize:      24,
    fontWeight:    900,
    letterSpacing: '0.18em',
    color:         '#9D7CFF',
    textShadow:    '0 0 16px #9D7CFF',
    marginBottom:  8,
  },
  eventName: {
    fontSize:      28,
    fontWeight:    800,
    letterSpacing: '0.04em',
    color:         '#FFFFFF',
    marginBottom:  6,
  },
  eventMeta: {
    color:         '#F5F5F7',
    fontSize:      13,
    opacity:       0.45,
    letterSpacing: '0.06em',
    marginBottom:  6,
  },
  countLabel: {
    color:         '#F5F5F7',
    fontSize:      13,
    opacity:       0.3,
    letterSpacing: '0.1em',
    margin:        0,
  },
  center: {
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    padding:        '80px 0',
    gap:            20,
  },
  spinner: {
    width:        48,
    height:       48,
    borderRadius: '50%',
    border:       '3px solid rgba(157,124,255,0.25)',
    borderTop:    '3px solid #9D7CFF',
    animation:    'spin 0.9s linear infinite',
  },
  loadingText: { color: '#F5F5F7', fontSize: 15, opacity: 0.5 },
  emptyText:   { color: '#F5F5F7', fontSize: 15, opacity: 0.4 },

  // ── Blocked states ──────────────────────────────────────────────────────
  gateBox: {
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    padding:        '60px 24px',
    maxWidth:       480,
    margin:         '0 auto',
    backgroundColor: 'rgba(17,17,25,0.6)',
    borderRadius:   20,
    border:         '1.5px solid rgba(157,124,255,0.2)',
  },
  gateIcon: {
    fontSize:     48,
    color:        '#9D7CFF',
    opacity:      0.35,
    marginBottom: 20,
  },
  gateTitle: {
    color:         '#FFFFFF',
    fontSize:      22,
    fontWeight:    800,
    letterSpacing: '0.02em',
    textAlign:     'center',
    marginBottom:  12,
    margin:        0,
  },
  gateDesc: {
    color:     '#F5F5F7',
    fontSize:  15,
    opacity:   0.5,
    textAlign: 'center',
    lineHeight: 1.6,
    margin:    0,
    marginTop: 12,
  },

  grid: {
    display:             'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap:                 12,
    maxWidth:            1200,
    margin:              '0 auto',
  },
  card: {
    backgroundColor: '#111119',
    borderRadius:    12,
    overflow:        'hidden',
    border:          '1px solid rgba(157,124,255,0.13)',
  },
  thumb: {
    position:        'relative',
    cursor:          'pointer',
    aspectRatio:     '9/16',
    overflow:        'hidden',
    backgroundColor: '#000',
  },
  thumbVideo: {
    width:     '100%',
    height:    '100%',
    objectFit: 'cover',
    display:   'block',
  },
  playOverlay: {
    position:       'absolute',
    inset:          0,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    fontSize:       32,
    color:          'rgba(255,255,255,0.85)',
    background:     'rgba(0,0,0,0.22)',
    pointerEvents:  'none',
  },
  cardFooter: {
    padding:        '10px 12px',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    gap:            8,
  },
  cardDl: {
    color:          '#9D7CFF',
    fontSize:       13,
    fontWeight:     600,
    letterSpacing:  '0.04em',
    cursor:         'pointer',
    textDecoration: 'none',
  },
  cardShare: {
    background:   'transparent',
    border:       '1px solid rgba(157,124,255,0.25)',
    color:        '#9D7CFF',
    fontSize:     13,
    fontWeight:   700,
    padding:      '4px 10px',
    borderRadius: 8,
    cursor:       'pointer',
    flexShrink:   0,
  },
  modal: {
    position:       'fixed',
    inset:          0,
    background:     'rgba(0,0,0,0.88)',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    zIndex:         1000,
    padding:        16,
  },
  modalInner: {
    width:        '100%',
    maxWidth:     440,
    background:   '#111119',
    borderRadius: 16,
    overflow:     'hidden',
    border:       '1.5px solid rgba(157,124,255,0.27)',
    boxShadow:    '0 0 60px rgba(157,124,255,0.13)',
  },
  modalVideo: {
    width:           '100%',
    display:         'block',
    backgroundColor: '#000',
  },
  modalActions: {
    display:    'flex',
    gap:        8,
    padding:    '12px 16px',
    alignItems: 'center',
  },
  dlBtn: {
    flex:            1,
    display:         'block',
    textAlign:       'center',
    backgroundColor: '#FF7300',
    color:           '#fff',
    fontSize:        14,
    fontWeight:      700,
    padding:         '11px 0',
    borderRadius:    10,
    cursor:          'pointer',
    textDecoration:  'none',
  },
  shareBtn: {
    flex:         1,
    textAlign:    'center',
    background:   'rgba(157,124,255,0.1)',
    border:       '1.5px solid rgba(157,124,255,0.27)',
    color:        '#9D7CFF',
    fontSize:     14,
    fontWeight:   700,
    padding:      '11px 0',
    borderRadius: 10,
    cursor:       'pointer',
  },
  closeBtn: {
    background:   'transparent',
    border:       '1.5px solid rgba(255,255,255,0.12)',
    color:        'rgba(255,255,255,0.4)',
    fontSize:     14,
    fontWeight:   700,
    padding:      '11px 16px',
    borderRadius: 10,
    cursor:       'pointer',
    flexShrink:   0,
  },
  footer: {
    textAlign:     'center',
    marginTop:     64,
    color:         '#F5F5F7',
    fontSize:      12,
    opacity:       0.22,
    letterSpacing: '0.08em',
  },
};
