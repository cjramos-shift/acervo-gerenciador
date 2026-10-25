import { useState } from 'react'
import { validateLinkUrl } from '../../../domain/rules/contentRules'
import { Button } from '../design-system/Button'
import { Dialog } from '../design-system/Dialog'
import { TextField } from '../design-system/TextField'

interface LinkDialogProps {
  isOpen: boolean
  initialUrl: string
  onApply: (url: string) => void
  onRemove: () => void
  onClose: () => void
}

function LinkForm({ initialUrl, onApply, onRemove, onClose }: Omit<LinkDialogProps, 'isOpen'>) {
  const [url, setUrl] = useState(initialUrl)
  const [error, setError] = useState<string | undefined>()

  const apply = () => {
    const validationError = validateLinkUrl(url)
    if (validationError) return setError(validationError)
    onApply(url.trim())
  }

  return (
    <Dialog
      isOpen
      title="Inserir link"
      onClose={onClose}
      actions={
        <>
          {initialUrl && (
            <Button variant="danger" onClick={onRemove}>
              Remover link
            </Button>
          )}
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={apply}>
            Aplicar link
          </Button>
        </>
      }
    >
      <TextField
        id="editor-link-url"
        label="Endereço do link"
        hint="Comece com http:// ou https://"
        value={url}
        error={error}
        onValueChange={setUrl}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            apply()
          }
        }}
        autoFocus
      />
    </Dialog>
  )
}

export function LinkDialog({ isOpen, ...formProps }: LinkDialogProps) {
  return isOpen ? <LinkForm {...formProps} /> : null
}
