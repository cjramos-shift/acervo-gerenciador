import type { ContentFormData } from '../../application/ports/contentGateway'

export function toFormData(form: ContentFormData): FormData {
  const data = new FormData()

  data.append('title', form.title)
  data.append('body', form.body)
  data.append('groupName', form.groupName)
  data.append('categoryName', form.categoryName)

  form.links.forEach((link, index) => {
    data.append(`links[${index}].url`, link.url)
    data.append(`links[${index}].label`, link.label)
  })
  form.images.forEach((image, index) => {
    data.append(`images[${index}].file`, image.file, image.file.name)
    data.append(`images[${index}].description`, image.description)
  })
  form.files.forEach((file) => data.append('files', file, file.name))
  form.removedAttachmentIds.forEach((id) => data.append('removedAttachmentIds', id))

  return data
}
