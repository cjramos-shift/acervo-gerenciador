import type { ContentFormData, ContentGateway } from '../ports/contentGateway'
import { ensureFormIsValid } from './saveContentGuard'

export type UpdateContent = (contentId: string, form: ContentFormData) => Promise<string>

export const createUpdateContent =
  (gateway: ContentGateway): UpdateContent =>
  async (contentId, form) => {
    ensureFormIsValid(form)
    return gateway.update(contentId, form)
  }
