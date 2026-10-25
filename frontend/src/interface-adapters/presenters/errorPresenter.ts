import { GatewayError, NotFoundError, ValidationError } from '../../application/errors'
import type { FieldErrors } from '../../domain/rules/fieldErrors'

const FALLBACK_MESSAGE = 'Algo deu errado. Tente novamente.'
const NETWORK_MESSAGE = 'Não foi possível falar com o servidor. Verifique se a API está em execução.'

export function presentErrorMessage(error: unknown): string {
  if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof GatewayError) {
    return error.message
  }
  return error instanceof TypeError ? NETWORK_MESSAGE : FALLBACK_MESSAGE
}

export interface ErrorSummaryItem {
  field: string
  message: string
}

export function presentErrorSummary(errors: FieldErrors): ErrorSummaryItem[] {
  return Object.entries(errors).flatMap(([field, messages]) => messages.map((message) => ({ field, message })))
}

const FIELD_LABELS: Record<string, string> = {
  title: 'Título',
  groupName: 'Grupo',
  categoryName: 'Categoria',
  body: 'Conteúdo',
  removedAttachmentIds: 'Anexos',
  search: 'Busca',
}

const INDEXED_FIELD_LABELS: [prefix: string, label: string][] = [
  ['links', 'Link'],
  ['images', 'Imagem'],
  ['files', 'Arquivo'],
]

export function presentFieldLabel(field: string): string {
  const knownLabel = FIELD_LABELS[field]
  if (knownLabel) return knownLabel

  const indexed = INDEXED_FIELD_LABELS.find(([prefix]) => field.startsWith(prefix))
  const position = /\[(\d+)\]/.exec(field)?.[1]
  if (!indexed) return ''

  return position === undefined ? `${indexed[1]}s` : `${indexed[1]} ${Number(position) + 1}`
}
