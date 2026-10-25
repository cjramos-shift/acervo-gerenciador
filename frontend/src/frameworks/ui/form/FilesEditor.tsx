import type { FieldErrors } from '../../../domain/rules/fieldErrors'
import { UPLOAD_RULES } from '../../../domain/rules/uploadRules'
import type { ExistingAttachmentItem, NewFileItem } from '../../../interface-adapters/controllers/contentDraft'
import { formatFileSize } from '../../../interface-adapters/presenters/fileSizePresenter'
import { Button } from '../design-system/Button'
import { FilePicker } from './FilePicker'
import styles from './form.module.css'

interface FilesEditorProps {
  existing: ExistingAttachmentItem[]
  added: NewFileItem[]
  remainingSlots: number
  errors: FieldErrors
  onPick: (files: File[]) => void
  onRemoveAdded: (key: string) => void
  onToggleExisting: (attachmentId: string) => void
}

export function FilesEditor({ existing, added, remainingSlots, errors, onPick, onRemoveAdded, onToggleExisting }: FilesEditorProps) {
  return (
    <>
      <ul className={styles.rows}>
        {existing.map((file) => (
          <li key={file.id} className={`${styles.row} ${file.isRemoved ? styles.removed : ''}`}>
            <div className={styles.rowHeader}>
              <span className={styles.rowTitle}>{file.fileName}</span>
              <Button variant={file.isRemoved ? 'secondary' : 'danger'} onClick={() => onToggleExisting(file.id)}>
                {file.isRemoved ? 'Desfazer' : 'Remover'}
              </Button>
            </div>
            {file.isRemoved && <p className={styles.removalNotice}>Será removido ao salvar.</p>}
          </li>
        ))}

        {added.map((item, index) => (
          <li key={item.key} className={styles.row}>
            <div className={styles.rowHeader}>
              <span className={styles.rowTitle}>
                <span>
                  {item.file.name} <span className={styles.rowMeta}>({formatFileSize(item.file.size)})</span>
                </span>
              </span>
              <Button variant="ghost" icon="trash" aria-label={`Remover ${item.file.name}`} onClick={() => onRemoveAdded(item.key)} />
            </div>
            {errors[`files[${index}]`] && <p className={styles.rowError}>{errors[`files[${index}]`][0]}</p>}
          </li>
        ))}
      </ul>

      <FilePicker
        id="pick-files"
        label="Adicionar arquivos"
        accept={UPLOAD_RULES.fileExtensions.join(',')}
        hint="PDF, TXT, MD, DOCX, XLSX, PPTX ou ZIP, até 20 MB cada."
        remainingSlots={remainingSlots}
        onPick={onPick}
      />
    </>
  )
}
