// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { Tabs, type TabItem } from './Tabs'

afterEach(cleanup)

const TABS: TabItem<'a' | 'b' | 'c'>[] = [
  { id: 'a', label: 'Conteúdo' },
  { id: 'b', label: 'Referências (2)' },
  { id: 'c', label: 'Arquivos (1)' },
]

function Harness() {
  const [active, setActive] = useState<'a' | 'b' | 'c'>('a')
  return (
    <Tabs idPrefix="t" label="Seções" tabs={TABS} activeId={active} onChange={setActive}>
      <p>painel {active}</p>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('exposes the ARIA tab pattern', () => {
    render(<Harness />)

    expect(screen.getByRole('tablist', { name: 'Seções' })).toBeTruthy()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tab', { name: 'Conteúdo' }).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tabpanel').getAttribute('aria-labelledby')).toBe('t-tab-a')
  })

  it('has a single tab stop (roving tabindex)', () => {
    render(<Harness />)

    const stops = screen.getAllByRole('tab').filter((tab) => tab.getAttribute('tabindex') === '0')
    expect(stops).toHaveLength(1)
  })

  it('moves with the arrow keys, wrapping around, and Home/End', () => {
    render(<Harness />)
    const list = screen.getByRole('tablist')

    fireEvent.keyDown(list, { key: 'ArrowRight' })
    expect(screen.getByText('painel b')).toBeTruthy()

    fireEvent.keyDown(list, { key: 'End' })
    expect(screen.getByText('painel c')).toBeTruthy()

    fireEvent.keyDown(list, { key: 'ArrowRight' })
    expect(screen.getByText('painel a')).toBeTruthy()

    fireEvent.keyDown(list, { key: 'ArrowLeft' })
    expect(screen.getByText('painel c')).toBeTruthy()
  })

  it('changes the panel on click', () => {
    render(<Harness />)

    fireEvent.click(screen.getByRole('tab', { name: 'Referências (2)' }))

    expect(screen.getByText('painel b')).toBeTruthy()
  })
})
