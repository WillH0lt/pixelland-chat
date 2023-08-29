import gql from 'graphql-tag'

import { InviteFragment } from '@/graphql/fragments/fragments'

export const addInvite = gql`
  mutation addInvite($input: InviteInput!) {
    addInvite(input: $input) {
      ...InviteFragment
    }
  }
  ${InviteFragment}
`

export const redeemInvite = gql`
  mutation redeemInvite($code: String!) {
    redeemInvite(code: $code) {
      ...InviteFragment
    }
  }
  ${InviteFragment}
`
