import type { DeleteContent } from './use-cases/deleteContent'
import type { GetContentDetails } from './use-cases/getContentDetails'
import type { ListContents } from './use-cases/listContents'
import type { ListGroups } from './use-cases/listGroups'
import type { RegisterContent } from './use-cases/registerContent'
import type { UpdateContent } from './use-cases/updateContent'

export interface UseCases {
  listGroups: ListGroups
  listContents: ListContents
  getContentDetails: GetContentDetails
  registerContent: RegisterContent
  updateContent: UpdateContent
  deleteContent: DeleteContent
}
