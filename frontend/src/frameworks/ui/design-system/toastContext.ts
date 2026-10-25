import { createContext, useContext } from 'react'

export interface ToastApi {
  show: (message: string) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const toast = useContext(ToastContext)
  if (!toast) throw new Error('ToastProvider ausente na árvore de componentes.')
  return toast
}
