// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAsync } from './useAsync'

afterEach(cleanup)

describe('useAsync', () => {
  it('goes from loading to success', async () => {
    const { result } = renderHook(() => useAsync(async () => 'dados', 'chave'))

    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current).toMatchObject({ status: 'success', data: 'dados' }))
  })

  it('reports a rejected operation as an error', async () => {
    const failure = new Error('falhou')
    const { result } = renderHook(() => useAsync(async () => Promise.reject(failure), 'chave'))

    await waitFor(() => expect(result.current).toMatchObject({ status: 'error', error: failure }))
  })

  it('goes back to loading and runs again when the request key changes', async () => {
    const operation = vi.fn(async () => 'x')
    const { result, rerender } = renderHook(({ requestKey }) => useAsync(operation, requestKey), {
      initialProps: { requestKey: 'a' },
    })
    await waitFor(() => expect(result.current.status).toBe('success'))

    rerender({ requestKey: 'b' })

    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(operation).toHaveBeenCalledTimes(2)
  })

  it('runs the operation again on reload', async () => {
    const operation = vi.fn(async () => 'x')
    const { result } = renderHook(() => useAsync(operation, 'chave'))
    await waitFor(() => expect(result.current.status).toBe('success'))

    act(() => result.current.reload())

    await waitFor(() => expect(operation).toHaveBeenCalledTimes(2))
  })

  it('aborts the previous request when the key changes', async () => {
    const signals: AbortSignal[] = []
    const operation = (signal: AbortSignal) => {
      signals.push(signal)
      return new Promise<string>(() => undefined)
    }
    const { rerender } = renderHook(({ requestKey }) => useAsync(operation, requestKey), {
      initialProps: { requestKey: 'a' },
    })

    rerender({ requestKey: 'b' })

    expect(signals[0].aborted).toBe(true)
    expect(signals[1].aborted).toBe(false)
  })
})
