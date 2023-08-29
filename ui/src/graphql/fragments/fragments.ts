import gql from 'graphql-tag'

export const PageInfoFragment = gql`
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
  }
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
    isCategory
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

export const InstanceFragment = gql`
  fragment InstanceFragment on Instance {
    id
    name
    readAccess
    icon
    createdAt
    description
    channelsConnection(first: $channelsFirst, after: $channelsAfter) {
      edges {
        ...InstanceChannelsEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${InstanceChannelsEdgeFragment}
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
    instancesConnection(first: $instancesFirst, after: $instancesAfter) {
      edges {
        ...UserInstancesEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${UserInstancesEdgeFragment}
  ${PageInfoFragment}
`
