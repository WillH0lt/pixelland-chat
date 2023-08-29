import gql from 'graphql-tag'

import {
  AuthorFragment,
  ChannelMessagesEdgeFragment,
  InstanceChannelsEdgeFragment,
  InstanceFragment,
  UserFragment,
} from '@/graphql/fragments/fragments'

export const instanceStream = gql`
  subscription instanceStream(
    $instanceId: Uuid!
    $instancesFirst: Int = 0
    $instancesAfter: String = ""
    $channelsFirst: Int = 0
    $channelsAfter: String = ""
    $messagesLast: Int = 0
    $messagesBefore: String = ""
  ) {
    instanceStream(instanceId: $instanceId) {
      mutation
      channelMessagesEdge {
        ...ChannelMessagesEdgeFragment
      }
      instanceChannelsEdge {
        ...InstanceChannelsEdgeFragment
      }
      user {
        ...UserFragment
      }
      author {
        ...AuthorFragment
      }
      instance {
        ...InstanceFragment
      }
    }
  }
  ${ChannelMessagesEdgeFragment}
  ${AuthorFragment}
  ${InstanceFragment}
  ${InstanceChannelsEdgeFragment}
  ${UserFragment}
`
