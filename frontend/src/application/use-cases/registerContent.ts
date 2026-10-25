import type { ContentFormData, ContentGateway } from '../ports/contentGateway'
import { ensureFormIsValid } from './saveContentGuard'

export type RegisterContent = (form: ContentFormData) => Promise<string>

export const createRegisterContent =
  (gateway: ContentGateway): RegisterContent =>
  async (form) => {
    ensureFormIsValid(form)
    return gateway.create(form)
  }
