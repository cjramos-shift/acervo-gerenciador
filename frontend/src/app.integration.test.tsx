// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createUseCases } from './frameworks/composition/compositionRoot'
import { routeDefinitions } from './frameworks/routing/routes'
import { ToastProvider } from './frameworks/ui/design-system/ToastProvider'
import { GroupTreeProvider } from './frameworks/ui/providers/GroupTreeProvider'
import { UseCasesProvider } from './interface-adapters/controllers/useCasesContext'
import type { HttpRequest, HttpResponse } from './interface-adapters/http/httpTransport'

interface StoredContent {
  id: string
  title: string
  body: string
  groupName: string
  categoryName: string
  links: { id: string; url: string; label: string | null }[]
}

const slug = (text: string) => text.toLowerCase().replace(/\W+/g, '-')
const plain = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
const json = (status: number, data: unknown): HttpResponse => ({ status, data })

function createFakeApi(initial: StoredContent[]) {
  const contents = [...initial]
  const requests: HttpRequest[] = []
  const summary = (c: StoredContent) => ({
    id: c.id, title: c.title, groupId: `g-${slug(c.groupName)}`, groupName: c.groupName,
    categoryId: `c-${slug(c.categoryName)}`, categoryName: c.categoryName, bodyPreview: c.body,
    linkCount: c.links.length, imageCount: 0, fileCount: 0, updatedAt: '2026-10-24T12:00:00Z',
  })
  const tree = () =>
    [...new Set(contents.map((c) => c.groupName))].map((groupName) => {
      const inGroup = contents.filter((c) => c.groupName === groupName)
      const names = [...new Set(inGroup.map((c) => c.categoryName))]
      return {
        id: `g-${slug(groupName)}`, name: groupName, contentCount: inGroup.length,
        categories: names.map((name) => ({ id: `c-${slug(name)}`, name, contentCount: inGroup.filter((c) => c.categoryName === name).length })),
      }
    })

  const send = async (request: HttpRequest): Promise<HttpResponse> => {
    requests.push(request)
    const { method, path, query = {} } = request
    if (path === '/api/groups') return json(200, tree())
    if (path === '/api/contents' && method === 'GET') {
      const found = contents.map(summary).filter((c) =>
        (!query.groupId || c.groupId === query.groupId) &&
        (!query.categoryId || c.categoryId === query.categoryId) &&
        (!query.search || plain(`${c.title} ${c.bodyPreview} ${c.groupName} ${c.categoryName}`).includes(plain(String(query.search)))))
      return json(200, { items: found, page: 1, pageSize: 12, totalItems: found.length, totalPages: 1 })
    }
    if (path === '/api/contents' && method === 'POST') return json(201, { id: 'created' })
    const id = /^\/api\/contents\/([^/]+)$/.exec(path)?.[1]
    const content = contents.find((c) => c.id === id)
    if (!content) return json(404, { title: 'Conteúdo não encontrado.' })
    if (method === 'DELETE') { contents.splice(contents.indexOf(content), 1); return json(204, null) }
    if (method === 'PUT') return json(200, { id: content.id })
    return json(200, { ...summary(content), body: content.body, createdAt: '2026-10-24T12:00:00Z', links: content.links, images: [], files: [] })
  }
  return { send, requests }
}

const BOOKS: StoredContent = {
  id: 'book-1', title: 'Livros interessantes para análise', groupName: 'Livros', categoryName: 'TI',
  body: '- **Código Limpo** (Robert C. Martin): legibilidade\n- **TCP/IP Illustrated**: redes',
  links: [{ id: 'l1', url: 'https://exemplo.com/docs', label: 'Documentação' }],
}
const ARTICLE: StoredContent = {
  id: 'art-1', title: 'Álgebra relacional na prática', groupName: 'Artigos', categoryName: 'Bancos de dados',
  body: 'Operações do modelo relacional.', links: [],
}

function renderApp(path: string, initial: StoredContent[] = [BOOKS, ARTICLE]) {
  const api = createFakeApi(initial)
  const router = createMemoryRouter(routeDefinitions, { initialEntries: [path] })
  render(
    <UseCasesProvider value={createUseCases({ send: api.send })}>
      <ToastProvider>
        <GroupTreeProvider>
          <RouterProvider router={router} />
        </GroupTreeProvider>
      </ToastProvider>
    </UseCasesProvider>,
  )
  return { api, router }
}

beforeAll(() => {
  const dialog = HTMLDialogElement.prototype
  dialog.showModal = function showModal(this: HTMLDialogElement) { this.setAttribute('open', '') }
  dialog.close = function close(this: HTMLDialogElement) { this.removeAttribute('open'); this.dispatchEvent(new Event('close')) }
})
afterEach(cleanup)

describe('navigation and reading', () => {
  it('shows groups and recent content on the home page without listing everything at once', async () => {
    renderApp('/')

    expect(await screen.findByRole('heading', { level: 1, name: 'Seu acervo' })).toBeTruthy()
    const main = within(screen.getByRole('main'))
    expect(await main.findByRole('link', { name: 'Livros' })).toBeTruthy()
    expect(main.getByRole('link', { name: 'Artigos' })).toBeTruthy()
    expect(await main.findByRole('link', { name: 'Livros interessantes para análise' })).toBeTruthy()
  })

  it('builds the two-level menu and expands only the active group', async () => {
    renderApp('/grupos/g-livros')

    const menu = await screen.findByRole('navigation', { name: 'Navegação principal' })
    expect(await within(menu).findByRole('link', { name: /^TI/ })).toBeTruthy()
    expect(within(menu).queryByRole('link', { name: /^Bancos de dados/ })).toBeNull()

    fireEvent.click(within(menu).getByRole('button', { name: 'Expandir categorias de Artigos' }))

    expect(within(menu).getByRole('link', { name: /^Bancos de dados/ })).toBeTruthy()
  })

  it('opens a category from the menu and lists only its contents', async () => {
    const { router } = renderApp('/')
    const menu = await screen.findByRole('navigation', { name: 'Navegação principal' })

    fireEvent.click(await within(menu).findByRole('button', { name: 'Expandir categorias de Livros' }))
    fireEvent.click(within(menu).getByRole('link', { name: /^TI/ }))

    expect(await screen.findByRole('heading', { level: 1, name: 'TI' })).toBeTruthy()
    expect(router.state.location.pathname).toBe('/grupos/g-livros/categorias/c-ti')
    expect(await screen.findByRole('link', { name: 'Livros interessantes para análise' })).toBeTruthy()
    expect(screen.queryByText('Álgebra relacional na prática')).toBeNull()
  })

  it('shows the details with tabs and renders the markdown body as a list', async () => {
    renderApp('/conteudos/book-1')

    expect(await screen.findByRole('heading', { level: 1, name: 'Livros interessantes para análise' })).toBeTruthy()
    const tabs = screen.getAllByRole('tab').map((tab) => tab.textContent)
    expect(tabs).toEqual(['Conteúdo', 'Referências (1)'])
    expect(within(screen.getByRole('tabpanel')).getAllByRole('listitem')).toHaveLength(2)

    fireEvent.click(screen.getByRole('tab', { name: 'Referências (1)' }))

    expect(within(screen.getByRole('tabpanel')).getByText('Documentação')).toBeTruthy()
  })

  it('shows a friendly page for an unknown content', async () => {
    renderApp('/conteudos/nao-existe')

    expect(await screen.findByRole('heading', { name: 'Conteúdo não encontrado' })).toBeTruthy()
  })
})

describe('search', () => {
  it('searches ignoring accents and shows the result count', async () => {
    const { router } = renderApp('/')
    const field = await screen.findByRole('searchbox', { name: 'Buscar no acervo' })

    fireEvent.change(field, { target: { value: 'algebra' } })
    fireEvent.submit(field.closest('form')!)

    expect(await screen.findByRole('heading', { level: 1, name: 'Resultados para “algebra”' })).toBeTruthy()
    expect(router.state.location.search).toBe('?q=algebra')
    expect(await screen.findByRole('link', { name: 'Álgebra relacional na prática' })).toBeTruthy()
    expect(within(screen.getByRole('main')).getByRole('status').textContent).toBe('1 resultado')
  })

  it('shows an empty state when nothing matches', async () => {
    renderApp('/busca?q=inexistente')

    expect(await screen.findByRole('heading', { name: 'Nenhum resultado para “inexistente”' })).toBeTruthy()
  })

  it('rejects a one-character term before navigating', async () => {
    const { router } = renderApp('/')
    const field = await screen.findByRole('searchbox', { name: 'Buscar no acervo' })

    fireEvent.change(field, { target: { value: 'a' } })
    fireEvent.submit(field.closest('form')!)

    expect((await screen.findByRole('alert')).textContent).toContain('2 a 100')
    expect(router.state.location.pathname).toBe('/')
  })
})

describe('delete', () => {
  it('asks for confirmation, deletes and returns home', async () => {
    const { api, router } = renderApp('/conteudos/art-1')
    fireEvent.click(await screen.findByRole('button', { name: 'Excluir' }))

    const dialog = await screen.findByRole('dialog', { name: 'Excluir este conteúdo?' })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Excluir conteúdo' }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(api.requests.some((request) => request.method === 'DELETE' && request.path === '/api/contents/art-1')).toBe(true)
    expect((await screen.findByRole('status')).textContent).toContain('Conteúdo excluído.')
  })
})

describe('content form', () => {
  it('blocks an empty submission and explains every missing field', async () => {
    const { api } = renderApp('/conteudos/novo')
    fireEvent.click(await screen.findByRole('button', { name: 'Salvar conteúdo' }))

    const summary = await screen.findByRole('alert', { name: '' })
    expect(summary.textContent).toContain('Título:')
    expect(summary.textContent).toContain('Grupo:')
    expect(summary.textContent).toContain('Categoria:')
    expect(summary.textContent).toContain('Conteúdo: Escreva o conteúdo.')
    expect(api.requests.some((request) => request.method === 'POST')).toBe(false)
  })

  it('keeps the category disabled until a group is informed and suggests the group categories', async () => {
    renderApp('/conteudos/novo')
    const category = (await screen.findByLabelText(/^Categoria/)) as HTMLInputElement
    expect(category.disabled).toBe(true)

    fireEvent.change(screen.getByLabelText(/^Grupo/), { target: { value: 'livros' } })

    expect(category.disabled).toBe(false)
    expect(document.querySelector('#field-categoryName-options option')?.getAttribute('value')).toBe('TI')
  })

  it('shows the toolbar with accessible state and the editor labelled by the field name', async () => {
    renderApp('/conteudos/novo')

    const toolbar = await screen.findByRole('toolbar', { name: 'Formatação do texto' })
    expect(within(toolbar).getByRole('button', { name: 'Negrito' }).getAttribute('aria-pressed')).toBe('false')
    expect(within(toolbar).getAllByRole('button').filter((button) => button.tabIndex === 0)).toHaveLength(1)
    expect(screen.getByRole('textbox', { name: /Conteúdo/ })).toBeTruthy()
  })

  it('edits an existing content and sends the multipart payload the API expects', async () => {
    const { api, router } = renderApp('/conteudos/book-1/editar')

    const title = (await screen.findByLabelText(/^Título \(obrigatório\)/)) as HTMLInputElement
    expect(title.value).toBe('Livros interessantes para análise')
    fireEvent.change(title, { target: { value: 'Título atualizado' } })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar conteúdo' }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/conteudos/book-1'))
    const put = api.requests.find((request) => request.method === 'PUT')!
    const body = put.body as FormData
    expect(put.path).toBe('/api/contents/book-1')
    expect(body.get('title')).toBe('Título atualizado')
    expect(body.get('groupName')).toBe('Livros')
    expect(body.get('categoryName')).toBe('TI')
    expect(body.get('body')).toContain('**Código Limpo**')
    expect(body.get('links[0].url')).toBe('https://exemplo.com/docs')
    expect(body.get('links[0].label')).toBe('Documentação')
  })
})
