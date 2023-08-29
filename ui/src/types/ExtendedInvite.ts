import { Invite } from '@/graphql/types.gen'

interface Extension {
  createdAtDate: Date
}

export type ExtendedInvite = Invite & Extension
