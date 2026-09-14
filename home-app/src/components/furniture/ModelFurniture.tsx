import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { getMaterial } from '../../three/materials'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { m } from '../../three/units'
import type { Furniture } from '../../types'

export const modelUrl = (file: string) => `${import.meta.env.BASE_URL}models/${file}`
/** décodeur Draco servi localement (certains modèles IKEA sont compressés Draco) */
const DRACO_PATH = `${import.meta.env.BASE_URL}draco/`

/**
 * Modèle 3D (glTF) mis à l'échelle sur les dimensions déclarées du meuble et posé au sol.
 * L'échelle est non uniforme : la fidélité des cotes prime sur les proportions du modèle.
 */
export function ModelFurniture({ item }: { item: Furniture }) {
  if (item.variant === 'dropleaf-open') return <DropLeafOpen item={item} />
  return <PlainModel item={item} />
}

function PlainModel({ item }: { item: Furniture }) {
  const { scene } = useGLTF(modelUrl(item.model!), DRACO_PATH)
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
    let box = new THREE.Box3().setFromObject(o)
    let size = new THREE.Vector3(); box.getSize(size)
    // Si le modèle est orienté dans l'autre sens (long côté sur Z alors que la largeur déclarée est sur X), on le tourne de 90°
    // plutôt que de l'étirer.
    const inner = new THREE.Group(); inner.add(o)
    if ((size.x > size.z) !== (item.width > item.depth) && Math.abs(size.x - size.z) > 0.05) {
      inner.rotation.y = Math.PI / 2
      inner.updateMatrixWorld(true)
      box = new THREE.Box3().setFromObject(inner); size = new THREE.Vector3(); box.getSize(size)
    }
    const center = new THREE.Vector3(); box.getCenter(center)
    const sx = m(item.width) / (size.x || 1), sy = m(item.height) / (size.y || 1), sz = m(item.depth) / (size.z || 1)
    const wrap = new THREE.Group()
    inner.position.set(-center.x, -box.min.y, -center.z)
    wrap.add(inner)
    wrap.scale.set(sx, sy, sz)
    return wrap
  }, [scene, item.width, item.height, item.depth, item.matte])
  // Option « couvercle bois » : planche posée sur le dessus du meuble (ex. RÅSKOG)
  const lid = item.variant === 'lid'
  return (
    <group>
      <primitive object={object} />
      {lid && <mesh position={[0, m(item.height) + 0.01, 0]} material={getMaterial('wood', item.color ?? '#c9a87c')} castShadow receiveShadow><boxGeometry args={[m(item.width) + 0.01, 0.02, m(item.depth) + 0.01]} /></mesh>}
    </group>
  )
}

/**
 * Table à rabat DÉPLIÉE à partir du modèle IKEA replié : le modèle garde son échelle réelle (largeur native),
 * ses abattants pendants sont découpés par deux plans de coupe, et deux abattants relevés + pieds-portillons
 * sont ajoutés pour atteindre la largeur déclarée.
 */
function DropLeafOpen({ item }: { item: Furniture }) {
  const { scene } = useGLTF(modelUrl(item.model!), DRACO_PATH)
  const groupRef = useRef<THREE.Group>(null)
  const CORE = 0.66 // largeur conservée du modèle (plateau fixe), abattants pendants au-delà
  const planes = useMemo(() => [new THREE.Plane(new THREE.Vector3(-1, 0, 0), CORE / 2), new THREE.Plane(new THREE.Vector3(1, 0, 0), CORE / 2)], [])
  const local = useMemo(() => planes.map(p => p.clone()), [planes])
  const { object, nativeW } = useMemo(() => {
    const o = scene.clone(true)
    const box = new THREE.Box3().setFromObject(o)
    const size = new THREE.Vector3(); box.getSize(size)
    const center = new THREE.Vector3(); box.getCenter(center)
    const s = m(item.height) / (size.y || 1)
    o.traverse(n => {
      const mesh = n as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true; mesh.receiveShadow = true
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      const cloned = mats.map(mm => { const c = (mm as THREE.MeshStandardMaterial).clone(); c.clippingPlanes = planes; c.clipShadows = true; return c })
      mesh.material = cloned.length === 1 ? cloned[0] : cloned
    })
    const wrap = new THREE.Group()
    o.position.set(-center.x, -box.min.y, -center.z)
    wrap.add(o)
    wrap.scale.set(s, s, s)
    return { object: wrap, nativeW: size.x * s }
  }, [scene, item.height, planes])
  useFrame(() => { const g = groupRef.current; if (!g) return; g.updateMatrixWorld(); planes.forEach((p, i) => p.copy(local[i]).applyMatrix4(g.matrixWorld)) })
  const w = m(item.width), h = m(item.height), d = m(item.depth)
  // Un seul abattant (57 cm sur le vrai meuble), côté +X, décalé pour que le cœur reste centré sur la position de l'objet
  const leaf = Math.max(0, w - CORE)
  const top = getMaterial('wood', '#c99d63'), white = getMaterial('paint', '#f3f1ec')
  const shift = -leaf / 2 // le meuble complet (cœur + abattant) reste centré
  const legX = CORE / 2 + leaf * 0.72
  const bar = 0.035
  void nativeW
  return (
    <group ref={groupRef} position={[shift, 0, 0]}>
      <primitive object={object} />
      {leaf > 0.01 && (
        <group>
          {/* abattant relevé */}
          <mesh position={[CORE / 2 + leaf / 2, h - 0.0125, 0]} material={top} castShadow receiveShadow><boxGeometry args={[leaf - 0.003, 0.025, d]} /></mesh>
          {/* portillon : un pied vertical, une traverse haute de 10 cm sous l'abattant, une traverse basse à 14 cm du sol */}
          <mesh position={[legX, (h - 0.03) / 2, d / 2 - 0.09]} material={white} castShadow><boxGeometry args={[bar, h - 0.03, bar]} /></mesh>
          <mesh position={[(CORE / 2 + legX) / 2, h - 0.03 - 0.05, d / 2 - 0.09]} material={white} castShadow><boxGeometry args={[legX - CORE / 2, 0.1, bar * 0.6]} /></mesh>
          <mesh position={[(CORE / 2 + legX) / 2, 0.14, d / 2 - 0.09]} material={white} castShadow><boxGeometry args={[legX - CORE / 2, bar * 0.8, bar * 0.6]} /></mesh>
        </group>
      )}
    </group>
  )
}
