import type { ContentDetails } from '../../domain/entities/content'

export type ContentTabId = 'content' | 'links' | 'images' | 'files'

export interface ContentTab {
  id: ContentTabId
  label: string
}

export function presentContentTabs(content: ContentDetails): ContentTab[] {
  const optionalTabs: [ContentTabId, string, number][] = [
    ['links', 'Referências', content.links.length],
    ['images', 'Imagens', content.images.length],
    ['files', 'Arquivos', content.files.length],
  ]

  return [
    { id: 'content', label: 'Conteúdo' },
    ...optionalTabs.filter(([, , count]) => count > 0).map(([id, label, count]) => ({ id, label: `${label} (${count})` })),
  ]
}
