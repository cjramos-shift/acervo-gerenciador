import { describe, expect, it } from 'vitest'
import type { ContentDetails } from '../../domain/entities/content'
import {
  createDraftFromDetails,
  createEmptyDraft,
  draftToContentForm,
  filledLinkIndex,
  remainingImageSlots,
  withImageDescription,
  withLinkChange,
  withNewImages,
  withNewLink,
  withToggledRemoval,
  withoutLink,
  withText,
} from './contentDraft'

const details: ContentDetails = {
  id: '1', title: 'Livros', body: '- item', groupId: 'g', groupName: 'Livros', categoryId: 'c', categoryName: 'TI',
  createdAt: '', updatedAt: '',
  links: [{ id: 'l1', url: 'https://a.com', label: null }],
  images: [{ id: 'i1', fileName: 'a.png', description: null, sizeInBytes: 1, url: '/i1' }],
  files: [{ id: 'f1', fileName: 'a.pdf', contentType: 'application/pdf', sizeInBytes: 1, url: '/f1' }],
}

const file = (name: string) => new File(['x'], name)

describe('contentDraft', () => {
  it('starts empty and updates text immutably', () => {
    const draft = createEmptyDraft()
    expect(withText(draft, 'title', 'Novo').title).toBe('Novo')
    expect(draft.title).toBe('')
  })

  it('loads an existing content for editing', () => {
    const draft = createDraftFromDetails(details)

    expect(draft.links).toHaveLength(1)
    expect(draft.links[0].label).toBe('')
    expect(draft.existingImages[0].isRemoved).toBe(false)
  })

  it('adds, edits and removes link rows', () => {
    let draft = withNewLink(createEmptyDraft())
    const key = draft.links[0].key

    draft = withLinkChange(draft, key, { url: 'https://a.com' })
    expect(draft.links[0].url).toBe('https://a.com')

    expect(withoutLink(draft, key).links).toHaveLength(0)
  })

  it('does not send blank link rows', () => {
    const draft = withNewLink(createEmptyDraft())

    expect(draftToContentForm(draft).links).toEqual([])
  })

  it('maps a link error index ignoring blank rows', () => {
    let draft = withNewLink(withNewLink(withNewLink(createEmptyDraft())))
    draft = withLinkChange(draft, draft.links[2].key, { url: 'https://c.com' })
    draft = withLinkChange(draft, draft.links[0].key, { url: 'https://a.com' })

    expect(filledLinkIndex(draft.links, draft.links[0].key)).toBe(0)
    expect(filledLinkIndex(draft.links, draft.links[1].key)).toBeNull()
    expect(filledLinkIndex(draft.links, draft.links[2].key)).toBe(1)
  })

  it('collects ids of attachments marked for removal', () => {
    const draft = withToggledRemoval(withToggledRemoval(createDraftFromDetails(details), 'i1'), 'f1')

    expect(draftToContentForm(draft).removedAttachmentIds).toEqual(['i1', 'f1'])
  })

  it('lets the user undo a removal', () => {
    const draft = withToggledRemoval(withToggledRemoval(createDraftFromDetails(details), 'i1'), 'i1')

    expect(draftToContentForm(draft).removedAttachmentIds).toEqual([])
  })

  it('counts remaining image slots including kept and new images', () => {
    let draft = createDraftFromDetails(details)
    draft = withNewImages(draft, [file('b.png'), file('c.png')])
    expect(remainingImageSlots(draft)).toBe(7)

    draft = withToggledRemoval(draft, 'i1')
    expect(remainingImageSlots(draft)).toBe(8)
  })

  it('sends new images with their descriptions in order', () => {
    let draft = withNewImages(createEmptyDraft(), [file('b.png')])
    draft = withImageDescription(draft, draft.newImages[0].key, 'Capa')

    expect(draftToContentForm(draft).images).toEqual([{ file: draft.newImages[0].file, description: 'Capa' }])
  })
})
