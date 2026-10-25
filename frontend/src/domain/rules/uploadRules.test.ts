import { describe, expect, it } from 'vitest'
import { UPLOAD_RULES, validateAttachmentFile, validateImageFile } from './uploadRules'

describe('validateImageFile', () => {
  it('accepts a png within the size limit', () => expect(validateImageFile({ name: 'Foto.PNG', size: 1024 })).toBeNull())

  it.each(['desenho.svg', 'script.exe', 'semextensao'])('rejects %s', (name) =>
    expect(validateImageFile({ name, size: 10 })).toContain('Tipo não permitido'))

  it('rejects an image above 5 MB', () =>
    expect(validateImageFile({ name: 'a.png', size: UPLOAD_RULES.maxImageBytes + 1 })).toContain('5 MB'))

  it('rejects an empty file', () => expect(validateImageFile({ name: 'a.png', size: 0 })).toContain('vazio'))
})

describe('validateAttachmentFile', () => {
  it('accepts a pdf', () => expect(validateAttachmentFile({ name: 'livro.pdf', size: 2048 })).toBeNull())

  it('rejects an executable', () => expect(validateAttachmentFile({ name: 'setup.exe', size: 5 })).not.toBeNull())

  it('rejects a file above 20 MB', () =>
    expect(validateAttachmentFile({ name: 'a.zip', size: UPLOAD_RULES.maxFileBytes + 1 })).toContain('20 MB'))
})
