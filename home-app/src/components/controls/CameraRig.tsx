import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { CameraControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import CameraControlsImpl from 'camera-controls'
import { useAppStore, useVisibleRooms } from '../../store/useAppStore'
import { apartmentBounds, roomCenter } from '../../three/helpers/geometry'
import { m } from '../../three/units'

const EYE = 1.65 // hauteur des yeux en mode visite (m)

/**
 * Gère les 3 modes caméra : orbite (maquette), plan (vue verticale), visite (à hauteur humaine),
 * et les animations vers une pièce.
 */
export function CameraRig() {
  const ref = useRef<CameraControlsImpl>(null)
  const mode = useAppStore(s => s.mode)
  const focus = useAppStore(s => s.focusRequest)
  const dragging = useAppStore(s => s.isDragging)
  const rooms = useVisibleRooms()
  const { gl } = useThree()
  const keys = useRef<Record<string, boolean>>({})
  const visitPos = useRef(new THREE.Vector3())

  // Mode → contraintes et cadrage
  useEffect(() => {
    const c = ref.current; if (!c) return
    const b = apartmentBounds(rooms)
    const cx = m((b.minX + b.maxX) / 2), cz = m((b.minZ + b.maxZ) / 2)
    const size = m(Math.max(b.maxX - b.minX, b.maxZ - b.minZ, 400))
    const A = CameraControlsImpl.ACTION
    c.mouseButtons.left = A.ROTATE; c.mouseButtons.right = A.TRUCK; c.mouseButtons.middle = A.TRUCK; c.mouseButtons.wheel = A.DOLLY
    c.touches.one = A.TOUCH_ROTATE; c.touches.two = A.TOUCH_DOLLY_TRUCK; c.touches.three = A.TOUCH_TRUCK
    c.dollyToCursor = true; c.infinityDolly = false
    if (mode === 'orbit') {
      c.minPolarAngle = 0.02; c.maxPolarAngle = Math.PI / 2 - 0.005; c.minDistance = 0.3; c.maxDistance = 80
      c.setLookAt(cx + size * 0.9, size * 1.1, cz + size * 1.2, cx, 0, cz, true)
    } else if (mode === 'plan') {
      c.minPolarAngle = 0; c.maxPolarAngle = 0; c.minDistance = 2; c.maxDistance = 80
      c.mouseButtons.left = A.TRUCK; c.touches.one = A.TOUCH_TRUCK
      c.setLookAt(cx, size * 1.6, cz + 0.0001, cx, 0, cz, true)
    } else {
      // Visite : on entre dans la pièce sélectionnée ou la première
      const room = rooms.find(r => r.id === useAppStore.getState().selectedRoomId) ?? rooms[0]
      const rc = room ? roomCenter(room) : { x: 0, z: 0 }
      const px = m(rc.x), pz = m(rc.z) + (room ? m(room.depth) * 0.3 : 0)
      visitPos.current.set(px, EYE, pz)
      c.minPolarAngle = 0.3; c.maxPolarAngle = Math.PI - 0.3; c.minDistance = 0.01; c.maxDistance = 0.01
      c.mouseButtons.left = A.ROTATE; c.touches.one = A.TOUCH_ROTATE
      c.setLookAt(px, EYE, pz, px, EYE - 0.05, pz - 1, true)
    }
  }, [mode, rooms])

  // Animation vers une pièce
  useEffect(() => {
    const c = ref.current; if (!c || !focus.roomId) return
    const room = rooms.find(r => r.id === focus.roomId); if (!room) return
    const rc = roomCenter(room)
    const cx = m(rc.x), cz = m(rc.z), size = m(Math.max(room.width, room.depth))
    if (mode === 'plan') c.setLookAt(cx, size * 1.8, cz + 0.0001, cx, 0, cz, true)
    else if (mode === 'visit') { visitPos.current.set(cx, EYE, cz); c.setLookAt(cx, EYE, cz, cx, EYE - 0.05, cz - 1, true) }
    else c.setLookAt(cx + size * 0.8, size * 0.9 + m(room.height) * 0.5, cz + size * 1.1, cx, m(room.height) * 0.3, cz, true)
  }, [focus.nonce]) // eslint-disable-line react-hooks/exhaustive-deps

  // Déplacement doux en mode visite (ZQSD / WASD / flèches, ou glisser avec deux doigts)
  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.metaKey || e.ctrlKey) return; const t = e.target as HTMLElement; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return; if (e.key.startsWith('Arrow') && useAppStore.getState().selectedFurnitureIds.length) return; keys.current[e.key.toLowerCase()] = true }
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', down); window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  useFrame((_, dt) => {
    const c = ref.current; if (!c) return
    c.enabled = !dragging
    const k = keys.current
    const fwd = (k['z'] || k['w'] || k['arrowup'] ? 1 : 0) - (k['s'] || k['arrowdown'] ? 1 : 0)
    const side = (k['d'] || k['arrowright'] ? 1 : 0) - (k['q'] || k['a'] || k['arrowleft'] ? 1 : 0)
    if (!fwd && !side) return
    if (mode === 'visit') { const speed = 1.6 * dt; c.forward(fwd * speed, false); c.truck(side * speed, 0, false); return }
    // Vue 3D / Plan : les touches déplacent la cible (vitesse proportionnelle à la distance)
    const speed = Math.max(0.5, c.distance * 0.6) * dt
    if (mode === 'plan') c.truck(side * speed, -fwd * speed, false)
    else { c.forward(fwd * speed, false); c.truck(side * speed, 0, false) }
  })

  useEffect(() => { gl.domElement.style.cursor = mode === 'visit' ? 'grab' : 'default' }, [mode, gl])

  // Maj enfoncée : le bouton gauche déplace la vue au lieu de la tourner
  useEffect(() => {
    const A = CameraControlsImpl.ACTION
    const apply = (shift: boolean) => { const c = ref.current; if (!c || mode === 'visit') return; c.mouseButtons.left = shift ? A.TRUCK : (mode === 'plan' ? A.TRUCK : A.ROTATE) }
    const down = (e: KeyboardEvent) => { if (e.key === 'Shift') apply(true) }
    const up = (e: KeyboardEvent) => { if (e.key === 'Shift') apply(false) }
    window.addEventListener('keydown', down); window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [mode])

  return <CameraControls ref={ref} makeDefault smoothTime={0.3} draggingSmoothTime={0.05} />
}
