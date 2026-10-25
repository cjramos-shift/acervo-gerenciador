export const SEARCH_RULES = { minLength: 2, maxLength: 100 } as const

export function validateSearchTerm(term: string): string | null {
  const length = term.trim().length
  if (length === 0) return null

  const { minLength, maxLength } = SEARCH_RULES
  return length < minLength || length > maxLength
    ? `Digite de ${minLength} a ${maxLength} caracteres para buscar.`
    : null
}
