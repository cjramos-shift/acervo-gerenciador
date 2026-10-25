const DIRECT_ANCHORS: Record<string, string> = {
  title: 'field-title',
  groupName: 'field-groupName',
  categoryName: 'field-categoryName',
  body: 'field-body',
}

const SECTION_ANCHORS: [prefix: string, anchor: string][] = [
  ['links', 'section-links'],
  ['images', 'section-images'],
  ['files', 'section-files'],
  ['removedAttachmentIds', 'section-images'],
]

export function anchorForField(field: string): string | null {
  return DIRECT_ANCHORS[field] ?? SECTION_ANCHORS.find(([prefix]) => field.startsWith(prefix))?.[1] ?? null
}

export function focusAnchor(anchor: string): void {
  const element = document.getElementById(anchor)
  const target = element?.matches('details') ? element.querySelector('summary') : element
  target?.focus()
}
