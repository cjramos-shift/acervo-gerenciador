import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { ContentDetails } from '../../../domain/entities/content'
import { useDeleteContentController } from '../../../interface-adapters/controllers/useDeleteContentController'
import { formatDateTime } from '../../../interface-adapters/presenters/datePresenter'
import { presentContentTabs, type ContentTabId } from '../../../interface-adapters/presenters/contentTabsPresenter'
import { paths } from '../../routing/paths'
import { Button, LinkButton } from '../design-system/Button'
import { Dialog } from '../design-system/Dialog'
import { Tabs } from '../design-system/Tabs'
import { useToast } from '../design-system/toastContext'
import { FileList, ImageGallery, ReferenceLinkList } from '../content/AttachmentLists'
import { MarkdownContent } from '../markdown/MarkdownContent'
import { useDocumentTitle } from '../layout/useDocumentTitle'
import { Breadcrumb } from './Breadcrumb'
import styles from './pageLayout.module.css'

function TabPanelContent({ content, tabId }: { content: ContentDetails; tabId: ContentTabId }) {
  if (tabId === 'links') return <ReferenceLinkList links={content.links} />
  if (tabId === 'images') return <ImageGallery images={content.images} />
  if (tabId === 'files') return <FileList files={content.files} />
  return <MarkdownContent markdown={content.body} />
}

export function ContentDetailsView({ content }: { content: ContentDetails }) {
  const navigate = useNavigate()
  const toast = useToast()
  const deletion = useDeleteContentController()
  const [activeTab, setActiveTab] = useState<ContentTabId>('content')
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  useDocumentTitle(content.title)
  const tabs = presentContentTabs(content)

  const confirmDelete = async () => {
    const wasDeleted = await deletion.remove(content.id)
    if (!wasDeleted) return

    setIsConfirmingDelete(false)
    toast.show('Conteúdo excluído.')
    navigate(paths.home)
  }

  return (
    <article>
      <div className={styles.header}>
        <Breadcrumb
          items={[
            { label: 'Início', to: paths.home },
            { label: content.groupName, to: paths.group(content.groupId) },
            { label: content.categoryName, to: paths.category(content.groupId, content.categoryId) },
          ]}
        />
        <h1>{content.title}</h1>
        <p className={styles.subtitle}>Atualizado em {formatDateTime(content.updatedAt)}</p>
      </div>

      <div className={styles.actions}>
        <LinkButton icon="edit" to={paths.editContent(content.id)}>
          Editar
        </LinkButton>
        <Button variant="danger" icon="trash" onClick={() => setIsConfirmingDelete(true)}>
          Excluir
        </Button>
      </div>

      <Tabs idPrefix="content" label="Seções do conteúdo" tabs={tabs} activeId={activeTab} onChange={setActiveTab}>
        <TabPanelContent content={content} tabId={activeTab} />
      </Tabs>

      <Dialog
        isOpen={isConfirmingDelete}
        title="Excluir este conteúdo?"
        onClose={() => setIsConfirmingDelete(false)}
        actions={
          <>
            <Button onClick={() => setIsConfirmingDelete(false)}>Cancelar</Button>
            <Button variant="danger" disabled={deletion.isDeleting} onClick={confirmDelete}>
              {deletion.isDeleting ? 'Excluindo…' : 'Excluir conteúdo'}
            </Button>
          </>
        }
      >
        <p>
          “{content.title}” e seus links, imagens e arquivos serão removidos de forma permanente.
        </p>
        {deletion.errorMessage && <p role="alert">{deletion.errorMessage}</p>}
      </Dialog>
    </article>
  )
}
