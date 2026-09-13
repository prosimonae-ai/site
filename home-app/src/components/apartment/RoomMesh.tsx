import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Edges, Html } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useAppStore } from '../../store/useAppStore'
import { getMaterial, SELECTION_COLOR } from '../../three/materials'
import { m } from '../../three/units'
import { prismPoints, roomBox, roomEdges, roomShape, splitWall, type RoomEdge } from '../../three/helpers/geometry'
import type { Room } from '../../types'

interface Props { room: Room; wallOpacity: number }

export function RoomMesh({ room, wallOpacity }: Props) {
  const selected = useAppStore(s => s.selectedRoomId === room.id)
  const selectRoom = useAppStore(s => s.selectRoom)
  const tool = useAppStore(s => s.tool)
  const showDims = useAppStore(s => s.showDimensions)
  const mode = useAppStore(s => s.mode)

  const floorMat = useMemo(() => getMaterial(room.floor, room.color), [room.floor, room.color])

  // Sol : forme libre (Shape 2D : x → X, y → -Z après rotation -90° autour de X)
  const floorGeo = useMemo(() => {
    const pts = roomShape(room)
    const shape = new THREE.Shape(pts.map(p => new THREE.Vector2(m(p.x), -m(p.z))))
    return new THREE.ShapeGeometry(shape)
  }, [room])
  const edges = useMemo(() => roomEdges(room), [room])
  const box = roomBox(room)
  const cx = m((box.minX + box.maxX) / 2), cz = m((box.minZ + box.maxZ) / 2)

  const onFloorClick = (e: ThreeEvent<MouseEvent>) => {
    if (tool === 'measure') return
    e.stopPropagation()
    selectRoom(selected ? null : room.id)
  }

  return (
    <group>
      <mesh geometry={floorGeo} position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={onFloorClick} material={floorMat}>
        {selected && <Edges color={SELECTION_COLOR} lineWidth={1.5} />}
      </mesh>
      {selected && (
        <mesh geometry={floorGeo} position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={SELECTION_COLOR} transparent opacity={0.08} depthWrite={false} />
        </mesh>
      )}
      {wallOpacity > 0.02 && edges.map((e, i) => <WallMesh key={i} room={room} edge={e} baseOpacity={wallOpacity} selected={selected} />)}
      {(mode === 'plan' || showDims) && (
        <Html position={[cx, 0.02, cz]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <div className="text-center whitespace-nowrap select-none">
            <div className="text-[11px] font-semibold tracking-wide text-ink">{room.name}</div>
            <div className="text-[10px] text-ink-3">{((box.maxX - box.minX) / 100).toFixed(2)} × {((box.maxZ - box.minZ) / 100).toFixed(2)} m</div>
          </div>
        </Html>
      )}
      {showDims && <Dimensions room={room} />}
    </group>
  )
}

function WallMesh({ room, edge, baseOpacity, selected }: { room: Room; edge: RoomEdge; baseOpacity: number; selected: boolean }) {
  const { wall, length } = edge
  const selectRoom = useAppStore(s => s.selectRoom)
  const tool = useAppStore(s => s.tool)
  const mode = useAppStore(s => s.mode)
  const wallsDisplay = useAppStore(s => s.wallsDisplay)
  const anySelected = useAppStore(s => !!s.selectedRoomId)
  const material = useMemo(() => { const b = getMaterial('paint').clone(); b.transparent = true; b.opacity = baseOpacity; return b }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const edgesRefs = useRef<THREE.LineSegments[]>([])
  // Fondu des murs qui se trouvent entre la caméra et l'intérieur de la pièce (mode « auto »)
  const mid = useMemo(() => new THREE.Vector3(m((edge.a.x + edge.b.x) / 2), m(room.height / 2), m((edge.a.z + edge.b.z) / 2)), [edge, room.height])
  const normal = useMemo(() => new THREE.Vector3(edge.nx, 0, edge.nz), [edge])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const groupRef = useRef<THREE.Group>(null)
  const CUT = Math.min(0.6, 60 / room.height) // muret de 60 cm
  // Ressort par segment de mur : { x: hauteur actuelle (facteur), v: vitesse }, cible et instant du changement
  const springs = useRef<{ x: number; v: number }[]>([])
  const cutTarget = useRef(1)
  const changedAt = useRef(0)
  const fromA = useRef(true)
  useFrame(({ camera, clock }, dt) => {
    let target = baseOpacity, targetCut = 1
    if (mode === 'orbit' && (wallsDisplay === 'auto' || wallsDisplay === 'ghost')) {
      const facing = tmp.copy(camera.position).sub(mid).dot(normal) > 0
      if (wallsDisplay === 'ghost') target = facing ? (selected || !anySelected ? 0.06 : 0.03) : (selected || !anySelected ? 1 : 0.45)
      else { targetCut = facing ? CUT : 1; target = selected || !anySelected ? 1 : 0.55 }
    }
    const k = 1 - Math.exp(-dt * 7)
    material.opacity += (target - material.opacity) * k
    material.depthWrite = material.opacity > 0.5
    edgesRefs.current.forEach(l => { if (l) (l.material as THREE.LineBasicMaterial).opacity = material.opacity * 0.18 })
    if (targetCut !== cutTarget.current) {
      cutTarget.current = targetCut; changedAt.current = clock.elapsedTime
      // la vague part du bout du mur le plus proche de la caméra
      const da = camera.position.distanceTo(new THREE.Vector3(m(edge.a.x), 1, m(edge.a.z))), db = camera.position.distanceTo(new THREE.Vector3(m(edge.b.x), 1, m(edge.b.z)))
      fromA.current = da <= db
    }
    const g = groupRef.current
    if (!g) return
    const step = Math.min(dt, 1 / 30)
    const front = (clock.elapsedTime - changedAt.current) * 450 // cm parcourus par la vague depuis le changement
    let minX = 1
    g.children.forEach((child, i) => {
      const bottom = child.userData.bottom as number | undefined
      if (bottom === undefined) return // menuiseries : traitées après
      if (!springs.current[i]) springs.current[i] = { x: 1, v: 0 }
      const sp = springs.current[i]
      const u = child.userData.u as number
      const dist = fromA.current ? u : length - u
      const tgt = dist <= front ? cutTarget.current : (cutTarget.current < 1 ? 1 : CUT)
      // ressort sous-amorti : petit rebond quand la tranche arrive
      const acc = 170 * (tgt - sp.x) - 18 * sp.v
      sp.v += acc * step
      sp.x += sp.v * step
      const f = Math.max(0.05, sp.x)
      child.scale.y = f
      child.visible = !(bottom > 0 && f < 0.6) // linteaux au-dessus des ouvertures : cachés une fois le mur bas
      minX = Math.min(minX, f)
    })
    g.children.forEach(child => { if (child.userData.bottom === undefined) child.visible = minX > 0.6 })
  })
  const pieces = useMemo(() => splitWall(length, room.height, wall.openings), [length, room.height, wall.openings])
  // Chaque morceau = prisme entre la face intérieure (arête) et la face extérieure (avec onglets aux extrémités)
  // Tranches de ~30 cm : chaque tranche s'anime séparément (vague le long du mur)
  const slabs = useMemo(() => {
    const ux = (edge.b.x - edge.a.x) / length, uz = (edge.b.z - edge.a.z) / length
    const t = wall.thickness
    const out: { geometry: THREE.BufferGeometry; u: number; bottom: number }[] = []
    for (const p of pieces) {
      const n = Math.max(1, Math.round(p.length / 30))
      const sl = p.length / n
      for (let i = 0; i < n; i++) {
        const u0 = p.u + i * sl, u1 = u0 + sl
        const inA = { x: edge.a.x + ux * u0, z: edge.a.z + uz * u0 }, inB = { x: edge.a.x + ux * u1, z: edge.a.z + uz * u1 }
        const outA = u0 < 0.01 ? edge.outerA : { x: inA.x + edge.nx * t, z: inA.z + edge.nz * t }
        const outB = u1 > length - 0.01 ? edge.outerB : { x: inB.x + edge.nx * t, z: inB.z + edge.nz * t }
        const { positions, indices } = prismPoints([inA, inB, outB, outA], p.v, p.height)
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        g.setIndex(indices); g.computeVertexNormals()
        out.push({ geometry: g, u: (u0 + u1) / 2, bottom: p.v })
      }
    }
    return out
  }, [edge, pieces, length, wall.thickness])
  if (!wall.present) return null
  const glass = getMaterial('glass')
  const frameMat = getMaterial('wood-dark')
  const t = wall.thickness / 2
  const mx = (edge.a.x + edge.b.x) / 2 + edge.nx * t, mz = (edge.a.z + edge.b.z) / 2 + edge.nz * t
  return (
    <group ref={groupRef}>
      {slabs.map((sl, i) => (
        <mesh key={i} geometry={sl.geometry} material={material} castShadow receiveShadow userData={{ bottom: sl.bottom, u: sl.u }}
          onClick={(e) => { if (tool === 'measure') return; e.stopPropagation(); selectRoom(room.id) }}>
          <Edges ref={(el) => { edgesRefs.current[i] = el as unknown as THREE.LineSegments }} color="#141412" threshold={30} lineWidth={0.5} transparent opacity={0.18} />
        </mesh>
      ))}
      <group position={[m(mx), 0, m(mz)]} rotation={[0, -edge.angle, 0]}>
        {wall.openings.map(o => (
          <group key={o.id} position={[m(o.offset + o.width / 2 - length / 2), m(o.sill + o.height / 2), 0]}>
            {o.type === 'window' ? (
              <>
                <mesh material={glass}><boxGeometry args={[m(o.width), m(o.height), m(2)]} /></mesh>
                {/* cadre : traverses haute et basse, montants extérieurs et montants entre vantaux */}
                <mesh material={frameMat} position={[0, m(o.height / 2 - 2), 0]}><boxGeometry args={[m(o.width + 6), m(4), m(wall.thickness + 2)]} /></mesh>
                <mesh material={frameMat} position={[0, m(-o.height / 2 + 2), 0]}><boxGeometry args={[m(o.width + 6), m(4), m(wall.thickness + (o.sill > 20 ? 6 : 2))]} /></mesh>
                {Array.from({ length: (o.leaves ?? 1) + 1 }).map((_, i) => (
                  <mesh key={i} material={frameMat} position={[m(-o.width / 2 + (o.width * i) / (o.leaves ?? 1)), 0, 0]}><boxGeometry args={[m(i === 0 || i === (o.leaves ?? 1) ? 6 : 8), m(o.height), m(wall.thickness + 2)]} /></mesh>
                ))}
                {(o.leaves ?? 1) > 1 && Array.from({ length: o.leaves! }).map((_, i) => (
                  <mesh key={'h' + i} material={getMaterial('metal', '#9a9ea3')} position={[m(-o.width / 2 + (o.width * (i + 0.5)) / o.leaves! + (i === 0 ? o.width / o.leaves! / 2 - 8 : -(o.width / o.leaves! / 2 - 8))), m(o.sill > 20 ? -o.height * 0.1 : 0), m(wall.thickness / 2 + 1)]}><boxGeometry args={[m(2), m(14), m(2)]} /></mesh>
                ))}
              </>
            ) : (
              <mesh>
                <boxGeometry args={[m(o.width), m(o.height), m(3)]} />
                <meshStandardMaterial color="#c9b79a" roughness={0.6} transparent opacity={0.35} />
              </mesh>
            )}
          </group>
        ))}
      </group>
    </group>
  )
}

/** Cotations discrètes (boîte englobante) */
function Dimensions({ room }: { room: Room }) {
  const b = roomBox(room)
  const x0 = m(b.minX), x1 = m(b.maxX), z0 = m(b.minZ), z1 = m(b.maxZ)
  const off = 0.35
  const Line = ({ a, b }: { a: [number, number, number]; b: [number, number, number] }) => {
    const line = useMemo(() => new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a), new THREE.Vector3(...b)]), new THREE.LineBasicMaterial({ color: '#6b6964', transparent: true, opacity: 0.6 })), [a, b])
    return <primitive object={line} />
  }
  return (
    <group>
      <Line a={[x0, 0.01, z0 - off]} b={[x1, 0.01, z0 - off]} />
      <Line a={[x1 + off, 0.01, z0]} b={[x1 + off, 0.01, z1]} />
      <Html position={[(x0 + x1) / 2, 0.02, z0 - off - 0.12]} center style={{ pointerEvents: 'none' }}><span className="text-[10px] text-ink-2 whitespace-nowrap">← {((b.maxX - b.minX) / 100).toFixed(2)} m →</span></Html>
      <Html position={[x1 + off + 0.12, 0.02, (z0 + z1) / 2]} center style={{ pointerEvents: 'none' }}><span className="text-[10px] text-ink-2 whitespace-nowrap">{((b.maxZ - b.minZ) / 100).toFixed(2)} m</span></Html>
    </group>
  )
}
