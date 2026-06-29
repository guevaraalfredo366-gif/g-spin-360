'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default function EventoPage({ params }) {
  const { id: idEvento } = params;
  const [videos,  setVideos]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [active,  setActive]  = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, 'videos'),
          where('idEvento', '==', idEvento),
          orderBy('createdAt', 'desc'),
        );
        const snap = await getDocs(q);
        setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [idEvento]);

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <h1 style={s.brand}>G-SPIN 360</h1>
        <h2 style={s.eventName}>{idEvento}</h2>
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

      {/* Modal de reproducción */}
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
              <a
                href={active.url}
                download={`gspin360_${idEvento}_${active.id}.mp4`}
                style={s.dlBtn}
              >
                ⬇ Descargar
              </a>
              <button style={s.closeBtn} onClick={() => setActive(null)}>✕ Cerrar</button>
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
                <a
                  href={v.url}
                  download={`gspin360_${idEvento}_${v.id}.mp4`}
                  style={s.cardDl}
                >
                  ⬇ Descargar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={s.footer}>G-SPIN 360 · Todos los videos del evento</p>
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
    textAlign:   'center',
    paddingTop:  48,
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
    letterSpacing: '0.06em',
    color:         '#FFFFFF',
    marginBottom:  8,
  },
  countLabel: {
    color:     '#F5F5F7',
    fontSize:  13,
    opacity:   0.4,
    letterSpacing: '0.1em',
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
    border:       '3px solid #9D7CFF44',
    borderTop:    '3px solid #9D7CFF',
    animation:    'spin 0.9s linear infinite',
  },
  loadingText: {
    color:   '#F5F5F7',
    fontSize: 15,
    opacity:  0.5,
  },
  emptyText: {
    color:   '#F5F5F7',
    fontSize: 15,
    opacity:  0.4,
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
    border:          '1px solid #9D7CFF22',
    transition:      'border-color 0.2s',
  },
  thumb: {
    position:   'relative',
    cursor:     'pointer',
    aspectRatio: '9/16',
    overflow:   'hidden',
    backgroundColor: '#000',
  },
  thumbVideo: {
    width:      '100%',
    height:     '100%',
    objectFit:  'cover',
    display:    'block',
  },
  playOverlay: {
    position:   'absolute',
    inset:       0,
    display:    'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize:   32,
    color:      'rgba(255,255,255,0.8)',
    background: 'rgba(0,0,0,0.25)',
    pointerEvents: 'none',
  },
  cardFooter: {
    padding: '10px 12px',
  },
  cardDl: {
    color:         '#9D7CFF',
    fontSize:      13,
    fontWeight:    600,
    letterSpacing: '0.05em',
    cursor:        'pointer',
  },
  modal: {
    position:   'fixed',
    inset:      0,
    background: 'rgba(0,0,0,0.88)',
    display:    'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:     1000,
    padding:    16,
  },
  modalInner: {
    width:        '100%',
    maxWidth:     440,
    background:   '#111119',
    borderRadius: 16,
    overflow:     'hidden',
    border:       '1.5px solid #9D7CFF44',
    boxShadow:    '0 0 60px #9D7CFF22',
  },
  modalVideo: {
    width:           '100%',
    display:         'block',
    backgroundColor: '#000',
  },
  modalActions: {
    display:        'flex',
    gap:            12,
    padding:        '14px 16px',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  dlBtn: {
    flex:            1,
    display:         'block',
    textAlign:       'center',
    backgroundColor: '#FF7300',
    color:           '#fff',
    fontSize:        14,
    fontWeight:      700,
    padding:         '12px 0',
    borderRadius:    10,
    cursor:          'pointer',
  },
  closeBtn: {
    background:   'transparent',
    border:       '1.5px solid #9D7CFF55',
    color:        '#9D7CFF',
    fontSize:     14,
    fontWeight:   700,
    padding:      '12px 20px',
    borderRadius: 10,
    cursor:       'pointer',
  },
  footer: {
    textAlign:   'center',
    marginTop:   64,
    color:       '#F5F5F7',
    fontSize:    12,
    opacity:     0.25,
    letterSpacing: '0.08em',
  },
};
