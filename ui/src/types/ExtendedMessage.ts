import { Message } from '@/graphql/types.gen'

interface Extension {
  createdAtDate: Date
  timeSince: string
  compact: boolean
  saved: boolean
  cursor: string
  authorId: string
  error?: string
}

// removing "author" from type since it's not reactive
// to get author use messageStore.getUser(authorId)
type ReducedMessage = Omit<Message, 'author'>

export type ExtendedMessage = ReducedMessage & Extension
