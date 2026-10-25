import type { ChangeEvent } from 'react'
import styles from './form.module.css'

interface FilePickerProps {
  id: string
  label: string
  accept: string
  hint: string
  remainingSlots: number
  onPick: (files: File[]) => void
}

export function FilePicker({ id, label, accept, hint, remainingSlots, onPick }: FilePickerProps) {
  const pick = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, remainingSlots)
    event.target.value = ''
    if (files.length > 0) onPick(files)
  }

  return (
    <div className={styles.picker}>
      <label htmlFor={id} style={{ fontWeight: 600 }}>
        {label}
      </label>
      <input id={id} type="file" multiple accept={accept} disabled={remainingSlots === 0} onChange={pick} aria-describedby={`${id}-hint`} />
      <p id={`${id}-hint`} className={styles.hint}>
        {hint} {remainingSlots === 0 ? 'Limite atingido.' : `Você ainda pode adicionar ${remainingSlots}.`}
      </p>
    </div>
  )
}
