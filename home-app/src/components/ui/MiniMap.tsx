import { useAppStore, useRooms } from '../../store/useAppStore'
import { apartmentBounds, roomCenter, roomEdges, roomShape } from '../../three/helpers/geometry'

/** Plan 2D minimaliste : pièces, ouvertures, pièce sélectionnée. */
export function MiniMap() {
  const rooms = useRooms()
  const selected = useAppStore(s => s.selectedRoomId)
  const hidden = useAppStore(s => s.hiddenRoomIds)
  const focusRoom = useAppStore(s => s.focusRoom)
  const b = apartmentBounds(rooms)
  const pad = 40
  const w = b.maxX - b.minX + pad * 2, h = b.maxZ - b.minZ + pad * 2
  const W = 150, H = Math.max(80, Math.round(W * h / w))

  return (
    <div className="pointer-events-auto absolute bottom-4 right-3 glass rounded-xl p-2 hidden sm:block">
      <svg width={W} height={H} viewBox={`${b.minX - pad} ${b.minZ - pad} ${w} ${h}`} className="block">
        {rooms.map(r => {
          const c = roomCenter(r)
          const pts = roomShape(r).map(p => `${p.x},${p.z}`).join(' ')
          return (
            <g key={r.id} onClick={() => focusRoom(r.id)} className="cursor-pointer" opacity={hidden.includes(r.id) ? 0.25 : 1}>
              <polygon points={pts} fill={selected === r.id ? 'rgba(45,90,61,.18)' : 'rgba(20,20,18,.05)'} stroke={selected === r.id ? '#2d5a3d' : '#141412'} strokeWidth={selected === r.id ? 6 : 4} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
              {roomEdges(r).flatMap(e => e.wall.openings.map(o => {
                const ux = (e.b.x - e.a.x) / e.length, uz = (e.b.z - e.a.z) / e.length
                const x1 = e.a.x + ux * o.offset, z1 = e.a.z + uz * o.offset, x2 = x1 + ux * o.width, z2 = z1 + uz * o.width
                return <line key={o.id} x1={x1} y1={z1} x2={x2} y2={z2} stroke={o.type === 'window' ? '#7fb3d5' : '#f4f3f0'} strokeWidth={8} />
              }))}
              <text x={c.x} y={c.z} textAnchor="middle" dominantBaseline="middle" fontSize={Math.min(r.width, r.depth) * 0.16} fill="#6b6964" fontFamily="Inter, sans-serif" fontWeight={500}>{r.name.replace(/\s*\(.*\)/, '').replace(' / Cuisine', '')}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
