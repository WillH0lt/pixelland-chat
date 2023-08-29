import { Instance } from '@/graphql/types.gen'

interface Extension {
  rank: string
  mutableRank: number
  mutablePinned: boolean
  createdAtDate: Date
  timeSince: string
}

export type ExtendedInstance = Instance & Extension
