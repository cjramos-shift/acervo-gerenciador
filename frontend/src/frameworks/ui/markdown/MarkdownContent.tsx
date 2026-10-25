import type { ComponentProps } from 'react'
import Markdown, { type Components } from 'react-markdown'
import { markdownContentClassName } from './markdownClassName'

function omitNode<T extends object>(props: T) {
  const rest = { ...props } as T & { node?: unknown }
  delete rest.node
  return rest
}

const COMPONENTS: Components = {
  h1: (props: ComponentProps<'h1'>) => <h2 {...omitNode(props)} />,
  a: (props: ComponentProps<'a'>) => <a {...omitNode(props)} target="_blank" rel="noopener noreferrer" />,
}

export function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <div className={markdownContentClassName}>
      <Markdown components={COMPONENTS}>{markdown}</Markdown>
    </div>
  )
}
