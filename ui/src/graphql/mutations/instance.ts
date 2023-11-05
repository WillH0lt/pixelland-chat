import gql from 'graphql-tag'

import { InstanceFragment, UserInstancesEdgeFragment } from '@/graphql/fragments/fragments'

export const addInstance = gql`
  mutation addInstance(
    $input: InstanceInput!
    $channelsFirst: Int!
    $channelsAfter: String!
    $likesFirst: Int!
    $likesAfter: String!
    $authorsFirst: Int!
    $authorsAfter: String!
    $authorsRoles: [Role!]!
    $messagesLast: Int!
    $messagesBefore: String!
  ) {
    addInstance(input: $input) {
      ...UserInstancesEdgeFragment
    }
  }
  ${UserInstancesEdgeFragment}
`

export const updateInstance = gql`
  mutation updateInstance(
    $instanceId: Uuid!
    $input: InstanceInput!
    $channelsFirst: Int!
    $channelsAfter: String!
    $likesFirst: Int!
    $likesAfter: String!
    $authorsFirst: Int!
    $authorsAfter: String!
    $authorsRoles: [Role!]!
    $messagesLast: Int!
    $messagesBefore: String!
  ) {
    updateInstance(instanceId: $instanceId, input: $input) {
      ...UserInstancesEdgeFragment
    }
  }
  ${UserInstancesEdgeFragment}
`

export const removeInstance = gql`
  mutation removeInstance(
    $instanceId: Uuid!
    $channelsFirst: Int!
    $channelsAfter: String!
    $likesFirst: Int!
    $likesAfter: String!
    $authorsFirst: Int!
    $authorsAfter: String!
    $authorsRoles: [Role!]!
    $messagesLast: Int!
    $messagesBefore: String!
  ) {
    removeInstance(instanceId: $instanceId) {
      ...UserInstancesEdgeFragment
    }
  }
  ${UserInstancesEdgeFragment}
`

export const reorderInstance = gql`
  mutation reorderInstance(
    $input: InstanceReorderInput!
    $instanceId: Uuid!
    $channelsFirst: Int!
    $channelsAfter: String!
    $likesFirst: Int!
    $likesAfter: String!
    $authorsFirst: Int!
    $authorsAfter: String!
    $authorsRoles: [Role!]!
    $messagesLast: Int!
    $messagesBefore: String!
  ) {
    reorderInstance(input: $input, instanceId: $instanceId) {
      ...UserInstancesEdgeFragment
    }
  }
  ${UserInstancesEdgeFragment}
`

export const pinInstance = gql`
  mutation pinInstance(
    $input: InstancePinInput!
    $instanceId: Uuid!
    $channelsFirst: Int!
    $channelsAfter: String!
    $likesFirst: Int!
    $likesAfter: String!
    $authorsFirst: Int!
    $authorsAfter: String!
    $authorsRoles: [Role!]!
    $messagesLast: Int!
    $messagesBefore: String!
  ) {
    pinInstance(input: $input, instanceId: $instanceId) {
      ...UserInstancesEdgeFragment
    }
  }
  ${UserInstancesEdgeFragment}
`
