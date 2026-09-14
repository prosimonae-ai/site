import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apartment as apartmentData } from '../data/apartmentData'
import type { Apartment, Configuration, Furniture, GridStep, TimeOfDay, Tool, ViewMode, WallsDisplay } from '../types'

interface MeasurePoint { x: number; y: number; z: number }
export interface Snapshot { id: string; name: string; at: number; configurations: Configuration[]; activeConfigId: string }

interface AppState {
  apartment: Apartment
  activeConfigId: string
  mode: ViewMode
  tool: Tool
  selectedRoomId: string | null
  selectedFurnitureId: string | null
  /** sélection multiple (Maj + clic) ; selectedFurnitureId = dernier sélectionné */
  selectedFurnitureIds: string[]
  focusRequest: { roomId: string | null; nonce: number }
  timeOfDay: TimeOfDay
  wallsDisplay: WallsDisplay
  showMiniMap: boolean
  showDimensions: boolean
  gridStep: GridStep
  debug: boolean
  measure: MeasurePoint[]
  panelOpen: boolean
  isDragging: boolean
  history: Configuration[][]
  future: Configuration[][]
  hiddenRoomIds: string[]
  clipboard: Furniture[]
  showShortcuts: boolean
  snapshots: Snapshot[]
  lastSavedAt: number | null
  /** objets définis dans le code que l'utilisateur a supprimés (ne sont plus recréés au chargement) */
  deletedIds: string[]
  /** dernière écriture automatique dans la mémoire du navigateur */
  autoSavedAt: number | null

  setMode: (m: ViewMode) => void
  setTool: (t: Tool) => void
  selectRoom: (id: string | null) => void
  selectFurniture: (id: string | null, additive?: boolean) => void
  removeSelected: () => void
  setLockedSelected: (locked: boolean) => void
  copySelected: () => void
  paste: () => void
  selectAll: () => void
  nudgeSelected: (dx: number, dz: number) => void
  toggleShortcuts: () => void
  /** remet un objet du code supprimé par l'utilisateur */
  restoreDeleted: (id: string) => void
  saveSnapshot: (name?: string) => void
  restoreSnapshot: (id: string) => void
  deleteSnapshot: (id: string) => void
  exportJson: () => string
  importJson: (json: string) => boolean
  rotateSelected: (deg: number) => void
  duplicateSelected: () => void
  focusRoom: (id: string | null) => void
  setTimeOfDay: (t: TimeOfDay) => void
  setWallsDisplay: (w: WallsDisplay) => void
  toggle: (k: 'showMiniMap' | 'showDimensions' | 'debug' | 'panelOpen') => void
  setGridStep: (g: GridStep) => void
  toggleRoomVisible: (id: string) => void
  isolateRoom: (id: string) => void
  showAllRooms: () => void
  setDragging: (d: boolean) => void
  addMeasurePoint: (p: MeasurePoint) => void
  clearMeasure: () => void

  furniture: () => Furniture[]
  /** enregistre un point de retour avant une modification (drag, saisie…) */
  beginChange: () => void
  undo: () => void
  redo: () => void
  updateFurniture: (id: string, patch: Partial<Furniture>) => void
  addFurniture: (f: Furniture) => void
  removeFurniture: (id: string) => void
  duplicateFurniture: (id: string) => void
  setActiveConfig: (id: string) => void
  addConfiguration: (name: string) => void
  resetFurniture: () => void
}

/** anciens objets définis dans le code puis supprimés : à purger des sauvegardes */
const RETIRED_IDS = new Set(['raskog-couvercle'])

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

/** Applique `patch` au meuble `id` et répercute déplacement / rotation sur les meubles qui lui sont liés (récursif). */
function applyWithChildren(list: Furniture[], id: string, patch: Partial<Furniture>, depth = 0): Furniture[] {
  const src = list.find(f => f.id === id); if (!src || depth > 8) return list // garde-fou contre les liaisons circulaires
  const next = { ...src, ...patch }
  let out = list.map(f => (f.id === id ? next : f))
  const dx = next.position.x - src.position.x, dz = next.position.z - src.position.z, dy = next.position.y - src.position.y
  const drot = next.rotation - src.rotation
  if (!dx && !dz && !dy && !drot) return out
  const rad = (drot * Math.PI) / 180, c = Math.cos(rad), sn = Math.sin(rad)
  for (const child of list.filter(f => f.parentId === id)) {
    // rotation de l'enfant autour du centre du parent, puis translation
    const ox = child.position.x - src.position.x, oz = child.position.z - src.position.z
    const rx = ox * c + oz * sn, rz = -ox * sn + oz * c
    const childPatch: Partial<Furniture> = { position: { x: src.position.x + dx + rx, y: child.position.y + dy, z: src.position.z + dz + rz }, rotation: ((child.rotation + drot) % 360 + 360) % 360 }
    if (child.id !== id) out = applyWithChildren(out, child.id, childPatch, depth + 1)
  }
  return out
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      apartment: clone(apartmentData),
      activeConfigId: apartmentData.configurations[0]?.id ?? 'current',
      mode: 'orbit',
      tool: 'select',
      selectedRoomId: null,
      selectedFurnitureId: null,
      selectedFurnitureIds: [],
      focusRequest: { roomId: null, nonce: 0 },
      timeOfDay: 'day',
      wallsDisplay: 'auto',
      showMiniMap: true,
      showDimensions: false,
      gridStep: 1,
      debug: false,
      measure: [],
      panelOpen: false,
      isDragging: false,
      history: [],
      future: [],
      hiddenRoomIds: [],
      clipboard: [],
      showShortcuts: false,
      snapshots: [],
      lastSavedAt: null,
      deletedIds: [],
      autoSavedAt: null,

      setMode: (mode) => set({ mode, measure: [] }),
      setTool: (tool) => set({ tool, measure: [] }),
      selectRoom: (id) => set({ selectedRoomId: id, selectedFurnitureId: null, selectedFurnitureIds: [], panelOpen: !!id }),
      selectFurniture: (id, additive = false) => set(s => {
        if (!id) return { selectedFurnitureId: null, selectedFurnitureIds: [], panelOpen: false }
        let ids = additive ? (s.selectedFurnitureIds.includes(id) ? s.selectedFurnitureIds.filter(x => x !== id) : [...s.selectedFurnitureIds, id]) : [id]
        if (!ids.length) ids = []
        const last = ids.includes(id) ? id : ids[ids.length - 1] ?? null
        return { selectedFurnitureIds: ids, selectedFurnitureId: last, selectedRoomId: last ? s.apartment.configurations.find(c => c.id === s.activeConfigId)?.furniture.find(f => f.id === last)?.roomId ?? s.selectedRoomId : s.selectedRoomId, panelOpen: !!last }
      }),
      removeSelected: () => { const ids = get().selectedFurnitureIds.filter(id => !get().furniture().find(f => f.id === id)?.locked); if (!ids.length) return; get().beginChange(); const gone = get().furniture().filter(f => ids.includes(f.id) || (f.parentId && ids.includes(f.parentId))).map(f => f.id); set(s => ({ apartment: { ...s.apartment, configurations: s.apartment.configurations.map(c => c.id !== s.activeConfigId ? c : { ...c, furniture: c.furniture.filter(f => !gone.includes(f.id)) }) }, deletedIds: [...new Set([...s.deletedIds, ...gone])], selectedFurnitureId: null, selectedFurnitureIds: [], panelOpen: false })) },
      copySelected: () => { const ids = get().selectedFurnitureIds; set({ clipboard: clone(get().furniture().filter(f => ids.includes(f.id))) }) },
      paste: () => {
        const src = get().clipboard; if (!src.length) return
        get().beginChange()
        const copies = src.map((f, i) => ({ ...clone(f), id: `f-${Date.now().toString(36)}-${i}`, locked: false, position: { ...f.position, x: f.position.x + 30, z: f.position.z + 30 } }))
        set(s => ({ apartment: { ...s.apartment, configurations: s.apartment.configurations.map(c => c.id !== s.activeConfigId ? c : { ...c, furniture: [...c.furniture, ...copies] }) }, selectedFurnitureIds: copies.map(c => c.id), selectedFurnitureId: copies[copies.length - 1].id, panelOpen: true, clipboard: copies.map(c => ({ ...c })) }))
      },
      selectAll: () => set(s => {
        const hidden = s.hiddenRoomIds
        const roomId = s.selectedRoomId
        const all = get().furniture().filter(f => (!f.roomId || !hidden.includes(f.roomId)) && (!roomId || f.roomId === roomId))
        return { selectedFurnitureIds: all.map(f => f.id), selectedFurnitureId: all[all.length - 1]?.id ?? null, panelOpen: all.length > 0 }
      }),
      nudgeSelected: (dx, dz) => { const ids = get().selectedFurnitureIds; if (!ids.length) return; get().beginChange(); ids.forEach(id => { const f = get().furniture().find(x => x.id === id); if (f && !f.locked && !(f.parentId && ids.includes(f.parentId))) get().updateFurniture(id, { position: { ...f.position, x: f.position.x + dx, z: f.position.z + dz } }) }) },
      toggleShortcuts: () => set(s => ({ showShortcuts: !s.showShortcuts })),
      restoreDeleted: (id) => {
        const code = apartmentData.configurations.flatMap(c => c.furniture).find(f => f.id === id); if (!code) return
        get().beginChange()
        set(s => ({ deletedIds: s.deletedIds.filter(x => x !== id), apartment: { ...s.apartment, configurations: s.apartment.configurations.map(c => c.id !== s.activeConfigId ? c : { ...c, furniture: c.furniture.some(f => f.id === id) ? c.furniture : [...c.furniture, clone(code)] }) }, selectedFurnitureIds: [id], selectedFurnitureId: id, panelOpen: true }))
      },
      saveSnapshot: (name) => set(s => {
        const at = Date.now()
        const snap: Snapshot = { id: `snap-${at.toString(36)}`, name: name || new Date(at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }), at, configurations: clone(s.apartment.configurations), activeConfigId: s.activeConfigId }
        return { snapshots: [snap, ...s.snapshots].slice(0, 30), lastSavedAt: at }
      }),
      restoreSnapshot: (id) => { const snap = get().snapshots.find(x => x.id === id); if (!snap) return; get().beginChange(); set(s => ({ apartment: { ...s.apartment, configurations: clone(snap.configurations) }, activeConfigId: snap.activeConfigId, selectedFurnitureId: null, selectedFurnitureIds: [], panelOpen: false })) },
      deleteSnapshot: (id) => set(s => ({ snapshots: s.snapshots.filter(x => x.id !== id) })),
      exportJson: () => JSON.stringify({ app: 'maison', version: 1, exportedAt: new Date().toISOString(), configurations: get().apartment.configurations, activeConfigId: get().activeConfigId, snapshots: get().snapshots }, null, 2),
      importJson: (json) => {
        try {
          const d = JSON.parse(json)
          if (!Array.isArray(d.configurations)) return false
          get().beginChange()
          set(s => ({ apartment: { ...s.apartment, configurations: d.configurations }, activeConfigId: d.configurations.some((c: Configuration) => c.id === d.activeConfigId) ? d.activeConfigId : d.configurations[0].id, snapshots: Array.isArray(d.snapshots) ? d.snapshots : s.snapshots, selectedFurnitureId: null, selectedFurnitureIds: [], panelOpen: false }))
          return true
        } catch { return false }
      },
      setLockedSelected: (locked) => { const ids = get().selectedFurnitureIds; if (!ids.length) return; set(s => ({ apartment: { ...s.apartment, configurations: s.apartment.configurations.map(c => c.id !== s.activeConfigId ? c : { ...c, furniture: c.furniture.map(f => ids.includes(f.id) ? { ...f, locked } : f) }) } })) },
      rotateSelected: (deg) => { const ids = get().selectedFurnitureIds; if (!ids.length) return; get().beginChange(); ids.forEach(id => { const f = get().furniture().find(x => x.id === id); if (f && !f.locked && !(f.parentId && ids.includes(f.parentId))) get().updateFurniture(id, { rotation: (f.rotation + deg + 360) % 360 }) }) },
      duplicateSelected: () => {
        const ids = get().selectedFurnitureIds; if (!ids.length) return
        get().beginChange()
        const copies = get().furniture().filter(f => ids.includes(f.id)).map((f, i) => ({ ...clone(f), id: `f-${Date.now().toString(36)}-${i}`, position: { ...f.position, x: f.position.x + 30, z: f.position.z + 30 } }))
        set(s => ({ apartment: { ...s.apartment, configurations: s.apartment.configurations.map(c => c.id !== s.activeConfigId ? c : { ...c, furniture: [...c.furniture, ...copies] }) }, selectedFurnitureIds: copies.map(c => c.id), selectedFurnitureId: copies[copies.length - 1].id, panelOpen: true }))
      },
      focusRoom: (roomId) => set(s => ({ focusRequest: { roomId, nonce: s.focusRequest.nonce + 1 }, selectedRoomId: roomId, selectedFurnitureId: null, panelOpen: !!roomId })),
      setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
      setWallsDisplay: (wallsDisplay) => set({ wallsDisplay }),
      toggle: (k) => set(s => ({ [k]: !s[k] }) as Partial<AppState>),
      setGridStep: (gridStep) => set({ gridStep }),
      toggleRoomVisible: (id) => set(s => ({ hiddenRoomIds: s.hiddenRoomIds.includes(id) ? s.hiddenRoomIds.filter(r => r !== id) : [...s.hiddenRoomIds, id] })),
      isolateRoom: (id) => set(s => ({ hiddenRoomIds: s.apartment.rooms.filter(r => r.id !== id).map(r => r.id), selectedRoomId: id })),
      showAllRooms: () => set({ hiddenRoomIds: [] }),
      setDragging: (isDragging) => set({ isDragging }),
      addMeasurePoint: (p) => set(s => ({ measure: s.measure.length >= 2 ? [p] : [...s.measure, p] })),
      clearMeasure: () => set({ measure: [] }),

      furniture: () => get().apartment.configurations.find(c => c.id === get().activeConfigId)?.furniture ?? [],
      beginChange: () => set(s => ({ history: [...s.history.slice(-49), clone(s.apartment.configurations)], future: [] })),
      undo: () => set(s => {
        const prev = s.history[s.history.length - 1]; if (!prev) return {}
        return { history: s.history.slice(0, -1), future: [...s.future, clone(s.apartment.configurations)], apartment: { ...s.apartment, configurations: prev }, selectedFurnitureId: null, selectedFurnitureIds: [], panelOpen: false }
      }),
      redo: () => set(s => {
        const next = s.future[s.future.length - 1]; if (!next) return {}
        return { future: s.future.slice(0, -1), history: [...s.history, clone(s.apartment.configurations)], apartment: { ...s.apartment, configurations: next }, selectedFurnitureId: null, selectedFurnitureIds: [], panelOpen: false }
      }),
      updateFurniture: (id, patch) => set(s => ({ apartment: { ...s.apartment, configurations: s.apartment.configurations.map(c => c.id !== s.activeConfigId ? c : { ...c, furniture: applyWithChildren(c.furniture, id, patch) }) } })),
      addFurniture: (f) => { get().beginChange(); set(s => ({ apartment: { ...s.apartment, configurations: s.apartment.configurations.map(c => c.id !== s.activeConfigId ? c : { ...c, furniture: [...c.furniture, f] }) }, selectedFurnitureId: f.id, selectedFurnitureIds: [f.id], panelOpen: true })) },
      removeFurniture: (id) => { if (get().furniture().find(f => f.id === id)?.locked) return; get().beginChange(); const gone = get().furniture().filter(f => f.id === id || f.parentId === id).map(f => f.id); set(s => ({ apartment: { ...s.apartment, configurations: s.apartment.configurations.map(c => c.id !== s.activeConfigId ? c : { ...c, furniture: c.furniture.filter(f => !gone.includes(f.id)) }) }, deletedIds: [...new Set([...s.deletedIds, ...gone])], selectedFurnitureId: null, selectedFurnitureIds: [], panelOpen: false })) },
      duplicateFurniture: (id) => {
        const src = get().furniture().find(f => f.id === id); if (!src) return
        const nid = `f-${Date.now().toString(36)}`
        get().addFurniture({ ...clone(src), id: nid, position: { ...src.position, x: src.position.x + 30, z: src.position.z + 30 } })
        get().furniture().filter(f => f.parentId === id).forEach((ch, i) => { get().addFurniture({ ...clone(ch), id: `${nid}-${i}`, parentId: nid, position: { ...ch.position, x: ch.position.x + 30, z: ch.position.z + 30 } }) })
        set({ selectedFurnitureIds: [nid], selectedFurnitureId: nid })
      },
      setActiveConfig: (activeConfigId) => set({ activeConfigId, selectedFurnitureId: null }),
      addConfiguration: (name) => set(s => {
        const base = s.apartment.configurations.find(c => c.id === s.activeConfigId)
        const id = `cfg-${Date.now().toString(36)}`
        return { apartment: { ...s.apartment, configurations: [...s.apartment.configurations, { id, name, furniture: clone(base?.furniture ?? []) }] }, activeConfigId: id }
      }),
      resetFurniture: () => set({ apartment: clone(apartmentData), activeConfigId: apartmentData.configurations[0]?.id ?? 'current', selectedFurnitureId: null, selectedFurnitureIds: [], deletedIds: [] }),
    }),
    {
      name: 'home-app-v1',
      // Les pièces viennent toujours du code (apartmentData) ; seuls meubles/configs/préférences sont persistés.
      partialize: (s) => ({ configurations: s.apartment.configurations, activeConfigId: s.activeConfigId, timeOfDay: s.timeOfDay, wallsDisplay: s.wallsDisplay, showMiniMap: s.showMiniMap, showDimensions: s.showDimensions, gridStep: s.gridStep, hiddenRoomIds: s.hiddenRoomIds, snapshots: s.snapshots, lastSavedAt: s.lastSavedAt, deletedIds: s.deletedIds }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState> & { configurations?: Apartment['configurations'] }
        // Fusion sauvegarde ↔ code : les objets définis dans apartmentData.ts existent toujours ;
        // ce que l'utilisateur a modifié (position, rotation, dimensions, couleur, nom) est conservé,
        // le code n'impose que forme / modèle / matériau — sauf si sa `rev` est plus récente.
        const codeCfgs = clone(apartmentData.configurations)
        const deleted = new Set(p.deletedIds ?? [])
        const codeItems = new Map(codeCfgs.flatMap(c => c.furniture).map(f => [f.id, f]))
        const mergeItem = (code: Furniture, saved?: Furniture): Furniture => {
          if (!saved || (code.rev ?? 0) > (saved.rev ?? 0)) return code
          return { ...code, position: saved.position, rotation: saved.rotation, width: saved.width, depth: saved.depth, height: saved.height, color: saved.color ?? code.color, name: saved.name, brand: saved.brand ?? code.brand, roomId: saved.roomId ?? code.roomId, locked: saved.locked, matte: saved.matte ?? code.matte, variant: saved.variant ?? code.variant, parentId: saved.parentId === undefined ? code.parentId : saved.parentId || undefined }
        }
        const configurations = (p.configurations?.length ? p.configurations : codeCfgs).map(c => {
          const fromCode = codeCfgs.find(cc => cc.id === c.id)
          const fixed = (fromCode ? fromCode.furniture : codeCfgs[0].furniture).filter(f => !deleted.has(f.id)).map(f => mergeItem(f, c.furniture.find(x => x.id === f.id)))
          return { ...c, furniture: [...fixed, ...c.furniture.filter(f => !codeItems.has(f.id) && !RETIRED_IDS.has(f.id))] }
        })
        return { ...current, ...p, apartment: { ...clone(apartmentData), configurations }, activeConfigId: configurations.some(c => c.id === p.activeConfigId) ? p.activeConfigId! : configurations[0].id }
      },
    },
  ),
)

// Après hydratation : on réécrit tout de suite l'état fusionné, et on suit les écritures pour l'indicateur
useAppStore.persist.onFinishHydration(() => { useAppStore.setState({ autoSavedAt: Date.now() }) })
useAppStore.subscribe((s, prev) => { if (s.apartment.configurations !== prev.apartment.configurations) useAppStore.setState({ autoSavedAt: Date.now() }) })
// Plusieurs onglets : on se resynchronise dès qu'un autre onglet écrit, pour ne jamais réécrire un état périmé
if (typeof window !== 'undefined') window.addEventListener('storage', e => { if (e.key === 'home-app-v1' && e.newValue) useAppStore.persist.rehydrate() })

export const useRooms = () => useAppStore(s => s.apartment.rooms)
/** pièces réellement affichées */
export const useVisibleRooms = () => { const rooms = useRooms(); const hidden = useAppStore(s => s.hiddenRoomIds); return useMemo(() => rooms.filter(r => !hidden.includes(r.id)), [rooms, hidden]) }
export const useFurniture = () => useAppStore(s => s.apartment.configurations.find(c => c.id === s.activeConfigId)?.furniture ?? EMPTY)
const EMPTY: Furniture[] = []
