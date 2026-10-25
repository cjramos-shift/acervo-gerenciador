import { validateContentForm } from '../../domain/rules/contentFormRules'
import { hasFieldErrors } from '../../domain/rules/fieldErrors'
import { ValidationError } from '../errors'
import type { ContentFormData } from '../ports/contentGateway'

export function ensureFormIsValid(form: ContentFormData): void {
  const errors = validateContentForm(form)
  if (hasFieldErrors(errors)) throw new ValidationError(errors)
}
