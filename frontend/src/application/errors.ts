import type { FieldErrors } from '../domain/rules/fieldErrors'

export class ValidationError extends Error {
  readonly fieldErrors: FieldErrors

  constructor(fieldErrors: FieldErrors, message = 'Revise os campos destacados.') {
    super(message)
    this.name = 'ValidationError'
    this.fieldErrors = fieldErrors
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Não encontramos o que você procura.') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class GatewayError extends Error {
  constructor(message = 'Não foi possível concluir a operação. Tente novamente.') {
    super(message)
    this.name = 'GatewayError'
  }
}
