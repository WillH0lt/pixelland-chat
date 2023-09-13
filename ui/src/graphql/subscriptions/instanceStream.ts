import gql from 'graphql-tag'

import {
  AuthorFragment,
  ChannelMessagesEdgeFragment,
  InstanceChannelsEdgeFragment,
  InstanceFragment,
  InstanceLikesEdgeFragment,
  UserFragment,
} from '@/graphql/fragments/fragments'

export const instanceStream = gql`
  subscription instanceStream(
    $instanceId: Uuid!
    $instancesFirst: Int = 0
    $instancesAfter: String = ""
    $channelsFirst: Int = 0
    $channelsAfter: String = ""
    $likesFirst: Int = 0
    $likesAfter: String = ""
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
      instanceLikesEdge {
        ...InstanceLikesEdgeFragment
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
  ${InstanceLikesEdgeFragment}
  ${UserFragment}
`
