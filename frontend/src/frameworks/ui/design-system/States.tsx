import type { ReactNode } from 'react'
import { Button } from './Button'
import { Icon } from './Icon'
import styles from './states.module.css'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.state}>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.state} role="alert">
      <span className={styles.errorIcon}>
        <Icon name="alert" size={28} />
      </span>
      <h2>Não foi possível carregar</h2>
      <p>{message}</p>
      {onRetry && <Button onClick={onRetry}>Tentar novamente</Button>}
    </div>
  )
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="visually-hidden">Carregando…</span>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className={styles.skeletonRow} />
      ))}
    </div>
  )
}
