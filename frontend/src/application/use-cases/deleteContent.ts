import type { ContentGateway } from '../ports/contentGateway'

export type DeleteContent = (contentId: string) => Promise<void>

export const createDeleteContent =
  (gateway: ContentGateway): DeleteContent =>
  (contentId) =>
    gateway.remove(contentId)
