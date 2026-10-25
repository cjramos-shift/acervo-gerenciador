import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { GroupNode } from '../../domain/entities/group'
import { useUseCases } from './useCasesContext'

export interface GroupTreeState {
  status: 'loading' | 'ready' | 'error'
  groups: GroupNode[]
  reload: () => void
}

export const GroupTreeContext = createContext<GroupTreeState | null>(null)

export function useGroupTree(): GroupTreeState {
  const groupTree = useContext(GroupTreeContext)
  if (!groupTree) throw new Error('GroupTreeProvider ausente na árvore de componentes.')
  return groupTree
}

export function useGroupTreeLoader(): GroupTreeState {
  const { listGroups } = useUseCases()
  const [reloadCount, setReloadCount] = useState(0)
  const [snapshot, setSnapshot] = useState<Pick<GroupTreeState, 'status' | 'groups'>>({ status: 'loading', groups: [] })

  useEffect(() => {
    const controller = new AbortController()

    listGroups(controller.signal).then(
      (groups) => setSnapshot({ status: 'ready', groups }),
      () => {
        if (!controller.signal.aborted) setSnapshot((previous) => ({ ...previous, status: 'error' }))
      },
    )

    return () => controller.abort()
  }, [listGroups, reloadCount])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  return { ...snapshot, reload }
}
