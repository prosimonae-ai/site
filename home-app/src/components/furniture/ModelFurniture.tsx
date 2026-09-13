import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { m } from '../../three/units'
import type { Furniture } from '../../types'

export const modelUrl = (file: string) => `${import.meta.env.BASE_URL}models/${file}`

/**
 * Modèle 3D (glTF) mis à l'échelle sur les dimensions déclarées du meuble et posé au sol.
 * L'échelle est non uniforme : la fidélité des cotes prime sur les proportions du modèle.
 */
export function ModelFurniture({ item }: { item: Furniture }) {
  const { scene } = useGLTF(modelUrl(item.model!))
  const object = useMemo(() => {
    const o = scene.clone(true)
    o.traverse(n => {
      const mesh = n as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true; mesh.receiveShadow = true
      if (item.matte) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mesh.material = mats.map(mm => { const c = (mm as THREE.MeshStandardMaterial).clone(); if ('metalness' in c) { c.metalness = 0.05; c.roughness = Math.max(0.8, c.roughness); c.envMapIntensity = 0.1 } return c }) as unknown as THREE.Material
        if (!Array.isArray(mesh.material) || mesh.material.length === 1) mesh.material = (mesh.material as unknown as THREE.Material[])[0]
      }
    })
    const box = new THREE.Box3().setFromObject(o)
    const size = new THREE.Vector3(); box.getSize(size)
    const center = new THREE.Vector3(); box.getCenter(center)
    const sx = m(item.width) / (size.x || 1), sy = m(item.height) / (size.y || 1), sz = m(item.depth) / (size.z || 1)
    const wrap = new THREE.Group()
    o.position.set(-center.x, -box.min.y, -center.z)
    wrap.add(o)
    wrap.scale.set(sx, sy, sz)
    return wrap
  }, [scene, item.width, item.height, item.depth, item.matte])
  return <primitive object={object} />
}
