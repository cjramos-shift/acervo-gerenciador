import type { ContentFormData, UploadableFile } from '../../application/ports/contentGateway'
import type { ContentDetails } from '../../domain/entities/content'
import { CONTENT_RULES } from '../../domain/rules/contentRules'

export interface LinkItem {
  key: string
  url: string
  label: string
}

export interface NewImageItem {
  key: string
  file: UploadableFile
  description: string
}

export interface NewFileItem {
  key: string
  file: UploadableFile
}

export interface ExistingAttachmentItem {
  id: string
  fileName: string
  url: string
  description: string | null
  isRemoved: boolean
}

export interface ContentDraft {
  title: string
  body: string
  groupName: string
  categoryName: string
  links: LinkItem[]
  newImages: NewImageItem[]
  newFiles: NewFileItem[]
  existingImages: ExistingAttachmentItem[]
  existingFiles: ExistingAttachmentItem[]
}

export type TextField = 'title' | 'body' | 'groupName' | 'categoryName'

let lastKey = 0
const newKey = () => `item-${++lastKey}`

export const createEmptyDraft = (): ContentDraft => ({
  title: '',
  body: '',
  groupName: '',
  categoryName: '',
  links: [],
  newImages: [],
  newFiles: [],
  existingImages: [],
  existingFiles: [],
})

export const createDraftFromDetails = (details: ContentDetails): ContentDraft => ({
  ...createEmptyDraft(),
  title: details.title,
  body: details.body,
  groupName: details.groupName,
  categoryName: details.categoryName,
  links: details.links.map((link) => ({ key: newKey(), url: link.url, label: link.label ?? '' })),
  existingImages: details.images.map((image) => ({
    id: image.id,
    fileName: image.fileName,
    url: image.url,
    description: image.description,
    isRemoved: false,
  })),
  existingFiles: details.files.map((file) => ({
    id: file.id,
    fileName: file.fileName,
    url: file.url,
    description: null,
    isRemoved: false,
  })),
})

export const withText = (draft: ContentDraft, field: TextField, value: string): ContentDraft => ({
  ...draft,
  [field]: value,
})

export const withNewLink = (draft: ContentDraft): ContentDraft => ({
  ...draft,
  links: [...draft.links, { key: newKey(), url: '', label: '' }],
})

export const withLinkChange = (
  draft: ContentDraft,
  key: string,
  change: Partial<Pick<LinkItem, 'url' | 'label'>>,
): ContentDraft => ({
  ...draft,
  links: draft.links.map((link) => (link.key === key ? { ...link, ...change } : link)),
})

export const withoutLink = (draft: ContentDraft, key: string): ContentDraft => ({
  ...draft,
  links: draft.links.filter((link) => link.key !== key),
})

export const withNewImages = (draft: ContentDraft, files: UploadableFile[]): ContentDraft => ({
  ...draft,
  newImages: [...draft.newImages, ...files.map((file) => ({ key: newKey(), file, description: '' }))],
})

export const withImageDescription = (draft: ContentDraft, key: string, description: string): ContentDraft => ({
  ...draft,
  newImages: draft.newImages.map((image) => (image.key === key ? { ...image, description } : image)),
})

export const withoutNewImage = (draft: ContentDraft, key: string): ContentDraft => ({
  ...draft,
  newImages: draft.newImages.filter((image) => image.key !== key),
})

export const withNewFiles = (draft: ContentDraft, files: UploadableFile[]): ContentDraft => ({
  ...draft,
  newFiles: [...draft.newFiles, ...files.map((file) => ({ key: newKey(), file }))],
})

export const withoutNewFile = (draft: ContentDraft, key: string): ContentDraft => ({
  ...draft,
  newFiles: draft.newFiles.filter((file) => file.key !== key),
})

const toggleRemoval = (items: ExistingAttachmentItem[], id: string) =>
  items.map((item) => (item.id === id ? { ...item, isRemoved: !item.isRemoved } : item))

export const withToggledRemoval = (draft: ContentDraft, attachmentId: string): ContentDraft => ({
  ...draft,
  existingImages: toggleRemoval(draft.existingImages, attachmentId),
  existingFiles: toggleRemoval(draft.existingFiles, attachmentId),
})

const keptCount = (items: ExistingAttachmentItem[]) => items.filter((item) => !item.isRemoved).length

export const remainingImageSlots = (draft: ContentDraft) =>
  Math.max(CONTENT_RULES.maxImages - keptCount(draft.existingImages) - draft.newImages.length, 0)

export const remainingFileSlots = (draft: ContentDraft) =>
  Math.max(CONTENT_RULES.maxFiles - keptCount(draft.existingFiles) - draft.newFiles.length, 0)

const isFilledLink = (link: LinkItem) => link.url.trim() !== '' || link.label.trim() !== ''

export function filledLinkIndex(links: LinkItem[], key: string): number | null {
  const index = links.filter(isFilledLink).findIndex((link) => link.key === key)
  return index < 0 ? null : index
}

export const draftToContentForm = (draft: ContentDraft): ContentFormData => ({
  title: draft.title,
  body: draft.body,
  groupName: draft.groupName,
  categoryName: draft.categoryName,
  links: draft.links.filter(isFilledLink).map(({ url, label }) => ({ url, label })),
  images: draft.newImages.map(({ file, description }) => ({ file, description })),
  files: draft.newFiles.map(({ file }) => file),
  removedAttachmentIds: [...draft.existingImages, ...draft.existingFiles]
    .filter((item) => item.isRemoved)
    .map((item) => item.id),
})
