import type { GroupNode } from '../../domain/entities/group'

export interface GroupGateway {
  list(signal?: AbortSignal): Promise<GroupNode[]>
}
