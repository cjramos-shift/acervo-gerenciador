import type { GroupGateway } from '../../application/ports/groupGateway'
import type { GroupNode } from '../../domain/entities/group'
import { sendAndUnwrap } from '../http/httpFailure'
import type { HttpTransport } from '../http/httpTransport'

export const createHttpGroupGateway = (transport: HttpTransport): GroupGateway => ({
  list: (signal) => sendAndUnwrap<GroupNode[]>(transport, { method: 'GET', path: '/api/groups', signal }),
})
