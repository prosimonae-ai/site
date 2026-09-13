import type { Cm } from '../types'

/** centimètres → unités Three.js (mètres). Seule conversion autorisée dans le projet. */
export const m = (cm: Cm): number => cm / 100
export const cm = (meters: number): Cm => Math.round(meters * 100)
export const fmtM = (cmValue: Cm, digits = 2): string => `${(cmValue / 100).toFixed(digits)} m`
export const fmtArea = (cm2: number): string => `${(cm2 / 10000).toFixed(1)} m²`
