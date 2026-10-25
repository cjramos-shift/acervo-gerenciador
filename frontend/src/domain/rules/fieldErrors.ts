export type FieldErrors = Record<string, string[]>

export function addFieldError(errors: FieldErrors, field: string, message: string | null): void {
  if (message === null) return
  errors[field] = [...(errors[field] ?? []), message]
}

export function hasFieldErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}
