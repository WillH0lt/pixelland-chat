import { Author } from '@/graphql/types.gen'

interface Extension {
  // accessedAtDate: Date
}

export type ExtendedAuthor = Author & Extension
