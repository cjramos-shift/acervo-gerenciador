import { useEffect, useId, useRef, type ReactNode } from 'react'
import styles from './dialog.module.css'

interface DialogProps {
  isOpen: boolean
  title: string
  onClose: () => void
  actions: ReactNode
  children: ReactNode
}

export function Dialog({ isOpen, title, onClose, actions, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className={styles.body}>
        <h2 id={titleId}>{title}</h2>
        {children}
        <div className={styles.actions}>{actions}</div>
      </div>
    </dialog>
  )
}
