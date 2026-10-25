import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import styles from './tabs.module.css'

export interface TabItem<Id extends string> {
  id: Id
  label: string
}

interface TabsProps<Id extends string> {
  idPrefix: string
  label: string
  tabs: TabItem<Id>[]
  activeId: Id
  onChange: (id: Id) => void
  children: ReactNode
}

const tabIdOf = (prefix: string, id: string) => `${prefix}-tab-${id}`

function nextIndex(key: string, current: number, total: number): number | null {
  if (key === 'ArrowRight') return (current + 1) % total
  if (key === 'ArrowLeft') return (current - 1 + total) % total
  if (key === 'Home') return 0
  return key === 'End' ? total - 1 : null
}

export function Tabs<Id extends string>({ idPrefix, label, tabs, activeId, onChange, children }: TabsProps<Id>) {
  const tabListRef = useRef<HTMLDivElement>(null)
  const activeIndex = Math.max(
    tabs.findIndex((tab) => tab.id === activeId),
    0,
  )

  const moveFocus = (event: KeyboardEvent) => {
    const target = nextIndex(event.key, activeIndex, tabs.length)
    if (target === null) return

    event.preventDefault()
    onChange(tabs[target].id)
    tabListRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[target]?.focus()
  }

  return (
    <div>
      <div ref={tabListRef} role="tablist" aria-label={label} className={styles.tabList} onKeyDown={moveFocus}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={tabIdOf(idPrefix, tab.id)}
            aria-selected={tab.id === activeId}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={tab.id === activeId ? 0 : -1}
            className={styles.tab}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${idPrefix}-panel`}
        aria-labelledby={tabIdOf(idPrefix, activeId)}
        tabIndex={0}
        className={styles.panel}
      >
        {children}
      </div>
    </div>
  )
}
