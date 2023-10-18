import { Author } from '@/graphql/types.gen'

interface Extension {
  createdAtDate: Date
  createdAtTimeSince: string
  likedAtDate?: Date
  likedAtTimeSince?: string
}

export type ExtendedAuthor = Author & Extension
