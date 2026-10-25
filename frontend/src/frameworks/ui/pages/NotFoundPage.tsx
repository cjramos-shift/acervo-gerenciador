import { paths } from '../../routing/paths'
import { LinkButton } from '../design-system/Button'
import { EmptyState } from '../design-system/States'
import { useDocumentTitle } from '../layout/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Página não encontrada')

  return (
    <EmptyState
      title="Página não encontrada"
      description="O endereço que você abriu não existe no Acervo."
      action={<LinkButton to={paths.home}>Voltar ao início</LinkButton>}
    />
  )
}
