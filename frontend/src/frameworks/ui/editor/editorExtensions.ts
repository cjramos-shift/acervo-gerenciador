import { Markdown } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'

const SAFE_LINK_PROTOCOLS = /^(https?:|mailto:)/i

export const HEADING_LEVELS = [2, 3, 4] as const

export const createEditorExtensions = () => [
  StarterKit.configure({
    heading: { levels: [...HEADING_LEVELS] },
    link: {
      openOnClick: false,
      autolink: false,
      linkOnPaste: true,
      isAllowedUri: (url) => SAFE_LINK_PROTOCOLS.test(url),
    },
    strike: false,
    underline: false,
    trailingNode: false,
  }),
  Markdown,
]
