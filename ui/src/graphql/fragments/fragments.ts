import gql from 'graphql-tag'

export const PageInfoFragment = gql`
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
  }
`

export const BadgeFragment = gql`
  fragment BadgeFragment on Badge {
    id
    name
    icon
  }
`

export const UserBadgesEdgeFragment = gql`
  fragment UserBadgesEdgeFragment on UserBadgesEdge {
    cursor
    count
    badgedAt
    node {
      ...BadgeFragment
    }
  }
  ${BadgeFragment}
`

export const AuthorFragment = gql`
  fragment AuthorFragment on Author {
    id
    userId
    instanceId
    name
    avatar
    bio
    roles
    createdAt
  }
`

export const InviteFragment = gql`
  fragment InviteFragment on Invite {
    id
    instanceId
    code
    createdAt
    expiresAt
    redemptions
    author {
      ...AuthorFragment
    }
  }
  ${AuthorFragment}
`

export const MessageFragment = gql`
  fragment MessageFragment on Message {
    id
    author {
      ...AuthorFragment
    }
    text
    createdAt
    channelId
    repliedMessage {
      id
      author {
        ...AuthorFragment
      }
      text
      createdAt
      channelId
    }
  }
  ${AuthorFragment}
`

export const NotificationFragment = gql`
  fragment NotificationFragment on Notification {
    id
    kind
    author {
      ...AuthorFragment
    }
    instance {
      ...InstanceFragment
    }
    message {
      ...MessageFragment
    }
    reply {
      ...MessageFragment
    }
    createdAt
  }
  ${AuthorFragment}
`

export const ChannelMessagesEdgeFragment = gql`
  fragment ChannelMessagesEdgeFragment on ChannelMessagesEdge {
    cursor
    node {
      ...MessageFragment
    }
  }
  ${MessageFragment}
`

export const ChannelFragment = gql`
  fragment ChannelFragment on Channel {
    id
    name
    rank
    instanceId
    readers
    publishers
    createdAt
    updatedAt
    lastMessageAddedAt
    messageCount
    isCategory
    isComments
    messagesConnection(last: $messagesLast, before: $messagesBefore) {
      edges {
        ...ChannelMessagesEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${ChannelMessagesEdgeFragment}
  ${PageInfoFragment}
`

export const InstanceChannelsEdgeFragment = gql`
  fragment InstanceChannelsEdgeFragment on InstanceChannelsEdge {
    cursor
    node {
      ...ChannelFragment
    }
  }
  ${ChannelFragment}
`

export const InstanceLikesEdgeFragment = gql`
  fragment InstanceLikesEdgeFragment on InstanceLikesEdge {
    cursor
    likedAt
    node {
      ...AuthorFragment
    }
  }
  ${AuthorFragment}
`

export const InstanceAuthorsEdgeFragment = gql`
  fragment InstanceAuthorsEdgeFragment on InstanceAuthorsEdge {
    cursor
    node {
      ...AuthorFragment
    }
  }
  ${AuthorFragment}
`

export const UserNotificationsEdgeFragment = gql`
  fragment UserNotificationsEdgeFragment on UserNotificationsEdge {
    cursor
    node {
      ...NotificationFragment
    }
  }
  ${NotificationFragment}
`

export const InstanceFragment = gql`
  fragment InstanceFragment on Instance {
    id
    name
    author {
      ...AuthorFragment
    }
    readAccess
    icon
    createdAt
    description
    showAuthor
    showChat
    showLikes
    showComments
    likesCount
    commentsCount
    likesConnection(first: $likesFirst, after: $likesAfter) {
      edges {
        ...InstanceLikesEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
    channelsConnection(first: $channelsFirst, after: $channelsAfter) {
      edges {
        ...InstanceChannelsEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
    authorsConnection(first: $authorsFirst, after: $authorsAfter, roles: $authorsRoles) {
      edges {
        ...InstanceAuthorsEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${AuthorFragment}
  ${ChannelFragment}
  ${InstanceLikesEdgeFragment}
  ${InstanceChannelsEdgeFragment}
  ${InstanceAuthorsEdgeFragment}
  ${PageInfoFragment}
`

export const UserInstancesEdgeFragment = gql`
  fragment UserInstancesEdgeFragment on UserInstancesEdge {
    cursor
    node {
      ...InstanceFragment
    }
    instanceUser {
      ...AuthorFragment
    }
    rank
    pinned
    likedByMe
  }
  ${AuthorFragment}
  ${InstanceFragment}
`

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    name
    avatar
    bio
    uid
    instancesConnection(first: $instancesFirst, after: $instancesAfter) {
      edges {
        ...UserInstancesEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
    notificationsConnection(last: $notificationsLast, before: $notificationsBefore) {
      edges {
        ...UserNotificationsEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      hasUnread
    }
  }
  ${UserInstancesEdgeFragment}
  ${UserNotificationsEdgeFragment}
  ${PageInfoFragment}
`
