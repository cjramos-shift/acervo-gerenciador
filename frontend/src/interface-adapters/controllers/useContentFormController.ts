import { useState } from 'react'
import { ValidationError } from '../../application/errors'
import type { UploadableFile } from '../../application/ports/contentGateway'
import type { ContentDetails } from '../../domain/entities/content'
import type { FieldErrors } from '../../domain/rules/fieldErrors'
import { presentErrorMessage } from '../presenters/errorPresenter'
import {
  createDraftFromDetails,
  createEmptyDraft,
  draftToContentForm,
  withImageDescription,
  withLinkChange,
  withNewFiles,
  withNewImages,
  withNewLink,
  withoutLink,
  withoutNewFile,
  withoutNewImage,
  withText,
  withToggledRemoval,
  type ContentDraft,
  type LinkItem,
  type TextField,
} from './contentDraft'
import { useGroupTree } from './groupTreeContext'
import { useUseCases } from './useCasesContext'

export type ContentFormMode = { kind: 'create' } | { kind: 'edit'; content: ContentDetails }

const withoutErrorsFrom = (errors: FieldErrors, fieldPrefix: string): FieldErrors =>
  Object.fromEntries(Object.entries(errors).filter(([field]) => !field.startsWith(fieldPrefix)))

const initialDraftFor = (mode: ContentFormMode) =>
  mode.kind === 'edit' ? createDraftFromDetails(mode.content) : createEmptyDraft()

export function useContentFormController(mode: ContentFormMode) {
  const { registerContent, updateContent } = useUseCases()
  const groupTree = useGroupTree()

  const [draft, setDraft] = useState<ContentDraft>(() => initialDraftFor(mode))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const change = (fieldPrefix: string, update: (current: ContentDraft) => ContentDraft) => {
    setDraft(update)
    setErrors((current) => withoutErrorsFrom(current, fieldPrefix))
  }

  const save = () => {
    const form = draftToContentForm(draft)
    return mode.kind === 'edit' ? updateContent(mode.content.id, form) : registerContent(form)
  }

  const submit = async (): Promise<string | null> => {
    setIsSaving(true)
    setGeneralError(null)

    try {
      const contentId = await save()
      setErrors({})
      groupTree.reload()
      return contentId
    } catch (error) {
      if (error instanceof ValidationError) setErrors(error.fieldErrors)
      setGeneralError(presentErrorMessage(error))
      return null
    } finally {
      setIsSaving(false)
    }
  }

  return {
    draft,
    errors,
    generalError,
    isSaving,
    groups: groupTree.groups,
    setText: (field: TextField, value: string) => change(field, (current) => withText(current, field, value)),
    addLink: () => change('links', withNewLink),
    changeLink: (key: string, patch: Partial<Pick<LinkItem, 'url' | 'label'>>) =>
      change('links', (current) => withLinkChange(current, key, patch)),
    removeLink: (key: string) => change('links', (current) => withoutLink(current, key)),
    addImages: (files: UploadableFile[]) => change('images', (current) => withNewImages(current, files)),
    changeImageDescription: (key: string, description: string) =>
      change('images', (current) => withImageDescription(current, key, description)),
    removeNewImage: (key: string) => change('images', (current) => withoutNewImage(current, key)),
    addFiles: (files: UploadableFile[]) => change('files', (current) => withNewFiles(current, files)),
    removeNewFile: (key: string) => change('files', (current) => withoutNewFile(current, key)),
    toggleExistingRemoval: (attachmentId: string) => setDraft((current) => withToggledRemoval(current, attachmentId)),
    submit,
  }
}

export type ContentFormController = ReturnType<typeof useContentFormController>
