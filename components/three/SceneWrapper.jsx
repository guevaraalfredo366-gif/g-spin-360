'use client';

import { useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import LogoMesh from './LogoMesh';
import FloatingIcons from './FloatingIcons';
import AbstractShapes from './AbstractShapes';
import ParticleField from './ParticleField';

function CameraRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.35 - camera.position.x) * 0.04;
    camera.position.y += (mouse.y * 0.22 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function SceneContents() {
  return (
    <>
      <ambientLight intensity={0.25} color="#9D7CFF" />
      <pointLight position={[ 5,  3,  2]} intensity={40} color="#FF7300" />
      <pointLight position={[-5, -2,  1]} intensity={25} color="#9D7CFF" />
      <pointLight position={[ 0,  5, -4]} intensity={15} color="#ffffff" />

      <CameraRig />

      <Stars radius={120} depth={60} count={3500} factor={3.5} saturation={0} fade speed={0.4} />

      <Suspense fallback={null}>
        <ParticleField />
        <LogoMesh />
        <FloatingIcons />
        <AbstractShapes />
      </Suspense>

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.12}
          luminanceSmoothing={0.65}
          intensity={1.8}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export default function SceneWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === 'undefined') {
    return <div style={{ position: 'absolute', inset: 0, background: '#0B0B0E' }} />;
  }

  return (
    <Suspense fallback={<div style={{ position: 'absolute', inset: 0, background: '#0B0B0E' }} />}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 70 }}
        dpr={[1, 2]}
        eventSource={null}
        eventPrefix="client"
        style={{ position: 'absolute', inset: 0, background: '#0B0B0E' }}
      >
        <SceneContents />
      </Canvas>
    </Suspense>
  );
}
