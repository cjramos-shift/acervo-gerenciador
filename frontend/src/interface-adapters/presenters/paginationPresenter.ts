export type PageItem = number | 'gap'

const SIBLINGS = 1

export function presentPageItems(currentPage: number, totalPages: number): PageItem[] {
  const wanted = new Set([1, totalPages, currentPage - SIBLINGS, currentPage, currentPage + SIBLINGS])
  const pages = [...wanted].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b)

  return pages.flatMap((page, index) => {
    const hasGapBefore = index > 0 && page - pages[index - 1] > 1
    return hasGapBefore ? ['gap' as const, page] : [page]
  })
}
