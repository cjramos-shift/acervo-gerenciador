import { useState, type ReactNode } from 'react'
import { Badge } from './Badge'
import styles from './disclosure.module.css'
import { Icon } from './Icon'

interface DisclosureProps {
  id?: string
  title: string
  count: number
  forceOpen?: boolean
  children: ReactNode
}

export function Disclosure({ id, title, count, forceOpen = false, children }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(count > 0)

  return (
    <details
      id={id}
      className={styles.disclosure}
      open={isOpen || forceOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary className={styles.summary}>
        <span className={styles.chevron}>
          <Icon name="chevronRight" size={18} />
        </span>
        {title}
        <Badge>{count}</Badge>
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  )
}
