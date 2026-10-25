import { describe, expect, it } from 'vitest'
import { validateContentForm, type ContentFormValues } from './contentFormRules'

const validForm = (): ContentFormValues => ({
  title: 'Livros interessantes',
  body: '- **C How to Program**',
  groupName: 'Livros',
  categoryName: 'TI',
  links: [],
  images: [],
  files: [],
})

describe('validateContentForm', () => {
  it('returns no errors for a valid form', () => expect(validateContentForm(validForm())).toEqual({}))

  it('reports every invalid essential field at once', () => {
    const errors = validateContentForm({ ...validForm(), title: '', body: '', groupName: '', categoryName: '' })

    expect(Object.keys(errors).sort()).toEqual(['body', 'categoryName', 'groupName', 'title'])
  })

  it('uses indexed keys that match the API contract', () => {
    const errors = validateContentForm({
      ...validForm(),
      links: [{ url: 'https://ok.com', label: '' }, { url: 'javascript:x', label: '' }],
      images: [{ file: { name: 'a.svg', size: 10 }, description: '' }],
      files: [{ name: 'a.exe', size: 10 }],
    })

    expect(Object.keys(errors).sort()).toEqual(['files[0]', 'images[0].file', 'links[1].url'])
  })

  it('flags a repeated link url on the repeated row', () => {
    const errors = validateContentForm({
      ...validForm(),
      links: [{ url: 'https://a.com', label: '' }, { url: 'HTTPS://A.COM', label: '' }],
    })

    expect(errors['links[1].url']).toEqual(['Esta URL já foi adicionada.'])
  })
})
