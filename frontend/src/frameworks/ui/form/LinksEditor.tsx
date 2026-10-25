import { CONTENT_RULES } from '../../../domain/rules/contentRules'
import type { FieldErrors } from '../../../domain/rules/fieldErrors'
import { filledLinkIndex, type LinkItem } from '../../../interface-adapters/controllers/contentDraft'
import { Button } from '../design-system/Button'
import { TextField } from '../design-system/TextField'
import styles from './form.module.css'

interface LinksEditorProps {
  links: LinkItem[]
  errors: FieldErrors
  onAdd: () => void
  onChange: (key: string, patch: Partial<Pick<LinkItem, 'url' | 'label'>>) => void
  onRemove: (key: string) => void
}

export function LinksEditor({ links, errors, onAdd, onChange, onRemove }: LinksEditorProps) {
  const errorFor = (link: LinkItem, property: 'url' | 'label') => {
    const index = filledLinkIndex(links, link.key)
    return index === null ? undefined : errors[`links[${index}].${property}`]?.[0]
  }

  return (
    <>
      {errors.links && <p className={styles.rowError}>{errors.links[0]}</p>}
      <ul className={styles.rows}>
        {links.map((link, index) => (
          <li key={link.key} className={styles.row}>
            <div className={styles.rowHeader}>
              <span className={styles.rowTitle}>Link {index + 1}</span>
              <Button variant="ghost" icon="trash" aria-label={`Remover link ${index + 1}`} onClick={() => onRemove(link.key)} />
            </div>
            <TextField
              id={`link-${link.key}-url`}
              label="Endereço (URL)"
              type="url"
              inputMode="url"
              placeholder="https://"
              value={link.url}
              error={errorFor(link, 'url')}
              onValueChange={(url) => onChange(link.key, { url })}
            />
            <TextField
              id={`link-${link.key}-label`}
              label="Rótulo (opcional)"
              hint="Um nome curto para reconhecer o link depois."
              value={link.label}
              error={errorFor(link, 'label')}
              onValueChange={(label) => onChange(link.key, { label })}
            />
          </li>
        ))}
      </ul>
      <div>
        <Button icon="plus" disabled={links.length >= CONTENT_RULES.maxLinks} onClick={onAdd}>
          Adicionar link
        </Button>
      </div>
    </>
  )
}
