import gql from 'graphql-tag'

import { InstanceFragment, UserInstancesEdgeFragment } from '@/graphql/fragments/fragments'

export const addInstance = gql`
  mutation addInstance(
    $input: InstanceInput!
    $channelsFirst: Int = 0
    $channelsAfter: String = ""
    $likesFirst: Int = 0
    $likesAfter: String = ""
    $authorsFirst: Int = 0
    $authorsAfter: String = ""
    $authorsRoles: [Role!] = []
    $messagesLast: Int = 0
    $messagesBefore: String = ""
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
    $channelsFirst: Int = 0
    $channelsAfter: String = ""
    $likesFirst: Int = 0
    $likesAfter: String = ""
    $authorsFirst: Int = 0
    $authorsAfter: String = ""
    $authorsRoles: [Role!] = []
    $messagesLast: Int = 0
    $messagesBefore: String = ""
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
    $channelsFirst: Int = 0
    $channelsAfter: String = ""
    $likesFirst: Int = 0
    $likesAfter: String = ""
    $authorsFirst: Int = 0
    $authorsAfter: String = ""
    $authorsRoles: [Role!] = []
    $messagesLast: Int = 0
    $messagesBefore: String = ""
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
    $channelsFirst: Int = 0
    $channelsAfter: String = ""
    $likesFirst: Int = 0
    $likesAfter: String = ""
    $authorsFirst: Int = 0
    $authorsAfter: String = ""
    $authorsRoles: [Role!] = []
    $messagesLast: Int = 0
    $messagesBefore: String = ""
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
    $channelsFirst: Int = 0
    $channelsAfter: String = ""
    $likesFirst: Int = 0
    $likesAfter: String = ""
    $authorsFirst: Int = 0
    $authorsAfter: String = ""
    $authorsRoles: [Role!] = []
    $messagesLast: Int = 0
    $messagesBefore: String = ""
  ) {
    pinInstance(input: $input, instanceId: $instanceId) {
      ...UserInstancesEdgeFragment
    }
  }
  ${UserInstancesEdgeFragment}
`

export const tagInstance = gql`
  mutation tagInstance(
    $instanceId: Uuid!
    $input: TagInput!
    $channelsFirst: Int = 0
    $channelsAfter: String = ""
    $likesFirst: Int = 0
    $likesAfter: String = ""
    $authorsFirst: Int = 0
    $authorsAfter: String = ""
    $authorsRoles: [Role!] = []
    $messagesLast: Int = 0
    $messagesBefore: String = ""
  ) {
    tagInstance(instanceId: $instanceId, input: $input) {
      ...InstanceFragment
    }
  }
  ${InstanceFragment}
`

export const untagInstance = gql`
  mutation untagInstance(
    $instanceId: Uuid!
    $input: TagInput!
    $channelsFirst: Int = 0
    $channelsAfter: String = ""
    $likesFirst: Int = 0
    $likesAfter: String = ""
    $authorsFirst: Int = 0
    $authorsAfter: String = ""
    $authorsRoles: [Role!] = []
    $messagesLast: Int = 0
    $messagesBefore: String = ""
  ) {
    untagInstance(instanceId: $instanceId, input: $input) {
      ...InstanceFragment
    }
  }
  ${InstanceFragment}
`
