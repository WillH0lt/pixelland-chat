import { Badge, UserBadgesEdge } from '@/graphql/types.gen'

interface Extension {
  badgedAtDate: Date
  count: number
}

export type ExtendedBadge = Badge & Extension

export function extendBadge(userBadgeEdge: UserBadgesEdge): ExtendedBadge {
  return {
    ...userBadgeEdge.node,
    badgedAtDate: new Date(userBadgeEdge.badgedAt),
    count: userBadgeEdge.count,
  }
}
