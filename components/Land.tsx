import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function Land() {
  const groundRef = useRef(null);
  const highlightMeshRef = useRef(null);

  // Optional: Rotate the ground slightly for testing (remove later if not needed)
//   useFrame((state, delta) => {
//     if (groundRef.current) {
//       groundRef.current.rotation.z += delta * 0.05;
//     }
//   });

  return (
    <>
      {/* Ground Plane */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} name="ground">
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color={0x4CAF50} side={THREE.DoubleSide} />
      </mesh>

      {/* Highlight Mesh */}
      <mesh ref={highlightMeshRef} position={[0.5, 0, 0.5]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          transparent
          opacity={0.5}
          color={0xffffff}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}