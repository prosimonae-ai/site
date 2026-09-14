import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Edges, Html } from '@react-three/drei'
import { useThree, type ThreeEvent } from '@react-three/fiber'
import { useAppStore, useRooms } from '../../store/useAppStore'
import { SELECTION_COLOR } from '../../three/materials'
import { ProceduralFurniture } from './ProceduralFurniture'
import { ModelFurniture } from './ModelFurniture'
import { m, cm } from '../../three/units'
import { pointInRoom, rectInsideRoom } from '../../three/helpers/geometry'
import type { Furniture } from '../../types'

const FLOOR = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

export function FurnitureMesh({ item }: { item: Furniture }) {
  const selected = useAppStore(s => s.selectedFurnitureIds.includes(item.id))
  const tool = useAppStore(s => s.tool)
  const gridStep = useAppStore(s => s.gridStep)
  const selectFurniture = useAppStore(s => s.selectFurniture)
  const updateFurniture = useAppStore(s => s.updateFurniture)
  const setDragging = useAppStore(s => s.setDragging)
  const beginChange = useAppStore(s => s.beginChange)
  const rooms = useRooms()
  const { raycaster } = useThree()
  const drag = useRef<{ dx: number; dz: number; group: { id: string; x: number; z: number }[] } | null>(null)
  const rot = useRef<{ start: number; startRot: number } | null>(null)
  const [rotating, setRotating] = useState(false)
  const soloSelected = useAppStore(s => s.selectedFurnitureIds.length === 1 && s.selectedFurnitureIds[0] === item.id)
  const someoneDragging = useAppStore(s => s.isDragging)
  const hitRef = useRef<THREE.Mesh>(null)
  // Pendant un glisser, seul le meuble tenu (ou tourné) reçoit le pointeur : les autres sont transparents aux événements
  const passive = someoneDragging && !drag.current && !rot.current
  const noRaycast = useMemo(() => () => null, [])
  useEffect(() => { const mesh = hitRef.current; if (!mesh) return; mesh.raycast = passive ? (noRaycast as unknown as THREE.Mesh['raycast']) : THREE.Mesh.prototype.raycast }, [passive, noRaycast])

  const canDrag = tool === 'select' || tool === 'move'

  const floorPoint = () => { const p = new THREE.Vector3(); raycaster.ray.intersectPlane(FLOOR, p); return p }
  const snap = (v: number) => (gridStep ? Math.round(v / gridStep) * gridStep : Math.round(v))

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    if (tool === 'measure') return
    e.stopPropagation()
    const shift = e.nativeEvent.shiftKey
    const already = useAppStore.getState().selectedFurnitureIds.includes(item.id)
    if (shift) { selectFurniture(item.id, true); return }
    if (!already) selectFurniture(item.id)
    if (!canDrag || item.locked) return
    const p = floorPoint()
    beginChange()
    const ids = useAppStore.getState().selectedFurnitureIds
    const group = useAppStore.getState().furniture().filter(f => ids.includes(f.id) && f.id !== item.id && !f.locked && !(f.parentId && (ids.includes(f.parentId) || f.parentId === item.id))).map(f => ({ id: f.id, x: f.position.x, z: f.position.z }))
    drag.current = { dx: item.position.x - cm(p.x), dz: item.position.z - cm(p.z), group }
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    setDragging(true)
  }
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (!drag.current) return
    e.stopPropagation()
    const p = floorPoint()
    let x = snap(cm(p.x) + drag.current.dx), z = snap(cm(p.z) + drag.current.dz)
    // La pièce de référence : celle qui contient le meuble (sinon celle où il est déclaré)
    const room = rooms.find(r => pointInRoom(r, item.position.x, item.position.z)) ?? rooms.find(r => r.id === item.roomId)
    if (room) {
      // Murs solides : le meuble ne peut pas sortir de la pièce. S'il bute, il vient au CONTACT exact du mur
      // (indépendamment du pas de grille) et glisse le long de l'autre axe.
      const ok = (px: number, pz: number) => rectInsideRoom(room, px, pz, item.width, item.depth, item.rotation)
      const contact = (from: number, to: number, test: (v: number) => boolean) => { // plus grande valeur valide entre from (valide) et to (invalide), au dixième de cm
        let lo = from, hi = to
        for (let i = 0; i < 12; i++) { const mid = (lo + hi) / 2; if (test(mid)) lo = mid; else hi = mid }
        return Math.round(lo * 10) / 10
      }
      if (!ok(x, z)) {
        const cx = item.position.x, cz = item.position.z
        const zOk = ok(cx, z), xOk = ok(x, cz)
        if (zOk) x = ok(cx, z) ? contact(cx, x, v => ok(v, z)) : cx
        else if (xOk) z = contact(cz, z, v => ok(x, v))
        else { x = ok(cx, cz) ? contact(cx, x, v => ok(v, cz)) : cx; z = contact(cz, z, v => ok(x, v)) }
      }
      // Aimantation « contact » : à moins de 4 cm d'un mur sur un axe, on colle au mur (uniquement si on s'en approche)
      const SNAP = 4
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        const tx = x + dx * SNAP, tz = z + dz * SNAP
        if (!ok(tx, tz)) { // un mur est proche dans cette direction
          if (dx) { const c = contact(x, tx, v => ok(v, z)); if (Math.abs(c - x) < SNAP && Math.abs(c - x) <= Math.abs(c - item.position.x) + 0.01) x = c }
          else { const c = contact(z, tz, v => ok(x, v)); if (Math.abs(c - z) < SNAP && Math.abs(c - z) <= Math.abs(c - item.position.z) + 0.01) z = c }
        }
      }
    }
    if (x !== item.position.x || z !== item.position.z) {
      const dx = x - item.position.x, dz = z - item.position.z
      updateFurniture(item.id, { position: { ...item.position, x, z }, roomId: room?.id ?? item.roomId })
      // Les autres meubles sélectionnés suivent du même déplacement
      const others = useAppStore.getState().furniture()
      drag.current.group.forEach(g => { const o = others.find(f => f.id === g.id); if (o) updateFurniture(g.id, { position: { ...o.position, x: o.position.x + dx, z: o.position.z + dz } }) })
    }
  }
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    if (!drag.current) return
    e.stopPropagation(); drag.current = null; setDragging(false)
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
  }

  // ── Poignée de rotation ──
  const angleTo = () => { const p = floorPoint(); return THREE.MathUtils.radToDeg(Math.atan2(p.x - m(item.position.x), p.z - m(item.position.z))) }
  const onRotDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    beginChange()
    rot.current = { start: angleTo(), startRot: item.rotation }
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    setDragging(true); setRotating(true)
  }
  const onRotMove = (e: ThreeEvent<PointerEvent>) => {
    if (!rot.current) return
    e.stopPropagation()
    let deg = rot.current.startRot + (angleTo() - rot.current.start)
    if (!e.nativeEvent.shiftKey) deg = Math.round(deg / 15) * 15
    deg = ((Math.round(deg) % 360) + 360) % 360
    if (deg !== item.rotation) updateFurniture(item.id, { rotation: deg })
  }
  const onRotUp = (e: ThreeEvent<PointerEvent>) => {
    if (!rot.current) return
    e.stopPropagation(); rot.current = null; setDragging(false); setRotating(false)
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
  }
  const ringR = Math.max(m(item.width), m(item.depth)) / 2 + 0.28
  const showHandle = soloSelected && !item.locked && canDrag

  return (
    <group position={[m(item.position.x), m(item.position.y), m(item.position.z)]} rotation={[0, THREE.MathUtils.degToRad(item.rotation), 0]}>
      {showHandle && (
        <group>
          {/* anneau au sol (non interactif) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} raycast={() => null}>
            <ringGeometry args={[ringR - 0.008, ringR + 0.008, 96]} />
            <meshBasicMaterial color={SELECTION_COLOR} transparent opacity={rotating ? 0.9 : 0.45} depthWrite={false} />
          </mesh>
          {/* bouton de rotation à l'avant du meuble */}
          <group position={[0, 0.02, ringR]}>
            <mesh onPointerDown={onRotDown} onPointerMove={onRotMove} onPointerUp={onRotUp} onPointerCancel={onRotUp} onClick={e => e.stopPropagation()}>
              <sphereGeometry args={[0.09, 20, 16]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            <mesh raycast={() => null}>
              <sphereGeometry args={[0.055, 20, 16]} />
              <meshStandardMaterial color={rotating ? '#1f4a30' : SELECTION_COLOR} roughness={0.5} />
            </mesh>
            <mesh raycast={() => null} position={[0, 0, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.03, 0.1]} />
              <meshBasicMaterial color={SELECTION_COLOR} transparent opacity={0.6} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
            {rotating && (
              <Html position={[0, 0.25, 0]} center zIndexRange={[9, 0]} style={{ pointerEvents: 'none' }}>
                <div className="rounded px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap bg-ink text-white">{item.rotation}°</div>
              </Html>
            )}
          </group>
        </group>
      )}
      {/* Volume de sélection / interaction (invisible) */}
      <mesh ref={hitRef} position={[0, m(item.height / 2), 0]} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onClick={e => { if (tool !== 'measure') e.stopPropagation() }}>
        <boxGeometry args={[m(item.width), m(item.height), m(item.depth)]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        {selected && <Edges color={SELECTION_COLOR} lineWidth={1.5} />}
      </mesh>
      <group raycast={() => null}>
        {item.model ? (
          <Suspense fallback={<ProceduralFurniture item={item} />}><ModelFurniture item={item} /></Suspense>
        ) : <ProceduralFurniture item={item} />}
      </group>
      {selected && (
        <Html position={[0, m(item.height) + 0.18, 0]} center zIndexRange={[6, 0]} style={{ pointerEvents: 'none' }}>
          <div className="glass rounded-md px-2 py-1 text-[10px] whitespace-nowrap text-ink">
            {item.locked && <span className="mr-1">🔒</span>}<span className="font-semibold">{item.name}</span> <span className="text-ink-3">{item.width}×{item.depth}×{item.height}</span>
          </div>
        </Html>
      )}
    </group>
  )
}
