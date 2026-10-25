export interface ReferenceLink {
  id: string
  url: string
  label: string | null
}

export interface ImageAttachment {
  id: string
  fileName: string
  description: string | null
  sizeInBytes: number
  url: string
}

export interface FileAttachment {
  id: string
  fileName: string
  contentType: string
  sizeInBytes: number
  url: string
}

export interface ContentSummary {
  id: string
  title: string
  groupId: string
  groupName: string
  categoryId: string
  categoryName: string
  bodyPreview: string
  linkCount: number
  imageCount: number
  fileCount: number
  updatedAt: string
}

export interface ContentDetails {
  id: string
  title: string
  body: string
  groupId: string
  groupName: string
  categoryId: string
  categoryName: string
  createdAt: string
  updatedAt: string
  links: ReferenceLink[]
  images: ImageAttachment[]
  files: FileAttachment[]
}

export interface Page<T> {
  items: T[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
