import { Link } from 'react-router'
import { presentPageItems } from '../../../interface-adapters/presenters/paginationPresenter'
import { Icon } from './Icon'
import styles from './pagination.module.css'

interface PaginationProps {
  page: number
  totalPages: number
  hrefFor: (page: number) => string
}

export function Pagination({ page, totalPages, hrefFor }: PaginationProps) {
  if (totalPages <= 1) return null

  const hasPrevious = page > 1
  const hasNext = page < totalPages

  return (
    <nav aria-label="Paginação" className={styles.pagination}>
      {hasPrevious ? (
        <Link className={styles.item} to={hrefFor(page - 1)} aria-label="Página anterior">
          <Icon name="chevronLeft" />
        </Link>
      ) : (
        <span className={`${styles.item} ${styles.disabled}`} aria-hidden="true">
          <Icon name="chevronLeft" />
        </span>
      )}

      {presentPageItems(page, totalPages).map((item, index) =>
        item === 'gap' ? (
          <span key={`gap-${index}`} className={`${styles.item} ${styles.gap}`} aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={item}
            className={`${styles.item} ${item === page ? styles.current : ''}`}
            to={hrefFor(item)}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Página ${item}`}
          >
            {item}
          </Link>
        ),
      )}

      {hasNext ? (
        <Link className={styles.item} to={hrefFor(page + 1)} aria-label="Próxima página">
          <Icon name="chevronRight" />
        </Link>
      ) : (
        <span className={`${styles.item} ${styles.disabled}`} aria-hidden="true">
          <Icon name="chevronRight" />
        </span>
      )}
    </nav>
  )
}
