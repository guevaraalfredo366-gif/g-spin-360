'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

function OrbitRing({ radius, color, speed, tiltX = 0, tiltZ = 0, phase = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase;
    ref.current.rotation.x = tiltX + Math.sin(t * 0.4) * 0.15;
    ref.current.rotation.z = tiltZ + t;
    ref.current.material.opacity = 0.35 + Math.sin(t * 2.2) * 0.12;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.012, 8, 80]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} transparent opacity={0.35} />
    </mesh>
  );
}

export default function LogoMesh() {
  const texture  = useTexture('/Logo.png');
  const logoRef  = useRef();
  const glow1Ref = useRef();
  const glow2Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    logoRef.current.rotation.y  = Math.sin(t * 0.28) * 0.07;
    logoRef.current.rotation.x  = Math.sin(t * 0.18) * 0.04;
    glow1Ref.current.material.opacity = 0.14 + Math.sin(t * 0.9) * 0.05;
    glow2Ref.current.material.opacity = 0.07 + Math.sin(t * 0.6) * 0.03;
  });

  return (
    <group>
      {/* Radial glow — orange */}
      <mesh ref={glow1Ref} position={[0, 0, -0.35]}>
        <circleGeometry args={[1.6, 64]} />
        <meshBasicMaterial color="#FF7300" transparent opacity={0.14} side={THREE.DoubleSide} />
      </mesh>

      {/* Radial glow — purple, larger */}
      <mesh ref={glow2Ref} position={[0, 0, -0.6]}>
        <circleGeometry args={[2.4, 64]} />
        <meshBasicMaterial color="#9D7CFF" transparent opacity={0.07} side={THREE.DoubleSide} />
      </mesh>

      {/* Logo plane */}
      <mesh ref={logoRef}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshStandardMaterial map={texture} transparent alphaTest={0.01} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Orbit rings */}
      <OrbitRing radius={1.55} color="#9D7CFF" speed={0.38}  tiltX={0.5}  tiltZ={0.1}  phase={0} />
      <OrbitRing radius={1.85} color="#FF7300" speed={0.22}  tiltX={0.9}  tiltZ={0.4}  phase={Math.PI / 2.5} />
      <OrbitRing radius={2.15} color="#9D7CFF" speed={0.16}  tiltX={0.3}  tiltZ={-0.3} phase={Math.PI / 1.4} />
    </group>
  );
}
