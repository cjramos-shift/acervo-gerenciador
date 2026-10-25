import type { ContentDetails, ContentSummary, Page } from '../../domain/entities/content'

export type UploadableFile = Blob & { readonly name: string }

export interface ContentListFilter {
  groupId?: string
  categoryId?: string
  search?: string
  page?: number
  pageSize?: number
}

export interface ContentFormData {
  title: string
  body: string
  groupName: string
  categoryName: string
  links: { url: string; label: string }[]
  images: { file: UploadableFile; description: string }[]
  files: UploadableFile[]
  removedAttachmentIds: string[]
}

export interface ContentGateway {
  list(filter: ContentListFilter, signal?: AbortSignal): Promise<Page<ContentSummary>>
  getById(contentId: string, signal?: AbortSignal): Promise<ContentDetails>
  create(form: ContentFormData): Promise<string>
  update(contentId: string, form: ContentFormData): Promise<string>
  remove(contentId: string): Promise<void>
}
