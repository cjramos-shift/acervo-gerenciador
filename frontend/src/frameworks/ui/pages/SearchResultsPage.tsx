import { useSearchParams } from 'react-router'
import { useContentListController } from '../../../interface-adapters/controllers/useContentListController'
import { LinkButton } from '../design-system/Button'
import { EmptyState } from '../design-system/States'
import { ContentResults } from '../content/ContentResults'
import { useDocumentTitle } from '../layout/useDocumentTitle'
import { PAGE_PARAM, paths, withPage } from '../../routing/paths'
import styles from './pageLayout.module.css'
import { parsePage } from './pageParams'
import { SEARCH_PARAM } from '../../routing/paths'

const describeTotal = (total: number) => (total === 1 ? '1 resultado' : `${total} resultados`)

export function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const term = (searchParams.get(SEARCH_PARAM) ?? '').trim()
  const page = parsePage(searchParams.get(PAGE_PARAM))

  const results = useContentListController({ search: term, page })
  useDocumentTitle(term ? `Busca: ${term}` : 'Busca')

  return (
    <>
      <div className={styles.header}>
        <h1>{term ? `Resultados para “${term}”` : 'Busca'}</h1>
        <p role="status" className={styles.subtitle}>
          {results.status === 'success' && term ? describeTotal(results.data.totalItems) : '\u00a0'}
        </p>
      </div>

      {term === '' ? (
        <EmptyState
          title="O que você procura?"
          description="Digite um termo no campo de busca para encontrar títulos, textos, grupos, categorias e links."
        />
      ) : (
        <ContentResults
          state={results}
          hrefForPage={(target) => withPage(paths.search(term), target)}
          emptyState={
            <EmptyState
              title={`Nenhum resultado para “${term}”`}
              description="Verifique a ortografia ou tente um termo mais geral. A busca ignora acentos e maiúsculas."
              action={<LinkButton to={paths.home}>Voltar ao início</LinkButton>}
            />
          }
        />
      )}
    </>
  )
}
