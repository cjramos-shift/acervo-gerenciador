// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MarkdownContent } from './MarkdownContent'

afterEach(cleanup)

describe('MarkdownContent', () => {
  it('renders lists and bold text', () => {
    const { container } = render(<MarkdownContent markdown={'- **Código Limpo** (Robert C. Martin)\n- Outro'} />)

    expect(container.querySelectorAll('li')).toHaveLength(2)
    expect(container.querySelector('strong')?.textContent).toBe('Código Limpo')
  })

  it('demotes a level 1 heading so the page keeps a single h1', () => {
    const { container } = render(<MarkdownContent markdown="# Título interno" />)

    expect(container.querySelector('h1')).toBeNull()
    expect(container.querySelector('h2')?.textContent).toBe('Título interno')
  })

  it('opens links safely in a new tab', () => {
    const { container } = render(<MarkdownContent markdown="[Docs](https://exemplo.com)" />)
    const link = container.querySelector('a')

    expect(link?.getAttribute('target')).toBe('_blank')
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('does not render raw html', () => {
    const { container } = render(<MarkdownContent markdown={'<script>alert(1)</script><b onclick="x()">oi</b>'} />)

    expect(container.querySelector('script')).toBeNull()
    expect(container.querySelector('b')).toBeNull()
  })

  it('drops javascript: urls from links', () => {
    const { container } = render(<MarkdownContent markdown="[clique](javascript:alert(1))" />)

    expect(container.querySelector('a')?.getAttribute('href') ?? '').not.toContain('javascript:')
  })
})
