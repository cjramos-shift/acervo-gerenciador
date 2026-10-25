import type { ContentDetails } from '../../domain/entities/content'
import type { ContentGateway } from '../ports/contentGateway'

export type GetContentDetails = (contentId: string, signal?: AbortSignal) => Promise<ContentDetails>

export const createGetContentDetails =
  (gateway: ContentGateway): GetContentDetails =>
  (contentId, signal) =>
    gateway.getById(contentId, signal)
