import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore, useFurniture, useRooms } from '../../store/useAppStore'
import { roomStats } from '../../hooks/useApartmentMetrics'
import { roomCenter } from '../../three/helpers/geometry'
import { fmtArea, fmtM } from '../../three/units'
import { I } from './Icons'
import { MATERIAL_SPECS } from '../../three/materials'
import type { Furniture, MaterialKey, Room } from '../../types'

const MATERIAL_LABELS: Record<MaterialKey, string> = { paint: 'Peinture', 'paint-warm': 'Peinture chaude', parquet: 'Parquet', tiles: 'Carrelage', concrete: 'Béton', wood: 'Bois', 'wood-dark': 'Bois foncé', metal: 'Métal', fabric: 'Tissu', glass: 'Verre', ceramic: 'Céramique', plant: 'Végétal' }

export function InfoPanel() {
  const s = useAppStore()
  const rooms = useRooms()
  const furniture = useFurniture()
  const room = rooms.find(r => r.id === s.selectedRoomId)
  const item = furniture.find(f => f.id === s.selectedFurnitureId)
  const multi = s.selectedFurnitureIds.length > 1
  const open = s.panelOpen && (item || room)

  return (
    <AnimatePresence>
      {open && (
        <motion.aside key={multi ? 'multi' : item?.id ?? room?.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.2 }}
          className="pointer-events-auto absolute right-3 top-16 bottom-20 sm:bottom-auto w-[min(88vw,300px)] glass rounded-2xl p-4 overflow-y-auto max-h-[70vh]">
          <button onClick={() => s.toggle('panelOpen')} className="absolute right-3 top-3 text-ink-3 hover:text-ink"><I.close /></button>
          {multi ? <MultiInfo /> : item ? <FurnitureInfo item={item} /> : room ? <RoomInfo room={room} /> : null}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function MultiInfo() {
  const s = useAppStore()
  const furniture = useFurniture()
    const items = furniture.filter(f => s.selectedFurnitureIds.includes(f.id))
    return (
      <>
        <div className="label">Sélection</div>
        <h2 className="text-[17px] font-semibold text-ink mt-0.5">{items.length} meubles</h2>
        <ul className="mt-2 text-[12px] text-ink-2 max-h-40 overflow-y-auto">
          {items.map(f => <li key={f.id} className="flex justify-between gap-2 py-0.5"><span className="truncate">{f.locked ? '🔒 ' : ''}{f.name}</span><span className="text-ink-3 shrink-0">{f.width}×{f.depth}×{f.height}</span></li>)}
        </ul>
        <p className="text-[11px] text-ink-3 mt-2">Glisse n'importe lequel pour tout déplacer. Maj + clic pour ajouter ou retirer.</p>
        <div className="flex gap-1.5 mt-4">
          <button onClick={() => s.setLockedSelected(!items.every(f => f.locked))} className={`tb-btn border flex-1 ${items.every(f => f.locked) ? 'on' : 'border-line'}`} title="Verrouiller / déverrouiller">{items.every(f => f.locked) ? <I.lock /> : <I.unlock />}</button>
          <button onClick={() => s.rotateSelected(90)} className="tb-btn border border-line flex-1" title="Tourner 90°"><I.rotate /></button>
          <button onClick={s.duplicateSelected} className="tb-btn border border-line flex-1" title="Dupliquer"><I.copy /></button>
          <button onClick={s.removeSelected} className="tb-btn border border-red-200 text-red-700 hover:bg-red-50 hover:text-red-700 flex-1" title="Supprimer"><I.trash /></button>
        </div>
        <button onClick={() => s.selectFurniture(null)} className="tb-btn border border-line w-full mt-1.5">Désélectionner</button>
      </>
    )
  }

function RoomInfo({ room }: { room: Room }) {
  const s = useAppStore()
  const furniture = useFurniture()
    const st = roomStats(room, furniture.filter(f => f.roomId === room.id).length)
    return (
      <>
        <div className="label">Pièce</div>
        <h2 className="text-[17px] font-semibold text-ink mt-0.5">{room.name}</h2>
        {room.demo && <p className="text-[11px] text-amber-700 mt-1">Pièce de démonstration — à remplacer par tes mesures.</p>}
        <div className="text-[28px] font-light text-ink mt-3 tracking-tight">{fmtArea(st.area)}</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-[12px]">
          <Stat l="Dimensions" v={`${(room.width / 100).toFixed(2)} × ${(room.depth / 100).toFixed(2)} m`} />
          <Stat l="Hauteur" v={fmtM(room.height)} />
          <Stat l="Fenêtres" v={String(st.windows)} />
          <Stat l="Portes" v={String(st.doors)} />
          <Stat l="Mobilier" v={`${st.furnitureCount} élément${st.furnitureCount > 1 ? 's' : ''}`} />
          <Stat l="Sol" v={MATERIAL_LABELS[room.floor]} />
        </div>
        <div className="flex gap-1.5 mt-4">
          <button onClick={() => s.focusRoom(room.id)} className="tb-btn on flex-1">Cadrer</button>
          <button onClick={() => { s.setMode('visit'); s.focusRoom(room.id) }} className="tb-btn border border-line flex-1">Visiter</button>
        </div>
        <div className="flex gap-1.5 mt-1.5">
          {s.hiddenRoomIds.length ? <button onClick={s.showAllRooms} className="tb-btn border border-line flex-1">Tout afficher</button>
            : <button onClick={() => { s.isolateRoom(room.id); s.focusRoom(room.id) }} className="tb-btn border border-line flex-1">Isoler cette pièce</button>}
        </div>
      </>
    )
  }

function FurnitureInfo({ item }: { item: Furniture }) {
  const s = useAppStore()
  const rooms = useRooms()
  const all = useFurniture()
    const mark = { onFocus: () => s.beginChange() }
    return (
      <>
        <div className="label">{item.decoration ? 'Décoration' : 'Meuble'}</div>
        <input className="text-[17px] font-semibold text-ink mt-0.5 bg-transparent outline-none w-full" value={item.name} onChange={e => s.updateFurniture(item.id, { name: e.target.value })} />
        <input className="text-[12px] text-ink-3 bg-transparent outline-none w-full" placeholder="Marque" value={item.brand ?? ''} onChange={e => s.updateFurniture(item.id, { brand: e.target.value })} />
        {item.estimated && <p className="text-[11px] text-amber-700 mt-1">Dimensions estimées.</p>}
        <div className="label mt-4 mb-1">Dimensions (cm)</div>
        <div className="grid grid-cols-3 gap-1.5">
          {(['width', 'depth', 'height'] as const).map(k => (
            <label key={k} className="block"><span className="text-[10px] text-ink-3">{k === 'width' ? 'L' : k === 'depth' ? 'P' : 'H'}</span><NumField value={item[k]} min={1} onCommit={v => s.updateFurniture(item.id, { [k]: v })} {...mark} /></label>
          ))}
        </div>
        <div className="label mt-3 mb-1">Pièce</div>
        <select className="field" value={item.roomId ?? ''} onChange={e => { const r = rooms.find(x => x.id === e.target.value); if (!r) return; s.beginChange(); const c = roomCenter(r); s.updateFurniture(item.id, { roomId: r.id, position: { ...item.position, x: c.x, z: c.z } }) }}>
          {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <div className="label mt-3 mb-1">Lié à</div>
        <select className="field" value={item.parentId ?? ''} onChange={e => { s.beginChange(); s.updateFurniture(item.id, { parentId: e.target.value || undefined }) }}>
          <option value="">— aucun (indépendant) —</option>
          {all.filter(f => f.id !== item.id && f.roomId === item.roomId && !isDescendant(all, f.id, item.id)).map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        {item.parentId && <p className="text-[11px] text-ink-3 mt-1">Suit les déplacements et rotations de son support ; reste réglable seul (hauteur, décalage).</p>}
        <div className="label mt-3 mb-1">Position (cm) · rotation · hauteur sol</div>
        <div className="grid grid-cols-3 gap-1.5">
          <label className="block"><span className="text-[10px] text-ink-3">X</span><NumField value={item.position.x} onCommit={v => s.updateFurniture(item.id, { position: { ...item.position, x: v } })} {...mark} /></label>
          <label className="block"><span className="text-[10px] text-ink-3">Z</span><NumField value={item.position.z} onCommit={v => s.updateFurniture(item.id, { position: { ...item.position, z: v } })} {...mark} /></label>
          <label className="block"><span className="text-[10px] text-ink-3">°</span><NumField value={item.rotation} onCommit={v => s.updateFurniture(item.id, { rotation: v })} {...mark} /></label>
          <label className="block"><span className="text-[10px] text-ink-3">Y (sol)</span><NumField value={item.position.y} min={0} onCommit={v => s.updateFurniture(item.id, { position: { ...item.position, y: v } })} {...mark} /></label>
        </div>
        <div className="label mt-3 mb-1">Matériau</div>
        <div className="flex flex-wrap gap-1">
          {(Object.keys(MATERIAL_SPECS) as MaterialKey[]).filter(k => !['paint', 'paint-warm', 'parquet', 'tiles', 'concrete'].includes(k)).map(k => (
            <button key={k} onClick={() => s.updateFurniture(item.id, { material: k, color: undefined })} className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] ${item.material === k ? 'border-ink text-ink' : 'border-line text-ink-2'}`}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: MATERIAL_SPECS[k].color }} />{MATERIAL_LABELS[k]}
            </button>
          ))}
          <label className="flex items-center gap-1.5 rounded-full border border-line px-2 py-1 text-[11px] text-ink-2 cursor-pointer">
            <input type="color" className="w-4 h-4 p-0 border-0 bg-transparent" value={item.color ?? MATERIAL_SPECS[item.material].color} onChange={e => s.updateFurniture(item.id, { color: e.target.value })} />Couleur
          </label>
        </div>
        {item.model?.includes('raskog') && (
          <label className="flex items-center justify-between mt-3 text-[12px] text-ink-2"><span>Couvercle bois sur le dessus</span>
            <button onClick={() => { s.beginChange(); s.updateFurniture(item.id, { variant: item.variant === 'lid' ? undefined : 'lid' }) }} className={`w-8 h-[18px] rounded-full relative transition-colors ${item.variant === 'lid' ? 'bg-ink' : 'bg-black/15'}`}><span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all ${item.variant === 'lid' ? 'left-[16px]' : 'left-[2px]'}`} /></button>
          </label>
        )}
        {item.model?.includes('pinntorp_table') && (
          <label className="flex items-center justify-between mt-3 text-[12px] text-ink-2"><span>Abattants dépliés (124 cm)</span>
            <button onClick={() => { s.beginChange(); const open = item.variant !== 'dropleaf-open'; s.updateFurniture(item.id, { variant: open ? 'dropleaf-open' : undefined, width: open ? 124 : 69 }) }} className={`w-8 h-[18px] rounded-full relative transition-colors ${item.variant === 'dropleaf-open' ? 'bg-ink' : 'bg-black/15'}`}><span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all ${item.variant === 'dropleaf-open' ? 'left-[16px]' : 'left-[2px]'}`} /></button>
          </label>
        )}
        {item.model && (
          <label className="flex items-center justify-between mt-3 text-[12px] text-ink-2"><span>Rendu mat (sans reflets)</span>
            <button onClick={() => s.updateFurniture(item.id, { matte: !item.matte })} className={`w-8 h-[18px] rounded-full relative transition-colors ${item.matte ? 'bg-ink' : 'bg-black/15'}`}><span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all ${item.matte ? 'left-[16px]' : 'left-[2px]'}`} /></button>
          </label>
        )}
        {item.locked && <p className="text-[11px] text-ink-3 mt-3">Verrouillé : ce meuble ne peut plus être déplacé, tourné ni supprimé.</p>}
        <div className="flex gap-1.5 mt-4">
          <button onClick={() => s.updateFurniture(item.id, { locked: !item.locked })} className={`tb-btn border flex-1 ${item.locked ? 'on' : 'border-line'}`} title={item.locked ? 'Déverrouiller' : 'Verrouiller'}>{item.locked ? <I.lock /> : <I.unlock />}</button>
          <button onClick={() => { if (item.locked) return; s.beginChange(); s.updateFurniture(item.id, { rotation: (item.rotation + 90) % 360 }) }} disabled={item.locked} className="tb-btn border border-line flex-1 disabled:opacity-30" title="Tourner 90°"><I.rotate /></button>
          <button onClick={() => s.duplicateFurniture(item.id)} className="tb-btn border border-line flex-1" title="Dupliquer"><I.copy /></button>
          <button onClick={() => s.removeFurniture(item.id)} disabled={item.locked} className="tb-btn border border-red-200 text-red-700 hover:bg-red-50 hover:text-red-700 flex-1 disabled:opacity-30" title="Supprimer"><I.trash /></button>
        </div>
      </>
    )
  }

/** Champ numérique : applique en direct si la valeur est valide, sinon à la validation (Entrée / sortie du champ). */
function NumField({ value, min, onCommit, onFocus }: { value: number; min?: number; onCommit: (v: number) => void; onFocus?: () => void }) {
  const [text, setText] = useState(String(value))
  useEffect(() => { setText(String(value)) }, [value])
  const commit = (t: string) => { const n = Number(t.replace(',', '.')); if (t.trim() === '' || Number.isNaN(n)) return false; const v = Math.round(min !== undefined ? Math.max(min, n) : n); if (v !== value) onCommit(v); return true }
  // Poignée « scrub » : glisser horizontalement pour faire défiler la valeur (1 unité / 2 px ; Maj ×10 ; Alt ×0,1)
  const scrub = useRef<{ x: number; start: number; acc: number } | null>(null)
  const onScrubDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    e.preventDefault(); onFocus?.()
    scrub.current = { x: e.clientX, start: value, acc: 0 }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    document.body.style.cursor = 'ew-resize'
  }
  const onScrubMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!scrub.current) return
    const mult = e.shiftKey ? 10 : e.altKey ? 0.1 : 1
    const delta = ((e.clientX - scrub.current.x) / 2) * mult
    const v = Math.round(min !== undefined ? Math.max(min, scrub.current.start + delta) : scrub.current.start + delta)
    if (v !== value) onCommit(v)
  }
  const onScrubUp = (e: React.PointerEvent<HTMLSpanElement>) => { scrub.current = null; (e.currentTarget as Element).releasePointerCapture(e.pointerId); document.body.style.cursor = '' }
  return (
    <div className="flex items-center rounded-lg border border-line bg-white/80 focus-within:border-ink/40">
      <span onPointerDown={onScrubDown} onPointerMove={onScrubMove} onPointerUp={onScrubUp} onPointerCancel={onScrubUp} title="Glisser pour faire varier (Maj ×10, Alt ×0,1)"
        className="select-none cursor-ew-resize px-1.5 text-[10px] text-ink-3 hover:text-ink touch-none">⇔</span>
      <input type="text" inputMode="decimal" className="w-full min-w-0 bg-transparent py-1.5 pr-2 text-[12px] text-ink outline-none" value={text} onFocus={onFocus}
        onChange={e => { setText(e.target.value); commit(e.target.value) }}
        onBlur={() => { if (!commit(text)) setText(String(value)) }}
        onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); const d = (e.key === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? 10 : 1); onCommit(Math.round(min !== undefined ? Math.max(min, value + d) : value + d)) } }} />
    </div>
  )
}

/** vrai si `id` descend (directement ou non) de `ancestor` — pour interdire les liaisons circulaires */
function isDescendant(all: Furniture[], id: string, ancestor: string): boolean {
  let cur = all.find(f => f.id === id); let guard = 0
  while (cur?.parentId && guard++ < 20) { if (cur.parentId === ancestor) return true; cur = all.find(f => f.id === cur!.parentId) }
  return false
}

const Stat = ({ l, v }: { l: string; v: string }) => <div><div className="text-[10px] text-ink-3">{l}</div><div className="text-ink font-medium">{v}</div></div>
