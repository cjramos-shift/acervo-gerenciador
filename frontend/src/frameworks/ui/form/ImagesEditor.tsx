import { CONTENT_RULES } from '../../../domain/rules/contentRules'
import type { FieldErrors } from '../../../domain/rules/fieldErrors'
import { UPLOAD_RULES } from '../../../domain/rules/uploadRules'
import type { ExistingAttachmentItem, NewImageItem } from '../../../interface-adapters/controllers/contentDraft'
import { formatFileSize } from '../../../interface-adapters/presenters/fileSizePresenter'
import { Button } from '../design-system/Button'
import { TextField } from '../design-system/TextField'
import { FilePicker } from './FilePicker'
import styles from './form.module.css'

interface ImagesEditorProps {
  existing: ExistingAttachmentItem[]
  added: NewImageItem[]
  remainingSlots: number
  errors: FieldErrors
  onPick: (files: File[]) => void
  onDescriptionChange: (key: string, description: string) => void
  onRemoveAdded: (key: string) => void
  onToggleExisting: (attachmentId: string) => void
}

export function ImagesEditor({
  existing,
  added,
  remainingSlots,
  errors,
  onPick,
  onDescriptionChange,
  onRemoveAdded,
  onToggleExisting,
}: ImagesEditorProps) {
  return (
    <>
      <ul className={styles.rows}>
        {existing.map((image) => (
          <li key={image.id} className={`${styles.row} ${image.isRemoved ? styles.removed : ''}`}>
            <div className={styles.rowHeader}>
              <span className={styles.rowTitle}>
                <img className={styles.thumbnail} src={image.url} alt="" />
                <span>
                  {image.fileName}
                  {image.description && <span className={styles.rowMeta}> — {image.description}</span>}
                </span>
              </span>
              <Button variant={image.isRemoved ? 'secondary' : 'danger'} onClick={() => onToggleExisting(image.id)}>
                {image.isRemoved ? 'Desfazer' : 'Remover'}
              </Button>
            </div>
            {image.isRemoved && <p className={styles.removalNotice}>Será removida ao salvar.</p>}
          </li>
        ))}

        {added.map((image, index) => (
          <li key={image.key} className={styles.row}>
            <div className={styles.rowHeader}>
              <span className={styles.rowTitle}>
                <span>
                  {image.file.name} <span className={styles.rowMeta}>({formatFileSize(image.file.size)})</span>
                </span>
              </span>
              <Button variant="ghost" icon="trash" aria-label={`Remover ${image.file.name}`} onClick={() => onRemoveAdded(image.key)} />
            </div>
            {errors[`images[${index}].file`] && <p className={styles.rowError}>{errors[`images[${index}].file`][0]}</p>}
            <TextField
              id={`image-${image.key}-description`}
              label="Descrição da imagem (opcional)"
              hint="Ajuda quem usa leitor de tela a entender a imagem."
              maxLength={CONTENT_RULES.descriptionMaxLength}
              value={image.description}
              error={errors[`images[${index}].description`]?.[0]}
              onValueChange={(description) => onDescriptionChange(image.key, description)}
            />
          </li>
        ))}
      </ul>

      <FilePicker
        id="pick-images"
        label="Adicionar imagens"
        accept={UPLOAD_RULES.imageExtensions.join(',')}
        hint="PNG, JPG, WEBP ou GIF, até 5 MB cada."
        remainingSlots={remainingSlots}
        onPick={onPick}
      />
    </>
  )
}
