import gql from 'graphql-tag'

import { UserFragment, UserInstancesEdgeFragment } from '@/graphql/fragments/fragments'

export const user = gql`
  query user(
    $uid: String!
    $instancesFirst: Int = 0
    $instancesAfter: String = ""
    $channelsFirst: Int = 0
    $channelsAfter: String = ""
    $likesFirst: Int = 0
    $likesAfter: String = ""
    $messagesLast: Int = 0
    $messagesBefore: String = ""
  ) {
    user(uid: $uid) {
      ...UserFragment
    }
  }
  ${UserFragment}
  ${UserInstancesEdgeFragment}
`
