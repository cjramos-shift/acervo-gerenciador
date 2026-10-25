import type { HttpRequest, HttpTransport } from '../../interface-adapters/http/httpTransport'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

function buildUrl({ path, query }: HttpRequest): string {
  const params = new URLSearchParams()

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value))
  })

  const queryString = params.toString()
  return `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ''}`
}

async function readBody(response: Response): Promise<unknown> {
  const isJson = (response.headers.get('content-type') ?? '').includes('json')
  return isJson ? response.json() : null
}

export const fetchTransport: HttpTransport = {
  async send(request) {
    const response = await fetch(buildUrl(request), {
      method: request.method,
      body: request.body,
      signal: request.signal,
    })

    return { status: response.status, data: await readBody(response) }
  },
}
