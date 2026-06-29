'use client';

import dynamic from 'next/dynamic';

const SceneDynamic = dynamic(() => import('./SceneWrapper'), {
  ssr:     false,
  loading: () => (
    <div style={{ position: 'absolute', inset: 0, background: '#0B0B0E' }} />
  ),
});

export default function SceneClient() {
  return <SceneDynamic />;
}
