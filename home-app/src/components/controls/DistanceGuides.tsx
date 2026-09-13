import { useMemo } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { useAppStore, useFurniture, useVisibleRooms } from '../../store/useAppStore'
import { roomShape } from '../../three/helpers/geometry'
import { m } from '../../three/units'
import type { Furniture, Point } from '../../types'

/** Boîte englobante au sol (cm) d'un meuble, rotation comprise */
function footprint(f: Furniture) {
  const r = THREE.MathUtils.degToRad(f.rotation), c = Math.abs(Math.cos(r)), s = Math.abs(Math.sin(r))
  const hw = (f.width * c + f.depth * s) / 2, hd = (f.width * s + f.depth * c) / 2
  return { minX: f.position.x - hw, maxX: f.position.x + hw, minZ: f.position.z - hd, maxZ: f.position.z + hd }
}

/** Intersection d'un rayon 2D (origine o, direction unitaire d) avec un segment [a,b] → distance ou null */
function raySegment(o: Point, d: Point, a: Point, b: Point): number | null {
  const ex = b.x - a.x, ez = b.z - a.z
  const den = d.x * ez - d.z * ex
  if (Math.abs(den) < 1e-9) return null
  const t = ((a.x - o.x) * ez - (a.z - o.z) * ex) / den
  const u = ((a.x - o.x) * d.z - (a.z - o.z) * d.x) / den
  return t > 0.5 && u >= 0 && u <= 1 ? t : null
}

interface Guide { from: Point; to: Point; dist: number; target: 'wall' | 'furniture' }

export function DistanceGuides() {
  const id = useAppStore(s => s.selectedFurnitureId)
  const dragging = useAppStore(s => s.isDragging)
  const mode = useAppStore(s => s.mode)
  const furniture = useFurniture()
  const rooms = useVisibleRooms()
  const item = furniture.find(f => f.id === id)

  const guides = useMemo<Guide[]>(() => {
    if (!item || mode === 'visit') return []
    const box = footprint(item)
    const cx = (box.minX + box.maxX) / 2, cz = (box.minZ + box.maxZ) / 2
    const edges = rooms.flatMap(r => { const p = roomShape(r); return p.map((a, i) => ({ a, b: p[(i + 1) % p.length] })) })
    const others = furniture.filter(f => f.id !== item.id).map(footprint)
    const dirs: { d: Point; from: Point }[] = [
      { d: { x: -1, z: 0 }, from: { x: box.minX, z: cz } }, { d: { x: 1, z: 0 }, from: { x: box.maxX, z: cz } },
      { d: { x: 0, z: -1 }, from: { x: cx, z: box.minZ } }, { d: { x: 0, z: 1 }, from: { x: cx, z: box.maxZ } },
    ]
    const out: Guide[] = []
    for (const { d, from } of dirs) {
      let best: number | null = null, target: Guide['target'] = 'wall'
      for (const e of edges) { const t = raySegment(from, d, e.a, e.b); if (t !== null && (best === null || t < best)) best = t }
      for (const o of others) {
        // face du meuble voisin traversée par le rayon
        const segs = [{ a: { x: o.minX, z: o.minZ }, b: { x: o.maxX, z: o.minZ } }, { a: { x: o.maxX, z: o.minZ }, b: { x: o.maxX, z: o.maxZ } }, { a: { x: o.maxX, z: o.maxZ }, b: { x: o.minX, z: o.maxZ } }, { a: { x: o.minX, z: o.maxZ }, b: { x: o.minX, z: o.minZ } }]
        for (const sg of segs) { const t = raySegment(from, d, sg.a, sg.b); if (t !== null && (best === null || t < best)) { best = t; target = 'furniture' } }
      }
      if (best !== null && best < 1500) out.push({ from, to: { x: from.x + d.x * best, z: from.z + d.z * best }, dist: Math.round(best), target })
    }
    return out
  }, [item, furniture, rooms, mode])

  if (!item || !guides.length) return null
  const y = m(item.position.y) + 0.02
  return (
    <group>
      {guides.map((g, i) => {
        const a = new THREE.Vector3(m(g.from.x), y, m(g.from.z)), b = new THREE.Vector3(m(g.to.x), y, m(g.to.z))
        const color = g.target === 'wall' ? '#2d5a3d' : '#b06a1c'
        const perp = new THREE.Vector3(-(b.z - a.z), 0, b.x - a.x).normalize().multiplyScalar(0.05)
        const tick = (p: THREE.Vector3) => new THREE.BufferGeometry().setFromPoints([p.clone().add(perp), p.clone().sub(perp)])
        return (
          <group key={i}>
            <primitive object={new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 }))} />
            <primitive object={new THREE.Line(tick(a), new THREE.LineBasicMaterial({ color }))} />
            <primitive object={new THREE.Line(tick(b), new THREE.LineBasicMaterial({ color }))} />
            <Html position={a.clone().lerp(b, 0.5)} center zIndexRange={[8, 0]} style={{ pointerEvents: 'none' }}>
              <div className={`rounded px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap ${dragging ? 'bg-ink text-white' : 'glass text-ink'}`} style={{ color: dragging ? undefined : color }}>
                {g.dist} cm{g.target === 'furniture' ? ' · meuble' : ''}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}
