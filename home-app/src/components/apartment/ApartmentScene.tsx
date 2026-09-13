import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Grid, Stats, GizmoHelper, GizmoViewport } from '@react-three/drei'
import { useAppStore, useFurniture, useVisibleRooms } from '../../store/useAppStore'
import { Lighting } from '../../three/lighting/Lighting'
import { RoomMesh } from './RoomMesh'
import { FurnitureMesh } from '../furniture/FurnitureMesh'
import { CameraRig } from '../controls/CameraRig'
import { MeasureTool } from '../controls/MeasureTool'
import { DistanceGuides } from '../controls/DistanceGuides'
import { apartmentBounds } from '../../three/helpers/geometry'
import { m } from '../../three/units'

export function ApartmentScene() {
  const rooms = useVisibleRooms()
  const furniture = useFurniture()
  const hidden = useAppStore(s => s.hiddenRoomIds)
  const mode = useAppStore(s => s.mode)
  const wallsDisplay = useAppStore(s => s.wallsDisplay)
  const debug = useAppStore(s => s.debug)
  const selectRoom = useAppStore(s => s.selectRoom)
  const tool = useAppStore(s => s.tool)
  const isMobile = useMemo(() => window.matchMedia('(max-width: 760px)').matches, [])

  // Murs : pleins en visite, semi-transparents en orbite (auto), coupés en plan
  const wallOpacity = mode === 'visit' ? 1 : mode === 'plan' ? 0.9 : wallsDisplay === 'hidden' ? 0 : 1
  const b = apartmentBounds(rooms)
  const center: [number, number, number] = [m((b.minX + b.maxX) / 2), 0, m((b.minZ + b.maxZ) / 2)]

  return (
    <Canvas
      shadows
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      camera={{ fov: 45, near: 0.05, far: 200, position: [6, 6, 8] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={(e) => { if (tool !== 'measure' && !e.shiftKey) selectRoom(null) }}
    >
      <Lighting />
      <CameraRig />
      {/* Sol extérieur discret */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[center[0], -0.02, center[2]]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#e9e7e2" roughness={1} />
      </mesh>
      <Grid position={[center[0], -0.015, center[2]]} args={[60, 60]} cellSize={0.5} cellThickness={0.5} cellColor="#d6d3cc" sectionSize={1} sectionThickness={0.8} sectionColor="#c6c2b8" fadeDistance={35} fadeStrength={1.5} infiniteGrid />
      <ContactShadows position={[center[0], 0, center[2]]} opacity={0.35} scale={30} blur={2.2} far={4} resolution={512} />

      {rooms.map(r => <RoomMesh key={r.id} room={r} wallOpacity={wallOpacity} />)}
      {furniture.filter(f => !f.roomId || !hidden.includes(f.roomId)).map(f => <FurnitureMesh key={f.id} item={f} />)}
      <MeasureTool />
      <DistanceGuides />

      {debug && (
        <>
          <axesHelper args={[2]} />
          <Stats />
          <GizmoHelper alignment="bottom-right" margin={[70, 70]}><GizmoViewport labelColor="#141412" axisHeadScale={0.8} /></GizmoHelper>
        </>
      )}
    </Canvas>
  )
}
