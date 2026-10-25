export interface CategoryNode {
  id: string
  name: string
  contentCount: number
}

export interface GroupNode {
  id: string
  name: string
  contentCount: number
  categories: CategoryNode[]
}
