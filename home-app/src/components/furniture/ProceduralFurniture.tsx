import { useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { getMaterial } from '../../three/materials'
import { m } from '../../three/units'
import type { Furniture, FurnitureKind, MaterialKey } from '../../types'

/**
 * Meubles dessinés en géométrie paramétrique, toujours aux dimensions exactes (cm).
 * Repère local : origine au sol, au centre ; X largeur, Y hauteur, Z profondeur ; la FACE AVANT est en +Z.
 */
export function ProceduralFurniture({ item }: { item: Furniture }) {
  const w = m(item.width), d = m(item.depth), h = m(item.height)
  const mat = useMemo(() => getMaterial(item.material, item.color), [item.material, item.color])
  const kind: FurnitureKind = item.kind ?? 'box'
  const props = { w, d, h, mat, item }
  switch (kind) {
    case 'cabinet': return <Cabinet {...props} />
    case 'fridge': return <Fridge {...props} />
    case 'sofa': return item.variant === 'play' ? <PlaySofa {...props} /> : item.variant === 'swivel' ? <SwivelArmchair {...props} /> : <Sofa {...props} />
    case 'bed': return <Bed {...props} />
    case 'table': return item.variant === 'dropleaf' ? <DropLeafTable {...props} /> : <Table {...props} legs={0.05} top={0.04} />
    case 'desk': return <Table {...props} legs={0.05} top={0.03} />
    case 'chair': return <Chair {...props} />
    case 'radiator': return <Radiator {...props} />
    case 'plant': return <Plant {...props} />
    case 'tv': return <Tv {...props} />
    case 'shelf': return <Shelf {...props} />
    case 'counter': return <Counter {...props} />
    case 'wc': return <Wc {...props} />
    case 'sink': return <Sink {...props} />
    case 'shower': return <Shower {...props} />
    case 'washer': return <Washer {...props} />
    case 'island': return <Island {...props} />
    default: return <Box {...props} />
  }
}

type P = { w: number; d: number; h: number; mat: THREE.Material; item: Furniture }
const M = (k: MaterialKey, c?: string) => getMaterial(k, c)
const B = ({ x = 0, y, z = 0, w, h, d, mat }: { x?: number; y: number; z?: number; w: number; h: number; d: number; mat: THREE.Material }) => (
  <mesh position={[x, y, z]} material={mat} castShadow receiveShadow><boxGeometry args={[w, h, d]} /></mesh>
)

function Box({ w, d, h, mat }: P) { return <B y={h / 2} w={w} h={h} d={d} mat={mat} /> }

/** Caisson avec portes (BESTÅ, commode, armoire, meuble TV…) */
function Cabinet({ w, d, h, mat, item }: P) {
  const doors = Math.max(1, Math.round(item.width / 60))
  const gap = 0.004, front = 0.018
  const dark = useMemo(() => { const c = new THREE.Color(item.color ?? '#c9b79a').multiplyScalar(0.88); return new THREE.MeshStandardMaterial({ color: c, roughness: 0.7 }) }, [item.color])
  const dw = (w - gap * (doors + 1)) / doors
  return (
    <group>
      <B y={h / 2} w={w} h={h} d={d - front} z={-front / 2} mat={mat} />
      {Array.from({ length: doors }).map((_, i) => (
        <B key={i} x={-w / 2 + gap + dw / 2 + i * (dw + gap)} y={h / 2} z={d / 2 - front / 2} w={dw} h={h - gap * 2} d={front} mat={dark} />
      ))}
    </group>
  )
}

function Fridge({ w, d, h, mat }: P) {
  const dark = M('metal', '#b9bcc0')
  return (
    <group>
      <B y={h / 2} w={w} h={h} d={d - 0.02} z={-0.01} mat={mat} />
      <B y={h * 0.35} z={d / 2 - 0.01} w={w - 0.01} h={h * 0.68} d={0.02} mat={mat} />
      <B y={h * 0.85} z={d / 2 - 0.01} w={w - 0.01} h={h * 0.29} d={0.02} mat={mat} />
      <B x={w / 2 - 0.06} y={h * 0.45} z={d / 2 + 0.01} w={0.02} h={0.5} d={0.02} mat={dark} />
      <B x={w / 2 - 0.06} y={h * 0.85} z={d / 2 + 0.01} w={0.02} h={0.18} d={0.02} mat={dark} />
    </group>
  )
}

function Sofa({ w, d, h, mat, item }: P) {
  const feet = 0.05
  const seatH = item.seatHeight ? m(item.seatHeight) : h * 0.42
  const arm = Math.min(0.18, w * 0.1), backT = d * 0.28
  const seats = Math.max(1, Math.round(w / 0.8))
  const cushionW = (w - arm * 2) / seats
  const cushion = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color((mat as THREE.MeshStandardMaterial).color).multiplyScalar(1.08), roughness: 1 }), [mat])
  const foot = M('metal', '#141414')
  return (
    <group>
      {[[-w / 2 + 0.08, -d / 2 + 0.08], [w / 2 - 0.08, -d / 2 + 0.08], [-w / 2 + 0.08, d / 2 - 0.08], [w / 2 - 0.08, d / 2 - 0.08], [0, d / 2 - 0.08]].map(([x, z], i) => <B key={i} x={x} z={z} y={feet / 2} w={0.05} h={feet} d={0.05} mat={foot} />)}
      <B y={feet + (seatH - feet) * 0.5} w={w} h={seatH - feet} d={d} mat={mat} />
      <B y={h / 2} z={-d / 2 + backT / 2} w={w} h={h} d={backT} mat={mat} />
      <B x={-w / 2 + arm / 2} y={h * 0.36} w={arm} h={h * 0.72} d={d} mat={mat} />
      <B x={w / 2 - arm / 2} y={h * 0.36} w={arm} h={h * 0.72} d={d} mat={mat} />
      {Array.from({ length: seats }).map((_, i) => (
        <group key={i}>
          <B x={-w / 2 + arm + cushionW / 2 + i * cushionW} y={seatH + 0.06} z={backT / 2} w={cushionW - 0.02} h={0.12} d={d - backT - 0.04} mat={cushion} />
          <B x={-w / 2 + arm + cushionW / 2 + i * cushionW} y={seatH + 0.12 + (h - seatH - 0.12) / 2} z={-d / 2 + backT + 0.05} w={cushionW - 0.02} h={h - seatH - 0.14} d={0.1} mat={cushion} />
        </group>
      ))}
    </group>
  )
}

/**
 * Canapé PLAY (Maisons du Monde) : volumes arrondis, sans pieds visibles.
 * Cotes officielles 2 places : a 193 × b 94 × c 74 ; assise d 117 (entre accoudoirs), profondeur e 63,
 * dossier f 32 au-dessus de l'assise, hauteur d'assise g 42, accoudoirs i 51. Tout est proportionnel à w/d/h.
 */
function PlaySofa({ w, d, h, mat, item }: P) {
  const seatH = item.seatHeight ? m(item.seatHeight) : h * 0.57
  const armW = Math.min(0.38, w * 0.2)
  const innerW = w - armW * 2
  const seatD = Math.min(0.63, d * 0.67)
  const armH = Math.min(0.51, h * 0.69)
  const backT = d - seatD - 0.06
  const seats = Math.max(1, Math.round(innerW / 0.6))
  const cw = innerW / seats
  const light = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color((mat as THREE.MeshStandardMaterial).color).multiplyScalar(1.12), roughness: 1 }), [mat])
  const R = ({ x = 0, y, z = 0, w: bw, h: bh, d: bd, r, m: mm = mat, rot = 0 }: { x?: number; y: number; z?: number; w: number; h: number; d: number; r: number; m?: THREE.Material; rot?: number }) => (
    <RoundedBox args={[bw, bh, bd]} radius={Math.min(r, bw / 2, bh / 2, bd / 2)} smoothness={5} position={[x, y, z]} rotation={[rot, 0, 0]} material={mm} castShadow receiveShadow />
  )
  return (
    <group>
      {/* Base pleine, arrondie, posée au sol (pas de pieds visibles) */}
      <R y={seatH / 2} w={w - 0.02} h={seatH} d={d} r={0.13} />
      {/* Coque de dossier, arrondie sur le dessus */}
      <R y={h / 2} z={-d / 2 + backT / 2} w={w - 0.04} h={h} d={backT} r={0.16} />
      {/* Accoudoirs : gros bourrelets qui montent vers l'arrière */}
      {[-1, 1].map(sgn => (
        <group key={sgn}>
          <R x={sgn * (w / 2 - armW / 2)} y={armH / 2} w={armW} h={armH} d={d - 0.04} r={0.16} />
          <R x={sgn * (w / 2 - armW / 2)} y={(armH + h) / 4 + 0.02} z={-d / 2 + 0.2} w={armW} h={(h + armH) / 2 - 0.04} d={0.4} r={0.16} />
        </group>
      ))}
      {/* Coussins d'assise (surface légèrement plus claire) */}
      {Array.from({ length: seats }).map((_, i) => (
        <R key={'s' + i} x={-innerW / 2 + cw / 2 + i * cw} y={seatH + 0.05} z={d / 2 - seatD / 2 - 0.02} w={cw - 0.03} h={0.14} d={seatD} r={0.06} m={light} />
      ))}
      {/* Coussins de dossier, inclinés */}
      {Array.from({ length: seats }).map((_, i) => (
        <R key={'b' + i} x={-innerW / 2 + cw / 2 + i * cw} y={seatH + (h - seatH) / 2 + 0.02} z={-d / 2 + backT + 0.09} w={cw - 0.03} h={h - seatH + 0.02} d={0.2} r={0.08} m={light} rot={-0.12} />
      ))}
    </group>
  )
}

/** Fauteuil pivotant type DYVLINGE : piètement rond, assise galette, dossier enveloppant en demi-cercle */
function SwivelArmchair({ w, d, h, mat, item }: P) {
  const seatH = item.seatHeight ? m(item.seatHeight) : h * 0.63
  const r = Math.min(w, d) / 2
  const base = M('metal', '#111111')
  const light = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color((mat as THREE.MeshStandardMaterial).color).multiplyScalar(1.15), roughness: 1 }), [mat])
  const seatT = 0.12
  return (
    <group>
      <mesh position={[0, 0.02, 0]} material={base} castShadow receiveShadow><cylinderGeometry args={[r * 0.75, r * 0.8, 0.04, 32]} /></mesh>
      <mesh position={[0, (seatH - seatT) / 2, 0]} material={base} castShadow><cylinderGeometry args={[0.035, 0.045, seatH - seatT, 16]} /></mesh>
      {/* assise galette */}
      <mesh position={[0, seatH - seatT / 2, d / 2 - r]} material={light} castShadow receiveShadow><cylinderGeometry args={[r, r * 0.95, seatT, 40]} /></mesh>
      {/* dossier enveloppant : demi-anneau épais, du côté arrière */}
      <mesh position={[0, seatH + (h - seatH) / 2 - 0.02, d / 2 - r]} rotation={[0, Math.PI / 2, 0]} material={mat} castShadow receiveShadow>
        <cylinderGeometry args={[r, r, h - seatH + 0.02, 40, 1, true, 0, Math.PI]} />
      </mesh>
      <mesh position={[0, seatH + (h - seatH) / 2 - 0.02, d / 2 - r]} rotation={[0, Math.PI / 2, 0]} material={mat} castShadow receiveShadow>
        <cylinderGeometry args={[r - 0.12, r - 0.12, h - seatH + 0.02, 40, 1, true, 0, Math.PI]} />
      </mesh>
      <mesh position={[0, h - 0.01, d / 2 - r]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} material={mat} castShadow><ringGeometry args={[r - 0.12, r, 40, 1, 0, Math.PI]} /></mesh>
    </group>
  )
}

function Bed({ w, d, h, mat }: P) {
  const frameH = Math.min(0.25, h * 0.5), mattH = h - frameH
  const sheet = M('fabric', '#ece7dd'), pillow = M('fabric', '#f7f5f0'), head = M('wood-dark')
  return (
    <group>
      <B y={frameH / 2} w={w} h={frameH} d={d} mat={mat} />
      <B y={frameH + mattH / 2} w={w - 0.04} h={mattH} d={d - 0.04} mat={sheet} />
      <B y={h + 0.05} z={-d / 2 + 0.3} x={-w / 4} w={w * 0.4} h={0.1} d={0.4} mat={pillow} />
      <B y={h + 0.05} z={-d / 2 + 0.3} x={w / 4} w={w * 0.4} h={0.1} d={0.4} mat={pillow} />
      <B y={h * 0.9} z={-d / 2 - 0.02} w={w} h={h * 1.8} d={0.04} mat={head} />
    </group>
  )
}

function Table({ w, d, h, mat, legs, top }: P & { legs: number; top: number }) {
  const legMat = M('wood-dark')
  const ix = w / 2 - legs / 2 - 0.03, iz = d / 2 - legs / 2 - 0.03
  return (
    <group>
      <B y={h - top / 2} w={w} h={top} d={d} mat={mat} />
      {[[-ix, -iz], [ix, -iz], [-ix, iz], [ix, iz]].map(([x, z], i) => <B key={i} x={x} z={z} y={(h - top) / 2} w={legs} h={h - top} d={legs} mat={legMat} />)}
    </group>
  )
}

/** Table à rabat type PINNTORP : plateau central + 2 abattants, piètement blanc, pied-portillon sous chaque abattant */
function DropLeafTable({ w, d, h, mat }: P) {
  const white = M('paint', '#f3f1ec'), top = mat
  const t = 0.025, leg = 0.045
  const core = Math.min(w, 0.67) // partie fixe (67 cm) ; le reste = abattants
  const leaf = Math.max(0, (w - core) / 2)
  const ix = core / 2 - leg / 2 - 0.02, iz = d / 2 - leg / 2 - 0.03
  return (
    <group>
      <B y={h - t / 2} w={core} h={t} d={d} mat={top} />
      {leaf > 0.01 && <B x={-core / 2 - leaf / 2} y={h - t / 2} w={leaf - 0.004} h={t} d={d} mat={top} />}
      {leaf > 0.01 && <B x={core / 2 + leaf / 2} y={h - t / 2} w={leaf - 0.004} h={t} d={d} mat={top} />}
      <B y={h - t - 0.04} w={core - 0.06} h={0.08} d={d - 0.08} mat={white} />
      {[[-ix, -iz], [ix, -iz], [-ix, iz], [ix, iz]].map(([x, z], i) => <B key={i} x={x} z={z} y={(h - t) / 2} w={leg} h={h - t} d={leg} mat={white} />)}
      {leaf > 0.01 && [-1, 1].map(sgn => <B key={sgn} x={sgn * (core / 2 + leaf * 0.55)} z={0} y={(h - t) / 2} w={leg * 0.8} h={h - t - 0.01} d={leg * 0.8} mat={white} />)}
    </group>
  )
}

function Chair({ w, d, h, mat }: P) {
  const seatH = h * 0.5, legs = 0.03
  const ix = w / 2 - 0.03, iz = d / 2 - 0.03
  return (
    <group>
      <B y={seatH} w={w} h={0.04} d={d} mat={mat} />
      {[[-ix, -iz], [ix, -iz], [-ix, iz], [ix, iz]].map(([x, z], i) => <B key={i} x={x} z={z} y={seatH / 2} w={legs} h={seatH} d={legs} mat={mat} />)}
      <B y={seatH + (h - seatH) / 2} z={-d / 2 + 0.02} w={w} h={h - seatH} d={0.03} mat={mat} />
    </group>
  )
}

function Radiator({ w, d, h, mat }: P) {
  const fins = Math.max(2, Math.round(w / 0.055))
  const fw = w / fins
  return (
    <group>
      {Array.from({ length: fins }).map((_, i) => <B key={i} x={-w / 2 + fw / 2 + i * fw} y={h / 2} w={fw - 0.012} h={h} d={d} mat={mat} />)}
      <B y={h - 0.04} w={w} h={0.03} d={d * 0.5} mat={mat} />
      <B y={0.04} w={w} h={0.03} d={d * 0.5} mat={mat} />
    </group>
  )
}

function Plant({ w, d, h }: P) {
  const pot = M('ceramic', '#cfc3b1'), leaf = M('plant')
  const r = Math.min(w, d) / 2
  return (
    <group>
      <mesh position={[0, h * 0.15, 0]} material={pot} castShadow><cylinderGeometry args={[r * 0.8, r * 0.6, h * 0.3, 16]} /></mesh>
      <mesh position={[0, h * 0.62, 0]} material={leaf} castShadow><sphereGeometry args={[r, 12, 10]} /></mesh>
      <mesh position={[r * 0.4, h * 0.8, 0]} material={leaf} castShadow><sphereGeometry args={[r * 0.7, 12, 10]} /></mesh>
      <mesh position={[-r * 0.4, h * 0.75, r * 0.2]} material={leaf} castShadow><sphereGeometry args={[r * 0.6, 12, 10]} /></mesh>
    </group>
  )
}

function Tv({ w, d, h, item }: P) {
  const screen = M('metal', '#0e0e10'), stand = M('metal', '#5a5c60')
  if (item.variant === 'flat') return <group><B y={h / 2} w={w} h={h} d={Math.max(0.015, d * 0.5)} mat={screen} /><B y={h / 2} z={-d / 4} w={w * 0.35} h={h * 0.35} d={d * 0.5} mat={stand} /></group>
  return (
    <group>
      <B y={h * 0.55} w={w} h={h * 0.9} d={Math.max(0.02, d * 0.4)} mat={screen} />
      <B y={h * 0.05} w={w * 0.35} h={0.02} d={d} mat={stand} />
    </group>
  )
}

function Shelf({ w, d, h, mat }: P) {
  const n = Math.max(2, Math.round(h / 0.35))
  return (
    <group>
      <B x={-w / 2 + 0.01} y={h / 2} w={0.02} h={h} d={d} mat={mat} />
      <B x={w / 2 - 0.01} y={h / 2} w={0.02} h={h} d={d} mat={mat} />
      <B y={h - 0.01} z={-d / 2 + 0.005} w={w} h={h} d={0.01} mat={mat} x={0} />
      {Array.from({ length: n + 1 }).map((_, i) => <B key={i} y={0.01 + (i * (h - 0.02)) / n} w={w} h={0.02} d={d} mat={mat} />)}
    </group>
  )
}

function Counter({ w, d, h, mat, item }: P) {
  const top = M('tiles', '#e9e6df'), dark = M('paint', '#dcd8d0')
  const doors = Math.max(1, Math.round(item.width / 60))
  const dw = (w - 0.004 * (doors + 1)) / doors
  const hob = /plaque/i.test(item.name), basin = /évier|evier/i.test(item.name)
  return (
    <group>
      <B y={(h - 0.04) / 2} w={w} h={h - 0.04} d={d - 0.02} z={-0.01} mat={mat} />
      <B y={h - 0.02} w={w + 0.02} h={0.04} d={d + 0.02} mat={top} />
      {Array.from({ length: doors }).map((_, i) => <B key={i} x={-w / 2 + 0.004 + dw / 2 + i * (dw + 0.004)} y={(h - 0.06) / 2} z={d / 2 - 0.008} w={dw} h={h - 0.08} d={0.016} mat={dark} />)}
      {hob && <B y={h + 0.005} w={Math.min(w - 0.06, 0.58)} h={0.01} d={Math.min(d - 0.08, 0.5)} mat={M('metal', '#111114')} />}
      {basin && <B y={h - 0.01} w={Math.min(w - 0.1, 0.8)} h={0.06} d={Math.min(d - 0.12, 0.4)} mat={M('metal', '#c8cacd')} />}
    </group>
  )
}

/**
 * Îlot central type Molene (Sweeek) : plateau bois hévéa 1,5 cm débordant de 37 cm côté repas (+Z),
 * corps MDF laqué noir de 38 cm de profondeur : tiroir + porte à gauche, 3 étagères ouvertes à droite.
 */
function Island({ w, d, h, mat, item }: P) {
  // Face AVANT (+Z) = côté rangements (tiroir, porte, étagères) ; le débord du plateau, côté repas, est à l'arrière (−Z)
  const black = mat, wood = M('wood', item.color ? undefined : '#c9a87c')
  const topT = 0.015, overhang = Math.min(0.37, d * 0.5), bodyD = d - overhang
  const feet = 0.08, bodyH = h - topT - feet
  const alu = M('metal', '#c8cacd')
  const bz = d / 2 - bodyD / 2           // centre du corps
  const front = d / 2                    // face avant du corps (extérieur)
  const back = d / 2 - bodyD             // fond du corps (côté repas)
  const half = (w - 0.06) / 2
  const shelfT = 0.018
  return (
    <group>
      {[[-w / 2 + 0.03, back + 0.03], [w / 2 - 0.03, back + 0.03], [-w / 2 + 0.03, front - 0.03], [w / 2 - 0.03, front - 0.03]].map(([x, z], i) => <B key={i} x={x} z={z} y={feet / 2} w={0.038} h={feet} d={0.038} mat={black} />)}
      {/* Carcasse : fond (côté repas), côtés, séparation centrale, plancher */}
      <B y={feet + bodyH / 2} z={back + 0.01} w={w} h={bodyH} d={0.02} mat={black} />
      <B x={-w / 2 + 0.01} y={feet + bodyH / 2} z={bz} w={0.02} h={bodyH} d={bodyD} mat={black} />
      <B x={w / 2 - 0.01} y={feet + bodyH / 2} z={bz} w={0.02} h={bodyH} d={bodyD} mat={black} />
      <B y={feet + bodyH / 2} z={bz} w={0.02} h={bodyH} d={bodyD} mat={black} />
      <B y={feet + 0.01} z={bz} w={w} h={0.02} d={bodyD} mat={black} />
      {/* Gauche : tiroir (10,2 cm) en haut, porte en dessous, façades sur la face avant */}
      <B x={-w / 2 + 0.03 + half / 2} y={feet + bodyH - 0.06} z={front - 0.01} w={half - 0.006} h={0.102} d={0.018} mat={black} />
      <B x={-w / 2 + 0.03 + half / 2} y={feet + (bodyH - 0.12) / 2} z={front - 0.01} w={half - 0.006} h={bodyH - 0.125} d={0.018} mat={black} />
      <B x={-w / 2 + 0.03 + half / 2} y={feet + bodyH - 0.06} z={front + 0.008} w={0.12} h={0.015} d={0.016} mat={alu} />
      <B x={-w / 2 + 0.03 + half - 0.06} y={feet + bodyH - 0.2} z={front + 0.008} w={0.015} h={0.12} d={0.016} mat={alu} />
      {/* Droite : 3 étagères ouvertes */}
      {[0.21, 0.42, 0.63].map((y, i) => <B key={i} x={w / 2 - 0.03 - half / 2} y={feet + y} z={bz} w={half - 0.006} h={shelfT} d={bodyD - 0.02} mat={black} />)}
      {/* Plateau hévéa, débord côté repas (−Z) */}
      <B y={h - topT / 2} w={w} h={topT} d={d} mat={wood} />
    </group>
  )
}

function Wc({ w, d, h }: P) {
  const c = M('ceramic')
  return (
    <group>
      <B y={h * 0.7} z={-d / 2 + 0.08} w={w} h={h * 0.6} d={0.16} mat={c} />
      <mesh position={[0, h * 0.25, d * 0.12]} material={c} castShadow><cylinderGeometry args={[w * 0.45, w * 0.3, h * 0.5, 20]} /></mesh>
      <mesh position={[0, h * 0.52, d * 0.12]} material={c} castShadow><cylinderGeometry args={[w * 0.5, w * 0.5, 0.05, 20]} /></mesh>
    </group>
  )
}

function Sink({ w, d, h, mat }: P) {
  const c = M('ceramic')
  return (
    <group>
      <B y={(h - 0.15) / 2} w={w} h={h - 0.15} d={d} mat={mat} />
      <B y={h - 0.075} w={w + 0.02} h={0.15} d={d + 0.02} mat={c} />
      <B y={h + 0.15} z={-d / 2 + 0.01} w={w} h={0.3} d={0.02} mat={M('metal', '#cfd3d6')} />
    </group>
  )
}

function Shower({ w, d, h }: P) {
  const tray = M('ceramic'), glass = M('glass')
  return (
    <group>
      <B y={0.03} w={w} h={0.06} d={d} mat={tray} />
      <B x={w / 2 - 0.005} y={h / 2} w={0.01} h={h} d={d} mat={glass} />
      <B y={h / 2} z={d / 2 - 0.005} w={w} h={h} d={0.01} mat={glass} />
      <B y={h - 0.1} x={-w / 2 + 0.06} z={-d / 2 + 0.06} w={0.12} h={0.02} d={0.12} mat={M('metal')} />
    </group>
  )
}

function Washer({ w, d, h, mat }: P) {
  return (
    <group>
      <B y={h / 2} w={w} h={h} d={d} mat={mat} />
      <mesh position={[0, h * 0.5, d / 2 + 0.005]} rotation={[Math.PI / 2, 0, 0]} material={M('glass', '#8fa3b5')} castShadow><cylinderGeometry args={[w * 0.28, w * 0.28, 0.01, 24]} /></mesh>
      <B y={h - 0.06} z={d / 2 + 0.002} w={w - 0.04} h={0.06} d={0.005} mat={M('metal', '#c8cacd')} />
    </group>
  )
}
