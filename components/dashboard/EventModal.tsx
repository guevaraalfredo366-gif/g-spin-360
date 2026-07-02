'use client';

import { useRef, useState } from 'react';
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAssets, Asset } from '@/hooks/useAssets';
import SpeedEffectsEditor, {
  TimelineSegments,
  defaultTimelineSegments,
} from './SpeedEffectsEditor';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface EventData {
  id:                string;
  idEvento:          string;
  name:              string;
  operatorId:        string;
  status?:           string;
  eventDate?:        Timestamp | null;
  eventLocation?:    string | null;
  framePublicId?:    string | null;
  musicPublicId?:    string | null;
  introPublicId?:    string | null;
  outroPublicId?:    string | null;
  logoPublicId?:     string | null;
  logoPosition?:     string;
  recordingEffect?:  string;
  recordingDuration?: number;
  cameraFacing?:     string;
  countdownSec?:     number;
  videoQuality?:     string;
  videoFps?:         number;
  timelineSegments?: TimelineSegments | null;
  startTime?:        Timestamp | null;
  endTime?:          Timestamp | null;
  isGalleryOpen?:    boolean;
  createdAt?:        Timestamp;
}

interface Props {
  mode:    'create' | 'edit';
  event?:  EventData;
  onClose: () => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const LOGO_POSITIONS = [
  { key: 'top-left',     label: 'Sup. izq.' },
  { key: 'top-right',    label: 'Sup. der.' },
  { key: 'bottom-left',  label: 'Inf. izq.' },
  { key: 'bottom-right', label: 'Inf. der.' },
];

// ── Utils ─────────────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name.trim().toUpperCase().replace(/\s+/g, '-').replace(/[^A-Z0-9-]/g, '').slice(0, 40);
}

function tsToDateTimeLocal(ts: Timestamp | null | undefined): string {
  if (!ts?.toDate) return '';
  const d   = ts.toDate();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function tsToDateInput(ts: Timestamp | null | undefined): string {
  if (!ts?.toDate) return '';
  const d   = ts.toDate();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function uploadLogoToCloudinary(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', 'gspin_preset');
  fd.append('folder', 'eventos360');
  const res  = await fetch('https://api.cloudinary.com/v1_1/ddsylhrzz/image/upload', { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? 'Upload failed');
  return data.public_id as string;
}

// ── Shared style primitives ────────────────────────────────────────────────────

const inputSt: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
  color: '#ffffff', background: '#16162A', border: '1px solid #1E1E35',
  outline: 'none', boxSizing: 'border-box',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function Label({ text }: { text: string }) {
  return (
    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '7px' }}>
      {text}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = 'text', disabled, maxLength }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; disabled?: boolean; maxLength?: number;
}) {
  return (
    <input
      type={type} value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} disabled={disabled} maxLength={maxLength}
      style={{ ...inputSt, color: disabled ? 'rgba(255,255,255,0.3)' : '#fff', background: disabled ? '#0a0a12' : '#16162A', cursor: disabled ? 'not-allowed' : 'text' }}
      onFocus={(e) => { if (!disabled) e.currentTarget.style.borderColor = '#9D7CFF'; }}
      onBlur={(e)  => { e.currentTarget.style.borderColor = '#1E1E35'; }}
    />
  );
}

function AssetSelect({ value, onChange, options, loading }: {
  value: string; onChange: (v: string) => void; options: Asset[]; loading: boolean;
}) {
  return (
    <select
      value={value} onChange={(e) => onChange(e.target.value)} disabled={loading}
      style={{ ...inputSt, cursor: 'pointer', appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
    >
      {options.map((o) => (
        <option key={o.id} value={o.publicId} style={{ background: '#16162A' }}>
          {o.label}{o.desc ? ` — ${o.desc}` : ''}
        </option>
      ))}
    </select>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: '20px 0 14px', borderTop: '1px solid #1E1E35', paddingTop: '18px' }}>
      {children}
    </p>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
        position: 'relative', flexShrink: 0,
        background: checked ? '#9D7CFF' : '#2A2A3E', transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute', top: '3px', left: checked ? '23px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', display: 'block',
      }} />
    </button>
  );
}

function OptionGroup({ options, selected, onSelect, primary = '#9D7CFF' }: {
  options: { key: string | number; label: string }[];
  selected: string | number;
  onSelect: (v: string | number) => void;
  primary?: string;
}) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onSelect(o.key)}
          style={{
            flex: 1, padding: '8px 4px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            background: selected === o.key ? `${primary}15` : '#16162A',
            border: `1px solid ${selected === o.key ? primary : '#1E1E35'}`,
            color: selected === o.key ? primary : 'rgba(255,255,255,0.4)',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function DurationStepper({ label, value, min, max, onChange, color = '#9D7CFF' }: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void; color?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#aaa', fontSize: '13px', fontWeight: 600 }}>{label}</span>
        <span style={{ padding: '3px 10px', borderRadius: '20px', background: `${color}22`, border: `1px solid ${color}60`, color, fontSize: '13px', fontWeight: 800 }}>
          {value}s
        </span>
      </div>
      <div style={{ height: '6px', borderRadius: '3px', background: '#1A1A28', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: '3px', background: color }} />
      </div>
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
        {[-5, -1, +1, +5].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onChange(Math.min(max, Math.max(min, value + d)))}
            style={{
              padding: '5px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
              cursor: 'pointer', border: `1px solid ${d > 0 ? color + '60' : '#1E1E35'}`,
              background: d > 0 ? `${color}18` : '#16162A',
              color: d > 0 ? color : 'rgba(255,255,255,0.4)',
            }}
          >
            {d > 0 ? `+${d}` : d}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function EventModal({ mode, event, onClose }: Props) {
  const { user }   = useAuth();
  const { assets, loading: assetsLoading } = useAssets();
  const logoFileRef = useRef<HTMLInputElement>(null);
  const isEdit      = mode === 'edit';

  // ── Step 0: Event identity ─────────────────────────────────────────────────
  const [name,          setName]          = useState(isEdit ? (event?.name ?? '') : '');
  const [eventDate,     setEventDate]     = useState(tsToDateInput(event?.eventDate));
  const [eventLocation, setEventLocation] = useState(event?.eventLocation ?? '');
  const [status,        setStatus]        = useState(event?.status ?? 'Activo');
  const [startDT,       setStartDT]       = useState(tsToDateTimeLocal(event?.startTime));
  const [endDT,         setEndDT]         = useState(tsToDateTimeLocal(event?.endTime));
  const [galleryOpen,   setGalleryOpen]   = useState(event?.isGalleryOpen ?? false);

  // ── Step 1: Camera settings ────────────────────────────────────────────────
  const [cameraFacing,     setCameraFacing]     = useState(event?.cameraFacing ?? 'front');
  const [countdownEnabled, setCountdownEnabled] = useState((event?.countdownSec ?? 3) > 0);
  const [countdownSec,     setCountdownSec]     = useState(event?.countdownSec ?? 3);
  const [recordingDuration, setRecordingDuration] = useState(event?.recordingDuration ?? 8);
  const [videoQuality,     setVideoQuality]     = useState(event?.videoQuality ?? 'hd');
  const [videoFps,         setVideoFps]         = useState<number>(event?.videoFps ?? 30);

  // ── Step 2: Assets ─────────────────────────────────────────────────────────
  const [frameId,  setFrameId]  = useState(event?.framePublicId  ?? '__none__');
  const [musicId,  setMusicId]  = useState(event?.musicPublicId  ?? '__none__');
  const [introId,  setIntroId]  = useState(event?.introPublicId  ?? '__none__');
  const [outroId,  setOutroId]  = useState(event?.outroPublicId  ?? '__none__');
  const [logoId,   setLogoId]   = useState(event?.logoPublicId   ?? '');
  const [logoPos,  setLogoPos]  = useState(event?.logoPosition   ?? 'top-right');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // ── Step 3: Effects ────────────────────────────────────────────────────────
  const [timelineSegments, setTimelineSegments] = useState<TimelineSegments>(() => {
    const ts = event?.timelineSegments;
    if (ts && typeof ts === 'object' && ts.slow !== undefined) return ts as TimelineSegments;
    const dur = event?.recordingDuration ?? 8;
    const old = event?.recordingEffect;
    return {
      slow:      { enabled: old === 'slow',      startSec: 0, durationSec: dur, speedFactor: 0.50 },
      fast:      { enabled: old === 'fast',      startSec: 0, durationSec: dur, speedFactor: 2.00 },
      boomerang: { enabled: old === 'boomerang' },
    };
  });

  // ── UI state ───────────────────────────────────────────────────────────────
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [created,       setCreated]       = useState<string | null>(null);

  // Duration info for preview
  const introDurSec = assets.intro.find(a => a.publicId === introId)?.durationSec ?? 0;
  const outroDurSec = assets.outro.find(a => a.publicId === outroId)?.durationSec ?? 0;

  async function handleLogoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoUploading(true);
    try {
      const publicId = await uploadLogoToCloudinary(file);
      setLogoId(publicId);
    } catch {
      setError('No se pudo subir el logo.');
    } finally {
      setLogoUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError('');

    let idEvento: string;
    if (isEdit) {
      idEvento = event!.id;
    } else {
      const cleanName = name.trim().slice(0, 100);
      if (!cleanName) { setError('Escribe un nombre para el evento.'); return; }
      idEvento = `${slugify(cleanName)}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
    }

    setSaving(true);
    try {
      const toTs     = (dtStr: string) => { if (!dtStr) return null; const d = new Date(dtStr); return isNaN(d.getTime()) ? null : Timestamp.fromDate(d); };
      const toDateTs = (dateStr: string) => { if (!dateStr) return null; const d = new Date(dateStr + 'T12:00:00'); return isNaN(d.getTime()) ? null : Timestamp.fromDate(d); };
      const nullIfNone = (v: string) => (!v || v === '__none__') ? null : v;

      const recordingEffect = timelineSegments.boomerang?.enabled ? 'boomerang'
        : timelineSegments.slow?.enabled ? 'slow'
        : timelineSegments.fast?.enabled ? 'fast'
        : 'normal';

      const payload = {
        idEvento,
        name:              isEdit ? (event?.name ?? idEvento) : name.trim().slice(0, 100),
        operatorId:        user.uid,
        status:            isEdit ? status : 'Activo',
        eventDate:         toDateTs(eventDate),
        eventLocation:     eventLocation.trim() || null,
        framePublicId:     nullIfNone(frameId),
        musicPublicId:     nullIfNone(musicId),
        introPublicId:     nullIfNone(introId),
        outroPublicId:     nullIfNone(outroId),
        logoPublicId:      logoId || null,
        logoPosition:      logoPos,
        // Camera
        cameraFacing,
        countdownSec:      countdownEnabled ? countdownSec : 0,
        countdownEnabled,
        videoQuality,
        videoFps,
        recordingDuration,
        // Effects
        timelineSegments,
        recordingEffect,
        startTime:         toTs(startDT),
        endTime:           toTs(endDT),
        isGalleryOpen:     galleryOpen,
        ...(isEdit ? {} : { videoCount: 0, createdAt: serverTimestamp() }),
      };

      if (isEdit) {
        await updateDoc(doc(db, 'events', idEvento), payload);
        onClose();
      } else {
        await setDoc(doc(db, 'events', idEvento), payload);
        setCreated(idEvento);
      }
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'No se pudo guardar el evento.');
    } finally {
      setSaving(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '580px', borderRadius: '20px', background: '#0F0F1A', border: '1px solid #1E1E35', padding: '28px', marginTop: '16px', marginBottom: '40px' }}
      >
        {created ? (
          /* ── Success ─────────────────────────────────────────────────── */
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '28px', marginBottom: '8px' }}>✅</p>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>Evento creado</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px', lineHeight: 1.6 }}>
              Abre la app G-SPIN 360 y escribe este código para conectarte:
            </p>
            <div style={{ padding: '14px', borderRadius: '12px', background: '#16162A', border: '1px solid rgba(157,124,255,0.3)', fontSize: '17px', fontWeight: 800, letterSpacing: '0.08em', color: '#9D7CFF', marginBottom: '24px', wordBreak: 'break-all' }}>
              {created}
            </div>
            <button onClick={onClose} style={{ width: '100%', padding: '13px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, background: '#9D7CFF', border: 'none', color: '#fff', cursor: 'pointer' }}>
              Listo
            </button>
          </div>
        ) : (
          /* ── Form ────────────────────────────────────────────────────── */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>
                {isEdit ? 'Editar evento' : 'Nuevo evento'}
              </h2>
              <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '22px', cursor: 'pointer', padding: '4px' }}>✕</button>
            </div>

            {/* ── Identidad ──────────────────────────────────────────── */}
            {!isEdit && (
              <div>
                <Label text="Nombre del evento" />
                <Input value={name} onChange={setName} placeholder="Ej. Boda Alfredo & María" maxLength={100} />
              </div>
            )}
            {isEdit && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#0a0a12', border: '1px solid #1E1E35' }}>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '2px', letterSpacing: '0.1em' }}>ID DEL EVENTO</p>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#9D7CFF', margin: 0 }}>{event?.idEvento}</p>
              </div>
            )}
            {isEdit && (
              <div>
                <Label text="Estado" />
                <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...inputSt, cursor: 'pointer', appearance: 'none' }}>
                  <option value="Activo">Activo</option>
                  <option value="Completado">Completado</option>
                </select>
              </div>
            )}

            {/* ── Detalles del evento ─────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <Label text="Fecha del evento" />
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
                  style={{ ...inputSt, cursor: 'pointer' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#9D7CFF')}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = '#1E1E35')} />
              </div>
              <div>
                <Label text="Ubicación" />
                <Input value={eventLocation} onChange={setEventLocation} placeholder="Salón Los Arcos, MTY" maxLength={100} />
              </div>
            </div>

            {/* ── Cámara ─────────────────────────────────────────── */}
            <SectionTitle>Cámara y grabación</SectionTitle>

            <div>
              <Label text="Posición de cámara" />
              <OptionGroup
                options={[{ key: 'front', label: 'Frontal' }, { key: 'back', label: 'Trasera' }]}
                selected={cameraFacing}
                onSelect={(v) => setCameraFacing(v as string)}
              />
            </div>

            <DurationStepper label="Duración de grabación" value={recordingDuration} min={3} max={30} onChange={setRecordingDuration} color="#9D7CFF" />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '10px', background: '#16162A', border: '1px solid #1E1E35' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: '0 0 2px' }}>Cuenta regresiva</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>{countdownEnabled ? `${countdownSec}s antes de grabar` : 'Sin cuenta regresiva'}</p>
              </div>
              <ToggleSwitch checked={countdownEnabled} onChange={setCountdownEnabled} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <Label text="Calidad" />
                <OptionGroup
                  options={[{ key: 'sd', label: 'SD' }, { key: 'hd', label: 'HD' }, { key: 'fhd', label: 'FHD' }]}
                  selected={videoQuality}
                  onSelect={(v) => setVideoQuality(v as string)}
                />
              </div>
              <div>
                <Label text="FPS" />
                <OptionGroup
                  options={[{ key: 24, label: '24' }, { key: 30, label: '30' }, { key: 60, label: '60' }]}
                  selected={videoFps}
                  onSelect={(v) => setVideoFps(v as number)}
                />
              </div>
            </div>

            {/* ── Composición de video ────────────────────────────── */}
            <SectionTitle>Composición de video</SectionTitle>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><Label text="Intro"  /><AssetSelect value={introId} onChange={setIntroId} options={assets.intro} loading={assetsLoading} /></div>
              <div><Label text="Outro"  /><AssetSelect value={outroId} onChange={setOutroId} options={assets.outro} loading={assetsLoading} /></div>
              <div><Label text="Marco"  /><AssetSelect value={frameId} onChange={setFrameId} options={assets.frame} loading={assetsLoading} /></div>
              <div><Label text="Música" /><AssetSelect value={musicId} onChange={setMusicId} options={assets.music} loading={assetsLoading} /></div>
            </div>

            {/* ── Logo ────────────────────────────────────────────── */}
            <SectionTitle>Logo del operador</SectionTitle>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'flex-end' }}>
              <div>
                <Label text="Logo (PNG con transparencia)" />
                <input ref={logoFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoFileChange} />
                <button
                  type="button"
                  onClick={() => logoFileRef.current?.click()}
                  disabled={logoUploading}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: '#16162A', border: '1px solid #1E1E35', color: logoId ? '#9D7CFF' : 'rgba(255,255,255,0.4)', cursor: 'pointer', textAlign: 'left' }}
                >
                  {logoUploading ? 'Subiendo…' : logoFile ? `✓ ${logoFile.name}` : logoId ? '✓ Logo guardado' : 'Subir logo…'}
                </button>
              </div>
              <div>
                <Label text="Posición del logo" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {LOGO_POSITIONS.map((p) => (
                    <button key={p.key} type="button" onClick={() => setLogoPos(p.key)}
                      style={{ padding: '7px 4px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', background: logoPos === p.key ? 'rgba(157,124,255,0.15)' : '#16162A', border: `1px solid ${logoPos === p.key ? '#9D7CFF' : '#1E1E35'}`, color: logoPos === p.key ? '#9D7CFF' : 'rgba(255,255,255,0.4)' }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Efectos de velocidad ────────────────────────────── */}
            <SectionTitle>Efectos de velocidad</SectionTitle>
            <SpeedEffectsEditor
              value={timelineSegments}
              onChange={setTimelineSegments}
              recordingDuration={recordingDuration}
              introDurSec={introDurSec}
              outroDurSec={outroDurSec}
            />

            {/* ── Ventana QR ──────────────────────────────────────── */}
            <SectionTitle>Ventana de acceso al QR</SectionTitle>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <Label text="Inicio (fecha y hora)" />
                <input type="datetime-local" value={startDT} onChange={(e) => setStartDT(e.target.value)}
                  style={{ ...inputSt, cursor: 'pointer' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#9D7CFF')}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = '#1E1E35')} />
              </div>
              <div>
                <Label text="Fin (fecha y hora)" />
                <input type="datetime-local" value={endDT} onChange={(e) => setEndDT(e.target.value)}
                  style={{ ...inputSt, cursor: 'pointer' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#9D7CFF')}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = '#1E1E35')} />
              </div>
            </div>

            {/* ── Acceso público ──────────────────────────────────── */}
            <SectionTitle>Acceso público</SectionTitle>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', background: '#16162A', border: '1px solid #1E1E35' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: '0 0 2px' }}>Galería pública</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                  {galleryOpen ? 'Invitados pueden ver los clips vía QR' : 'Galería cerrada — solo tú puedes ver'}
                </p>
              </div>
              <ToggleSwitch checked={galleryOpen} onChange={setGalleryOpen} />
            </div>

            {/* ── Error ───────────────────────────────────────────── */}
            {error && <p style={{ fontSize: '12px', color: '#EF4444', margin: 0 }}>{error}</p>}

            {/* ── Actions ─────────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
              <button type="button" onClick={onClose}
                style={{ flex: 1, padding: '13px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, background: 'transparent', border: '1px solid #1E1E35', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button type="submit" disabled={saving || logoUploading}
                style={{ flex: 1, padding: '13px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, border: 'none', color: '#fff', cursor: saving ? 'default' : 'pointer', background: saving ? 'rgba(157,124,255,0.5)' : '#9D7CFF' }}>
                {saving ? 'Guardando…' : isEdit ? 'Actualizar evento' : 'Crear evento'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
