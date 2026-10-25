import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { validateSearchTerm } from '../../../domain/rules/searchRules'
import { paths, SEARCH_PARAM } from '../../routing/paths'
import { Button } from '../design-system/Button'
import styles from './searchField.module.css'

function SearchForm({ initialTerm }: { initialTerm: string }) {
  const navigate = useNavigate()
  const [term, setTerm] = useState(initialTerm)
  const [error, setError] = useState<string | null>(null)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (term.trim() === '') return

    const validationError = validateSearchTerm(term)
    setError(validationError)
    if (!validationError) navigate(paths.search(term.trim()))
  }

  return (
    <form role="search" className={styles.form} onSubmit={submit}>
      <div className={styles.row}>
        <label htmlFor="global-search" className="visually-hidden">
          Buscar no acervo
        </label>
        <input
          id="global-search"
          type="search"
          className={styles.input}
          placeholder="Buscar no acervo"
          value={term}
          maxLength={200}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'global-search-error' : undefined}
          onChange={(event) => setTerm(event.target.value)}
        />
        <Button type="submit" icon="search" aria-label="Buscar" />
      </div>
      {error && (
        <p id="global-search-error" role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </form>
  )
}

export function SearchField() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const termInUrl = location.pathname === '/busca' ? (searchParams.get(SEARCH_PARAM) ?? '') : ''

  return <SearchForm key={termInUrl} initialTerm={termInUrl} />
}
