import { describe, expect, it } from 'vitest'
import {
  CONTENT_RULES,
  collapseWhitespace,
  validateBody,
  validateDescription,
  validateLinkLabel,
  validateLinkUrl,
  validateName,
  validateTitle,
} from './contentRules'

describe('validateTitle', () => {
  it.each(['', 'ab', '   '])('rejects "%s"', (title) => expect(validateTitle(title)).not.toBeNull())

  it('accepts a trimmed title within the limits', () => expect(validateTitle('  Livros  ')).toBeNull())

  it('rejects a title above the limit', () =>
    expect(validateTitle('a'.repeat(CONTENT_RULES.titleMaxLength + 1))).not.toBeNull())
})

describe('validateBody', () => {
  it('requires some text', () => expect(validateBody('  \n ')).toBe('Escreva o conteúdo.'))

  it('rejects markdown above the limit', () =>
    expect(validateBody('a'.repeat(CONTENT_RULES.bodyMaxLength + 1))).toContain('limite'))

  it('accepts regular markdown', () => expect(validateBody('- **item**')).toBeNull())
})

describe('validateName', () => {
  it('collapses inner whitespace before measuring', () => expect(validateName('  T   I ')).toBeNull())

  it('rejects names that are too short', () => expect(validateName(' a ')).not.toBeNull())

  it('collapseWhitespace trims and squeezes spaces', () => expect(collapseWhitespace('  a   b  ')).toBe('a b'))
})

describe('validateLinkUrl', () => {
  it.each(['https://exemplo.com', 'http://exemplo.com/a?b=1', ' https://exemplo.com '])('accepts %s', (url) =>
    expect(validateLinkUrl(url)).toBeNull(),
  )

  it.each(['', 'www.exemplo.com', 'javascript:alert(1)', 'ftp://exemplo.com', '/relativo', 'https://'])(
    'rejects "%s"',
    (url) => expect(validateLinkUrl(url)).not.toBeNull(),
  )
})

describe('optional text limits', () => {
  it('rejects a long link label', () =>
    expect(validateLinkLabel('a'.repeat(CONTENT_RULES.linkLabelMaxLength + 1))).not.toBeNull())

  it('rejects a long image description', () =>
    expect(validateDescription('a'.repeat(CONTENT_RULES.descriptionMaxLength + 1))).not.toBeNull())

  it('accepts empty optional fields', () => {
    expect(validateLinkLabel('')).toBeNull()
    expect(validateDescription('')).toBeNull()
  })
})
