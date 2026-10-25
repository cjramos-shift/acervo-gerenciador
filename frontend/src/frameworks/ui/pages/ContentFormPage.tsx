import { useParams } from 'react-router'
import { NotFoundError } from '../../../application/errors'
import { useContentDetailsController } from '../../../interface-adapters/controllers/useContentDetailsController'
import { presentErrorMessage } from '../../../interface-adapters/presenters/errorPresenter'
import { paths } from '../../routing/paths'
import { LinkButton } from '../design-system/Button'
import { EmptyState, ErrorState, ListSkeleton } from '../design-system/States'
import { ContentForm } from '../form/ContentForm'

export function NewContentPage() {
  return <ContentForm mode={{ kind: 'create' }} />
}

export function EditContentPage() {
  const { contentId = '' } = useParams()
  const details = useContentDetailsController(contentId)

  if (details.status === 'loading') return <ListSkeleton rows={3} />

  if (details.status === 'error') {
    return details.error instanceof NotFoundError ? (
      <EmptyState
        title="Conteúdo não encontrado"
        description="Ele pode ter sido excluído."
        action={<LinkButton to={paths.home}>Voltar ao início</LinkButton>}
      />
    ) : (
      <ErrorState message={presentErrorMessage(details.error)} onRetry={details.reload} />
    )
  }

  return <ContentForm key={details.data.id} mode={{ kind: 'edit', content: details.data }} />
}
