import type { GroupNode } from '../../domain/entities/group'
import type { GroupGateway } from '../ports/groupGateway'

export type ListGroups = (signal?: AbortSignal) => Promise<GroupNode[]>

export const createListGroups =
  (gateway: GroupGateway): ListGroups =>
  (signal) =>
    gateway.list(signal)
