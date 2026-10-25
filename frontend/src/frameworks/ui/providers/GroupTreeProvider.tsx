import type { ReactNode } from 'react'
import { GroupTreeContext, useGroupTreeLoader } from '../../../interface-adapters/controllers/groupTreeContext'

export function GroupTreeProvider({ children }: { children: ReactNode }) {
  const groupTree = useGroupTreeLoader()
  return <GroupTreeContext.Provider value={groupTree}>{children}</GroupTreeContext.Provider>
}
