import type { ContentSummary, Page } from '../../domain/entities/content'
import { validateSearchTerm } from '../../domain/rules/searchRules'
import { ValidationError } from '../errors'
import type { ContentGateway, ContentListFilter } from '../ports/contentGateway'

export type ListContents = (filter: ContentListFilter, signal?: AbortSignal) => Promise<Page<ContentSummary>>

export const createListContents =
  (gateway: ContentGateway): ListContents =>
  async (filter, signal) => {
    const searchError = validateSearchTerm(filter.search ?? '')
    if (searchError) throw new ValidationError({ search: [searchError] }, searchError)

    return gateway.list(filter, signal)
  }
