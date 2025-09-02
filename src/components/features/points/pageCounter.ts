// src/features/points/pageCounter.ts
import { PDFDocument } from 'pdf-lib'

export async function countPagesClient(files: File[]): Promise<number> {
  let total = 0
  for (const f of files) {
    const buf = await f.arrayBuffer()
    const pdf = await PDFDocument.load(buf) // 워커 불필요
    total += pdf.getPageCount()
  }
  return total
}
