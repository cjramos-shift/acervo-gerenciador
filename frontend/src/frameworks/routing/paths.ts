export const PAGE_PARAM = 'pagina'
export const SEARCH_PARAM = 'q'

export const paths = {
  home: '/',
  group: (groupId: string) => `/grupos/${groupId}`,
  category: (groupId: string, categoryId: string) => `/grupos/${groupId}/categorias/${categoryId}`,
  search: (term: string) => `/busca?${SEARCH_PARAM}=${encodeURIComponent(term)}`,
  content: (contentId: string) => `/conteudos/${contentId}`,
  newContent: '/conteudos/novo',
  editContent: (contentId: string) => `/conteudos/${contentId}/editar`,
}

export const withPage = (basePath: string, page: number) => {
  if (page <= 1) return basePath
  const separator = basePath.includes('?') ? '&' : '?'
  return `${basePath}${separator}${PAGE_PARAM}=${page}`
}
