// import React, { useRef } from "react";
// import { Box } from "@react-three/drei/native";
// import { useFrame } from "@react-three/fiber";

// export default function Farm({ lands }) {
//   const groupRef = useRef(null);
//   const gridSize = 5;
//   const cellSize = 1;
//   const gap = 0.09; //  control then gap b/w two land
//   const landSize = gridSize * (cellSize + gap);
//   useFrame(() => {
//     if (groupRef.current) {
//       // groupRef.current.rotation.z = -(Math.PI / 18);
//       groupRef.current.rotation.y = Math.PI / 20;
//     }
//   });

//   return (
//     <group ref={groupRef}>
//       {lands.map((land) =>
//         Array.from({ length: gridSize }).map((_, row) =>
//           Array.from({ length: gridSize }).map((_, col) => (
//             <Box
//               key={`${land.id}-${row}-${col}`}
//               // position={[
//               //   land.xOffset + row * (cellSize+gap),
//               //   0,
//               //   col * (cellSize+gap),
//               // ]}
//               // args={[1, 0.1, 1]}
//               position={[
//                 land.x * landSize + row * (cellSize + gap),
//                 0,
//                 land.z * landSize + col * (cellSize + gap),
//               ]}
//               args={[cellSize, 0.1, cellSize]}
//               onPointerDown={() => {
//                 console.log(
//                   `Land ${land.id} -> Pressed cell at X: ${row}, Z: ${col}`
//                 );
//               }}
//             >
//               <meshStandardMaterial attach="material" color="green" wireframe />
//             </Box>
//           ))
//         )
//       )}
//     </group>
//   );
// }

import React, { useRef, useEffect, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber/native";
import * as THREE from "three";
import { SharedValue } from "react-native-reanimated";
import { Box, useGLTF, Gltf } from "@react-three/drei/native";

type Land = {
  id: number;
  x: number;
  z: number;
};

const gridSize = 5;
const cellSize = 1;
const gap = 0.09;

const landSize = (gridSize * cellSize) + ((gridSize - 1) * gap);

const LAND_GLTF = require('../assets/land/raising_hands_land.glb');

type FarmProps = {
  lands: Land[];
  panX: SharedValue<number>;
  panZ: SharedValue<number>;
  scale: SharedValue<number>;
};

function FarmGrid({ lands, panX, panZ, scale }: FarmProps) {
  const groupRef = useRef<THREE.Group | null>(null);

  const { centerOffset } = useMemo(() => {
    if (lands.length === 0) {
      return { centerOffset: [0, 0] as [number, number] };
    }
    const xs = lands.map((l) => l.x);
    const zs = lands.map((l) => l.z);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);
    const offsetX = ((minX + maxX) / 2) * landSize;
    const offsetZ = ((minZ + maxZ) / 2) * landSize;
    return { centerOffset: [offsetX, offsetZ] as [number, number] };
  }, [lands]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.PI / 20;
      groupRef.current.position.x = panX.value;
      groupRef.current.position.z = panZ.value;
      const s = scale.value;
      groupRef.current.scale.set(s, s, s);
    }
  });
  // const { scene } = useGLTF(LAND_GLTF) as { scene: THREE.Group };

  return (
    <group ref={groupRef}>
      {/* Land models for each land piece */}
      {lands.map((land) => (
        <group 
          key={`land-${land.id}`}
          position={[
            land.x * landSize - centerOffset[0] - landSize / 2,
            0,
            land.z * landSize - centerOffset[1] - landSize / 2,
          ]}
        >
          {/* <Suspense fallback={
            <mesh>
              <boxGeometry args={[landSize, 0.1, landSize]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
          }>
            {scene ? (
              <primitive 
                object={scene.clone()} 
                scale={[landSize, 1, landSize]}
                position={[0, 0 ,0]}
              />
            ) : (
              <mesh>
                <boxGeometry args={[landSize, 0.1, landSize]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
            )}
          </Suspense> */}
          <Gltf src={LAND_GLTF} />
          
          {/* Grid cells for this land - positioned relative to land center */}
          {Array.from({ length: gridSize }).map((_, row) =>
            Array.from({ length: gridSize }).map((_, col) => {
              const startOffset = -((gridSize - 1) * (cellSize + gap)) / 2;
              const cellX = startOffset + row * (cellSize + gap);
              const cellZ = startOffset + col * (cellSize + gap);
              
              return (
                <Box
                  key={`${land.id}-${row}-${col}`}
                  position={[cellX, 0.06, cellZ]}
                  args={[cellSize, 0.02, cellSize]}
                  onPointerDown={() => {
                    console.log(
                      `Land ${land.id} -> Pressed cell at X: ${row}, Z: ${col}`
                    );
                  }}
                >
                  <meshStandardMaterial
                    attach="material"
                    color="white"
                    opacity={0}
                    transparent={true}
                  />
                </Box>
              );
            })
          )}
        </group>
      ))}
    </group>
  );
}

export default function Farm(props: FarmProps) {
  return <FarmGrid {...props} />;
}
