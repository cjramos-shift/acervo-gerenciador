const UNITS = ['B', 'KB', 'MB', 'GB'] as const
const STEP = 1024

export function formatFileSize(sizeInBytes: number): string {
  let value = sizeInBytes
  let unitIndex = 0

  while (value >= STEP && unitIndex < UNITS.length - 1) {
    value /= STEP
    unitIndex++
  }

  const text = unitIndex === 0 ? String(value) : value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
  return `${text} ${UNITS[unitIndex]}`
}
