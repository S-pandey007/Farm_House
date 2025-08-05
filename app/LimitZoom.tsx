import { useThree, useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';

export default function LimitZoom() {
  const { camera, controls } = useThree();

  useFrame(() => {
    const target = new THREE.Vector3(2.5, 0, 2.5); // Center of 5x5 grid
    const distance = camera.position.distanceTo(target);

    const minDistance = 10;
    const maxDistance = 30;

    if (distance < minDistance) {
      const dir = camera.position.clone().sub(target).normalize();
      camera.position.copy(dir.multiplyScalar(minDistance).add(target));
    } else if (distance > maxDistance) {
      const dir = camera.position.clone().sub(target).normalize();
      camera.position.copy(dir.multiplyScalar(maxDistance).add(target));
    }
  });

  return null;
}
// import { useThree, useFrame } from '@react-three/fiber/native';
// import * as THREE from 'three';

// // Shared target for camera and zoom/pan
// const TARGET = new THREE.Vector3(0, 0, 0); // center of farm (adjust if farm center shifts)
// const DIR = new THREE.Vector3();
// const CLAMPED_POS = new THREE.Vector3();

// const MIN_DISTANCE = 5; // tighten for better visibility
// const MAX_DISTANCE = 50;

// export default function LimitZoom() {
//   const { camera } = useThree();

//   useFrame(() => {
//     // distance from target
//     const currentDist = camera.position.distanceTo(TARGET);
//     if (currentDist < MIN_DISTANCE || currentDist > MAX_DISTANCE) {
//       DIR.copy(camera.position).sub(TARGET).normalize();
//       const desired = Math.min(Math.max(currentDist, MIN_DISTANCE), MAX_DISTANCE);
//       CLAMPED_POS.copy(DIR).multiplyScalar(desired).add(TARGET);
//       camera.position.copy(CLAMPED_POS);
//     }
//   });

//   return null;
// }

