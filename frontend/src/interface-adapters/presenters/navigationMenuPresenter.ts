import type { GroupNode } from '../../domain/entities/group'

export interface MenuCategory {
  id: string
  name: string
  count: number
}

export interface MenuGroup {
  id: string
  name: string
  count: number
  categories: MenuCategory[]
}

export function presentNavigationMenu(groups: GroupNode[]): MenuGroup[] {
  return groups
    .filter((group) => group.contentCount > 0)
    .map((group) => ({
      id: group.id,
      name: group.name,
      count: group.contentCount,
      categories: group.categories
        .filter((category) => category.contentCount > 0)
        .map((category) => ({ id: category.id, name: category.name, count: category.contentCount })),
    }))
}
