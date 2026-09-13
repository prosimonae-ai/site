import type { Cm, Opening, Point, Room, Side, Wall } from '../../types'

/** Segment plein de mur (cm), dans le repère local du mur : u le long du mur, v vertical */
export interface WallPiece { u: Cm; v: Cm; length: Cm; height: Cm }

/** Découpe un mur en morceaux pleins autour des ouvertures (portes / fenêtres). */
export function splitWall(length: Cm, height: Cm, openings: Opening[]): WallPiece[] {
  const pieces: WallPiece[] = []
  const sorted = [...openings].sort((a, b) => a.offset - b.offset)
  let cursor = 0
  for (const o of sorted) {
    const start = Math.max(0, Math.min(length, o.offset))
    const end = Math.max(start, Math.min(length, o.offset + o.width))
    if (start > cursor) pieces.push({ u: cursor, v: 0, length: start - cursor, height })
    const top = Math.min(height, o.sill + o.height)
    if (o.sill > 0) pieces.push({ u: start, v: 0, length: end - start, height: o.sill })
    if (top < height) pieces.push({ u: start, v: top, length: end - start, height: height - top })
    cursor = end
  }
  if (cursor < length) pieces.push({ u: cursor, v: 0, length: length - cursor, height })
  return pieces
}

/** Contour intérieur d'une pièce (sens horaire vu du dessus), rectangle ou forme libre. */
export function roomShape(room: Room): Point[] {
  if (room.shape) return room.shape
  const { x, z } = room.origin
  return [{ x, z }, { x: x + room.width, z }, { x: x + room.width, z: z + room.depth }, { x, z: z + room.depth }]
}

export interface RoomEdge {
  a: Point; b: Point; wall: Wall; side?: Side; length: Cm
  /** angle de l'arête (rad) autour de Y */ angle: number
  /** normale extérieure unitaire */ nx: number; nz: number
  /** coins de la face extérieure du mur (onglet avec les murs voisins) */ outerA: Point; outerB: Point
}

const DEFAULT_WALL: Wall = { present: true, thickness: 10, openings: [] }

/**
 * Arêtes murales d'une pièce. Pour un rectangle : nord (NO→NE), est (NE→SE), sud (SO→SE), ouest (NO→SO),
 * de sorte que les offsets partent du coin ouest (nord/sud) ou nord (est/ouest).
 */
export function roomEdges(room: Room): RoomEdge[] {
  const pts = roomShape(room)
  const edges: { a: Point; b: Point; wall: Wall; side?: Side }[] = []
  if (room.shape) {
    pts.forEach((a, i) => edges.push({ a, b: pts[(i + 1) % pts.length], wall: room.edgeWalls?.[i] ?? DEFAULT_WALL }))
  } else {
    const [nw, ne, se, sw] = pts
    const w = room.walls!
    edges.push({ a: nw, b: ne, wall: w.north, side: 'north' }, { a: ne, b: se, wall: w.east, side: 'east' }, { a: sw, b: se, wall: w.south, side: 'south' }, { a: nw, b: sw, wall: w.west, side: 'west' })
  }
  const base = edges.map(e => {
    const dx = e.b.x - e.a.x, dz = e.b.z - e.a.z, length = Math.hypot(dx, dz)
    let nx = -dz / length, nz = dx / length
    const mid = { x: (e.a.x + e.b.x) / 2, z: (e.a.z + e.b.z) / 2 }
    if (pointInPolygon(pts, mid.x + nx * 2, mid.z + nz * 2)) { nx = -nx; nz = -nz }
    return { ...e, length, angle: Math.atan2(dz, dx), nx, nz }
  })
  // Onglets : pour chaque sommet du contour, intersection des faces extérieures des deux murs incidents
  const same = (p: Point, q: Point) => Math.abs(p.x - q.x) < 0.01 && Math.abs(p.z - q.z) < 0.01
  const outerAt = (edge: typeof base[number], v: Point): Point => {
    const t = edge.wall.thickness
    const self = { x: v.x + edge.nx * t, z: v.z + edge.nz * t }
    const other = base.find(o => o !== edge && o.wall.present && (same(o.a, v) || same(o.b, v)))
    if (!other) return self
    // droites : self-line = v + n1*t1 + s*d1 ; other-line = v + n2*t2 + r*d2
    const t2 = other.wall.thickness
    const d1 = { x: edge.b.x - edge.a.x, z: edge.b.z - edge.a.z }, d2 = { x: other.b.x - other.a.x, z: other.b.z - other.a.z }
    const p1 = self, p2 = { x: v.x + other.nx * t2, z: v.z + other.nz * t2 }
    const den = d1.x * d2.z - d1.z * d2.x
    if (Math.abs(den) < 1e-6) return self
    const sPar = ((p2.x - p1.x) * d2.z - (p2.z - p1.z) * d2.x) / den
    const pt = { x: p1.x + d1.x * sPar, z: p1.z + d1.z * sPar }
    // garde-fou : un onglet trop long (angle très aigu) est tronqué
    const maxLen = Math.max(t, t2) * 4
    return Math.hypot(pt.x - v.x, pt.z - v.z) > maxLen ? self : pt
  }
  return base.map(e => ({ ...e, outerA: outerAt(e, e.a), outerB: outerAt(e, e.b) }))
}

/** Prisme vertical défini par 4 points au sol (cm) et une plage de hauteur (cm) → géométrie en mètres */
export function prismPoints(quad: Point[], y0: Cm, h: Cm): { positions: number[]; indices: number[] } {
  const M = 0.01
  const bottom = quad.map(p => [p.x * M, y0 * M, p.z * M]), top = quad.map(p => [p.x * M, (y0 + h) * M, p.z * M])
  const positions: number[] = [], indices: number[] = []
  const push = (a: number[], b: number[], c: number[], d: number[]) => { const i = positions.length / 3; positions.push(...a, ...b, ...c, ...d); indices.push(i, i + 1, i + 2, i, i + 2, i + 3) }
  push(top[0], top[1], top[2], top[3]); push(bottom[3], bottom[2], bottom[1], bottom[0])
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; push(bottom[i], bottom[j], top[j], top[i]) }
  return { positions, indices }
}

export function roomOpenings(room: Room): Opening[] { return roomEdges(room).flatMap(e => e.wall.openings) }

export function roomArea(room: Room): number {
  const p = roomShape(room)
  let s = 0
  for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; s += a.x * b.z - b.x * a.z }
  return Math.abs(s) / 2
}

export function roomBox(room: Room) {
  if (!room.shape) return { minX: room.origin.x, maxX: room.origin.x + room.width, minZ: room.origin.z, maxZ: room.origin.z + room.depth }
  const xs = room.shape.map(p => p.x), zs = room.shape.map(p => p.z)
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minZ: Math.min(...zs), maxZ: Math.max(...zs) }
}

export function roomCenter(room: Room) {
  const b = roomBox(room)
  return { x: (b.minX + b.maxX) / 2, z: (b.minZ + b.maxZ) / 2 }
}

export function apartmentBounds(rooms: Room[]) {
  if (!rooms.length) return { minX: -300, maxX: 300, minZ: -300, maxZ: 300 }
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
  for (const r of rooms) {
    const b = roomBox(r)
    minX = Math.min(minX, b.minX); maxX = Math.max(maxX, b.maxX); minZ = Math.min(minZ, b.minZ); maxZ = Math.max(maxZ, b.maxZ)
  }
  return { minX, maxX, minZ, maxZ }
}

export function pointInPolygon(poly: Point[], x: Cm, z: Cm) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j]
    if ((a.z > z) !== (b.z > z) && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) inside = !inside
  }
  return inside
}

export function pointInRoom(room: Room, x: Cm, z: Cm) { return pointInPolygon(roomShape(room), x, z) }

/** Coins au sol d'un rectangle (w × d, cm) centré en (x,z) et tourné de `deg` autour de Y */
export function rectCorners(x: Cm, z: Cm, w: Cm, d: Cm, deg: number): Point[] {
  const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r)
  return [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]].map(([px, pz]) => ({ x: x + px * c + pz * s, z: z - px * s + pz * c }))
}

/** Vrai si tout le rectangle tient dans la pièce (tolérance 0,5 cm vers l'intérieur) */
export function rectInsideRoom(room: Room, x: Cm, z: Cm, w: Cm, d: Cm, deg: number): boolean {
  const poly = roomShape(room)
  const cx = x, cz = z
  return rectCorners(x, z, w, d, deg).every(p => {
    // on rentre légèrement le coin vers le centre pour tolérer le contact avec le mur
    const dx = cx - p.x, dz = cz - p.z, l = Math.hypot(dx, dz) || 1
    return pointInPolygon(poly, p.x + (dx / l) * 0.5, p.z + (dz / l) * 0.5)
  })
}
