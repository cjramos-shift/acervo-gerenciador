import { Link } from 'react-router'
import { Icon } from '../design-system/Icon'
import styles from './pageLayout.module.css'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Você está em" className={styles.breadcrumb}>
      <ol>
        {items.map((item, index) => (
          <li key={item.label}>
            {index > 0 && <Icon name="chevronRight" size={14} />}
            {item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
