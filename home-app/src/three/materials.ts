import * as THREE from 'three'
import type { MaterialKey } from '../types'

interface Spec { color: string; roughness: number; metalness: number; transparent?: boolean; opacity?: number }

export const MATERIAL_SPECS: Record<MaterialKey, Spec> = {
  paint:       { color: '#f1efe9', roughness: 0.95, metalness: 0 },
  'paint-warm':{ color: '#ebe4d6', roughness: 0.95, metalness: 0 },
  parquet:     { color: '#c9a97c', roughness: 0.65, metalness: 0 },
  tiles:       { color: '#d9d6cf', roughness: 0.35, metalness: 0.05 },
  concrete:    { color: '#b9b6ae', roughness: 0.9,  metalness: 0 },
  wood:        { color: '#b08a5a', roughness: 0.6,  metalness: 0 },
  'wood-dark': { color: '#5a4030', roughness: 0.6,  metalness: 0 },
  metal:       { color: '#9ea3a8', roughness: 0.35, metalness: 0.8 },
  fabric:      { color: '#8f9aa6', roughness: 1,    metalness: 0 },
  glass:       { color: '#bcd7e6', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.35 },
  ceramic:     { color: '#f3f3f1', roughness: 0.2,  metalness: 0 },
  plant:       { color: '#5b8a5a', roughness: 0.9,  metalness: 0 },
}

const cache = new Map<string, THREE.MeshStandardMaterial>()

/** Matériau partagé (mis en cache) ; une couleur custom crée une variante. */
export function getMaterial(key: MaterialKey, color?: string): THREE.MeshStandardMaterial {
  const spec = MATERIAL_SPECS[key]
  const id = `${key}:${color ?? ''}`
  let mat = cache.get(id)
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({
      color: color ?? spec.color, roughness: spec.roughness, metalness: spec.metalness, side: THREE.DoubleSide,
      ...(spec.transparent ? { transparent: true, opacity: spec.opacity ?? 1 } : {}),
    })
    cache.set(id, mat)
  }
  return mat
}

export const SELECTION_COLOR = '#2d5a3d'
