import type { Furniture, FurnitureKind, MaterialKey } from '../types'

/** Catalogue de volumes standards (cm) pour tester rapidement ce qui rentre. */
export interface FurniturePreset { name: string; width: number; depth: number; height: number; material: MaterialKey; color?: string; brand?: string; decoration?: boolean; kind?: FurnitureKind; model?: string; seatHeight?: number; variant?: string; matte?: boolean }

export const FURNITURE_PRESETS: FurniturePreset[] = [
  { name: 'Lit 140', width: 140, depth: 200, height: 50, material: 'wood', color: '#d9d2c5', kind: 'bed' },
  { name: 'Lit 160', width: 160, depth: 200, height: 50, material: 'wood', color: '#d9d2c5', kind: 'bed' },
  // Maisons du Monde PLAY, tissu mailles 3D bleu Majorelle — cotes officielles, assise 43 cm
  { name: 'PLAY 2 places (bleu)', brand: 'Maisons du Monde', width: 193, depth: 94, height: 74, seatHeight: 42, material: 'fabric', color: '#1e3c8f', kind: 'sofa', variant: 'play' },
  { name: 'PLAY 3 places (bleu)', brand: 'Maisons du Monde', width: 231, depth: 94, height: 74, seatHeight: 42, material: 'fabric', color: '#1e3c8f', kind: 'sofa', variant: 'play' },
  { name: 'Canapé 2 places', width: 180, depth: 90, height: 82, material: 'fabric', kind: 'sofa', model: 'sofa_03/sofa_03_1k.gltf' },
  { name: 'Canapé 3 places', width: 220, depth: 95, height: 82, material: 'fabric', kind: 'sofa', model: 'sofa_02/sofa_02_1k.gltf' },
  { name: 'Fauteuil', width: 85, depth: 85, height: 80, material: 'fabric', kind: 'sofa', model: 'modern_arm_chair_01/modern_arm_chair_01_1k.gltf' },
  // IKEA — vrais modèles 3D (API IKEA), cotes du modèle
  { name: 'HOLMERUD table d\'appoint', brand: 'IKEA', width: 81, depth: 31, height: 52, material: 'wood', kind: 'table', model: 'ikea/holmerud_appoint.glb' },
  { name: 'HOLMERUD table basse', brand: 'IKEA', width: 90, depth: 55, height: 40, material: 'wood', kind: 'table', model: 'ikea/holmerud_basse.glb' },
  { name: 'PINNTORP table à rabat (dépliée)', brand: 'IKEA', width: 124, depth: 75, height: 75, material: 'wood', color: '#c99d63', kind: 'table', variant: 'dropleaf' },
  { name: 'PINNTORP table à rabat (repliée)', brand: 'IKEA', width: 67, depth: 75, height: 75, material: 'wood', color: '#c99d63', kind: 'table', variant: 'dropleaf' },
  { name: 'PINNTORP chaise', brand: 'IKEA', width: 42, depth: 50, height: 90, material: 'wood', kind: 'chair', model: 'ikea/pinntorp_chaise.glb' },
  { name: 'BISSA armoire à chaussures', brand: 'IKEA', width: 49, depth: 28, height: 93, material: 'wood', kind: 'cabinet', model: 'ikea/bissa.glb' },
  { name: 'HYLLIS étagère', brand: 'IKEA', width: 61, depth: 28, height: 74, material: 'metal', kind: 'shelf', model: 'ikea/hyllis.glb', matte: true },
  { name: 'Table basse', width: 100, depth: 60, height: 40, material: 'wood', kind: 'table', model: 'modern_coffee_table_01/modern_coffee_table_01_1k.gltf' },
  { name: 'Table basse ronde', width: 80, depth: 80, height: 42, material: 'wood', kind: 'table', model: 'coffee_table_round_01/coffee_table_round_01_1k.gltf' },
  { name: 'Table d\'appoint', width: 45, depth: 45, height: 55, material: 'wood', kind: 'table', model: 'side_table_01/side_table_01_1k.gltf' },
  { name: 'Table 4 pers.', width: 140, depth: 80, height: 75, material: 'wood', kind: 'table', model: 'wooden_table_02/wooden_table_02_1k.gltf' },
  { name: 'Table 6 pers.', width: 180, depth: 90, height: 75, material: 'wood', kind: 'table', model: 'dining_table/dining_table_1k.gltf' },
  { name: 'Chaise', width: 45, depth: 50, height: 90, material: 'wood-dark', kind: 'chair', model: 'dining_chair_02/dining_chair_02_1k.gltf' },
  { name: 'Bureau', width: 120, depth: 70, height: 75, material: 'wood', color: '#e8e2d6', kind: 'desk' },
  { name: 'Armoire', width: 100, depth: 60, height: 200, material: 'paint', kind: 'cabinet' },
  { name: 'Commode', width: 100, depth: 45, height: 85, material: 'wood', kind: 'cabinet', model: 'modern_wooden_cabinet/modern_wooden_cabinet_1k.gltf' },
  { name: 'Étagère', width: 80, depth: 30, height: 180, material: 'wood', kind: 'shelf' },
  { name: 'Meuble TV', width: 160, depth: 40, height: 50, material: 'wood-dark', kind: 'cabinet' },
  { name: 'TV 55"', width: 123, depth: 25, height: 75, material: 'metal', kind: 'tv' },
  { name: 'Frigo', width: 60, depth: 65, height: 180, material: 'metal', kind: 'fridge' },
  { name: 'Lave-linge', width: 60, depth: 60, height: 85, material: 'ceramic', kind: 'washer' },
  { name: 'Radiateur', width: 60, depth: 10, height: 60, material: 'metal', color: '#f1f1ef', kind: 'radiator' },
  { name: 'Plante', width: 40, depth: 40, height: 120, material: 'plant', decoration: true, kind: 'plant', model: 'potted_plant_01/potted_plant_01_1k.gltf' },
  { name: 'Plante (petite)', width: 30, depth: 30, height: 60, material: 'plant', decoration: true, kind: 'plant', model: 'potted_plant_02/potted_plant_02_1k.gltf' },
]

let seq = 1
export function fromPreset(p: FurniturePreset, x: number, z: number, roomId?: string): Furniture {
  return { id: `f-${Date.now().toString(36)}-${seq++}`, name: p.name, brand: p.brand, width: p.width, depth: p.depth, height: p.height,
    position: { x, y: 0, z }, rotation: 0, material: p.material, color: p.color, roomId, decoration: p.decoration, kind: p.kind, model: p.model, seatHeight: p.seatHeight, variant: p.variant, matte: p.matte }
}
