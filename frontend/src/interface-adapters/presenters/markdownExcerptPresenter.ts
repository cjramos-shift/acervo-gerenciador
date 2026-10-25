const DEFAULT_MAX_LENGTH = 170

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
}

const decodeEntities = (text: string) => text.replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => HTML_ENTITIES[entity])

const MARKDOWN_NOISE: [RegExp, string][] = [
  [/!\[([^\]]*)\]\([^)]*\)/g, '$1'],
  [/\[([^\]]*)\]\([^)]*\)/g, '$1'],
  [/^[ \t]*(#{1,6}[ \t]+|>[ \t]?|[-*+][ \t]+|\d+\.[ \t]+|```.*$)/gm, ''],
  [/(?<!\\)(\*|`|~~)/g, ''],
  [/(?<![\\\w])_|(?<!\\)_(?!\w)/g, ''],
  [/\\([\\`*_{}[\]()#+\-.!|<>~&])/g, '$1'],
  [/\s+/g, ' '],
]

export function toExcerpt(markdown: string, maxLength = DEFAULT_MAX_LENGTH): string {
  const withoutSyntax = MARKDOWN_NOISE.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), markdown)
  const plainText = decodeEntities(withoutSyntax).trim()

  if (plainText.length <= maxLength) return plainText
  return `${plainText.slice(0, maxLength).trimEnd()}…`
}
