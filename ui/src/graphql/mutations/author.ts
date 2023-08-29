import gql from 'graphql-tag'

import { AuthorFragment } from '@/graphql/fragments/fragments'

export const addRole = gql`
  mutation addRole($authorId: Uuid!, $role: Role!) {
    addRole(authorId: $authorId, role: $role) {
      ...AuthorFragment
    }
  }
  ${AuthorFragment}
`

export const removeRole = gql`
  mutation removeRole($authorId: Uuid!, $role: Role!) {
    removeRole(authorId: $authorId, role: $role) {
      ...AuthorFragment
    }
  }
  ${AuthorFragment}
`
