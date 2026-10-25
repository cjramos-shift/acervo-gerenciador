import { useState } from 'react'
import { Link, NavLink, useMatch } from 'react-router'
import { useGroupTree } from '../../../interface-adapters/controllers/groupTreeContext'
import { presentNavigationMenu, type MenuGroup } from '../../../interface-adapters/presenters/navigationMenuPresenter'
import { paths } from '../../routing/paths'
import { Button } from '../design-system/Button'
import { Icon } from '../design-system/Icon'
import styles from './sidebar.module.css'

interface SidebarProps {
  id: string
  className: string
  onNavigate: () => void
}

function MenuLinkLabel({ name, count }: { name: string; count: number }) {
  return (
    <>
      <span>{name}</span>
      <span className={styles.count}>{count}</span>
    </>
  )
}

interface GroupItemProps {
  group: MenuGroup
  isExpanded: boolean
  onToggle: () => void
  onNavigate: () => void
}

function GroupItem({ group, isExpanded, onToggle, onNavigate }: GroupItemProps) {
  const categoriesId = `categorias-${group.id}`

  return (
    <li>
      <div className={styles.groupRow}>
        <NavLink end to={paths.group(group.id)} className={styles.link} onClick={onNavigate}>
          <MenuLinkLabel name={group.name} count={group.count} />
        </NavLink>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={isExpanded}
          aria-controls={categoriesId}
          aria-label={`${isExpanded ? 'Recolher' : 'Expandir'} categorias de ${group.name}`}
          onClick={onToggle}
        >
          <Icon name="chevronRight" size={18} />
        </button>
      </div>
      {isExpanded && (
        <ul id={categoriesId} className={styles.categories}>
          {group.categories.map((category) => (
            <li key={category.id}>
              <NavLink to={paths.category(group.id, category.id)} className={styles.link} onClick={onNavigate}>
                <MenuLinkLabel name={category.name} count={category.count} />
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export function Sidebar({ id, className, onNavigate }: SidebarProps) {
  const { status, groups, reload } = useGroupTree()
  const activeGroupId = useMatch({ path: '/grupos/:groupId', end: false })?.params.groupId
  const [manualExpansion, setManualExpansion] = useState<Record<string, boolean>>({})

  const menuGroups = presentNavigationMenu(groups)
  const isExpanded = (groupId: string) => manualExpansion[groupId] ?? groupId === activeGroupId
  const toggle = (groupId: string) =>
    setManualExpansion((current) => ({ ...current, [groupId]: !isExpanded(groupId) }))

  return (
    <nav id={id} aria-label="Navegação principal" className={className}>
      <Link to={paths.home} className={styles.brand} onClick={onNavigate}>
        <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 3l11 13-11 13L5 16z" fill="var(--color-primary)" />
          <path d="M16 11l5 5-5 5-5-5z" fill="var(--color-bg)" />
        </svg>
        Acervo
      </Link>

      <ul className={styles.list}>
        <li>
          <NavLink end to={paths.home} className={styles.link} onClick={onNavigate}>
            Início
          </NavLink>
        </li>
      </ul>

      <p className={styles.sectionTitle}>Grupos</p>

      {status === 'loading' && menuGroups.length === 0 && (
        <div aria-hidden="true">
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
        </div>
      )}

      {status === 'error' && (
        <div>
          <p className={styles.muted}>Não foi possível carregar os grupos.</p>
          <Button variant="ghost" onClick={reload}>
            Tentar novamente
          </Button>
        </div>
      )}

      {status === 'ready' && menuGroups.length === 0 && (
        <p className={styles.muted}>Os grupos aparecem aqui quando você cadastrar o primeiro conteúdo.</p>
      )}

      <ul className={styles.list}>
        {menuGroups.map((group) => (
          <GroupItem
            key={group.id}
            group={group}
            isExpanded={isExpanded(group.id)}
            onToggle={() => toggle(group.id)}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </nav>
  )
}
