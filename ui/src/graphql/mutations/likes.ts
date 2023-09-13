import gql from 'graphql-tag'

import { InstanceLikesEdgeFragment } from '@/graphql/fragments/fragments'

export const addLike = gql`
  mutation addLike($instanceId: Uuid!) {
    addLike(instanceId: $instanceId) {
      ...InstanceLikesEdgeFragment
    }
  }
  ${InstanceLikesEdgeFragment}
`

export const removeLike = gql`
  mutation removeLike($instanceId: Uuid!) {
    removeLike(instanceId: $instanceId) {
      ...InstanceLikesEdgeFragment
    }
  }
  ${InstanceLikesEdgeFragment}
`
