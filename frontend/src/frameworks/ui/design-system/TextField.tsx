import type { InputHTMLAttributes } from 'react'
import { FormField } from './FormField'
import styles from './formField.module.css'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'onChange' | 'value'> {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  hint?: string
  error?: string
  isRequired?: boolean
  suggestions?: string[]
}

export function TextField({
  id,
  label,
  value,
  onValueChange,
  hint,
  error,
  isRequired,
  suggestions,
  ...inputProps
}: TextFieldProps) {
  const listId = suggestions ? `${id}-options` : undefined

  return (
    <FormField id={id} label={label} hint={hint} error={error} isRequired={isRequired}>
      {(aria) => (
        <>
          <input
            {...inputProps}
            {...aria}
            className={styles.input}
            value={value}
            list={listId}
            onChange={(event) => onValueChange(event.target.value)}
          />
          {listId && (
            <datalist id={listId}>
              {suggestions?.map((suggestion) => <option key={suggestion} value={suggestion} />)}
            </datalist>
          )}
        </>
      )}
    </FormField>
  )
}
