import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'
import { useState, type KeyboardEvent, type RefObject } from 'react'
import { Icon, type IconName } from '../design-system/Icon'
import styles from './editor.module.css'

interface ToolbarAction {
  id: string
  label: string
  icon?: IconName
  text?: string
  isActive?: boolean
  isDisabled?: boolean
  run: () => void
}

interface EditorToolbarProps {
  editor: Editor
  toolbarRef: RefObject<HTMLDivElement | null>
  onOpenLink: () => void
  onOpenShortcuts: () => void
}

function useToolbarState(editor: Editor) {
  return useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current?.isActive('bold') ?? false,
      italic: current?.isActive('italic') ?? false,
      code: current?.isActive('code') ?? false,
      h2: current?.isActive('heading', { level: 2 }) ?? false,
      h3: current?.isActive('heading', { level: 3 }) ?? false,
      h4: current?.isActive('heading', { level: 4 }) ?? false,
      bulletList: current?.isActive('bulletList') ?? false,
      orderedList: current?.isActive('orderedList') ?? false,
      blockquote: current?.isActive('blockquote') ?? false,
      codeBlock: current?.isActive('codeBlock') ?? false,
      link: current?.isActive('link') ?? false,
      canUndo: current?.can().undo() ?? false,
      canRedo: current?.can().redo() ?? false,
    }),
  })
}

function buildActionGroups({ editor, onOpenLink, onOpenShortcuts }: Omit<EditorToolbarProps, 'toolbarRef'>, state: ReturnType<typeof useToolbarState>): ToolbarAction[][] {
  const chain = () => editor.chain().focus()

  return [
    [
      { id: 'h2', label: 'Título nível 2', text: 'H2', isActive: state.h2, run: () => chain().toggleHeading({ level: 2 }).run() },
      { id: 'h3', label: 'Título nível 3', text: 'H3', isActive: state.h3, run: () => chain().toggleHeading({ level: 3 }).run() },
      { id: 'h4', label: 'Título nível 4', text: 'H4', isActive: state.h4, run: () => chain().toggleHeading({ level: 4 }).run() },
    ],
    [
      { id: 'bold', label: 'Negrito', icon: 'bold', isActive: state.bold, run: () => chain().toggleBold().run() },
      { id: 'italic', label: 'Itálico', icon: 'italic', isActive: state.italic, run: () => chain().toggleItalic().run() },
      { id: 'code', label: 'Código em linha', icon: 'code', isActive: state.code, run: () => chain().toggleCode().run() },
    ],
    [
      { id: 'bullets', label: 'Lista com marcadores', icon: 'listBullet', isActive: state.bulletList, run: () => chain().toggleBulletList().run() },
      { id: 'numbers', label: 'Lista numerada', icon: 'listOrdered', isActive: state.orderedList, run: () => chain().toggleOrderedList().run() },
      { id: 'quote', label: 'Citação', icon: 'quote', isActive: state.blockquote, run: () => chain().toggleBlockquote().run() },
      { id: 'codeBlock', label: 'Bloco de código', icon: 'codeBlock', isActive: state.codeBlock, run: () => chain().toggleCodeBlock().run() },
    ],
    [
      { id: 'link', label: 'Inserir ou editar link', icon: 'link', isActive: state.link, run: onOpenLink },
      { id: 'rule', label: 'Linha horizontal', icon: 'rule', run: () => chain().setHorizontalRule().run() },
    ],
    [
      { id: 'undo', label: 'Desfazer', icon: 'undo', isDisabled: !state.canUndo, run: () => chain().undo().run() },
      { id: 'redo', label: 'Refazer', icon: 'redo', isDisabled: !state.canRedo, run: () => chain().redo().run() },
    ],
    [{ id: 'shortcuts', label: 'Atalhos de teclado', icon: 'keyboard', run: onOpenShortcuts }],
  ]
}

export function EditorToolbar({ editor, toolbarRef, onOpenLink, onOpenShortcuts }: EditorToolbarProps) {
  const [focusIndex, setFocusIndex] = useState(0)
  const state = useToolbarState(editor)
  const groups = buildActionGroups({ editor, onOpenLink, onOpenShortcuts }, state)
  const actions = groups.flat()

  const moveFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? actions.length - 1 : step === undefined ? null : (focusIndex + step + actions.length) % actions.length
    if (target === null) return

    event.preventDefault()
    setFocusIndex(target)
    toolbarRef.current?.querySelectorAll<HTMLButtonElement>('button')[target]?.focus()
  }

  let actionIndex = -1

  return (
    <div ref={toolbarRef} role="toolbar" aria-label="Formatação do texto" className={styles.toolbar} onKeyDown={moveFocus}>
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} role="group" style={{ display: 'contents' }}>
          {groupIndex > 0 && <span className={styles.separator} aria-hidden="true" />}
          {group.map((action) => {
            actionIndex++
            const index = actionIndex
            return (
              <button
                key={action.id}
                type="button"
                className={styles.toolButton}
                aria-label={action.label}
                title={action.label}
                aria-pressed={action.isActive === undefined ? undefined : action.isActive}
                disabled={action.isDisabled}
                tabIndex={index === focusIndex ? 0 : -1}
                onFocus={() => setFocusIndex(index)}
                onClick={action.run}
              >
                {action.icon ? <Icon name={action.icon} /> : action.text}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
