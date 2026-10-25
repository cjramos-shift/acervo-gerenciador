import { useEffect, useRef, useState } from 'react'

type Settled<T> = { status: 'success'; data: T } | { status: 'error'; error: unknown }

export type AsyncState<T> = { status: 'loading' } | Settled<T>

export type AsyncResult<T> = AsyncState<T> & { reload: () => void }

const LOADING = { status: 'loading' } as const

export function useAsync<T>(operation: (signal: AbortSignal) => Promise<T>, requestKey: string): AsyncResult<T> {
  const latestOperation = useRef(operation)
  const [reloadCount, setReloadCount] = useState(0)
  const [settled, setSettled] = useState<{ identity: string; outcome: Settled<T> } | null>(null)

  const identity = `${requestKey}#${reloadCount}`

  useEffect(() => {
    latestOperation.current = operation
  })

  useEffect(() => {
    const controller = new AbortController()

    latestOperation.current(controller.signal).then(
      (data) => setSettled({ identity, outcome: { status: 'success', data } }),
      (error: unknown) => {
        if (!controller.signal.aborted) setSettled({ identity, outcome: { status: 'error', error } })
      },
    )

    return () => controller.abort()
  }, [identity])

  const state: AsyncState<T> = settled?.identity === identity ? settled.outcome : LOADING

  return { ...state, reload: () => setReloadCount((count) => count + 1) }
}
