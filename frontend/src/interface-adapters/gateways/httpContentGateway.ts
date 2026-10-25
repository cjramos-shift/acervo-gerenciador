import type { ContentGateway, ContentListFilter } from '../../application/ports/contentGateway'
import type { ContentDetails, ContentSummary, Page } from '../../domain/entities/content'
import { sendAndUnwrap } from '../http/httpFailure'
import type { HttpTransport } from '../http/httpTransport'
import { toFormData } from './contentFormData'

const toQuery = (filter: ContentListFilter) => ({
  groupId: filter.groupId,
  categoryId: filter.categoryId,
  search: filter.search?.trim() || undefined,
  page: filter.page,
  pageSize: filter.pageSize,
})

export function createHttpContentGateway(transport: HttpTransport): ContentGateway {
  return {
    list: (filter, signal) =>
      sendAndUnwrap<Page<ContentSummary>>(transport, {
        method: 'GET',
        path: '/api/contents',
        query: toQuery(filter),
        signal,
      }),

    getById: (contentId, signal) =>
      sendAndUnwrap<ContentDetails>(transport, { method: 'GET', path: `/api/contents/${contentId}`, signal }),

    create: async (form) => {
      const saved = await sendAndUnwrap<{ id: string }>(transport, {
        method: 'POST',
        path: '/api/contents',
        body: toFormData(form),
      })
      return saved.id
    },

    update: async (contentId, form) => {
      const saved = await sendAndUnwrap<{ id: string }>(transport, {
        method: 'PUT',
        path: `/api/contents/${contentId}`,
        body: toFormData(form),
      })
      return saved.id
    },

    remove: async (contentId) => {
      await sendAndUnwrap<unknown>(transport, { method: 'DELETE', path: `/api/contents/${contentId}` })
    },
  }
}
