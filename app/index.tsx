// import React, { useRef, useEffect, useState } from "react";
// import { View } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Canvas, useThree } from "@react-three/fiber/native";
// import useControls from "r3f-native-orbitcontrols";
// import Farm from "./Farm";
// import LimitZoom from "./LimitZoom";
// import UnlockButton from "./UnlockButton";
// import { PerspectiveCamera, OrbitControls } from "@react-three/drei";

// export default function Home() {
//   const [OrbitControls, events] = useControls();
//   const controlsRef = useRef(null);
//   const [lands, setLands] = useState([{ id: 0, x: 0, z: 0 }]);
//   const directions = ["right", "front", "left", "back"];
//   const [directionIndex, setDirectionIndex] = useState(0);

//   const directionOffsets = {
//     right: { x: 1, z: 0 },
//     front: { x: 0, z: 1 },
//     left: { x: -1, z: 0 },
//     back: { x: 0, z: -1 },
//   };
//   const addNewLand = () => {
//     const lastLand = lands[lands.length - 1];
//     let newLand = null;
//     let tries = 0;

//     // Try all 4 directions until we find a free spot
//     while (tries < 4 && newLand === null) {
//       const direction = directions[directionIndex];
//       const offset = directionOffsets[direction];

//       const newX = lastLand.x + offset.x;
//       const newZ = lastLand.z + offset.z;

//       if (!doesLandExist(newX, newZ)) {
//         newLand = { x: newX, z: newZ };
//       } else {
//         // Try next direction
//         setDirectionIndex((prevIndex) => (prevIndex + 1) % directions.length);
//         tries++;
//       }
//     }

//     // Add land if found
//     if (newLand) {
//       setLands((prev) => [...prev, { ...newLand, id: prev.length }]);
//       setDirectionIndex((prevIndex) => (prevIndex + 1) % directions.length);
//     }

//     // const nextId = lands.length;
//     // setLands([...lands, { id: nextId, xOffset: nextId * 6 }]);
//   };

//   const doesLandExist = (x, z) => {
//     return lands.some((land) => land.x === x && land.z === z);
//   };

//   useEffect(() => {
//     const controls = controlsRef.current;
//     if (!controls) return;

//     const originalPan = controls.pan;
//     controls.pan = function (deltaX, deltaY) {
//       originalPan.call(this, deltaX, 0); // allow only horizontal dragging
//     };
//   }, []);

//   return (
//     <View style={{ flex: 1 }} {...events}>
//       {/* <Canvas camera={{ position: [10, 8, 8], fov: 50 }}> */}
//       <Canvas>
//         <PerspectiveCamera
//           makeDefault
//           position={[9.453, 5.00627, 5.78344]}
//           fov={37} // vertical FOV in degrees
//           up={[0, 1, 0]}
//           onUpdate={(self) => self.lookAt(-7.62396536, 5.520862, 5.56458702)}
//           near={0.1}
//           far={1000}
//         />
//         <ambientLight intensity={0.5} />
//         <pointLight position={[10, 10, 10]} intensity={1} />
//         <OrbitControls
//           enableRotate={false}
//           enableZoom={false}
//           enablePan={false}
//           enabled={false}
//         />
//         <LimitZoom />
//         <Farm lands={lands} />
//       </Canvas>

//       {/* External RN Button */}
//       <UnlockButton onPress={addNewLand} />
//     </View>
//   );
// }

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Suspense,
} from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Canvas,useFrame } from "@react-three/fiber/native";
import useControls from "r3f-native-orbitcontrols";
import Farm from "./Farm";
// import LimitZoom from "./LimitZoom";
import UnlockButton from "./UnlockButton";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { Gltf } from "@react-three/drei/native";
import * as THREE from "three";
// const LAND_GLTF = require("../assets/land/raising_hands_land.glb");
import FarmLand from "./FarmLand";
const { width } = Dimensions.get("window");
const PAN_SENSITIVITY = 0.02 * (width / 400);

type Land = {
  id: number;
  x: number;
  z: number;
};

const directions = [
  { name: "right", offset: { x: 1, z: 0 } },
  { name: "front", offset: { x: 0, z: 1 } },
  { name: "left", offset: { x: -1, z: 0 } },
  { name: "back", offset: { x: 0, z: -1 } },
];



export default function Home() {
  const [OrbitControlsNative, events] = useControls();
  const controlsRef = useRef<any>(null);
  const [lands, setLands] = useState<Land[]>([{ id: 0, x: 0, z: 0 }]);
  const [directionIndex, setDirectionIndex] = useState(0);

  // Shared values for pan, passed to Farm
  const panX = useSharedValue(0);
  const panZ = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetZ = useSharedValue(0);
  const scale = useSharedValue(1);
  const baseScale = useSharedValue(1);

  const doesLandExist = useCallback(
    (x: number, z: number) =>
      lands.some((land) => land.x === x && land.z === z),
    [lands]
  );

  const addNewLand = useCallback(() => {
    const lastLand = lands[lands.length - 1];
    // const lastLand = lands[0];
    let newLand: Land | null = null;
    let tries = 0;
    let localDirIndex = directionIndex;

    while (tries < directions.length && newLand === null) {
      const { offset } = directions[localDirIndex];
      const candidateX = lastLand.x + offset.x;
      const candidateZ = lastLand.z + offset.z;

      if (!doesLandExist(candidateX, candidateZ)) {
        newLand = {
          x: candidateX,
          z: candidateZ,
          id: lands.length,
        };
      } else {
        localDirIndex = (localDirIndex + 1) % directions.length;
        tries++;
      }
    }

    if (newLand) {
      setLands((prev) => [...prev, newLand]);
      setDirectionIndex((prev) => (prev + 1) % directions.length);
    }
  }, [lands, directionIndex, doesLandExist]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const originalPan = controls.pan;
    controls.pan = function (deltaX: number, deltaY: number) {
      originalPan.call(this, deltaX, 0);
    };
  }, []);

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onUpdate((e) => {
      panX.value = offsetX.value + e.translationX * PAN_SENSITIVITY;
      panZ.value = offsetZ.value + e.translationY * PAN_SENSITIVITY;
    })
    .onEnd(() => {
      offsetX.value = panX.value;
      offsetZ.value = panZ.value;
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      baseScale.value = scale.value;
    })
    .onUpdate((e) => {
      const newScale = baseScale.value * e.scale;
      scale.value = Math.max(0.5, Math.min(3, newScale));
    })
    .onEnd(() => {
      scale.value = withTiming(scale.value, { duration: 100 });
    });

  const combined = Gesture.Simultaneous(panGesture, pinchGesture);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={combined}>
        <View style={{ flex: 1 }} {...events}>
          <Canvas>
            <PerspectiveCamera
              makeDefault
              position={[9.453, 5.00627, 5.78344]}
              fov={37}
              up={[0, 1, 0]}
              onUpdate={(self) =>
                self.lookAt(-7.62396536, 5.520862, 5.56458702)
              }
              near={0.1}
              far={1000}
            />
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1} /> 
             <pointLight position={[-5, 5, -5]} intensity={0.3} />
             <OrbitControls
              ref={controlsRef}
              enableRotate={false}
              enableZoom={true}
              enablePan={false}
              enabled={true}
            />
          <FarmLand />
          </Canvas>
          <UnlockButton onPress={addNewLand} />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

// import React, { useRef } from "react";
// import { View } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { Canvas, useFrame } from "@react-three/fiber/native";
// import { Gltf, OrbitControls } from "@react-three/drei/native";
// import {
//   Gesture,
//   GestureDetector,
//   GestureHandlerRootView,
// } from "react-native-gesture-handler";
// import { useSharedValue } from "react-native-reanimated";
// import { SafeAreaView } from "react-native";
// import * as THREE from "three";

// // const Land = require('../Farm_House/assets/land/Banana.glb');

// function LandModel({ x, y }: { x: { value: number }; y: { value: number } }) {
//   const groupRef = useRef<THREE.Group>(null);
//   const basePos: [number, number, number] = [2, -1.2, 2];
//   const sensitivity = 0.01;

//   useFrame(() => {
//     if (groupRef.current) {
//       const newX = basePos[0] + x.value * sensitivity;
//       const newZ = basePos[2] - y.value * sensitivity;
//       groupRef.current.position.set(newX, basePos[1], newZ);
//     }
//   });

//   return (
//     <>
//       <ambientLight intensity={0.2} />
//       <OrbitControls
//         autoRotate={true}
//         autoRotateSpeed={3}
//         enablePan={false}
//         enabled={false}
//       />
//       <directionalLight />
//       <group ref={groupRef} rotation={[0.1, 0, 0]} scale={1.2}>
//         <Gltf src="https://res.cloudinary.com/do9zifunn/image/upload/v1754330646/embedded_land_vaoe4y.glb" />
//       </group>
//     </>
//   );
// }

// export default function Home() {
//   const x = useSharedValue(0);
//   const y = useSharedValue(0);
//   const offsetX = useSharedValue(0);
//   const offsetY = useSharedValue(0);

//   const panGesture = Gesture.Pan()
//     .minDistance(0)
//     .onStart(() => {
//       console.log("Pan gesture started");
//     })
//     .onUpdate((e) => {
//       x.value = offsetX.value + e.translationX;
//       y.value = offsetY.value + e.translationY;
//       console.log("Pan gesture updated", { x: x.value, y: y.value });
//     })
//     .onEnd((e) => {
//       offsetX.value = x.value;
//       offsetY.value = y.value;
//       console.log("Pan gesture ended", { x: x.value, y: y.value });
//     });

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaView className="flex-1">
//         <StatusBar style="dark" />
//         <GestureDetector gesture={panGesture}>
//           <View className="flex-1">
//             <Canvas camera={{ position: [2, 3, 10], fov: 50 }}>
//               <LandModel x={x} y={y} />
//             </Canvas>
//           </View>
//         </GestureDetector>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// }
