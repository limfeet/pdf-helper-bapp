// src/features/points/calc.ts
export const PAGES_PER_POINT = 10

export function estimatePoints(totalPages: number) {
  return Math.max(1, Math.ceil(totalPages / PAGES_PER_POINT))
}
