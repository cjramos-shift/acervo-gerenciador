import { useEffect, useRef, type MouseEvent } from 'react'
import type { FieldErrors } from '../../../domain/rules/fieldErrors'
import { presentErrorSummary, presentFieldLabel } from '../../../interface-adapters/presenters/errorPresenter'
import { Icon } from '../design-system/Icon'
import { anchorForField, focusAnchor } from './fieldAnchors'
import styles from './form.module.css'

interface ErrorSummaryProps {
  errors: FieldErrors
  generalMessage: string | null
  focusKey: number
}

export function ErrorSummary({ errors, generalMessage, focusKey }: ErrorSummaryProps) {
  const summaryRef = useRef<HTMLDivElement>(null)
  const items = presentErrorSummary(errors)

  useEffect(() => {
    if (focusKey > 0) summaryRef.current?.focus()
  }, [focusKey])

  if (items.length === 0 && !generalMessage) return null

  const goToField = (event: MouseEvent, anchor: string) => {
    event.preventDefault()
    focusAnchor(anchor)
  }

  return (
    <div ref={summaryRef} role="alert" tabIndex={-1} className={styles.summary}>
      <h2>
        <Icon name="alert" size={20} />
        {items.length > 0 ? 'Revise os campos abaixo' : 'Não foi possível salvar'}
      </h2>
      {items.length === 0 && generalMessage && <p>{generalMessage}</p>}
      {items.length > 0 && (
        <ul>
          {items.map(({ field, message }) => {
            const anchor = anchorForField(field)
            const label = presentFieldLabel(field)
            const text = label ? `${label}: ${message}` : message

            return (
              <li key={`${field}-${message}`}>
                {anchor ? (
                  <a href={`#${anchor}`} onClick={(event) => goToField(event, anchor)}>
                    {text}
                  </a>
                ) : (
                  text
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
