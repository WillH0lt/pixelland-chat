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
    $channelsFirst: Int!
    $channelsAfter: String!
    $likesFirst: Int!
    $likesAfter: String!
    $authorsFirst: Int!
    $authorsAfter: String!
    $authorsRoles: [Role!]!
    $messagesLast: Int!
    $messagesBefore: String!
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
