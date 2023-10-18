import gql from 'graphql-tag'

import {
  AuthorFragment,
  ChannelMessagesEdgeFragment,
  InstanceChannelsEdgeFragment,
  InstanceFragment,
  InstanceLikesEdgeFragment,
  UserFragment,
  UserNotificationsEdgeFragment,
} from '@/graphql/fragments/fragments'

export const stream = gql`
  subscription stream(
    $instanceId: Uuid!
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
    stream(instanceId: $instanceId) {
      kind
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
      userNotificationsEdge {
        ...UserNotificationsEdgeFragment
      }
    }
  }
  ${ChannelMessagesEdgeFragment}
  ${AuthorFragment}
  ${InstanceFragment}
  ${InstanceChannelsEdgeFragment}
  ${InstanceLikesEdgeFragment}
  ${UserFragment}
  ${UserNotificationsEdgeFragment}
`
