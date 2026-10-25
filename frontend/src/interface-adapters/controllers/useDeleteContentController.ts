import { useState } from 'react'
import { presentErrorMessage } from '../presenters/errorPresenter'
import { useGroupTree } from './groupTreeContext'
import { useUseCases } from './useCasesContext'

export function useDeleteContentController() {
  const { deleteContent } = useUseCases()
  const groupTree = useGroupTree()
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const remove = async (contentId: string): Promise<boolean> => {
    setIsDeleting(true)
    setErrorMessage(null)

    try {
      await deleteContent(contentId)
      groupTree.reload()
      return true
    } catch (error) {
      setErrorMessage(presentErrorMessage(error))
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return { isDeleting, errorMessage, remove }
}
