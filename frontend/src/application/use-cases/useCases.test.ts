import { describe, expect, it, vi } from 'vitest'
import type { ContentFormData, ContentGateway } from '../ports/contentGateway'
import { ValidationError } from '../errors'
import { createListContents } from './listContents'
import { createRegisterContent } from './registerContent'
import { createUpdateContent } from './updateContent'

const fakeGateway = (): ContentGateway => ({
  list: vi.fn().mockResolvedValue({ items: [], page: 1, pageSize: 12, totalItems: 0, totalPages: 0 }),
  getById: vi.fn(),
  create: vi.fn().mockResolvedValue('new-id'),
  update: vi.fn().mockResolvedValue('same-id'),
  remove: vi.fn(),
})

const validForm = (): ContentFormData => ({
  title: 'Livros interessantes',
  body: '- item',
  groupName: 'Livros',
  categoryName: 'TI',
  links: [],
  images: [],
  files: [],
  removedAttachmentIds: [],
})

describe('registerContent', () => {
  it('sends a valid form to the gateway', async () => {
    const gateway = fakeGateway()

    await expect(createRegisterContent(gateway)(validForm())).resolves.toBe('new-id')
    expect(gateway.create).toHaveBeenCalledOnce()
  })

  it('rejects an invalid form without calling the gateway', async () => {
    const gateway = fakeGateway()

    const attempt = createRegisterContent(gateway)({ ...validForm(), title: '' })

    await expect(attempt).rejects.toBeInstanceOf(ValidationError)
    await expect(attempt).rejects.toMatchObject({ fieldErrors: { title: expect.any(Array) } })
    expect(gateway.create).not.toHaveBeenCalled()
  })
})

describe('updateContent', () => {
  it('validates before updating', async () => {
    const gateway = fakeGateway()

    await expect(createUpdateContent(gateway)('abc', { ...validForm(), body: '' })).rejects.toBeInstanceOf(ValidationError)
    expect(gateway.update).not.toHaveBeenCalled()
  })

  it('updates with a valid form', async () => {
    const gateway = fakeGateway()

    await expect(createUpdateContent(gateway)('abc', validForm())).resolves.toBe('same-id')
    expect(gateway.update).toHaveBeenCalledWith('abc', validForm())
  })
})

describe('listContents', () => {
  it('forwards a valid filter', async () => {
    const gateway = fakeGateway()
    const filter = { search: 'algebra', page: 2 }

    await createListContents(gateway)(filter)

    expect(gateway.list).toHaveBeenCalledWith(filter, undefined)
  })

  it('turns an invalid search term into a rejected promise', async () => {
    const gateway = fakeGateway()

    await expect(createListContents(gateway)({ search: 'a' })).rejects.toBeInstanceOf(ValidationError)
    expect(gateway.list).not.toHaveBeenCalled()
  })
})
