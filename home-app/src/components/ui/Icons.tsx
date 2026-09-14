import type { SVGProps } from 'react'

const base = (props: SVGProps<SVGSVGElement>) => ({ width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, ...props })

export const I = {
  cursor: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M5 3l14 8-6 2-3 7z" /></svg>,
  move: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4" /></svg>,
  ruler: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2" /></svg>,
  sofa: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M4 11V8a2 2 0 012-2h12a2 2 0 012 2v3M3 12a1 1 0 011-1h16a1 1 0 011 1v5H3zM5 17v2M19 17v2" /></svg>,
  sun: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>,
  eye: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>,
  cog: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></svg>,
  chevron: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M6 9l6 6 6-6" /></svg>,
  close: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>,
  rotate: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M21 12a9 9 0 11-3-6.7" /><path d="M21 3v6h-6" /></svg>,
  copy: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 012-2h10" /></svg>,
  trash: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>,
  undo: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M9 14L4 9l5-5" /><path d="M4 9h11a5 5 0 010 10h-3" /></svg>,
  redo: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M15 14l5-5-5-5" /><path d="M20 9H9a5 5 0 000 10h3" /></svg>,
  lock: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>,
  unlock: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 017.5-2" /></svg>,
  save: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></svg>,
  map: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M9 4l6 2 6-2v14l-6 2-6-2-6 2V6zM9 4v14M15 6v14" /></svg>,
}
