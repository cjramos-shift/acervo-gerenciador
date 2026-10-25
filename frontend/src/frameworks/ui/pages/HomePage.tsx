import { Link } from 'react-router'
import { useGroupTree } from '../../../interface-adapters/controllers/groupTreeContext'
import { useContentListController } from '../../../interface-adapters/controllers/useContentListController'
import { presentNavigationMenu } from '../../../interface-adapters/presenters/navigationMenuPresenter'
import { paths } from '../../routing/paths'
import { Badge } from '../design-system/Badge'
import { LinkButton } from '../design-system/Button'
import { EmptyState, ErrorState, ListSkeleton } from '../design-system/States'
import { ContentResults } from '../content/ContentResults'
import { useDocumentTitle } from '../layout/useDocumentTitle'
import styles from './pageLayout.module.css'

const RECENT_COUNT = 6
const VISIBLE_CATEGORIES = 4

const newContentAction = (
  <LinkButton variant="primary" icon="plus" to={paths.newContent}>
    Novo conteúdo
  </LinkButton>
)

function GroupTiles() {
  const { status, groups, reload } = useGroupTree()
  const menuGroups = presentNavigationMenu(groups)

  if (status === 'loading' && menuGroups.length === 0) return <ListSkeleton rows={2} />
  if (status === 'error') return <ErrorState message="Não foi possível carregar os grupos." onRetry={reload} />
  if (menuGroups.length === 0) {
    return (
      <EmptyState
        title="Seu acervo está vazio"
        description="Cadastre o primeiro conteúdo para começar a organizar suas leituras e estudos."
        action={newContentAction}
      />
    )
  }

  return (
    <ul className={styles.tiles}>
      {menuGroups.map((group) => (
        <li key={group.id}>
          <div className={styles.tile}>
            <h3>
              <Link to={paths.group(group.id)} className={styles.tileLink}>
                {group.name}
              </Link>
            </h3>
            <p className={styles.subtitle}>{group.count === 1 ? '1 conteúdo' : `${group.count} conteúdos`}</p>
            <div className={styles.chips}>
              {group.categories.slice(0, VISIBLE_CATEGORIES).map((category) => (
                <Badge key={category.id} tone="category">
                  {category.name}
                </Badge>
              ))}
              {group.categories.length > VISIBLE_CATEGORIES && (
                <Badge>+{group.categories.length - VISIBLE_CATEGORIES}</Badge>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function HomePage() {
  useDocumentTitle('Início')
  const recent = useContentListController({ pageSize: RECENT_COUNT })
  const hasRecentContent = recent.status === 'success' && recent.data.items.length > 0

  return (
    <>
      <div className={styles.header}>
        <h1>Seu acervo</h1>
        <p className={styles.subtitle}>Escolha um grupo para continuar de onde parou.</p>
      </div>

      <section aria-labelledby="home-groups">
        <h2 id="home-groups" className="visually-hidden">
          Grupos
        </h2>
        <GroupTiles />
      </section>

      {(hasRecentContent || recent.status !== 'success') && (
        <section className={styles.section} aria-labelledby="home-recent">
          <h2 id="home-recent">Atualizados recentemente</h2>
          <ContentResults state={recent} emptyState={null} />
        </section>
      )}
    </>
  )
}
