export type CellState = 'EMPTY' | 'SOFT_MARK' | 'TREE' | 'HARD_ROOT'

export interface Position {
  row: number
  col: number
}

export interface Cell {
  row: number
  col: number
  biomeId: number
  state: CellState
  /** Si c'est une HARD_ROOT, coordonnées de l'arbre source */
  originTree?: Position
}

export interface Grid {
  size: number
  cells: Cell[][]
}

export type DifficultyRating = 'easy' | 'medium' | 'hard'

export interface PuzzleDefinition {
  id: string
  size: number
  /** Matrice size x size où chaque cellule contient son identifiant de biome (0 à size - 1) */
  biomes: number[][]
  /** Coordonnées des N arbres formant l'unique solution */
  solution: Position[]
  difficultyRating: DifficultyRating
  deductionSteps: number
}

export interface InvariantViolation {
  type: 'ROW' | 'COL' | 'BIOME' | 'NEIGHBOR'
  positions: Position[]
  message: string
}

export interface ValidationResult {
  isValid: boolean
  violations: InvariantViolation[]
}

export interface AutoRootOptions {
  autoRootsRowCol: boolean
  autoRootsNeighbors: boolean
  autoRootsBiome: boolean
}
