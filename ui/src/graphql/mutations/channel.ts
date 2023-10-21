import gql from 'graphql-tag'

import { InstanceChannelsEdgeFragment } from '@/graphql/fragments/fragments'

export const addChannel = gql`
  mutation addChannel($input: ChannelInput!, $messagesLast: Int!, $messagesBefore: String!) {
    addChannel(input: $input) {
      ...InstanceChannelsEdgeFragment
    }
  }
  ${InstanceChannelsEdgeFragment}
`

export const updateChannel = gql`
  mutation updateChannel(
    $input: ChannelInput!
    $channelId: Uuid!
    $messagesLast: Int!
    $messagesBefore: String!
  ) {
    updateChannel(input: $input, channelId: $channelId) {
      ...InstanceChannelsEdgeFragment
    }
  }
  ${InstanceChannelsEdgeFragment}
`

export const reorderChannel = gql`
  mutation reorderChannel(
    $input: ChannelReorderInput!
    $channelId: Uuid!
    $messagesLast: Int!
    $messagesBefore: String!
  ) {
    reorderChannel(input: $input, channelId: $channelId) {
      ...InstanceChannelsEdgeFragment
    }
  }
  ${InstanceChannelsEdgeFragment}
`

export const removeChannel = gql`
  mutation removeChannel($channelId: Uuid!, $messagesLast: Int!, $messagesBefore: String!) {
    removeChannel(channelId: $channelId) {
      ...InstanceChannelsEdgeFragment
    }
  }
  ${InstanceChannelsEdgeFragment}
`
