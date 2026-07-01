'use client';

import React, { useMemo } from 'react';

// ── Types & constants ──────────────────────────────────────────────────────────

export interface Segment {
  id:       string;
  effect:   string;
  duration: number;
}

export interface SegmentWithTime extends Segment {
  startTime: number;
}

const EFFECT_META: Record<string, { label: string; symbol: string; color: string; factor: number }> = {
  normal:    { label: 'Normal',    symbol: '▶',  color: '#4A5568', factor: 1   },
  slow:      { label: 'Lento',     symbol: '🐢', color: '#2563EB', factor: 2   },
  fast:      { label: 'Rápido',    symbol: '⚡', color: '#D97706', factor: 0.5 },
  boomerang: { label: 'Boomerang', symbol: '↩',  color: '#7C3AED', factor: 2   },
};

const EFFECTS_ORDER = ['normal', 'slow', 'fast', 'boomerang'];

// ── Helpers ────────────────────────────────────────────────────────────────────

export function withStartTimes(segments: Segment[]): SegmentWithTime[] {
  let t = 0;
  return segments.map((s) => {
    const r = { ...s, startTime: t };
    t += s.duration;
    return r;
  });
}

function newId() {
  return `seg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

// ── Component ──────────────────────────────────────────────────────────────────

interface Props {
  segments:    Segment[];
  onChange:    (segs: Segment[]) => void;
  introDurSec: number;
  outroDurSec: number;
}

export default function TimelineEditor({ segments, onChange, introDurSec, outroDurSec }: Props) {
  const totalRecording = useMemo(() => segments.reduce((a, s) => a + s.duration, 0), [segments]);
  const totalClipOutput = useMemo(() =>
    segments.reduce((acc, seg) => acc + Math.round(seg.duration * (EFFECT_META[seg.effect]?.factor ?? 1)), 0),
    [segments],
  );
  const totalOutput = (introDurSec || 0) + totalClipOutput + (outroDurSec || 0);

  // ── Mutations ────────────────────────────────────────────────────────────────

  function changeEffect(id: string, effect: string) {
    onChange(segments.map((s) => (s.id === id ? { ...s, effect } : s)));
  }

  function changeDuration(id: string, delta: number) {
    const idx = segments.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const newDur = segments[idx].duration + delta;
    if (newDur < 1) return;
    const adjIdx = idx < segments.length - 1 ? idx + 1 : idx - 1;
    if (adjIdx < 0 || adjIdx === idx) return;
    const adjNew = segments[adjIdx].duration - delta;
    if (adjNew < 1) return;
    onChange(segments.map((s, i) => {
      if (i === idx)    return { ...s, duration: newDur };
      if (i === adjIdx) return { ...s, duration: adjNew };
      return s;
    }));
  }

  function addSegment() {
    const last = segments[segments.length - 1];
    if (last.duration < 2) return;
    const half1 = Math.ceil(last.duration / 2);
    const half2 = last.duration - half1;
    onChange([...segments.slice(0, -1), { ...last, duration: half1 }, { id: newId(), effect: 'normal', duration: half2 }]);
  }

  function removeSegment(id: string) {
    if (segments.length <= 1) return;
    const idx = segments.findIndex((s) => s.id === id);
    const dur = segments[idx].duration;
    const next = segments.filter((_, i) => i !== idx);
    const adjIdx = Math.min(idx, next.length - 1);
    next[adjIdx] = { ...next[adjIdx], duration: next[adjIdx].duration + dur };
    onChange(next);
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  const barStyle: React.CSSProperties = {
    display: 'flex', height: '48px', borderRadius: '10px',
    overflow: 'hidden', border: '1px solid #1E1E35', marginBottom: '12px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#0F0F1A', borderRadius: '12px', border: '1.5px solid #1E1E35',
    padding: '12px', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '10px',
  };

  const stepBtnStyle: React.CSSProperties = {
    width: '30px', height: '30px', borderRadius: '8px', border: '1px solid rgba(157,124,255,0.4)',
    background: 'rgba(157,124,255,0.1)', color: '#9D7CFF', fontSize: '18px', fontWeight: '700',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  };

  return (
    <div>
      {/* Timeline bar */}
      <div style={barStyle}>
        {segments.map((seg, i) => {
          const pct  = totalRecording > 0 ? (seg.duration / totalRecording) * 100 : 0;
          const meta = EFFECT_META[seg.effect] ?? EFFECT_META.normal;
          return (
            <div
              key={seg.id}
              style={{
                flex: `0 0 ${pct}%`, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '2px',
                background: meta.color + '44', borderRight: i < segments.length - 1 ? '1px solid #0B0B0E' : undefined,
                minWidth: '28px', overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: '14px', lineHeight: '1' }}>{meta.symbol}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', fontWeight: 700 }}>{seg.duration}s</span>
            </div>
          );
        })}
      </div>

      {/* Segment cards */}
      {segments.map((seg, i) => {
        const meta = EFFECT_META[seg.effect] ?? EFFECT_META.normal;
        return (
          <div key={seg.id} style={{ ...cardStyle, borderColor: meta.color + '60' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: meta.color, letterSpacing: '0.04em' }}>
                {meta.symbol} Segmento {i + 1}
              </span>
              {segments.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSegment(seg.id)}
                  style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '14px', cursor: 'pointer', padding: '2px 4px' }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Effect selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {EFFECTS_ORDER.map((key) => {
                const em     = EFFECT_META[key];
                const active = seg.effect === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => changeEffect(seg.id, key)}
                    style={{
                      padding: '6px 4px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer',
                      background: active ? em.color + '33' : '#16162A',
                      border: `1px solid ${active ? em.color : '#1E1E35'}`,
                      color: active ? em.color : 'rgba(255,255,255,0.4)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                    }}
                  >
                    <span style={{ fontSize: '13px', lineHeight: '1.2' }}>{em.symbol}</span>
                    <span style={{ fontSize: '9px', fontWeight: 700 }}>{em.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Duration stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button type="button" onClick={() => changeDuration(seg.id, -1)} style={stepBtnStyle}>−</button>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                <span style={{ color: '#ffffff', fontSize: '22px', fontWeight: '900' }}>{seg.duration}</span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>seg</span>
              </div>
              <button type="button" onClick={() => changeDuration(seg.id, 1)} style={stepBtnStyle}>+</button>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginLeft: '4px' }}>
                → {Math.round(seg.duration * (EFFECT_META[seg.effect]?.factor ?? 1))}s en video
              </span>
            </div>
          </div>
        );
      })}

      {/* Add segment */}
      <button
        type="button"
        onClick={addSegment}
        style={{
          width: '100%', padding: '10px', borderRadius: '10px', cursor: 'pointer',
          background: 'transparent', border: '1px dashed rgba(157,124,255,0.4)',
          color: 'rgba(157,124,255,0.6)', fontSize: '10px', fontWeight: 800,
          letterSpacing: '0.15em', marginBottom: '12px',
        }}
      >
        + AGREGAR SEGMENTO
      </button>

      {/* Duration preview */}
      <div style={{ padding: '12px', borderRadius: '12px', background: '#0F0F1A', border: '1px solid #1E1E35' }}>
        <p style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginBottom: '10px' }}>
          VIDEO FINAL ESTIMADO
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { label: 'INTRO', val: `${introDurSec || 0}s`, color: 'rgba(255,255,255,0.6)', extra: {} },
            { label: '+', val: null },
            { label: 'CLIP', val: `${totalClipOutput}s`, color: '#9D7CFF', extra: { border: '1px solid rgba(157,124,255,0.3)' } },
            { label: '+', val: null },
            { label: 'OUTRO', val: `${outroDurSec || 0}s`, color: 'rgba(255,255,255,0.6)', extra: {} },
            { label: '=', val: null },
            { label: 'TOTAL', val: `${totalOutput}s`, color: '#FF7300', extra: { border: '1px solid rgba(255,115,0,0.3)' } },
          ].map((item, idx) =>
            item.val === null ? (
              <span key={idx} style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>{item.label}</span>
            ) : (
              <div key={idx} style={{ textAlign: 'center', padding: '6px 8px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', minWidth: '44px', ...item.extra }}>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginBottom: '2px' }}>{item.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: item.color }}>{item.val}</div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
