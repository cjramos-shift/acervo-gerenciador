import { useParams, useSearchParams } from 'react-router'
import { useGroupTree } from '../../../interface-adapters/controllers/groupTreeContext'
import { useContentListController } from '../../../interface-adapters/controllers/useContentListController'
import { LinkButton } from '../design-system/Button'
import { EmptyState } from '../design-system/States'
import { ContentResults } from '../content/ContentResults'
import { useDocumentTitle } from '../layout/useDocumentTitle'
import { PAGE_PARAM, paths, withPage } from '../../routing/paths'
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb'
import styles from './pageLayout.module.css'
import { parsePage } from './pageParams'

const pluralizeContents = (total: number) => (total === 1 ? '1 conteúdo' : `${total} conteúdos`)

export function ContentListPage() {
  const { groupId, categoryId } = useParams()
  const [searchParams] = useSearchParams()
  const page = parsePage(searchParams.get(PAGE_PARAM))

  const tree = useGroupTree()
  const group = tree.groups.find((candidate) => candidate.id === groupId)
  const category = group?.categories.find((candidate) => candidate.id === categoryId)
  const list = useContentListController({ groupId, categoryId, page })

  const title = category?.name ?? group?.name ?? 'Conteúdos'
  useDocumentTitle(group && category ? `${category.name} · ${group.name}` : title)

  const basePath = groupId && categoryId ? paths.category(groupId, categoryId) : paths.group(groupId ?? '')
  const breadcrumb: BreadcrumbItem[] = [
    { label: 'Início', to: paths.home },
    category && group ? { label: group.name, to: paths.group(group.id) } : { label: group?.name ?? 'Grupo' },
    ...(category ? [{ label: category.name }] : []),
  ]

  const isMissing = tree.status === 'ready' && (!group || (categoryId !== undefined && !category))

  return (
    <>
      <div className={styles.header}>
        <Breadcrumb items={breadcrumb} />
        <h1>{isMissing ? 'Não encontrado' : title}</h1>
        {list.status === 'success' && <p className={styles.subtitle}>{pluralizeContents(list.data.totalItems)}</p>}
      </div>

      {isMissing ? (
        <EmptyState
          title="Esse grupo ou categoria não existe"
          description="Ele pode ter sido esvaziado ou removido. Volte ao início para ver o que há no acervo."
          action={<LinkButton to={paths.home}>Voltar ao início</LinkButton>}
        />
      ) : (
        <ContentResults
          state={list}
          hrefForPage={(target) => withPage(basePath, target)}
          emptyState={
            <EmptyState
              title="Nada por aqui ainda"
              description="Não há conteúdos nesta seção. Cadastre um novo para vê-lo aqui."
              action={
                <LinkButton variant="primary" icon="plus" to={paths.newContent}>
                  Novo conteúdo
                </LinkButton>
              }
            />
          }
        />
      )}
    </>
  )
}
