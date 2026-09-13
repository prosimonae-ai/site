import { useMemo } from 'react'
import * as THREE from 'three'
import { Environment, Lightformer } from '@react-three/drei'
import { useAppStore } from '../../store/useAppStore'
import type { TimeOfDay } from '../../types'

/** Presets d'ambiance : lumière extérieure (soleil), ciel, température. Évolutif vers une vraie simulation solaire. */
export const LIGHT_PRESETS: Record<TimeOfDay, { sun: string; sunIntensity: number; sunDir: [number, number, number]; sky: string; ground: string; ambient: number; background: string }> = {
  morning: { sun: '#ffe2b8', sunIntensity: 2.2, sunDir: [-8, 5, 6],  sky: '#dfe9f3', ground: '#c9bfae', ambient: 0.55, background: '#f2f1ee' },
  day:     { sun: '#ffffff', sunIntensity: 2.6, sunDir: [-5, 10, 4], sky: '#eaf0f5', ground: '#d0c8ba', ambient: 0.7,  background: '#f4f3f0' },
  evening: { sun: '#ffb27a', sunIntensity: 1.8, sunDir: [9, 3, -4],  sky: '#e8d6c8', ground: '#a89684', ambient: 0.45, background: '#efe7df' },
  night:   { sun: '#a9b8d6', sunIntensity: 0.35, sunDir: [4, 8, -6], sky: '#3d4757', ground: '#1e2128', ambient: 0.25, background: '#1a1c22' },
}

export function Lighting() {
  const time = useAppStore(s => s.timeOfDay)
  const p = LIGHT_PRESETS[time]
  const target = useMemo(() => new THREE.Object3D(), [])
  return (
    <>
      <color attach="background" args={[p.background]} />
      <hemisphereLight args={[p.sky, p.ground, p.ambient]} />
      <ambientLight intensity={p.ambient * 0.35} />
      <directionalLight
        color={p.sun} intensity={p.sunIntensity} position={p.sunDir} castShadow
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.02}
        shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15} shadow-camera-near={0.5} shadow-camera-far={60}
        target={target}
      />
      <primitive object={target} position={[0, 0, 0]} />
      {time === 'night' && <pointLight position={[2, 2.3, 2]} intensity={6} color="#ffd9a8" distance={12} decay={2} />}
      {/* Environnement procédural : reflets pour les métaux / verres, sans fichier HDR */}
      <Environment resolution={256} frames={1} environmentIntensity={time === 'night' ? 0.3 : 0.55}>
        <Lightformer form="rect" intensity={3} color={p.sky} position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 12, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[-8, 3, 0]} rotation={[0, Math.PI / 2, 0]} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#f5f0e6" position={[8, 3, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={0.6} color={p.ground} position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[12, 12, 1]} />
        <Lightformer form="circle" intensity={4} color={p.sun} position={p.sunDir} scale={[2, 2, 1]} />
      </Environment>
    </>
  )
}
