import React ,{useEffect,useRef}from "react";
import land from '../assets/land/land.jpg'
import soil from '../assets/land/soil.jpg'
import {useTexture} from '@react-three/drei'
import {Asset} from 'expo-asset'
export default function FarmLand(){
    const meshRef = useRef();
   const [grassTexture, soilTexture] = useTexture([
  Asset.fromModule(require('../assets/land/land.jpg')).uri,
  Asset.fromModule(require('../assets/land/soil.jpg')).uri
]);
     useEffect(() => {
    const geometry = meshRef.current.geometry;
    const position = geometry.attributes.position;

    const width = 20;
    const height = 2;
    const depth = 20;
    const widthSegments = 20;
    const depthSegments = 20;

    // Only modify the top face vertices
    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);
      // only modify top surface
      if (y >= height / 2) {
        const z = Math.sin(i * 0.2) * 0.2 + Math.random() * 0.2;
        position.setY(i, y + z);
      }
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();
  }, []);

   return (
    <mesh ref={meshRef} position={[0, -1, 0]}>
      <boxGeometry args={[20, 2, 20, 30, 5, 30]} />
      {[
        <meshStandardMaterial  key="right" attach="material-0" color="#8B4513" />, // right
        <meshStandardMaterial  key="left" attach="material-1" color="#8B4513" />, // left
        <meshStandardMaterial key="top" attach="material-2"color="#7BB369"/>, // top (this is the one with grass)
        <meshStandardMaterial key="bottom" attach="material-3" color="#8B4513" />, // bottom
        <meshStandardMaterial key="front" attach="material-4" color="#8B4513" />, // front
        <meshStandardMaterial key="back" attach="material-5" color="#8B4513" />  // back
        // <meshStandardMaterial key="right" attach="material-0"  map={soilTexture} />, // right
        // <meshStandardMaterial key="left" attach="material-1" map={soilTexture} />, // left
        // <meshStandardMaterial key="top" attach="material-2" map={grassTexture} />, // top (this is the one with grass)
        // <meshStandardMaterial key="bottom" attach="material-3" color="#8B4513" />, // bottom
        // <meshStandardMaterial key="front" attach="material-4" map={soilTexture} />, // front
        // <meshStandardMaterial key="back" attach="material-5" map={soilTexture} />  // back
      ]}
    </mesh>
  );
}
