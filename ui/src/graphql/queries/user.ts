import gql from 'graphql-tag'

import { UserFragment, UserInstancesEdgeFragment } from '@/graphql/fragments/fragments'

export const user = gql`
  query user(
    $instancesFirst: Int = 0
    $instancesAfter: String = ""
    $channelsFirst: Int = 0
    $channelsAfter: String = ""
    $likesFirst: Int = 0
    $likesAfter: String = ""
    $authorsFirst: Int = 0
    $authorsAfter: String = ""
    $authorsRoles: [Role!] = []
    $messagesLast: Int = 0
    $messagesBefore: String = ""
    $notificationsLast: Int = 0
    $notificationsBefore: String = ""
  ) {
    user {
      ...UserFragment
    }
  }
  ${UserFragment}
  ${UserInstancesEdgeFragment}
`
