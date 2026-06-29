'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function Rotating({ position, speed = 0.4, phase = 0, children }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * speed * 0.65 + phase;
    ref.current.rotation.y = t * speed + phase;
    ref.current.rotation.z = t * speed * 0.4 + phase;
  });
  return <group ref={ref} position={position}>{children}</group>;
}

export default function AbstractShapes() {
  return (
    <group>
      {/* Purple wireframe icosahedron — top right background */}
      <Rotating position={[4.2, 2.6, -3.5]} speed={0.28} phase={0}>
        <mesh>
          <icosahedronGeometry args={[0.75, 0]} />
          <meshStandardMaterial color="#9D7CFF" emissive="#9D7CFF" emissiveIntensity={0.7} wireframe />
        </mesh>
      </Rotating>

      {/* Small solid purple icosahedron */}
      <Rotating position={[-4.2, -2.6, -2.8]} speed={0.5} phase={1.3}>
        <mesh>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial color="#9D7CFF" emissive="#9D7CFF" emissiveIntensity={1.2} roughness={0.05} metalness={0.95} />
        </mesh>
      </Rotating>

      {/* Orange octahedron — left */}
      <Rotating position={[-4.6, 1.1, -3.2]} speed={0.38} phase={0.6}>
        <mesh>
          <octahedronGeometry args={[0.58]} />
          <meshStandardMaterial color="#FF7300" emissive="#FF7300" emissiveIntensity={1.0} roughness={0.1} metalness={0.8} />
        </mesh>
      </Rotating>

      {/* Small orange octahedron — bottom right */}
      <Rotating position={[4.3, -1.9, -2.2]} speed={0.65} phase={2.2}>
        <mesh>
          <octahedronGeometry args={[0.32]} />
          <meshStandardMaterial color="#FF7300" emissive="#FF7300" emissiveIntensity={1.4} roughness={0} metalness={1} />
        </mesh>
      </Rotating>

      {/* Purple torus knot — top far right */}
      <Float speed={0.7} rotationIntensity={0.6} floatIntensity={0.4} position={[3.6, 2.9, -4.2]}>
        <mesh>
          <torusKnotGeometry args={[0.33, 0.09, 72, 8, 2, 3]} />
          <meshStandardMaterial color="#9D7CFF" emissive="#9D7CFF" emissiveIntensity={0.8} roughness={0.08} metalness={0.9} />
        </mesh>
      </Float>

      {/* Orange torus knot — top left */}
      <Float speed={1.0} rotationIntensity={0.9} floatIntensity={0.5} position={[-4.1, 3.1, -4.0]}>
        <mesh>
          <torusKnotGeometry args={[0.27, 0.08, 56, 8, 3, 2]} />
          <meshStandardMaterial color="#FF7300" emissive="#FF7300" emissiveIntensity={0.8} roughness={0} metalness={0.95} />
        </mesh>
      </Float>

      {/* Large wireframe sphere — far background */}
      <Rotating position={[0, 0, -8]} speed={0.08} phase={0}>
        <mesh>
          <sphereGeometry args={[3.5, 16, 10]} />
          <meshStandardMaterial color="#9D7CFF" emissive="#9D7CFF" emissiveIntensity={0.15} wireframe transparent opacity={0.15} />
        </mesh>
      </Rotating>
    </group>
  );
}
