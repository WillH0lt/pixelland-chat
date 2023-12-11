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
      badge {
        ...BadgeFragment
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
