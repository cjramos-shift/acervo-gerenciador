import type { GroupNode } from '../../domain/entities/group'
import { collapseWhitespace } from '../../domain/rules/contentRules'

const sameName = (first: string, second: string) =>
  collapseWhitespace(first).toLocaleLowerCase('pt-BR') === collapseWhitespace(second).toLocaleLowerCase('pt-BR')

export const presentGroupOptions = (groups: GroupNode[]): string[] => groups.map((group) => group.name)

export function presentCategoryOptions(groups: GroupNode[], selectedGroupName: string): string[] {
  const group = groups.find((candidate) => sameName(candidate.name, selectedGroupName))
  return group ? group.categories.map((category) => category.name) : []
}
