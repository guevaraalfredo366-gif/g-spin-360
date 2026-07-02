'use client';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SpeedEffect {
  enabled:     boolean;
  startSec:    number;
  durationSec: number;
  speedFactor: number;
}

export interface TimelineSegments {
  slow:      SpeedEffect;
  fast:      SpeedEffect;
  boomerang: { enabled: boolean };
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SLOW_SPEEDS  = [0.35, 0.50, 0.75];
const FAST_SPEEDS  = [1.25, 1.75, 2.00, 2.50, 3.00];
const SLOW_COLOR   = '#F6AD55';
const FAST_COLOR   = '#4FD1C5';
const BOOM_COLOR   = '#9D7CFF';
const PRIMARY      = '#9D7CFF';

// ── Helpers ───────────────────────────────────────────────────────────────────

export function defaultTimelineSegments(recordingDuration = 8): TimelineSegments {
  return {
    slow:      { enabled: false, startSec: 0, durationSec: Math.min(3, recordingDuration), speedFactor: 0.50 },
    fast:      { enabled: false, startSec: 0, durationSec: Math.min(3, recordingDuration), speedFactor: 2.00 },
    boomerang: { enabled: false },
  };
}

export function calcClipOutputDuration(recordingDuration: number, ts: TimelineSegments): number {
  const { slow, fast } = ts;
  let total = recordingDuration;
  if (slow?.enabled) {
    const d = Math.max(0, Math.min(slow.durationSec, recordingDuration - slow.startSec));
    total  += d * (1 / slow.speedFactor - 1);
  }
  if (fast?.enabled) {
    const d = Math.max(0, Math.min(fast.durationSec, recordingDuration - fast.startSec));
    total  += d * (1 / fast.speedFactor - 1);
  }
  return Math.max(0, total);
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

function formatTime(secs: number): string {
  const s = Math.round(Math.max(0, secs));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, color }: { checked: boolean; onChange: (v: boolean) => void; color: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
        position: 'relative', flexShrink: 0,
        background: checked ? color : '#2A2A3E', transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute', top: '3px', left: checked ? '23px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%', background: '#ffffff',
        transition: 'left 0.2s', display: 'block',
      }} />
    </button>
  );
}

function Stepper({
  label, value, min, max, onDec, onInc, color,
}: {
  label: string; value: number; min: number; max: number;
  onDec: () => void; onInc: () => void; color: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ color: '#aaa', fontSize: '13px', fontWeight: 600 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          type="button"
          onClick={onDec}
          disabled={value <= min}
          style={{
            width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #333',
            background: '#1A1A28', color: '#ccc', fontSize: '16px', fontWeight: 700,
            cursor: value <= min ? 'not-allowed' : 'pointer', opacity: value <= min ? 0.25 : 1,
          }}
        >
          -
        </button>
        <span style={{ color: '#fff', fontSize: '18px', fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
          {value}
        </span>
        <button
          type="button"
          onClick={onInc}
          disabled={value >= max}
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            border: `1px solid ${color}60`, background: `${color}18`,
            color, fontSize: '16px', fontWeight: 700,
            cursor: value >= max ? 'not-allowed' : 'pointer', opacity: value >= max ? 0.25 : 1,
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

function SpeedChips({
  speeds, selected, onSelect, color,
}: {
  speeds: number[]; selected: number; onSelect: (v: number) => void; color: string;
}) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {speeds.map((sp) => {
        const active = Math.abs(selected - sp) < 0.001;
        return (
          <button
            key={sp}
            type="button"
            onClick={() => onSelect(sp)}
            style={{
              padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
              cursor: 'pointer',
              border: `1.5px solid ${active ? color : '#242438'}`,
              background: active ? `${color}22` : '#1A1A28',
              color: active ? color : '#666',
            }}
          >
            x{sp.toFixed(2)}
          </button>
        );
      })}
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────

function EffectCard({
  dot, title, enabled, onToggle, color, children,
}: {
  dot: string; title: string; enabled: boolean; onToggle: (v: boolean) => void;
  color: string; children?: React.ReactNode;
}) {
  return (
    <div style={{ background: '#111119', borderRadius: '12px', border: '1.5px solid #1E1E35', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: enabled ? color : '#444', flexShrink: 0 }} />
        <span style={{ flex: 1, color: enabled ? color : '#bbb', fontSize: '15px', fontWeight: 700 }}>{title}</span>
        <Toggle checked={enabled} onChange={onToggle} color={color} />
      </div>
      {enabled && children && (
        <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  value:             TimelineSegments;
  onChange:          (v: TimelineSegments) => void;
  recordingDuration: number;
  introDurSec?:      number;
  outroDurSec?:      number;
}

export default function SpeedEffectsEditor({
  value,
  onChange,
  recordingDuration = 8,
  introDurSec = 0,
  outroDurSec = 0,
}: Props) {
  const { slow, fast, boomerang } = value;

  function updateSlow(patch: Partial<SpeedEffect>) {
    onChange({ ...value, slow: { ...slow, ...patch } });
  }
  function updateFast(patch: Partial<SpeedEffect>) {
    onChange({ ...value, fast: { ...fast, ...patch } });
  }
  function updateBoomerang(patch: Partial<{ enabled: boolean }>) {
    onChange({ ...value, boomerang: { ...boomerang, ...patch } });
  }

  const clipOutput   = calcClipOutputDuration(recordingDuration, value);
  const boomExtra    = boomerang?.enabled ? clipOutput : 0;
  const totalOutput  = introDurSec + clipOutput + outroDurSec + boomExtra;

  // Bar overlay percentages
  const slowLeft  = slow?.enabled ? (clamp(slow.startSec, 0, recordingDuration) / recordingDuration) * 100 : 0;
  const slowWidth = slow?.enabled
    ? (clamp(slow.durationSec, 0, recordingDuration - clamp(slow.startSec, 0, recordingDuration)) / recordingDuration) * 100
    : 0;
  const fastLeft  = fast?.enabled ? (clamp(fast.startSec, 0, recordingDuration) / recordingDuration) * 100 : 0;
  const fastWidth = fast?.enabled
    ? (clamp(fast.durationSec, 0, recordingDuration - clamp(fast.startSec, 0, recordingDuration)) / recordingDuration) * 100
    : 0;

  const ticks = Array.from({ length: recordingDuration - 1 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* ── Timeline bar card ───────────────────────────────────────────── */}
      <div style={{ background: '#111119', borderRadius: '12px', border: '1.5px solid #1E1E35', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: 600 }}>Duración del video</span>
          <span style={{ color: '#fff', fontSize: '16px', fontWeight: 800, letterSpacing: '1px' }}>{formatTime(clipOutput)}</span>
        </div>

        {/* Bar */}
        <div style={{ height: '20px', borderRadius: '5px', background: '#7A0A0A', position: 'relative', overflow: 'hidden' }}>
          {slow?.enabled && slowWidth > 0 && (
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${slowLeft}%`, width: `${slowWidth}%`, background: SLOW_COLOR }} />
          )}
          {fast?.enabled && fastWidth > 0 && (
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${fastLeft}%`, width: `${fastWidth}%`, background: FAST_COLOR }} />
          )}
          {ticks.map((_, i) => (
            <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: `${((i + 1) / recordingDuration) * 100}%`, width: '1px', background: 'rgba(255,255,255,0.2)' }} />
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { color: SLOW_COLOR, label: 'Cámara lenta' },
            { color: FAST_COLOR, label: 'Cámara rápida' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', background: `${color}22`, border: `1px solid ${color}60` }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
              <span style={{ color, fontSize: '11px', fontWeight: 700 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cámara lenta ────────────────────────────────────────────────── */}
      <EffectCard
        dot="●" title="Cámara lenta"
        enabled={!!slow?.enabled}
        onToggle={(v) => updateSlow({ enabled: v })}
        color={SLOW_COLOR}
      >
        <Stepper
          label="Inicio" value={slow.startSec}
          min={0} max={Math.max(0, recordingDuration - 1)}
          onDec={() => updateSlow({ startSec: Math.max(0, slow.startSec - 1) })}
          onInc={() => updateSlow({ startSec: Math.min(recordingDuration - 1, slow.startSec + 1) })}
          color={SLOW_COLOR}
        />
        <Stepper
          label="Duracion" value={slow.durationSec}
          min={1} max={Math.max(1, recordingDuration - slow.startSec)}
          onDec={() => updateSlow({ durationSec: Math.max(1, slow.durationSec - 1) })}
          onInc={() => updateSlow({ durationSec: Math.min(recordingDuration - slow.startSec, slow.durationSec + 1) })}
          color={SLOW_COLOR}
        />
        <div>
          <p style={{ color: '#888', fontSize: '11px', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.1em' }}>Velocidad</p>
          <SpeedChips speeds={SLOW_SPEEDS} selected={slow.speedFactor} onSelect={(sp) => updateSlow({ speedFactor: sp })} color={SLOW_COLOR} />
        </div>
      </EffectCard>

      {/* ── Cámara rápida ────────────────────────────────────────────────── */}
      <EffectCard
        dot="●" title="Cámara rápida"
        enabled={!!fast?.enabled}
        onToggle={(v) => updateFast({ enabled: v })}
        color={FAST_COLOR}
      >
        <Stepper
          label="Inicio" value={fast.startSec}
          min={0} max={Math.max(0, recordingDuration - 1)}
          onDec={() => updateFast({ startSec: Math.max(0, fast.startSec - 1) })}
          onInc={() => updateFast({ startSec: Math.min(recordingDuration - 1, fast.startSec + 1) })}
          color={FAST_COLOR}
        />
        <Stepper
          label="Duracion" value={fast.durationSec}
          min={1} max={Math.max(1, recordingDuration - fast.startSec)}
          onDec={() => updateFast({ durationSec: Math.max(1, fast.durationSec - 1) })}
          onInc={() => updateFast({ durationSec: Math.min(recordingDuration - fast.startSec, fast.durationSec + 1) })}
          color={FAST_COLOR}
        />
        <div>
          <p style={{ color: '#888', fontSize: '11px', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.1em' }}>Velocidad</p>
          <SpeedChips speeds={FAST_SPEEDS} selected={fast.speedFactor} onSelect={(sp) => updateFast({ speedFactor: sp })} color={FAST_COLOR} />
        </div>
      </EffectCard>

      {/* ── Boomerang ────────────────────────────────────────────────────── */}
      <EffectCard
        dot="●" title="Boomerang"
        enabled={!!boomerang?.enabled}
        onToggle={(v) => updateBoomerang({ enabled: v })}
        color={BOOM_COLOR}
      >
        <p style={{ color: BOOM_COLOR, fontSize: '12px', opacity: 0.7, margin: 0, lineHeight: 1.5 }}>
          El clip reproducirá hacia adelante y luego en reversa al final.
        </p>
      </EffectCard>

      {/* ── Duration preview ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', background: '#111119', borderRadius: '12px', border: '1.5px solid #1E1E35', padding: '12px' }}>
        {[
          { label: 'INTRO', value: `${introDurSec}s`, accent: false },
          { label: '+', value: null, op: true },
          { label: 'CLIP',  value: `${Math.round(clipOutput)}s`, accent: PRIMARY },
          { label: '+', value: null, op: true },
          { label: 'OUTRO', value: `${outroDurSec}s`, accent: false },
          { label: '=', value: null, op: true },
          { label: 'TOTAL', value: `${Math.round(totalOutput)}s`, accent: '#FF7300' },
        ].map((item, i) =>
          item.op ? (
            <span key={i} style={{ color: '#555', fontSize: '14px', fontWeight: 700 }}>{item.label}</span>
          ) : (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '8px 10px', background: '#1A1A28', borderRadius: '10px', minWidth: '52px',
              border: item.accent ? `1px solid ${item.accent}40` : 'none',
            }}>
              <span style={{ color: '#888', fontSize: '8px', letterSpacing: '1.5px', fontWeight: 700 }}>{item.label}</span>
              <span style={{ color: typeof item.accent === 'string' ? item.accent : '#fff', fontSize: '15px', fontWeight: 800, marginTop: '2px' }}>{item.value}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
