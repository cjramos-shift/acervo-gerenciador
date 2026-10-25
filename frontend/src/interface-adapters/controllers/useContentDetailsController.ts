import { useAsync } from './useAsync'
import { useUseCases } from './useCasesContext'

export function useContentDetailsController(contentId: string) {
  const { getContentDetails } = useUseCases()
  return useAsync((signal) => getContentDetails(contentId, signal), contentId)
}
