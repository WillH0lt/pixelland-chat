import gql from 'graphql-tag'

import { ChannelMessagesEdgeFragment } from '@/graphql/fragments/fragments'

export const addMessage = gql`
  mutation addMessage($input: MessageInput!) {
    addMessage(input: $input) {
      ...ChannelMessagesEdgeFragment
    }
  }
  ${ChannelMessagesEdgeFragment}
`

export const removeMessage = gql`
  mutation removeMessage($messageId: Uuid!) {
    removeMessage(messageId: $messageId) {
      ...ChannelMessagesEdgeFragment
    }
  }
  ${ChannelMessagesEdgeFragment}
`
