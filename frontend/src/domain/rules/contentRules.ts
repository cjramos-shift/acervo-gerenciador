export const CONTENT_RULES = {
  titleMinLength: 3,
  titleMaxLength: 150,
  bodyMaxLength: 50_000,
  nameMinLength: 2,
  nameMaxLength: 60,
  maxLinks: 20,
  linkLabelMaxLength: 100,
  maxImages: 10,
  maxFiles: 10,
  descriptionMaxLength: 200,
} as const

const ABSOLUTE_WEB_URL = /^https?:\/\/\S+$/i

const rangeMessage = (min: number, max: number) => `Informe de ${min} a ${max} caracteres.`

export const collapseWhitespace = (text: string) => text.trim().replace(/\s+/g, ' ')

export function validateTitle(title: string): string | null {
  const { titleMinLength, titleMaxLength } = CONTENT_RULES
  const length = title.trim().length
  return length < titleMinLength || length > titleMaxLength ? rangeMessage(titleMinLength, titleMaxLength) : null
}

export function validateBody(markdown: string): string | null {
  if (markdown.trim().length === 0) return 'Escreva o conteúdo.'
  return markdown.length > CONTENT_RULES.bodyMaxLength
    ? `O conteúdo ultrapassa o limite de ${CONTENT_RULES.bodyMaxLength.toLocaleString('pt-BR')} caracteres.`
    : null
}

export function validateName(name: string): string | null {
  const { nameMinLength, nameMaxLength } = CONTENT_RULES
  const length = collapseWhitespace(name).length
  return length < nameMinLength || length > nameMaxLength ? rangeMessage(nameMinLength, nameMaxLength) : null
}

export function validateLinkUrl(url: string): string | null {
  return ABSOLUTE_WEB_URL.test(url.trim()) ? null : 'Informe uma URL completa, começando com http:// ou https://.'
}

export function validateLinkLabel(label: string): string | null {
  return label.trim().length > CONTENT_RULES.linkLabelMaxLength
    ? `O rótulo deve ter até ${CONTENT_RULES.linkLabelMaxLength} caracteres.`
    : null
}

export function validateDescription(description: string): string | null {
  return description.trim().length > CONTENT_RULES.descriptionMaxLength
    ? `A descrição deve ter até ${CONTENT_RULES.descriptionMaxLength} caracteres.`
    : null
}
