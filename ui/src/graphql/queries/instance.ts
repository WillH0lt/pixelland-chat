import gql from 'graphql-tag'

import { UserInstancesEdgeFragment } from '@/graphql/fragments/fragments'

export const instance = gql`
  query instance(
    $id: Uuid!
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
    instance(id: $id) {
      ...UserInstancesEdgeFragment
    }
  }
  ${UserInstancesEdgeFragment}
`
