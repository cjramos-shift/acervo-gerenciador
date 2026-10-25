import { Button } from '../design-system/Button'
import { Dialog } from '../design-system/Dialog'
import styles from './editor.module.css'

const SHORTCUTS: [string, string][] = [
  ['Ctrl/⌘ + B', 'Negrito'],
  ['Ctrl/⌘ + I', 'Itálico'],
  ['Ctrl/⌘ + E', 'Código em linha'],
  ['Ctrl/⌘ + K', 'Inserir ou editar link'],
  ['Ctrl/⌘ + Alt + 2, 3 ou 4', 'Título nível 2, 3 ou 4'],
  ['Ctrl/⌘ + Shift + 8', 'Lista com marcadores'],
  ['Ctrl/⌘ + Shift + 7', 'Lista numerada'],
  ['Ctrl/⌘ + Shift + B', 'Citação'],
  ['Ctrl/⌘ + Alt + C', 'Bloco de código'],
  ['Ctrl/⌘ + Z', 'Desfazer'],
  ['Ctrl/⌘ + Shift + Z', 'Refazer'],
  ['Esc', 'Mover o foco para a barra de ferramentas'],
  ['Digitar “- ”, “1. ” ou “## ”', 'Cria lista, lista numerada ou título (sintaxe Markdown)'],
]

interface ShortcutsDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ShortcutsDialog({ isOpen, onClose }: ShortcutsDialogProps) {
  return (
    <Dialog isOpen={isOpen} title="Atalhos de teclado" onClose={onClose} actions={<Button onClick={onClose}>Fechar</Button>}>
      <dl className={styles.shortcuts}>
        {SHORTCUTS.map(([keys, description]) => (
          <div key={keys} style={{ display: 'contents' }}>
            <dt>{keys}</dt>
            <dd>{description}</dd>
          </div>
        ))}
      </dl>
    </Dialog>
  )
}
