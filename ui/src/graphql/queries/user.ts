import gql from 'graphql-tag'

import {
  PageInfoFragment,
  UserBadgesEdgeFragment,
  UserFragment,
  UserInstancesEdgeFragment,
} from '@/graphql/fragments/fragments'

export const user = gql`
  query user(
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
    user {
      ...UserFragment
    }
  }
  ${UserFragment}
  ${UserInstancesEdgeFragment}
`

export const userBadges = gql`
  query userBadges($userId: Uuid!, $badgesFirst: Int!, $badgesAfter: String!) {
    userBadges(userId: $userId, first: $badgesFirst, after: $badgesAfter) {
      edges {
        ...UserBadgesEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${UserBadgesEdgeFragment}
  ${PageInfoFragment}
`
