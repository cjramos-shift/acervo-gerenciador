import type { UseCases } from '../../application/useCases'
import { createDeleteContent } from '../../application/use-cases/deleteContent'
import { createGetContentDetails } from '../../application/use-cases/getContentDetails'
import { createListContents } from '../../application/use-cases/listContents'
import { createListGroups } from '../../application/use-cases/listGroups'
import { createRegisterContent } from '../../application/use-cases/registerContent'
import { createUpdateContent } from '../../application/use-cases/updateContent'
import { createHttpContentGateway } from '../../interface-adapters/gateways/httpContentGateway'
import { createHttpGroupGateway } from '../../interface-adapters/gateways/httpGroupGateway'
import type { HttpTransport } from '../../interface-adapters/http/httpTransport'
import { fetchTransport } from '../http/fetchTransport'

export function createUseCases(transport: HttpTransport = fetchTransport): UseCases {
  const contentGateway = createHttpContentGateway(transport)
  const groupGateway = createHttpGroupGateway(transport)

  return {
    listGroups: createListGroups(groupGateway),
    listContents: createListContents(contentGateway),
    getContentDetails: createGetContentDetails(contentGateway),
    registerContent: createRegisterContent(contentGateway),
    updateContent: createUpdateContent(contentGateway),
    deleteContent: createDeleteContent(contentGateway),
  }
}
