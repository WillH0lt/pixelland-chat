import gql from 'graphql-tag'

import { UserFragment } from '@/graphql/fragments/fragments'

export const updateUser = gql`
  mutation updateUser(
    $input: UserInput!
    $instancesFirst: Int
    $instancesAfter: String
    $channelsFirst: Int = 0
    $channelsAfter: String = ""
    $likesFirst: Int = 0
    $likesAfter: String = ""
    $messagesLast: Int = 0
    $messagesBefore: String = ""
  ) {
    updateUser(input: $input) {
      ...UserFragment
    }
  }
  ${UserFragment}
`
