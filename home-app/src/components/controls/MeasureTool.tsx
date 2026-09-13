import { useMemo } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useAppStore } from '../../store/useAppStore'

/** Plan de capture des clics + rendu de la mesure entre deux points. */
export function MeasureTool() {
  const tool = useAppStore(s => s.tool)
  const points = useAppStore(s => s.measure)
  const add = useAppStore(s => s.addMeasurePoint)
  const active = tool === 'measure'

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (!active) return
    e.stopPropagation()
    add({ x: e.point.x, y: Math.max(0, e.point.y), z: e.point.z })
  }

  const line = useMemo(() => {
    if (points.length < 2) return null
    const a = new THREE.Vector3(points[0].x, points[0].y + 0.01, points[0].z), b = new THREE.Vector3(points[1].x, points[1].y + 0.01, points[1].z)
    return { a, b, d: a.distanceTo(b), mid: a.clone().lerp(b, 0.5) }
  }, [points])

  return (
    <group>
      {active && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} onClick={onClick} visible={false}>
          <planeGeometry args={[200, 200]} />
        </mesh>
      )}
      {points.map((p, i) => (
        <mesh key={i} position={[p.x, p.y + 0.01, p.z]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshBasicMaterial color="#2d5a3d" />
        </mesh>
      ))}
      {line && (
        <>
          <primitive object={new THREE.Line(new THREE.BufferGeometry().setFromPoints([line.a, line.b]), new THREE.LineBasicMaterial({ color: '#2d5a3d' }))} />
          <Html position={line.mid} center zIndexRange={[7, 0]} style={{ pointerEvents: 'none' }}>
            <div className="glass rounded-md px-2 py-1 text-[11px] font-semibold text-ink whitespace-nowrap">{line.d.toFixed(2)} m</div>
          </Html>
        </>
      )}
    </group>
  )
}
