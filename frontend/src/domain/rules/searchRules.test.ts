import { describe, expect, it } from 'vitest'
import { validateSearchTerm } from './searchRules'

describe('validateSearchTerm', () => {
  it('treats a blank term as "no search"', () => expect(validateSearchTerm('   ')).toBeNull())

  it('rejects a single character', () => expect(validateSearchTerm('a')).toContain('2 a 100'))

  it('rejects a term above 100 characters', () => expect(validateSearchTerm('a'.repeat(101))).not.toBeNull())

  it('accepts a regular term', () => expect(validateSearchTerm('álgebra relacional')).toBeNull())
})
