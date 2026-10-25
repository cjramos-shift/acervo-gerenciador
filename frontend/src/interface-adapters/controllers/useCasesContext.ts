import { createContext, useContext } from 'react'
import type { UseCases } from '../../application/useCases'

const UseCasesContext = createContext<UseCases | null>(null)

export const UseCasesProvider = UseCasesContext.Provider

export function useUseCases(): UseCases {
  const useCases = useContext(UseCasesContext)
  if (!useCases) throw new Error('UseCasesProvider ausente na árvore de componentes.')
  return useCases
}
