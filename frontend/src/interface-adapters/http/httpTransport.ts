export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface HttpRequest {
  method: HttpMethod
  path: string
  query?: Record<string, string | number | undefined>
  body?: FormData
  signal?: AbortSignal
}

export interface HttpResponse {
  status: number
  data: unknown
}

export interface HttpTransport {
  send(request: HttpRequest): Promise<HttpResponse>
}
