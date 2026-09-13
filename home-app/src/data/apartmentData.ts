import type { Apartment, Furniture, Opening, Room, Wall } from '../types'

/**
 * ─────────────────────────────────────────────────────────────────
 *  DONNÉES DE L'APPARTEMENT — source unique de vérité.
 *  Toutes les valeurs sont en CENTIMÈTRES.
 *  Repère : X ouest → est, Z nord → sud, origine (0,0) = coin nord-ouest
 *  intérieur du logement = coin nord-ouest du SÉJOUR prolongé jusqu'au
 *  niveau du mur nord des chambres (le balcon et le séjour partagent X = 0).
 *  Une pièce = coin nord-ouest + dimensions INTÉRIEURES. Les murs sont
 *  générés à l'extérieur de ces dimensions.
 *
 *  ÉTAT ACTUEL : reconstruit depuis le plan de l'architecte (sans cotes),
 *  échelle calée sur les surfaces réelles : chambre 2 = 10 m², chambre 1 = 12,7 m² (placard compris).
 *  ⇒ TOUT est `estimated: true` sauf : allège fenêtres 40 cm, seuil balcon
 *  5 cm, hauteur sous faux plafond SDE 225 cm (indiqués sur le plan).
 *  Remplace ces valeurs au fur et à mesure de tes relevés.
 * ─────────────────────────────────────────────────────────────────
 */

const EXT = 20   // mur extérieur / porteur (cm) — ESTIMATION
const PART = 10  // cloison (cm) — ESTIMATION
const H = 250    // hauteur sous plafond — ESTIMATION (non indiquée sur le plan)
const H_SDE = 225 // HSFP 2.25 indiqué sur le plan

const wall = (thickness = PART, openings: Opening[] = [], present = true): Wall => ({ present, thickness, openings })
const door = (id: string, offset: number, width = 83, height = 210): Opening => ({ id, type: 'door', offset, width, height, sill: 0, estimated: true })
const win = (id: string, offset: number, width: number, height = 175, sill = 40): Opening => ({ id, type: 'window', offset, width, height, sill, estimated: true, leaves: width > 120 ? 2 : 1 })

const rooms: Room[] = [
  {
    id: 'sejour', name: 'Séjour / Cuisine',
    // Boîte englobante (origin/width/depth) ; le contour réel est `shape`
    origin: { x: 0, z: 403 }, width: 480, depth: 689, height: H, floor: 'parquet',
    notes: 'Contour à 10 côtés : décroché du mur des chambres au nord, mur est qui descend le long du dégagement/WC, une diagonale, puis verticale jusqu\'au mur sud (pas de renfoncement à l\'entrée).',
    shape: [
      { x: 0, z: 403 },    // 0  NO (angle balcon)
      { x: 311, z: 403 },  // 1  fin du mur balcon
      { x: 311, z: 433 },  // 2  décroché (mur des chambres, plus épais)
      { x: 480, z: 433 },  // 3  NE (angle avec le dégagement)
      { x: 480, z: 753 },  // 4  bas du mur du dégagement / WC
      { x: 396, z: 848 },  // 5  fin de la 1re diagonale
      { x: 396, z: 1061 }, // 6  bas de la verticale
      { x: 353, z: 1061 }, // 7  petit mur horizontal vers la porte (décalé au nord de la ligne de porte)
      { x: 353, z: 1092 }, // 8  tout petit retour vertical qui rejoint le mur de la porte
      { x: 0, z: 1092 },   // 9  SO
    ],
    edgeWalls: [
      wall(EXT, [{ id: 'sej-pf', type: 'window', offset: 51, width: 207, height: 215, sill: 5, estimated: true, label: 'Double porte-fenêtre balcon', leaves: 2 }]), // 0→1 nord (balcon)
      wall(PART),                               // 1→2 décroché
      wall(PART),                               // 2→3 mur chambre 2
      wall(PART, [door('sej-dgt', 0)]),         // 3→4 est : porte vers le dégagement
      wall(PART),                               // 4→5 diagonale (WC)
      wall(EXT),                                // 5→6 mur vertical côté palier (masse de mur derrière)
      wall(EXT),                                // 6→7 petit mur horizontal
      wall(EXT),                                // 7→8 tout petit retour vertical
      wall(EXT, [door('sej-porte-paliere', 8, 90, 210)]), // 8→9 sud : porte palière juste à gauche du retour
      wall(EXT),                                // 9→0 ouest
    ],
  },
  {
    id: 'balcon', name: 'Balcon',
    origin: { x: 0, z: 223 }, width: 311, depth: 159, height: H, floor: 'concrete',
    notes: 'Garde-corps (pas de murs). Le mur sud est celui du séjour.',
    walls: { north: wall(PART, [], false), east: wall(PART, [], false), south: wall(PART, [], false), west: wall(PART, [], false) },
  },
  {
    id: 'chambre2', name: 'Chambre 2',
    origin: { x: 348, z: 0 }, width: 239, depth: 418, height: H, floor: 'parquet',
    walls: {
      north: wall(EXT, [win('ch2-fen-nord', 10, 191)]),
      east: wall(PART),
      south: wall(PART, [door('ch2-porte', 144)]),
      west: wall(EXT, [win('ch2-fen-ouest', 10, 191)]),
    },
  },
  {
    id: 'chambre1', name: 'Chambre 1',
    origin: { x: 600, z: 0 }, width: 282, depth: 418, height: H, floor: 'parquet',
    walls: {
      north: wall(EXT, [win('ch1-fen-nord', 50, 196)]),
      east: wall(EXT),
      south: wall(PART, [door('ch1-porte', 5), { id: 'ch1-pl', type: 'door', offset: 114, width: 154, height: 240, sill: 0, estimated: true, label: 'Placard' }]),
      west: wall(PART),
    },
  },
  {
    id: 'placard-ch1', name: 'Placard ch. 1',
    origin: { x: 714, z: 433 }, width: 168, depth: 55, height: H, floor: 'parquet',
    walls: { north: wall(PART, [], false), east: wall(EXT), south: wall(PART), west: wall(PART) },
  },
  {
    id: 'dgt', name: 'Dégagement',
    origin: { x: 491, z: 433 }, width: 223, depth: 161, height: H, floor: 'parquet',
    walls: {
      north: wall(PART, [door('dgt-ch2', 0), door('dgt-ch1', 109)]),
      east: wall(PART, [door('dgt-sde', 68)]),
      south: wall(PART, [door('dgt-wc', 22, 73)]),
      west: wall(PART, [door('dgt-sejour', 0)]),
    },
  },
  {
    id: 'wc', name: 'WC',
    origin: { x: 491, z: 594 }, width: 164, depth: 159, height: H, floor: 'tiles',
    walls: { north: wall(PART, [], false), east: wall(PART), south: wall(PART), west: wall(PART) },
  },
  {
    id: 'sde', name: 'Salle d\'eau',
    origin: { x: 714, z: 498 }, width: 168, depth: 254, height: H_SDE, floor: 'tiles',
    walls: { north: wall(PART), east: wall(EXT), south: wall(EXT), west: wall(PART, [], false) },
  },
]

// Équipements fixes visibles sur le plan (positions estimées)
const fixed: Furniture[] = [
  { id: 'radiateur-sejour', kind: 'radiator', name: 'Radiateur', width: 41, depth: 15, height: 106, position: { x: 285, y: 12, z: 411 }, rotation: 0, material: 'metal', color: '#f1f1ef', roomId: 'sejour', estimated: true },
  { id: 'compteur-elec', kind: 'cabinet', name: 'Gaine technique — compteur électrique', width: 60, depth: 42, height: 220, position: { x: 30, y: 0, z: 821 }, rotation: 0, material: 'paint', color: '#dedad2', roomId: 'sejour', estimated: true },
  { id: 'frigo', kind: 'fridge', name: 'Réfrigérateur', width: 60, depth: 65, height: 180, position: { x: 30, y: 0, z: 876 }, rotation: 0, material: 'metal', color: '#d3d5d7', roomId: 'sejour', estimated: true },
  { id: 'lave-vaisselle', kind: 'washer', name: 'Lave-vaisselle', width: 60, depth: 60, height: 85, position: { x: 30, y: 0, z: 938 }, rotation: 0, material: 'ceramic', color: '#e6e3dd', roomId: 'sejour', estimated: true },
  { id: 'plaques', kind: 'counter', name: 'Plan de travail — plaques', width: 60, depth: 60, height: 90, position: { x: 30, y: 0, z: 998 }, rotation: 0, material: 'ceramic', color: '#e6e3dd', roomId: 'sejour', estimated: true },
  { id: 'cuisine-evier', kind: 'counter', name: 'Plan de travail — évier', width: 129, depth: 60, height: 90, position: { x: 125, y: 0, z: 1062 }, rotation: 0, material: 'ceramic', color: '#e6e3dd', roomId: 'sejour', estimated: true },
  { id: 'cuisine-bloc', kind: 'cabinet', name: 'Meuble cuisine — bloc', width: 40, depth: 60, height: 90, position: { x: 212, y: 0, z: 1062 }, rotation: 0, material: 'ceramic', color: '#dad6cf', roomId: 'sejour', estimated: true },
  { id: 'wc-cuvette', kind: 'wc', name: 'WC', width: 41, depth: 67, height: 80, position: { x: 621, y: 0, z: 708 }, rotation: 0, material: 'ceramic', roomId: 'wc', estimated: true },
  { id: 'sde-lavabo', kind: 'sink', name: 'Lavabo', width: 62, depth: 46, height: 85, position: { x: 749, y: 0, z: 708 }, rotation: 0, material: 'ceramic', roomId: 'sde', estimated: true },
  { id: 'sde-douche', kind: 'shower', name: 'Douche', width: 92, depth: 92, height: 200, position: { x: 821, y: 0, z: 549 }, rotation: 0, material: 'glass', roomId: 'sde', estimated: true },
  { id: 'sde-ll', kind: 'washer', name: 'Lave-linge (placard)', width: 62, depth: 62, height: 85, position: { x: 745, y: 0, z: 722 }, rotation: 0, material: 'ceramic', color: '#f2f2f0', roomId: 'sde', estimated: true },
]

// Meubles réels (dimensions catalogue). Position initiale : à déplacer dans l'app.
const BESTA = { brand: 'IKEA', kind: 'cabinet' as const, width: 60, depth: 42, material: 'wood' as const, color: '#dccbb0', roomId: 'sejour' }
// Composition BESTÅ 240 cm contre le mur ouest du séjour (tournée de 90° : sa longueur suit le mur)
const realFurniture: Furniture[] = [
  { id: 'besta-1', name: 'BESTÅ caisson bas 1', ...BESTA, height: 38, position: { x: 21, y: 0, z: 450 }, rotation: 90 },
  { id: 'besta-2', name: 'BESTÅ caisson bas 2', ...BESTA, height: 38, position: { x: 21, y: 0, z: 510 }, rotation: 90 },
  { id: 'besta-3', name: 'BESTÅ caisson haut',  ...BESTA, height: 64, position: { x: 21, y: 0, z: 570 }, rotation: 90 },
  { id: 'besta-4', name: 'BESTÅ caisson bas 3', ...BESTA, height: 38, position: { x: 21, y: 0, z: 630 }, rotation: 90 },
  // Sweeek — îlot central Molene, plateau hévéa, corps MDF laqué noir (cotes officielles)
  { id: 'ilot-molene', name: 'Îlot Molene', brand: 'Sweeek', kind: 'island', width: 120, depth: 75, height: 90, material: 'paint', color: '#151515', position: { x: 200, y: 0, z: 850 }, rotation: 0, roomId: 'sejour' },
  // IKEA BISSA armoire à chaussures 2 casiers, motif chêne (vrai modèle 3D IKEA) — près de la porte palière
  { id: 'bissa', name: 'BISSA armoire à chaussures', brand: 'IKEA', kind: 'cabinet', model: 'ikea/bissa.glb', width: 49, depth: 28, height: 93, material: 'wood', position: { x: 200, y: 0, z: 1051 }, rotation: 0, roomId: 'sejour' },
  // IKEA PINNTORP : table à rabat (pas de modèle 3D chez IKEA → procédural, 67→124 cm) + 4 chaises (vrai modèle IKEA)
  { id: 'pinntorp-table', name: 'PINNTORP table à rabat', brand: 'IKEA', kind: 'table', variant: 'dropleaf', width: 124, depth: 75, height: 75, material: 'wood', color: '#c99d63', position: { x: 380, y: 0, z: 520 }, rotation: 0, roomId: 'sejour' },
  { id: 'pinntorp-chaise-1', name: 'PINNTORP chaise', brand: 'IKEA', kind: 'chair', model: 'ikea/pinntorp_chaise.glb', width: 42, depth: 50, height: 90, material: 'wood', position: { x: 350, y: 0, z: 458 }, rotation: 0, roomId: 'sejour' },
  { id: 'pinntorp-chaise-2', name: 'PINNTORP chaise', brand: 'IKEA', kind: 'chair', model: 'ikea/pinntorp_chaise.glb', width: 42, depth: 50, height: 90, material: 'wood', position: { x: 410, y: 0, z: 458 }, rotation: 0, roomId: 'sejour' },
  { id: 'pinntorp-chaise-3', name: 'PINNTORP chaise', brand: 'IKEA', kind: 'chair', model: 'ikea/pinntorp_chaise.glb', width: 42, depth: 50, height: 90, material: 'wood', position: { x: 350, y: 0, z: 582 }, rotation: 180, roomId: 'sejour' },
  { id: 'pinntorp-chaise-4', name: 'PINNTORP chaise', brand: 'IKEA', kind: 'chair', model: 'ikea/pinntorp_chaise.glb', width: 42, depth: 50, height: 90, material: 'wood', position: { x: 410, y: 0, z: 582 }, rotation: 180, roomId: 'sejour' },
  // IKEA HYLLIS étagère intérieur/extérieur (vrai modèle 3D IKEA)
  { id: 'hyllis', name: 'HYLLIS étagère', brand: 'IKEA', kind: 'shelf', model: 'ikea/hyllis.glb', matte: true, width: 61, depth: 28, height: 74, material: 'metal', position: { x: 454, y: 0, z: 500 }, rotation: 90, roomId: 'sejour' },
  // IKEA HOLMERUD table d'appoint (vrai modèle 3D IKEA)
  { id: 'holmerud', name: 'HOLMERUD table d\'appoint', brand: 'IKEA', kind: 'table', model: 'ikea/holmerud_appoint.glb', width: 81, depth: 31, height: 52, material: 'wood', position: { x: 360, y: 0, z: 620 }, rotation: 0, roomId: 'sejour' },
  // Maisons du Monde PLAY 2 places, bleu Majorelle — cotes officielles (193 × 94 × 74, assise 43)
  { id: 'canape-play', name: 'Canapé PLAY 2 places', brand: 'Maisons du Monde', kind: 'sofa', variant: 'play', rev: 1, width: 193, depth: 94, height: 74, seatHeight: 42, material: 'fabric', color: '#1e3c8f', position: { x: 240, y: 0, z: 620 }, rotation: 0, roomId: 'sejour' },
]

export const apartment: Apartment = {
  name: 'Appartement',
  defaults: { wallThickness: PART, ceilingHeight: H },
  rooms,
  configurations: [{ id: 'current', name: 'Actuel', furniture: [...fixed, ...realFurniture] }],
}
