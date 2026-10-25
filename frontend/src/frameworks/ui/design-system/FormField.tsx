import type { ReactNode } from 'react'
import styles from './formField.module.css'
import { Icon } from './Icon'

export interface FieldAria {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

interface FormFieldProps {
  id: string
  label: string
  hint?: string
  error?: string
  isRequired?: boolean
  children: (aria: FieldAria) => ReactNode
}

export function FormField({ id, label, hint, error, isRequired, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label} {isRequired && <span className={styles.required}>(obrigatório)</span>}
      </label>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {error && (
        <p id={errorId} className={styles.error}>
          <Icon name="alert" size={18} />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
