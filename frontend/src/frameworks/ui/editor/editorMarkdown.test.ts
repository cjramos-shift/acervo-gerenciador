// @vitest-environment jsdom
import { Editor } from '@tiptap/react'
import { afterEach, describe, expect, it } from 'vitest'
import { createEditorExtensions } from './editorExtensions'

const SEED = `- **C How to Program** (Paul Deitel & Harvey Deitel): Fundamentos de lógica, vetores e ponteiros.
- **Troubleshooting & Repairing Computer Printers** (Stephen J. Bigelow): Diagnóstico eletromecânico.
- **Código Limpo / Clean Code** (Robert C. Martin): Princípios de legibilidade.`

const editors: Editor[] = []

function openEditor(markdown: string): Editor {
  const editor = new Editor({ extensions: createEditorExtensions(), content: markdown, contentType: 'markdown' })
  editors.push(editor)
  return editor
}

afterEach(() => editors.splice(0).forEach((editor) => editor.destroy()))

describe('editor markdown round-trip', () => {
  it('turns the example list into a real bullet list with bold titles', () => {
    const editor = openEditor(SEED)

    expect(editor.getHTML()).toContain('<ul>')
    expect(editor.getHTML().match(/<li>/g)).toHaveLength(3)
    expect(editor.getHTML()).toContain('<strong>C How to Program</strong>')
  })

  it('saves the example back as the same list, writing & as the valid entity &amp;', () => {
    const editor = openEditor(SEED)

    expect(editor.getMarkdown().trim()).toBe(SEED.replaceAll('&', '&amp;'))
  })

  it('is stable: reopening what the editor saved changes nothing, and the text is preserved', () => {
    const first = openEditor(SEED)
    const second = openEditor(first.getMarkdown())

    expect(second.getMarkdown()).toBe(first.getMarkdown())
    expect(second.getText()).toBe(first.getText())
    expect(second.getText()).toContain('Paul Deitel & Harvey Deitel')
  })

  it('keeps headings, quotes, code and links', () => {
    const source = '## Título\n\n> citação\n\n`código` e [link](https://exemplo.com)'

    expect(openEditor(source).getMarkdown().trim()).toBe(source)
  })

  it('applies formatting commands and serializes them as markdown', () => {
    const editor = openEditor('texto')

    editor.chain().focus().selectAll().toggleBold().run()

    expect(editor.getMarkdown().trim()).toBe('**texto**')
  })

  it('does not offer strikethrough or underline (not representable in the baseline)', () => {
    const editor = openEditor('texto')

    expect(editor.schema.marks.strike).toBeUndefined()
    expect(editor.schema.marks.underline).toBeUndefined()
  })

  it('limits headings to levels 2 to 4', () => {
    const editor = openEditor('texto')

    editor.chain().focus().selectAll().toggleHeading({ level: 1 as never }).run()

    expect(editor.getMarkdown()).not.toMatch(/^# /m)
  })

  it('never turns raw html typed into the text into live elements', () => {
    const editor = openEditor('<script>alert(1)</script> e <img src=x onerror=alert(1)>')

    expect(editor.getHTML()).not.toContain('<script')
    expect(editor.getHTML()).not.toContain('<img')
    expect(editor.getHTML()).not.toContain('onerror=')
  })
})
