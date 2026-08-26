export interface BiomeTheme {
  id: number
  name: string
  color: string
  bgClass: string
  borderClass: string
  patternId: string
}

export const BIOME_THEMES: BiomeTheme[] = [
  {
    id: 0,
    name: 'Forêt Primaire',
    color: '#15803d',
    bgClass: 'bg-emerald-950/80',
    borderClass: 'border-emerald-600/40',
    patternId: 'pattern-dots'
  },
  {
    id: 1,
    name: 'Bruyère Sauvage',
    color: '#7e22ce',
    bgClass: 'bg-purple-950/80',
    borderClass: 'border-purple-600/40',
    patternId: 'pattern-stripes'
  },
  {
    id: 2,
    name: 'Clairière Dorée',
    color: '#a16207',
    bgClass: 'bg-amber-950/80',
    borderClass: 'border-amber-600/40',
    patternId: 'pattern-waves'
  },
  {
    id: 3,
    name: 'Source Céleste',
    color: '#0369a1',
    bgClass: 'bg-sky-950/80',
    borderClass: 'border-sky-600/40',
    patternId: 'pattern-crosshatch'
  },
  {
    id: 4,
    name: 'Sous-Bois d’Automne',
    color: '#c2410c',
    bgClass: 'bg-orange-950/80',
    borderClass: 'border-orange-600/40',
    patternId: 'pattern-zigzag'
  },
  {
    id: 5,
    name: 'Bambouseraie',
    color: '#047857',
    bgClass: 'bg-teal-950/80',
    borderClass: 'border-teal-600/40',
    patternId: 'pattern-rings'
  },
  {
    id: 6,
    name: 'Brume Minérale',
    color: '#475569',
    bgClass: 'bg-slate-900/80',
    borderClass: 'border-slate-500/40',
    patternId: 'pattern-horizontal'
  },
  {
    id: 7,
    name: 'Dune Solaire',
    color: '#b45309',
    bgClass: 'bg-yellow-950/80',
    borderClass: 'border-yellow-600/40',
    patternId: 'pattern-triangles'
  },
  {
    id: 8,
    name: 'Fleur Tropicale',
    color: '#be123c',
    bgClass: 'bg-rose-950/80',
    borderClass: 'border-rose-600/40',
    patternId: 'pattern-grid'
  },
  {
    id: 9,
    name: 'Sauge Zen',
    color: '#3f6212',
    bgClass: 'bg-lime-950/80',
    borderClass: 'border-lime-600/40',
    patternId: 'pattern-scales'
  },
  {
    id: 10,
    name: 'Nébuleuse Végétale',
    color: '#4338ca',
    bgClass: 'bg-indigo-950/80',
    borderClass: 'border-indigo-600/40',
    patternId: 'pattern-stars'
  },
  {
    id: 11,
    name: 'Thé Matcha',
    color: '#65a30d',
    bgClass: 'bg-green-950/80',
    borderClass: 'border-green-600/40',
    patternId: 'pattern-diamonds'
  }
]
