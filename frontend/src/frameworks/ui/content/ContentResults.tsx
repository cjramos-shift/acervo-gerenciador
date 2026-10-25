import type { ReactNode } from 'react'
import type { AsyncResult } from '../../../interface-adapters/controllers/useAsync'
import type { ContentSummary, Page } from '../../../domain/entities/content'
import { presentContentCard } from '../../../interface-adapters/presenters/contentCardPresenter'
import { presentErrorMessage } from '../../../interface-adapters/presenters/errorPresenter'
import { ErrorState, ListSkeleton } from '../design-system/States'
import { Pagination } from '../design-system/Pagination'
import { ContentRow } from './ContentRow'
import styles from './contentRow.module.css'

interface ContentResultsProps {
  state: AsyncResult<Page<ContentSummary>>
  emptyState: ReactNode
  hrefForPage?: (page: number) => string
}

export function ContentResults({ state, emptyState, hrefForPage }: ContentResultsProps) {
  if (state.status === 'loading') return <ListSkeleton />
  if (state.status === 'error') return <ErrorState message={presentErrorMessage(state.error)} onRetry={state.reload} />

  const { items, page, totalPages } = state.data
  if (items.length === 0) return <>{emptyState}</>

  return (
    <>
      <ul className={styles.list}>
        {items.map((summary) => (
          <ContentRow key={summary.id} card={presentContentCard(summary)} />
        ))}
      </ul>
      {hrefForPage && <Pagination page={page} totalPages={totalPages} hrefFor={hrefForPage} />}
    </>
  )
}
