import type { ContentListFilter } from '../../application/ports/contentGateway'
import { useAsync } from './useAsync'
import { useUseCases } from './useCasesContext'

export function useContentListController(filter: ContentListFilter) {
  const { listContents } = useUseCases()
  return useAsync((signal) => listContents(filter, signal), JSON.stringify(filter))
}
