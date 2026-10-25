import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Outlet, useLocation } from 'react-router'
import { paths } from '../../routing/paths'
import { Button, LinkButton } from '../design-system/Button'
import styles from './appShell.module.css'
import { SearchField } from './SearchField'
import { Sidebar } from './Sidebar'

const MENU_ID = 'menu-lateral'

export function AppShell() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const isFirstRender = useRef(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    mainRef.current?.focus()
  }, [pathname])

  const closeMenu = () => setIsMenuOpen(false)
  const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && closeMenu()

  return (
    <div className={styles.shell} onKeyDown={closeOnEscape}>
      <a href="#conteudo-principal" className={styles.skipLink}>
        Ir para o conteúdo
      </a>

      <Sidebar
        id={MENU_ID}
        className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarOpen : ''}`}
        onNavigate={closeMenu}
      />
      {isMenuOpen && <button type="button" className={styles.scrim} aria-label="Fechar menu" onClick={closeMenu} />}

      <div className={styles.main}>
        <header className={styles.header}>
          <span className={styles.menuToggle}>
            <Button
              icon="menu"
              aria-label="Abrir menu"
              aria-expanded={isMenuOpen}
              aria-controls={MENU_ID}
              onClick={() => setIsMenuOpen(true)}
            />
          </span>
          <SearchField />
          <span className={styles.headerSpacer} />
          <LinkButton variant="primary" icon="plus" to={paths.newContent}>
            Novo conteúdo
          </LinkButton>
        </header>

        <main id="conteudo-principal" ref={mainRef} tabIndex={-1} className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
