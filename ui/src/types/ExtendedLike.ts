// import { Author } from '@/graphql/types.gen'
import { ExtendedAuthor } from './ExtendedAuthor'

interface Extension {
  likedAtDate?: Date
  likedAtTimeSince?: string
}

export type ExtendedLike = ExtendedAuthor & Extension
