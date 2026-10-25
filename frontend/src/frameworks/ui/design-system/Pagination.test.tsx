// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { Pagination } from './Pagination'

afterEach(cleanup)

const renderPagination = (page: number, totalPages: number) =>
  render(
    <MemoryRouter>
      <Pagination page={page} totalPages={totalPages} hrefFor={(target) => `/lista?pagina=${target}`} />
    </MemoryRouter>,
  )

describe('Pagination', () => {
  it('renders nothing for a single page', () => {
    const { container } = renderPagination(1, 1)

    expect(container.querySelector('nav')).toBeNull()
  })

  it('marks the current page and links the others', () => {
    renderPagination(2, 3)

    expect(screen.getByRole('link', { name: 'Página 2' }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('link', { name: 'Página 3' }).getAttribute('href')).toBe('/lista?pagina=3')
    expect(screen.getByRole('link', { name: 'Página anterior' }).getAttribute('href')).toBe('/lista?pagina=1')
    expect(screen.getByRole('link', { name: 'Próxima página' }).getAttribute('href')).toBe('/lista?pagina=3')
  })

  it('has no previous link on the first page', () => {
    renderPagination(1, 3)

    expect(screen.queryByRole('link', { name: 'Página anterior' })).toBeNull()
  })

  it('has a labelled navigation landmark', () => {
    renderPagination(1, 3)

    expect(screen.getByRole('navigation', { name: 'Paginação' })).toBeTruthy()
  })
})
