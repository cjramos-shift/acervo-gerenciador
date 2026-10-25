import type { ContentSummary } from '../../domain/entities/content'
import { formatDate } from './datePresenter'
import { toExcerpt } from './markdownExcerptPresenter'

export type IndicatorKind = 'links' | 'images' | 'files'

export interface CardIndicator {
  kind: IndicatorKind
  count: number
  label: string
}

export interface ContentCardModel {
  id: string
  title: string
  groupName: string
  categoryName: string
  excerpt: string
  updatedAtLabel: string
  indicators: CardIndicator[]
}

const pluralize = (count: number, singular: string, plural: string) => `${count} ${count === 1 ? singular : plural}`

function presentIndicators(summary: ContentSummary): CardIndicator[] {
  const indicators: CardIndicator[] = [
    { kind: 'links', count: summary.linkCount, label: pluralize(summary.linkCount, 'link', 'links') },
    { kind: 'images', count: summary.imageCount, label: pluralize(summary.imageCount, 'imagem', 'imagens') },
    { kind: 'files', count: summary.fileCount, label: pluralize(summary.fileCount, 'arquivo', 'arquivos') },
  ]
  return indicators.filter((indicator) => indicator.count > 0)
}

export const presentContentCard = (summary: ContentSummary): ContentCardModel => ({
  id: summary.id,
  title: summary.title,
  groupName: summary.groupName,
  categoryName: summary.categoryName,
  excerpt: toExcerpt(summary.bodyPreview),
  updatedAtLabel: formatDate(summary.updatedAt),
  indicators: presentIndicators(summary),
})
