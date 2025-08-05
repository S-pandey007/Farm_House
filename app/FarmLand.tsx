
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei/native'

export default function Model() {
  const { nodes, materials } = useGLTF('https://res.cloudinary.com/do9zifunn/image/upload/v1754330646/embedded_land_vaoe4y.glb')
//   const { nodes, materials } = useGLTF(require('../assets/land/land3d.glb'))
  return (
    <group  dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0.geometry}
        material={nodes.mesh_0.material}
      />
    </group>
  )
}


// export default function Model() {
//   const gltf =  useGLTF('https://res.cloudinary.com/do9zifunn/image/upload/v1754330646/embedded_land_vaoe4y.glb')
//   return <primitive object={gltf.scene} />
// }
