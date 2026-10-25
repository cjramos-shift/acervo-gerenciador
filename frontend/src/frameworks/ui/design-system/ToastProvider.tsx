import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ToastContext } from './toastContext'
import styles from './toast.module.css'

const TOAST_DURATION_MS = 5000

interface ToastMessage {
  id: number
  text: string
}

let lastToastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const show = useCallback((text: string) => {
    const toast = { id: ++lastToastId, text }
    setMessages((current) => [...current, toast])
    window.setTimeout(() => setMessages((current) => current.filter((item) => item.id !== toast.id)), TOAST_DURATION_MS)
  }, [])

  const api = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div role="status" aria-live="polite" className={styles.region}>
        {messages.map((message) => (
          <p key={message.id} className={styles.toast}>
            {message.text}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
