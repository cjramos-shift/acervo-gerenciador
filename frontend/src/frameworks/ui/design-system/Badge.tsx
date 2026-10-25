import type { ReactNode } from 'react'
import styles from './badge.module.css'

interface BadgeProps {
  tone?: 'category' | 'neutral'
  children: ReactNode
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>
}
