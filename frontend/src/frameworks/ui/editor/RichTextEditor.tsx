import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'
import { CONTENT_RULES } from '../../../domain/rules/contentRules'
import { Icon } from '../design-system/Icon'
import formStyles from '../design-system/formField.module.css'
import { markdownContentClassName } from '../markdown/markdownClassName'
import { EditorToolbar } from './EditorToolbar'
import { createEditorExtensions } from './editorExtensions'
import styles from './editor.module.css'
import { LinkDialog } from './LinkDialog'
import { ShortcutsDialog } from './ShortcutsDialog'

interface RichTextEditorProps {
  id: string
  label: string
  value: string
  onChange: (markdown: string) => void
  maxLength?: number
  errorMessage?: string
  isDisabled?: boolean
}

const isLinkShortcut = (event: KeyboardEvent) => (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'

export function RichTextEditor({
  id,
  label,
  value,
  onChange,
  maxLength = CONTENT_RULES.bodyMaxLength,
  errorMessage,
  isDisabled = false,
}: RichTextEditorProps) {
  const toolbarRef = useRef<HTMLDivElement>(null)
  const lastEmittedMarkdown = useRef(value)
  const onChangeRef = useRef(onChange)
  const openLinkDialogRef = useRef<() => void>(() => undefined)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)

  const labelId = `${id}-label`
  const errorId = `${id}-error`

  const editor = useEditor({
    extensions: createEditorExtensions(),
    content: value,
    contentType: 'markdown',
    editable: !isDisabled,
    editorProps: {
      attributes: { id, role: 'textbox', 'aria-multiline': 'true', 'aria-labelledby': labelId, class: markdownContentClassName },
      handleKeyDown: (_view, event) => {
        if (event.key === 'Escape') {
          toolbarRef.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus()
          return true
        }
        if (!isLinkShortcut(event)) return false

        event.preventDefault()
        openLinkDialogRef.current()
        return true
      },
    },
    onUpdate: ({ editor: updated }) => {
      lastEmittedMarkdown.current = updated.getMarkdown()
      onChangeRef.current(lastEmittedMarkdown.current)
    },
  })

  useEffect(() => {
    onChangeRef.current = onChange
    openLinkDialogRef.current = () => setIsLinkDialogOpen(true)
  })

  useEffect(() => {
    editor.setEditable(!isDisabled)
  }, [editor, isDisabled])

  useEffect(() => {
    editor.setOptions({
      editorProps: {
        attributes: {
          id,
          role: 'textbox',
          'aria-multiline': 'true',
          'aria-labelledby': labelId,
          'aria-invalid': errorMessage ? 'true' : 'false',
          ...(errorMessage ? { 'aria-describedby': errorId } : {}),
          class: markdownContentClassName,
        },
      },
    })
  }, [editor, id, labelId, errorId, errorMessage])

  useEffect(() => {
    if (value === lastEmittedMarkdown.current) return

    lastEmittedMarkdown.current = value
    editor.commands.setContent(value, { contentType: 'markdown', emitUpdate: false })
  }, [editor, value])

  const applyLink = (url: string) => {
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    setIsLinkDialogOpen(false)
  }

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setIsLinkDialogOpen(false)
  }

  const isOverLimit = value.length > maxLength

  return (
    <div>
      <span id={labelId} className={formStyles.label}>
        {label} <span className={formStyles.required}>(obrigatório)</span>
      </span>
      <div className={`${styles.editor} ${errorMessage ? styles.invalid : ''}`} style={{ marginTop: 'var(--space-2)' }}>
        <EditorToolbar
          editor={editor}
          toolbarRef={toolbarRef}
          onOpenLink={() => setIsLinkDialogOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />
        <EditorContent editor={editor} className={styles.surface} />
        <p className={`${styles.footer} ${isOverLimit ? styles.overLimit : ''}`}>
          {value.length.toLocaleString('pt-BR')} / {maxLength.toLocaleString('pt-BR')} caracteres
        </p>
      </div>
      {errorMessage && (
        <p id={errorId} className={formStyles.error} style={{ marginTop: 'var(--space-2)' }}>
          <Icon name="alert" size={18} />
          <span>{errorMessage}</span>
        </p>
      )}
      <LinkDialog
        isOpen={isLinkDialogOpen}
        initialUrl={editor.getAttributes('link').href ?? ''}
        onApply={applyLink}
        onRemove={removeLink}
        onClose={() => setIsLinkDialogOpen(false)}
      />
      <ShortcutsDialog isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </div>
  )
}
