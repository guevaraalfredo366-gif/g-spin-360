'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default function VideoPage({ params }) {
  const { id } = params;
  const [video,   setVideo]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'videos', id));
        if (snap.exists()) {
          setVideo({ id: snap.id, ...snap.data() });
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function handleDownload() {
    const filename = `gspin360_${video.idEvento}_${id}.mp4`;
    const proxyUrl = `/api/download?url=${encodeURIComponent(video.url)}&name=${encodeURIComponent(filename)}`;

    // En iOS Safari el atributo download no funciona en cross-origin;
    // el proxy devuelve Content-Disposition:attachment resolviendo el problema.
    const a = document.createElement('a');
    a.href     = proxyUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  if (loading) {
    return (
      <div style={s.center}>
        <div style={s.spinner} />
        <p style={s.loadingText}>Cargando tu video…</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div style={s.center}>
        <p style={{ ...s.loadingText, color: '#FF4444' }}>Video no encontrado.</p>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <h1 style={s.brand}>G-SPIN 360</h1>
        <p style={s.eventLabel}>Evento: {video.idEvento}</p>
      </div>

      {/* Reproductor */}
      <div style={s.playerWrap}>
        <video
          src={video.url}
          controls
          autoPlay
          loop
          playsInline
          style={s.player}
        />
      </div>

      {/* Botón de descarga — funciona en iOS Safari, Android Chrome y desktop */}
      <div style={s.actions}>
        <button onClick={handleDownload} style={s.downloadBtn}>
          ⬇ DESCARGAR MI VIDEO
        </button>
      </div>

      <p style={s.footer}>G-SPIN 360 · Tu recuerdo en video 360°</p>
    </div>
  );
}

const s = {
  page: {
    minHeight:       '100dvh',
    backgroundColor: '#0B0B0E',
    display:         'flex',
    flexDirection:   'column',
    alignItems:      'center',
    padding:         '0 16px 48px',
  },
  center: {
    minHeight:       '100dvh',
    display:         'flex',
    flexDirection:   'column',
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: '#0B0B0E',
    gap:             20,
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
    color:    '#F5F5F7',
    fontSize: 16,
    opacity:  0.6,
  },
  header: {
    textAlign:     'center',
    paddingTop:    48,
    paddingBottom: 24,
  },
  brand: {
    fontSize:      28,
    fontWeight:    900,
    letterSpacing: '0.18em',
    color:         '#9D7CFF',
    textShadow:    '0 0 20px #9D7CFF',
    marginBottom:  6,
  },
  eventLabel: {
    color:         '#F5F5F7',
    fontSize:      13,
    opacity:       0.45,
    letterSpacing: '0.12em',
  },
  playerWrap: {
    width:        '100%',
    maxWidth:     480,
    borderRadius: 16,
    overflow:     'hidden',
    border:       '1.5px solid #9D7CFF33',
    boxShadow:    '0 0 40px #9D7CFF22',
    marginBottom: 32,
  },
  player: {
    width:           '100%',
    display:         'block',
    backgroundColor: '#000',
  },
  actions: {
    width:    '100%',
    maxWidth: 480,
  },
  downloadBtn: {
    display:         'block',
    width:           '100%',
    textAlign:       'center',
    backgroundColor: '#FF7300',
    color:           '#fff',
    fontSize:        16,
    fontWeight:      800,
    letterSpacing:   '0.15em',
    padding:         '18px 24px',
    borderRadius:    14,
    border:          'none',
    boxShadow:       '0 6px 28px #FF730055',
    cursor:          'pointer',
  },
  footer: {
    marginTop:     48,
    color:         '#F5F5F7',
    fontSize:      12,
    opacity:       0.3,
    letterSpacing: '0.08em',
  },
};
