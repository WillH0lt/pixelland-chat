import gql from 'graphql-tag'

import { UserFragment } from '@/graphql/fragments/fragments'

export const updateUser = gql`
  mutation updateUser(
    $input: UserInput!
    $instancesFirst: Int!
    $instancesAfter: String!
    $channelsFirst: Int!
    $channelsAfter: String!
    $likesFirst: Int!
    $likesAfter: String!
    $authorsFirst: Int!
    $authorsAfter: String!
    $authorsRoles: [Role!]!
    $messagesLast: Int!
    $messagesBefore: String!
    $notificationsLast: Int!
    $notificationsBefore: String!
  ) {
    updateUser(input: $input) {
      ...UserFragment
    }
  }
  ${UserFragment}
`
