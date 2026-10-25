import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { CONTENT_RULES } from '../../../domain/rules/contentRules'
import type { FieldErrors } from '../../../domain/rules/fieldErrors'
import { remainingFileSlots, remainingImageSlots } from '../../../interface-adapters/controllers/contentDraft'
import { useContentFormController, type ContentFormMode } from '../../../interface-adapters/controllers/useContentFormController'
import { presentCategoryOptions, presentGroupOptions } from '../../../interface-adapters/presenters/formOptionsPresenter'
import { paths } from '../../routing/paths'
import { Button, LinkButton } from '../design-system/Button'
import { Disclosure } from '../design-system/Disclosure'
import { TextField } from '../design-system/TextField'
import { useToast } from '../design-system/toastContext'
import { RichTextEditor } from '../editor/RichTextEditor'
import { useDocumentTitle } from '../layout/useDocumentTitle'
import { ErrorSummary } from './ErrorSummary'
import { FilesEditor } from './FilesEditor'
import styles from './form.module.css'
import { ImagesEditor } from './ImagesEditor'
import { LinksEditor } from './LinksEditor'

const hasErrorsFrom = (errors: FieldErrors, prefix: string) => Object.keys(errors).some((field) => field.startsWith(prefix))

const keptCount = (items: { isRemoved: boolean }[]) => items.filter((item) => !item.isRemoved).length

export function ContentForm({ mode }: { mode: ContentFormMode }) {
  const navigate = useNavigate()
  const toast = useToast()
  const form = useContentFormController(mode)
  const [failedAttempts, setFailedAttempts] = useState(0)

  const { draft, errors } = form
  const isEdit = mode.kind === 'edit'
  const heading = isEdit ? 'Editar conteúdo' : 'Novo conteúdo'
  useDocumentTitle(heading)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const contentId = await form.submit()

    if (!contentId) return setFailedAttempts((attempts) => attempts + 1)

    toast.show(isEdit ? 'Conteúdo atualizado.' : 'Conteúdo salvo.')
    navigate(paths.content(contentId))
  }

  return (
    <form noValidate className={styles.form} onSubmit={submit} aria-label={heading}>
      <h1>{heading}</h1>

      <ErrorSummary errors={errors} generalMessage={form.generalError} focusKey={failedAttempts} />

      <fieldset className={styles.section} disabled={form.isSaving}>
        <legend>Essencial</legend>
        <TextField
          id="field-title"
          label="Título"
          isRequired
          maxLength={CONTENT_RULES.titleMaxLength + 20}
          value={draft.title}
          error={errors.title?.[0]}
          onValueChange={(value) => form.setText('title', value)}
        />
        <TextField
          id="field-groupName"
          label="Grupo"
          isRequired
          hint="Escolha um grupo existente ou digite um nome novo para criá-lo. Exemplo: Livros."
          suggestions={presentGroupOptions(form.groups)}
          value={draft.groupName}
          error={errors.groupName?.[0]}
          onValueChange={(value) => form.setText('groupName', value)}
        />
        <TextField
          id="field-categoryName"
          label="Categoria"
          isRequired
          hint={draft.groupName.trim() === '' ? 'Informe o grupo primeiro.' : 'Escolha uma categoria deste grupo ou digite um nome novo. Exemplo: TI.'}
          suggestions={presentCategoryOptions(form.groups, draft.groupName)}
          disabled={draft.groupName.trim() === ''}
          value={draft.categoryName}
          error={errors.categoryName?.[0]}
          onValueChange={(value) => form.setText('categoryName', value)}
        />
        <RichTextEditor
          id="field-body"
          label="Conteúdo"
          value={draft.body}
          maxLength={CONTENT_RULES.bodyMaxLength}
          errorMessage={errors.body?.[0]}
          isDisabled={form.isSaving}
          onChange={(markdown) => form.setText('body', markdown)}
        />
      </fieldset>

      <section aria-labelledby="complements-title" className={styles.complements}>
        <h2 id="complements-title" className={styles.sectionTitle}>
          Complementos
        </h2>
        <p className={styles.sectionHint}>Tudo aqui é opcional. Abra o que for útil para este conteúdo.</p>

        <Disclosure id="section-links" title="Links de estudo ou referência" count={draft.links.length} forceOpen={hasErrorsFrom(errors, 'links')}>
          <LinksEditor links={draft.links} errors={errors} onAdd={form.addLink} onChange={form.changeLink} onRemove={form.removeLink} />
        </Disclosure>

        <Disclosure
          id="section-images"
          title="Imagens"
          count={keptCount(draft.existingImages) + draft.newImages.length}
          forceOpen={hasErrorsFrom(errors, 'images')}
        >
          <ImagesEditor
            existing={draft.existingImages}
            added={draft.newImages}
            remainingSlots={remainingImageSlots(draft)}
            errors={errors}
            onPick={form.addImages}
            onDescriptionChange={form.changeImageDescription}
            onRemoveAdded={form.removeNewImage}
            onToggleExisting={form.toggleExistingRemoval}
          />
        </Disclosure>

        <Disclosure
          id="section-files"
          title="Arquivos"
          count={keptCount(draft.existingFiles) + draft.newFiles.length}
          forceOpen={hasErrorsFrom(errors, 'files')}
        >
          <FilesEditor
            existing={draft.existingFiles}
            added={draft.newFiles}
            remainingSlots={remainingFileSlots(draft)}
            errors={errors}
            onPick={form.addFiles}
            onRemoveAdded={form.removeNewFile}
            onToggleExisting={form.toggleExistingRemoval}
          />
        </Disclosure>
      </section>

      <div className={styles.footer}>
        <LinkButton to={isEdit ? paths.content(mode.content.id) : paths.home}>Cancelar</LinkButton>
        <Button type="submit" variant="primary" disabled={form.isSaving}>
          {form.isSaving ? 'Salvando…' : 'Salvar conteúdo'}
        </Button>
      </div>
    </form>
  )
}
