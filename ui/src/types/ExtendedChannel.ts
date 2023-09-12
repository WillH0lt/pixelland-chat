import { Channel } from '@/graphql/types.gen'

interface Extension {
  // saved: boolean
  cursor: string
  updatedAtDate: Date
  lastMessageAddedAtDate?: Date
  // mutableRank: string
  mutableRank: number
  mutableMessageCount: number
}

export type ExtendedChannel = Channel & Extension
