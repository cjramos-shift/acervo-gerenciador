import { describe, expect, it } from 'vitest'
import type { ContentDetails, ContentSummary } from '../../domain/entities/content'
import type { GroupNode } from '../../domain/entities/group'
import { presentContentCard } from './contentCardPresenter'
import { presentContentTabs } from './contentTabsPresenter'
import { presentErrorSummary, presentFieldLabel } from './errorPresenter'
import { formatFileSize } from './fileSizePresenter'
import { presentCategoryOptions, presentGroupOptions } from './formOptionsPresenter'
import { toExcerpt } from './markdownExcerptPresenter'
import { presentNavigationMenu } from './navigationMenuPresenter'
import { presentPageItems } from './paginationPresenter'

const tree: GroupNode[] = [
  {
    id: 'g1', name: 'Livros', contentCount: 3,
    categories: [{ id: 'c1', name: 'TI', contentCount: 3 }, { id: 'c2', name: 'Vazia', contentCount: 0 }],
  },
  { id: 'g2', name: 'Artigos', contentCount: 0, categories: [{ id: 'c3', name: 'Saúde', contentCount: 0 }] },
]

describe('presentNavigationMenu', () => {
  it('hides groups and categories without content', () => {
    expect(presentNavigationMenu(tree)).toEqual([
      { id: 'g1', name: 'Livros', count: 3, categories: [{ id: 'c1', name: 'TI', count: 3 }] },
    ])
  })
})

describe('form option presenters', () => {
  it('lists every group, even empty ones', () => expect(presentGroupOptions(tree)).toEqual(['Livros', 'Artigos']))

  it('lists the categories of the typed group ignoring case and spaces', () =>
    expect(presentCategoryOptions(tree, '  livros ')).toEqual(['TI', 'Vazia']))

  it('returns nothing for an unknown group', () => expect(presentCategoryOptions(tree, 'Novo')).toEqual([]))
})

describe('toExcerpt', () => {
  it('removes markdown syntax and joins lines', () =>
    expect(toExcerpt('- **Código Limpo** (Robert C. Martin)\n- [Docs](https://x.com)')).toBe(
      'Código Limpo (Robert C. Martin) Docs',
    ))

  it('decodes the entities the editor writes into the stored markdown', () =>
    expect(toExcerpt('**Troubleshooting &amp; Repairing** (a &lt; b)')).toBe('Troubleshooting & Repairing (a < b)'))

  it('keeps escaped characters as literals', () =>
    expect(toExcerpt('a \\* b \\_ c C:\\\\pasta')).toBe('a * b _ c C:\\pasta'))

  it('truncates long text with an ellipsis', () => {
    const excerpt = toExcerpt('palavra '.repeat(100), 40)
    expect(excerpt.endsWith('…')).toBe(true)
    expect(excerpt.length).toBeLessThanOrEqual(41)
  })
})

describe('formatFileSize', () => {
  it.each([
    [512, '512 B'],
    [2048, '2 KB'],
    [5 * 1024 * 1024, '5 MB'],
  ])('formats %i bytes', (bytes, expected) => expect(formatFileSize(bytes)).toBe(expected))
})

describe('presentContentTabs', () => {
  const content = { links: [{}, {}], images: [], files: [{}] } as unknown as ContentDetails

  it('always shows the content tab and hides empty ones', () =>
    expect(presentContentTabs(content)).toEqual([
      { id: 'content', label: 'Conteúdo' },
      { id: 'links', label: 'Referências (2)' },
      { id: 'files', label: 'Arquivos (1)' },
    ]))
})

describe('presentContentCard', () => {
  const summary: ContentSummary = {
    id: '1', title: 'Livros', groupId: 'g', groupName: 'Livros', categoryId: 'c', categoryName: 'TI',
    bodyPreview: '- **Item**', linkCount: 1, imageCount: 0, fileCount: 2, updatedAt: '2026-10-24T12:00:00Z',
  }

  it('keeps only indicators with items and pluralizes labels', () =>
    expect(presentContentCard(summary).indicators.map((indicator) => indicator.label)).toEqual(['1 link', '2 arquivos']))

  it('presents a clean excerpt', () => expect(presentContentCard(summary).excerpt).toBe('Item'))
})

describe('presentPageItems', () => {
  it('shows every page when there are few', () => expect(presentPageItems(2, 3)).toEqual([1, 2, 3]))

  it('collapses distant pages into gaps', () =>
    expect(presentPageItems(5, 10)).toEqual([1, 'gap', 4, 5, 6, 'gap', 10]))

  it('does not add a gap between neighbours', () => expect(presentPageItems(1, 5)).toEqual([1, 2, 'gap', 5]))
})

describe('error presenters', () => {
  it('flattens field errors', () =>
    expect(presentErrorSummary({ title: ['a', 'b'], body: ['c'] })).toHaveLength(3))

  it.each([
    ['title', 'Título'],
    ['links[2].url', 'Link 3'],
    ['images[0].file', 'Imagem 1'],
    ['files[1]', 'Arquivo 2'],
  ])('labels %s', (field, label) => expect(presentFieldLabel(field)).toBe(label))
})
