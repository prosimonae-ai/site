import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore, useRooms } from '../../store/useAppStore'
import { useApartmentMetrics } from '../../hooks/useApartmentMetrics'
import { fmtArea } from '../../three/units'
import { FURNITURE_PRESETS, fromPreset } from '../../data/furnitureData'
import { roomCenter } from '../../three/helpers/geometry'
import { I } from './Icons'
import { InfoPanel } from './InfoPanel'
import { MiniMap } from './MiniMap'
import type { TimeOfDay, Tool, ViewMode, WallsDisplay, GridStep } from '../../types'

/* ─── Popover générique (ferme au clic extérieur) ─── */
function Popover({ button, children, align = 'right' }: { button: (open: boolean) => ReactNode; children: ReactNode; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    window.addEventListener('pointerdown', h); return () => window.removeEventListener('pointerdown', h)
  }, [open])
  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(o => !o)}>{button(open)}</div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.16 }}
            className={`glass absolute top-11 ${align === 'right' ? 'right-0' : 'left-0'} min-w-52 rounded-xl p-2 z-30`}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex items-center justify-between gap-3 px-2 py-1.5"><span className="text-[12px] text-ink-2">{label}</span>{children}</div>
)
const Seg = <T extends string | number>({ value, options, onChange }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void }) => (
  <div className="flex rounded-lg bg-black/[.05] p-0.5">
    {options.map(o => <button key={o.v} onClick={() => onChange(o.v)} className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${value === o.v ? 'bg-white text-ink shadow-sm' : 'text-ink-3 hover:text-ink'}`}>{o.l}</button>)}
  </div>
)
const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`w-8 h-[18px] rounded-full relative transition-colors ${on ? 'bg-ink' : 'bg-black/15'}`}><span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all ${on ? 'left-[16px]' : 'left-[2px]'}`} /></button>
)

/* ─── Interface flottante ─── */
export function Overlay() {
  const s = useAppStore()
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      const st = useAppStore.getState()
      const mod = e.metaKey || e.ctrlKey, key = e.key.toLowerCase()
      if (mod && key === 'z') { e.preventDefault(); e.shiftKey ? st.redo() : st.undo(); return }
      if (mod && key === 'c') { if (st.selectedFurnitureIds.length) { e.preventDefault(); st.copySelected() } return }
      if (mod && key === 'v') { if (st.clipboard.length) { e.preventDefault(); st.paste() } return }
      if (mod && key === 'd') { if (st.selectedFurnitureIds.length) { e.preventDefault(); st.duplicateSelected() } return }
      if (mod && key === 'a') { e.preventDefault(); st.selectAll(); return }
      if (mod) return
      if (e.key === 'Escape') { if (st.showShortcuts) { st.toggleShortcuts(); return } st.selectFurniture(null); st.selectRoom(null); st.setTool('select'); return }
      if (e.key === '?' || (e.shiftKey && e.key === '/')) { st.toggleShortcuts(); return }
      if ((e.key === 'Delete' || e.key === 'Backspace') && st.selectedFurnitureIds.length) { e.preventDefault(); st.removeSelected(); return }
      if (st.selectedFurnitureIds.length && e.key.startsWith('Arrow')) {
        e.preventDefault()
        const step = e.shiftKey ? 10 : (st.gridStep || 1)
        st.nudgeSelected(e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0, e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0)
        return
      }
      if (key === 'r' && st.selectedFurnitureIds.length) { st.rotateSelected(e.shiftKey ? -90 : 90); return }
      if (key === 'l' && st.selectedFurnitureIds.length) { const items = st.furniture().filter(f => st.selectedFurnitureIds.includes(f.id)); st.setLockedSelected(!items.every(f => f.locked)); return }
      if (key === '1') st.setMode('orbit'); else if (key === '2') st.setMode('plan'); else if (key === '3') st.setMode('visit')
      else if (key === 'v') st.setTool('select'); else if (key === 'm') st.setTool('measure'); else if (key === 'f') st.setTool(st.tool === 'furniture' ? 'select' : 'furniture')
      else if (key === 'h') st.toggle('showDimensions')
    }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }, [])
  const rooms = useRooms()
  const metrics = useApartmentMetrics()
  const selectedRoom = rooms.find(r => r.id === s.selectedRoomId)

  const tools: { t: Tool; l: string; icon: ReactNode }[] = [
    { t: 'select', l: 'Sélection', icon: <I.cursor /> }, { t: 'move', l: 'Déplacer', icon: <I.move /> },
    { t: 'measure', l: 'Mesurer', icon: <I.ruler /> }, { t: 'furniture', l: 'Meubles', icon: <I.sofa /> },
  ]
  const modes: { v: ViewMode; l: string }[] = [{ v: 'orbit', l: '3D' }, { v: 'plan', l: 'Plan' }, { v: 'visit', l: 'Visite' }]

  const addPreset = (p: typeof FURNITURE_PRESETS[number]) => {
    const room = selectedRoom ?? rooms[0]
    const c = room ? roomCenter(room) : { x: 0, z: 0 }
    s.addFurniture(fromPreset(p, c.x, c.z, room?.id))
    s.setTool('select')
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10 select-none">
      {/* Haut gauche : fil d'Ariane + sélecteur de pièce */}
      <div className="pointer-events-auto absolute left-3 top-3 flex items-center gap-2">
        <Popover align="left" button={(open) => (
          <button className="glass rounded-xl px-3.5 py-2 text-left flex items-center gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[.14em] text-ink-3 font-medium">{s.apartment.name}</div>
              <div className="text-[13px] font-semibold text-ink leading-tight">{selectedRoom?.name ?? 'Vue générale'}</div>
            </div>
            <I.chevron style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }} className="text-ink-3" />
          </button>
        )}>
          <button onClick={() => { s.selectRoom(null); s.setMode(s.mode) }} className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] hover:bg-black/[.05] ${!s.selectedRoomId ? 'font-semibold' : 'text-ink-2'}`}>Appartement</button>
          {rooms.map(r => (
            <button key={r.id} onClick={() => s.focusRoom(r.id)} className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] hover:bg-black/[.05] flex justify-between ${s.selectedRoomId === r.id ? 'font-semibold' : 'text-ink-2'}`}>
              <span>{r.name}{r.demo && <span className="ml-1.5 text-[9px] uppercase tracking-wider text-amber-700">demo</span>}</span><span className="text-ink-3">{fmtArea(r.width * r.depth)}</span>
            </button>
          ))}
        </Popover>
        <span className="chip hidden sm:inline-flex">{fmtArea(metrics.area)} · {metrics.roomCount} pièce{metrics.roomCount > 1 ? 's' : ''}</span>
      </div>

      {/* Haut centre : modes */}
      <div className="pointer-events-auto absolute left-1/2 top-3 -translate-x-1/2 glass rounded-full p-1 flex">
        {modes.map(mo => <button key={mo.v} onClick={() => s.setMode(mo.v)} className={`tb-btn ${s.mode === mo.v ? 'on' : ''}`}>{mo.l}</button>)}
      </div>

      {/* Haut droite : éclairage / affichage / réglages / aide */}
      <div className="pointer-events-auto absolute right-3 top-3 flex gap-1.5">
        <button onClick={s.toggleShortcuts} className={`glass h-9 w-9 rounded-full flex items-center justify-center text-ink-2 hover:text-ink text-[13px] font-semibold ${s.showShortcuts ? 'text-ink' : ''}`} title="Raccourcis clavier (?)">?</button>
        <Popover button={(o) => <button className={`glass h-9 w-9 rounded-full flex items-center justify-center text-ink-2 hover:text-ink ${o ? 'text-ink' : ''}`} title="Éclairage"><I.sun /></button>}>
          <div className="px-2 py-1 label">Moment de la journée</div>
          <Seg<TimeOfDay> value={s.timeOfDay} onChange={s.setTimeOfDay} options={[{ v: 'morning', l: 'Matin' }, { v: 'day', l: 'Jour' }, { v: 'evening', l: 'Soir' }, { v: 'night', l: 'Nuit' }]} />
        </Popover>
        <Popover button={(o) => <button className={`glass h-9 w-9 rounded-full flex items-center justify-center text-ink-2 hover:text-ink ${o ? 'text-ink' : ''}`} title="Affichage"><I.eye /></button>}>
          <Row label="Murs"><Seg<WallsDisplay> value={s.wallsDisplay} onChange={s.setWallsDisplay} options={[{ v: 'solid', l: 'Pleins' }, { v: 'auto', l: 'Coupés' }, { v: 'ghost', l: 'Transp.' }, { v: 'hidden', l: 'Cachés' }]} /></Row>
          <Row label="Cotations"><Toggle on={s.showDimensions} onClick={() => s.toggle('showDimensions')} /></Row>
          <Row label="Mini-plan"><Toggle on={s.showMiniMap} onClick={() => s.toggle('showMiniMap')} /></Row>
          <div className="border-t border-line my-1" />
          <div className="flex items-center justify-between px-2 pt-1"><span className="label">Pièces affichées</span>{s.hiddenRoomIds.length > 0 && <button onClick={s.showAllRooms} className="text-[11px] text-accent font-medium">Tout afficher</button>}</div>
          {rooms.map(r => (
            <div key={r.id} className="flex items-center justify-between gap-3 px-2 py-1">
              <span className={`text-[12px] ${s.hiddenRoomIds.includes(r.id) ? 'text-ink-3' : 'text-ink'}`}>{r.name}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => s.isolateRoom(r.id)} className="text-[10px] text-ink-3 hover:text-ink">seule</button>
                <Toggle on={!s.hiddenRoomIds.includes(r.id)} onClick={() => s.toggleRoomVisible(r.id)} />
              </div>
            </div>
          ))}
        </Popover>
        <Popover button={(o) => <button className={`glass h-9 w-9 rounded-full flex items-center justify-center text-ink-2 hover:text-ink ${o ? 'text-ink' : ''}`} title="Réglages"><I.cog /></button>}>
          <Row label="Grille"><Seg<GridStep> value={s.gridStep} onChange={s.setGridStep} options={[{ v: 0, l: 'Off' }, { v: 1, l: '1' }, { v: 5, l: '5' }, { v: 10, l: '10' }, { v: 25, l: '25' }]} /></Row>
          <div className="px-2 pt-2 pb-1 label">Configuration</div>
          {s.apartment.configurations.map(c => (
            <button key={c.id} onClick={() => s.setActiveConfig(c.id)} className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] hover:bg-black/[.05] ${s.activeConfigId === c.id ? 'font-semibold' : 'text-ink-2'}`}>{c.name} <span className="text-ink-3">· {c.furniture.length}</span></button>
          ))}
          <button onClick={() => { const n = prompt('Nom de la configuration', `Option ${String.fromCharCode(64 + s.apartment.configurations.length)}`); if (n) s.addConfiguration(n) }} className="w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] text-ink-2 hover:bg-black/[.05]">+ Dupliquer en nouvelle option</button>
          <div className="border-t border-line my-1" />
          <Row label="Mode développeur"><Toggle on={s.debug} onClick={() => s.toggle('debug')} /></Row>
          <button onClick={() => { if (confirm('Réinitialiser les meubles et configurations ?')) s.resetFurniture() }} className="w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] text-red-700 hover:bg-red-50">Réinitialiser</button>
        </Popover>
      </div>

      {/* Bas centre : outils + annuler / rétablir */}
      <div className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="glass rounded-full p-1 flex">
          <button onClick={s.undo} disabled={!s.history.length} className="tb-btn disabled:opacity-30" title="Annuler (⌘Z)"><I.undo /></button>
          <button onClick={s.redo} disabled={!s.future.length} className="tb-btn disabled:opacity-30" title="Rétablir (⌘⇧Z)"><I.redo /></button>
        </div>
        <div className="glass rounded-full p-1 flex">
          {tools.map(t => <button key={t.t} onClick={() => s.setTool(t.t)} className={`tb-btn ${s.tool === t.t ? 'on' : ''}`} title={t.l}>{t.icon}<span className="hidden sm:inline">{t.l}</span></button>)}
        </div>
      </div>

      {/* Catalogue de meubles */}
      <AnimatePresence>
        {s.tool === 'furniture' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.18 }}
            className="pointer-events-auto absolute bottom-18 left-1/2 -translate-x-1/2 glass rounded-2xl p-2 w-[min(92vw,560px)]">
            <div className="flex items-center justify-between px-2 pb-1"><span className="label">Ajouter dans {selectedRoom?.name ?? rooms[0]?.name ?? '—'}</span><span className="text-[10px] text-ink-3">volumes réels (cm)</span></div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 max-h-[38vh] overflow-y-auto">
              {FURNITURE_PRESETS.map(p => (
                <button key={p.name} onClick={() => addPreset(p)} className="text-left rounded-lg px-2.5 py-2 hover:bg-black/[.05]">
                  <div className="text-[12px] font-medium text-ink">{p.name}</div>
                  <div className="text-[10px] text-ink-3">{p.width} × {p.depth} × {p.height}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aide contextuelle */}
      <div className="pointer-events-none absolute bottom-4 left-3 hidden sm:flex flex-col gap-1 text-[11px] text-ink-3">
        {s.mode === 'visit' && <span><span className="kbd">Z Q S D</span> se déplacer · glisser pour regarder</span>}
        {s.tool === 'measure' && <span>{s.measure.length < 2 ? `Clique ${s.measure.length === 0 ? 'un premier' : 'un second'} point` : 'Clique pour recommencer'}</span>}
        {s.mode === 'orbit' && s.tool === 'select' && <span>Glisser : tourner · <span className="kbd">Maj</span> + glisser ou clic droit : déplacer · molette : zoom vers le curseur · <span className="kbd">Z Q S D</span> / flèches : déplacer la vue</span>}
      </div>

      <AnimatePresence>
        {s.showShortcuts && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.16 }}
            className="pointer-events-auto absolute right-3 top-14 glass rounded-2xl p-4 w-[min(92vw,340px)] z-30">
            <div className="flex items-center justify-between mb-2"><span className="label">Raccourcis clavier</span><button onClick={s.toggleShortcuts} className="text-ink-3 hover:text-ink"><I.close /></button></div>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[12px] text-ink-2">
              {([
                ['⌘Z / ⌘⇧Z', 'Annuler / rétablir'], ['⌘C / ⌘V', 'Copier / coller la sélection'], ['⌘D', 'Dupliquer'], ['⌘A', 'Tout sélectionner (dans la pièce sélectionnée)'],
                ['Maj + clic', 'Ajouter / retirer de la sélection'], ['Flèches', 'Déplacer la sélection (pas de la grille · Maj = 10 cm)'], ['R / Maj+R', 'Tourner 90° / −90°'], ['L', 'Verrouiller / déverrouiller'],
                ['Suppr', 'Supprimer'], ['Échap', 'Désélectionner / quitter l\'outil'], ['1 · 2 · 3', 'Vue 3D · Plan · Visite'], ['V · M · F', 'Sélection · Mesurer · Meubles'], ['H', 'Cotations'],
                ['Z Q S D', 'Déplacer la caméra (sans sélection)'], ['Maj + glisser', 'Déplacer la vue'], ['?', 'Cette aide'],
              ] as [string, string][]).map(([k, d]) => <div key={k} className="contents"><span className="kbd whitespace-nowrap">{k}</span><span>{d}</span></div>)}
            </div>
            <p className="text-[10px] text-ink-3 mt-3">Sur PC, ⌘ = Ctrl.</p>
          </motion.div>
        )}
      </AnimatePresence>
      <InfoPanel />
      {s.showMiniMap && <MiniMap />}
    </div>
  )
}
