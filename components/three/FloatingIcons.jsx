'use client';

import { useRef } from 'react';
import { Float, RoundedBox } from '@react-three/drei';

const ICONS = [
  { color: '#C13584', emissive: '#C13584', position: [-2.6,  1.5, -1.5], floatSpeed: 1.1, label: 'IG' },
  { color: '#1877F2', emissive: '#1877F2', position: [ 2.6,  1.4, -1.2], floatSpeed: 0.9, label: 'FB' },
  { color: '#69C9D0', emissive: '#010101', position: [-2.3, -1.6, -1.0], floatSpeed: 1.3, label: 'TT' },
  { color: '#FF0000', emissive: '#FF0000', position: [ 2.4, -1.5, -0.8], floatSpeed: 0.8, label: 'YT' },
  { color: '#aaaaaa', emissive: '#555555', position: [-3.1,  0.1, -2.0], floatSpeed: 1.0, label: 'X'  },
  { color: '#0A66C2', emissive: '#0A66C2', position: [ 3.1,  0.0, -2.0], floatSpeed: 1.2, label: 'IN' },
];

function Icon({ color, emissive, position, floatSpeed }) {
  return (
    <Float speed={floatSpeed} rotationIntensity={0.5} floatIntensity={0.7} position={position}>
      <RoundedBox args={[0.62, 0.62, 0.14]} radius={0.09} smoothness={4}>
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.9}
          roughness={0.15}
          metalness={0.7}
        />
      </RoundedBox>
    </Float>
  );
}

export default function FloatingIcons() {
  return (
    <group>
      {ICONS.map((icon) => (
        <Icon key={icon.label} {...icon} />
      ))}
    </group>
  );
}
