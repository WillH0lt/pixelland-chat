import gql from 'graphql-tag'

import { UserInstancesEdgeFragment } from '@/graphql/fragments/fragments'

export const instance = gql`
  query instance(
    $id: Uuid!
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
    instance(id: $id) {
      ...UserInstancesEdgeFragment
    }
  }
  ${UserInstancesEdgeFragment}
`
