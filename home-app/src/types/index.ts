/**
 * Convention de coordonnées (ne change jamais) :
 *  X = gauche → droite (est positif), Y = hauteur, Z = avant → arrière (sud positif).
 *  Origine globale (0,0,0) = coin nord-ouest de l'appartement, au sol.
 *  Toutes les mesures sont stockées en CENTIMÈTRES (telles que relevées) ;
 *  la conversion en mètres (1 unité Three.js = 1 m) se fait uniquement via three/units.ts.
 */
export type Cm = number
export type Side = 'north' | 'east' | 'south' | 'west'
export const SIDES: Side[] = ['north', 'east', 'south', 'west']

export type MaterialKey =
  | 'paint' | 'paint-warm' | 'parquet' | 'tiles' | 'concrete'
  | 'wood' | 'wood-dark' | 'metal' | 'fabric' | 'glass' | 'ceramic' | 'plant'

export interface Opening {
  id: string
  type: 'door' | 'window'
  /** distance depuis le début du mur (cm). Début = coin ouest pour nord/sud, coin nord pour est/ouest */
  offset: Cm
  width: Cm
  height: Cm
  /** hauteur d'allège pour une fenêtre (bas de la fenêtre), 0 pour une porte */
  sill: Cm
  /** valeur temporaire non mesurée */
  estimated?: boolean
  label?: string
  /** nombre de vantaux (fenêtre / porte-fenêtre) */
  leaves?: number
}

export interface Wall {
  present: boolean
  thickness: Cm
  openings: Opening[]
  material?: MaterialKey
}

export interface Point { x: Cm; z: Cm }

export interface Room {
  id: string
  name: string
  /** coin nord-ouest de la pièce, dimensions INTÉRIEURES (= boîte englobante si `shape` est défini) */
  origin: { x: Cm; z: Cm }
  width: Cm   // est-ouest
  depth: Cm   // nord-sud
  height: Cm
  floor: MaterialKey
  /** pièce rectangulaire : 4 murs nommés */
  walls?: Record<Side, Wall>
  /**
   * pièce non rectangulaire : contour intérieur, points dans le sens horaire vu du dessus
   * (nord = haut). L'arête i va de shape[i] à shape[i+1] ; son mur est edgeWalls[i] et
   * les offsets de ses ouvertures partent de shape[i].
   */
  shape?: Point[]
  edgeWalls?: Wall[]
  color?: string
  /** pièce de démonstration à remplacer par de vraies mesures */
  demo?: boolean
  notes?: string
}

export type FurnitureKind = 'box' | 'cabinet' | 'fridge' | 'sofa' | 'bed' | 'table' | 'desk' | 'chair' | 'radiator' | 'plant' | 'tv' | 'shelf' | 'counter' | 'wc' | 'sink' | 'shower' | 'washer' | 'island'

export interface Furniture {
  id: string
  name: string
  brand?: string
  /** forme procédurale utilisée quand aucun modèle 3D n'est fourni */
  kind?: FurnitureKind
  /** modèle glTF dans public/models/ (ex. 'sofa_02/sofa_02_1k.gltf'), mis à l'échelle des cotes */
  model?: string
  /** incrémenter pour forcer la valeur du code par-dessus la sauvegarde locale de l'utilisateur */
  rev?: number
  /** hauteur d'assise (cm) pour les canapés / fauteuils procéduraux */
  seatHeight?: Cm
  /** variante de dessin procédural (ex. 'play' pour le canapé PLAY Maisons du Monde) */
  variant?: string
  /** verrouillé : ni déplacement, ni rotation, ni suppression */
  locked?: boolean
  /** rendu mat : les matériaux du modèle 3D ne reflètent pas l'environnement */
  matte?: boolean
  width: Cm
  depth: Cm
  height: Cm
  /** centre au sol, repère global (cm) ; y = surélévation */
  position: { x: Cm; y: Cm; z: Cm }
  /** rotation autour de Y en degrés */
  rotation: number
  material: MaterialKey
  color?: string
  roomId?: string
  decoration?: boolean
  estimated?: boolean
}

export interface Configuration {
  id: string
  name: string
  furniture: Furniture[]
}

export interface Apartment {
  name: string
  rooms: Room[]
  configurations: Configuration[]
  /** dimensions par défaut */
  defaults: { wallThickness: Cm; ceilingHeight: Cm }
}

export type ViewMode = 'orbit' | 'plan' | 'visit'
export type Tool = 'select' | 'move' | 'measure' | 'furniture'
export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night'
export type WallsDisplay = 'solid' | 'auto' | 'ghost' | 'hidden'
export type GridStep = 0 | 1 | 5 | 10 | 25
