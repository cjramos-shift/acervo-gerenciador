import { describe, expect, it } from 'vitest'
import { GatewayError, NotFoundError, ValidationError } from '../../application/errors'
import type { ContentFormData } from '../../application/ports/contentGateway'
import type { HttpRequest, HttpResponse, HttpTransport } from '../http/httpTransport'
import { createHttpContentGateway } from './httpContentGateway'
import { createHttpGroupGateway } from './httpGroupGateway'

function recordingTransport(response: HttpResponse) {
  const requests: HttpRequest[] = []
  const transport: HttpTransport = {
    send: async (request) => {
      requests.push(request)
      return response
    },
  }
  return { transport, requests }
}

const formWithEverything = (): ContentFormData => ({
  title: 'Livros',
  body: '- **item**',
  groupName: 'Livros',
  categoryName: 'TI',
  links: [{ url: 'https://exemplo.com', label: 'Docs' }],
  images: [{ file: new File(['x'], 'capa.png', { type: 'image/png' }), description: 'Capa' }],
  files: [new File(['y'], 'resumo.pdf')],
  removedAttachmentIds: ['id-1', 'id-2'],
})

describe('http content gateway', () => {
  it('lists with a query that omits blank values', async () => {
    const { transport, requests } = recordingTransport({ status: 200, data: { items: [] } })

    await createHttpContentGateway(transport).list({ groupId: 'g1', search: '  álgebra ', page: 2 })

    expect(requests[0]).toMatchObject({
      method: 'GET',
      path: '/api/contents',
      query: { groupId: 'g1', categoryId: undefined, search: 'álgebra', page: 2 },
    })
  })

  it('posts multipart fields using the names the API expects', async () => {
    const { transport, requests } = recordingTransport({ status: 201, data: { id: 'abc' } })

    const id = await createHttpContentGateway(transport).create(formWithEverything())

    const body = requests[0].body as FormData
    expect(id).toBe('abc')
    expect(requests[0]).toMatchObject({ method: 'POST', path: '/api/contents' })
    expect([...body.keys()]).toEqual([
      'title', 'body', 'groupName', 'categoryName',
      'links[0].url', 'links[0].label',
      'images[0].file', 'images[0].description',
      'files', 'removedAttachmentIds', 'removedAttachmentIds',
    ])
    expect((body.get('images[0].file') as File).name).toBe('capa.png')
  })

  it('puts to the content url on update', async () => {
    const { transport, requests } = recordingTransport({ status: 200, data: { id: 'abc' } })

    await createHttpContentGateway(transport).update('abc', formWithEverything())

    expect(requests[0]).toMatchObject({ method: 'PUT', path: '/api/contents/abc' })
  })

  it('maps 404 to NotFoundError', async () => {
    const { transport } = recordingTransport({ status: 404, data: { title: 'Conteúdo não encontrado.' } })

    await expect(createHttpContentGateway(transport).getById('x')).rejects.toBeInstanceOf(NotFoundError)
  })

  it('maps 400 with errors to ValidationError using camelCase paths', async () => {
    const { transport } = recordingTransport({
      status: 400,
      data: { title: 'Dados inválidos', errors: { Title: ['Muito curto'], 'Links[0].Url': ['URL inválida'] } },
    })

    const attempt = createHttpContentGateway(transport).create(formWithEverything())

    await expect(attempt).rejects.toMatchObject({
      fieldErrors: { title: ['Muito curto'], 'links[0].url': ['URL inválida'] },
    })
    await expect(attempt).rejects.toBeInstanceOf(ValidationError)
  })

  it.each([
    [413, 'Os arquivos enviados são grandes demais.'],
    [500, 'O servidor encontrou um problema. Tente novamente em instantes.'],
  ])('maps %i without field errors to a friendly GatewayError', async (status, message) => {
    const { transport } = recordingTransport({ status, data: null })

    const attempt = createHttpContentGateway(transport).remove('x')

    await expect(attempt).rejects.toBeInstanceOf(GatewayError)
    await expect(attempt).rejects.toThrow(message)
  })

  it('treats 204 as success on delete', async () => {
    const { transport, requests } = recordingTransport({ status: 204, data: null })

    await expect(createHttpContentGateway(transport).remove('abc')).resolves.toBeUndefined()
    expect(requests[0]).toMatchObject({ method: 'DELETE', path: '/api/contents/abc' })
  })
})

describe('http group gateway', () => {
  it('gets the group tree', async () => {
    const tree = [{ id: 'g1', name: 'Livros', contentCount: 1, categories: [] }]
    const { transport, requests } = recordingTransport({ status: 200, data: tree })

    await expect(createHttpGroupGateway(transport).list()).resolves.toEqual(tree)
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/api/groups' })
  })
})
