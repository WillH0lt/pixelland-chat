import gql from 'graphql-tag'

import { InstanceFragment, InviteFragment } from '@/graphql/fragments/fragments'

export const invite = gql`
  query invite($instanceId: Uuid!) {
    invite(instanceId: $instanceId) {
      ...InviteFragment
    }
  }
  ${InviteFragment}
`

export const checkInvite = gql`
  query checkInvite(
    $code: String!
    $channelsFirst: Int = 0
    $channelsAfter: String = ""
    $likesFirst: Int = 0
    $likesAfter: String = ""
    $authorsFirst: Int = 0
    $authorsAfter: String = ""
    $authorsRoles: [Role!] = []
    $messagesLast: Int = 0
    $messagesBefore: String = ""
  ) {
    checkInvite(code: $code) {
      instance {
        ...InstanceFragment
      }
      ...InviteFragment
    }
  }
  ${InstanceFragment}
  ${InviteFragment}
`
