import { GatewayError, NotFoundError, ValidationError } from '../../application/errors'
import type { FieldErrors } from '../../domain/rules/fieldErrors'
import type { HttpRequest, HttpResponse, HttpTransport } from './httpTransport'

interface ProblemDetails {
  title?: string
  errors?: Record<string, string[]>
}

const STATUS_MESSAGES: Record<number, string> = {
  413: 'Os arquivos enviados são grandes demais.',
  415: 'Algum arquivo tem um tipo não permitido.',
}

const SERVER_ERROR_MESSAGE = 'O servidor encontrou um problema. Tente novamente em instantes.'

const isSuccess = (status: number) => status >= 200 && status < 300

const asProblem = (data: unknown): ProblemDetails =>
  typeof data === 'object' && data !== null ? (data as ProblemDetails) : {}

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1)

const toCamelCasePath = (path: string) => path.split('.').map(lowerFirst).join('.')

function normalizeErrors(errors: Record<string, string[]>): FieldErrors {
  return Object.fromEntries(Object.entries(errors).map(([path, messages]) => [toCamelCasePath(path), messages]))
}

function failureFor(response: HttpResponse): Error {
  const problem = asProblem(response.data)

  if (response.status === 404) return new NotFoundError(problem.title)
  if (problem.errors) return new ValidationError(normalizeErrors(problem.errors), problem.title)
  if (response.status >= 500) return new GatewayError(SERVER_ERROR_MESSAGE)
  return new GatewayError(STATUS_MESSAGES[response.status] ?? problem.title)
}

export async function sendAndUnwrap<T>(transport: HttpTransport, request: HttpRequest): Promise<T> {
  const response = await transport.send(request)
  if (!isSuccess(response.status)) throw failureFor(response)
  return response.data as T
}
