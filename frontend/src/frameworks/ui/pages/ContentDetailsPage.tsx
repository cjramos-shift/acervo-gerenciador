import { useParams } from 'react-router'
import { NotFoundError } from '../../../application/errors'
import { useContentDetailsController } from '../../../interface-adapters/controllers/useContentDetailsController'
import { presentErrorMessage } from '../../../interface-adapters/presenters/errorPresenter'
import { paths } from '../../routing/paths'
import { LinkButton } from '../design-system/Button'
import { EmptyState, ErrorState, ListSkeleton } from '../design-system/States'
import { ContentDetailsView } from './ContentDetailsView'

export function ContentDetailsPage() {
  const { contentId = '' } = useParams()
  const details = useContentDetailsController(contentId)

  if (details.status === 'loading') return <ListSkeleton rows={3} />

  if (details.status === 'error') {
    return details.error instanceof NotFoundError ? (
      <EmptyState
        title="Conteúdo não encontrado"
        description="Ele pode ter sido excluído ou o endereço está incorreto."
        action={<LinkButton to={paths.home}>Voltar ao início</LinkButton>}
      />
    ) : (
      <ErrorState message={presentErrorMessage(details.error)} onRetry={details.reload} />
    )
  }

  return <ContentDetailsView key={details.data.id} content={details.data} />
}
