import { Author } from '@/graphql/types.gen'

interface Extension {
  likedAtDate?: Date
  likedAtTimeSince?: string
}

export type ExtendedLike = Author & Extension
