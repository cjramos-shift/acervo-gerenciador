export const UPLOAD_RULES = {
  imageExtensions: ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
  fileExtensions: ['.pdf', '.txt', '.md', '.docx', '.xlsx', '.pptx', '.zip'],
  maxImageBytes: 5 * 1024 * 1024,
  maxFileBytes: 20 * 1024 * 1024,
} as const

export interface FileLike {
  readonly name: string
  readonly size: number
}

const BYTES_PER_MEGABYTE = 1024 * 1024

function extensionOf(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.')
  return dotIndex < 0 ? '' : fileName.slice(dotIndex).toLowerCase()
}

function validateFile(file: FileLike, allowed: readonly string[], maxBytes: number): string | null {
  if (!allowed.includes(extensionOf(file.name))) return `Tipo não permitido. Use: ${allowed.join(', ')}.`
  if (file.size <= 0) return 'O arquivo está vazio.'
  return file.size > maxBytes ? `O arquivo ultrapassa o limite de ${maxBytes / BYTES_PER_MEGABYTE} MB.` : null
}

export const validateImageFile = (file: FileLike) =>
  validateFile(file, UPLOAD_RULES.imageExtensions, UPLOAD_RULES.maxImageBytes)

export const validateAttachmentFile = (file: FileLike) =>
  validateFile(file, UPLOAD_RULES.fileExtensions, UPLOAD_RULES.maxFileBytes)
