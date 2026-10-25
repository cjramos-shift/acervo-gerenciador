import {
  validateBody,
  validateDescription,
  validateLinkLabel,
  validateLinkUrl,
  validateName,
  validateTitle,
} from './contentRules'
import { addFieldError, type FieldErrors } from './fieldErrors'
import { validateAttachmentFile, validateImageFile, type FileLike } from './uploadRules'

export interface ContentFormValues {
  title: string
  body: string
  groupName: string
  categoryName: string
  links: { url: string; label: string }[]
  images: { file: FileLike; description: string }[]
  files: FileLike[]
}

function validateLinks(links: ContentFormValues['links'], errors: FieldErrors): void {
  const seenUrls = new Set<string>()

  links.forEach((link, index) => {
    const normalizedUrl = link.url.trim().toLowerCase()
    addFieldError(errors, `links[${index}].url`, validateLinkUrl(link.url))
    addFieldError(errors, `links[${index}].label`, validateLinkLabel(link.label))

    if (seenUrls.has(normalizedUrl)) addFieldError(errors, `links[${index}].url`, 'Esta URL já foi adicionada.')
    seenUrls.add(normalizedUrl)
  })
}

function validateUploads(values: ContentFormValues, errors: FieldErrors): void {
  values.images.forEach((image, index) => {
    addFieldError(errors, `images[${index}].file`, validateImageFile(image.file))
    addFieldError(errors, `images[${index}].description`, validateDescription(image.description))
  })
  values.files.forEach((file, index) => addFieldError(errors, `files[${index}]`, validateAttachmentFile(file)))
}

export function validateContentForm(values: ContentFormValues): FieldErrors {
  const errors: FieldErrors = {}

  addFieldError(errors, 'title', validateTitle(values.title))
  addFieldError(errors, 'groupName', validateName(values.groupName))
  addFieldError(errors, 'categoryName', validateName(values.categoryName))
  addFieldError(errors, 'body', validateBody(values.body))
  validateLinks(values.links, errors)
  validateUploads(values, errors)

  return errors
}
