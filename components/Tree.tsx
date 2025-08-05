import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function Tree() {
  const groupRef = useRef(null);

  // Optional: Add a simple rotation for testing
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Trunk */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 10]} />
        <meshStandardMaterial color={0x8B4513} flatShading />
      </mesh>

      {/* Leaf Layers */}
      {Array.from({ length: 6 }, (_, i) => {
        const radius = 0.6 - i * 0.08;
        const height = 0.4 - i * 0.02;
        const yPosition = 0.6 + i * 0.3;
        return (
          <mesh key={i} position={[0, yPosition, 0]}>
            <coneGeometry args={[radius, height, 6]} />
            <meshStandardMaterial color={0x4CAF50} flatShading />
          </mesh>
        );
      })}
    </group>
  );
}