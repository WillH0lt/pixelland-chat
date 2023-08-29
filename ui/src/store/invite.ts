import { resolve } from 'path'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

import { useAddInviteMutation, useRedeemInviteMutation } from '@/graphql/mutations/invite.gen'
import { useCheckInviteQuery, useInviteQuery } from '@/graphql/queries/invite.gen'
import { Invite, InviteInput } from '@/graphql/types.gen'
import { ExtendedInvite } from '@/types/ExtendedInvite'

export const useInviteStore = defineStore('invite', () => {
  // =========================================
  // state
  const invite = ref<ExtendedInvite | null>(null)

  // =========================================
  // actions
  async function fetchInvite(instanceId: string) {
    const { onResult } = useInviteQuery({
      instanceId,
    })

    return new Promise((resolve, reject) => {
      onResult(result => {
        if (result.error) {
          reject(result.error.message)
        }
        if (!result.data?.invite) return
        handleInviteAdded(result.data.invite)
        resolve(invite.value)
      })
    })
  }

  async function checkInvite(code: string): Promise<ExtendedInvite | null> {
    const { onResult, onError } = useCheckInviteQuery({
      code,
    })

    return new Promise((resolve, reject) => {
      onError(error => {
        reject(error.message)
      })
      onResult(result => {
        if (result.error) {
          reject(result.error.message)
        }
        if (result.data?.checkInvite) {
          resolve(extendInvite(result.data.checkInvite))
        } else {
          resolve(null)
        }
      })
    })
  }

  async function addInvite(input: InviteInput) {
    const { mutate } = useAddInviteMutation({
      variables: { input },
    })

    const reponse = await mutate()
    if (reponse?.data?.addInvite) {
      handleInviteAdded(reponse.data.addInvite)
    }
  }

  function handleInviteAdded(newInvite: Invite) {
    invite.value = extendInvite(newInvite)
  }

  async function redeemInvite(code: string) {
    const { mutate } = useRedeemInviteMutation({
      variables: { code },
    })
    const response = await mutate()
    if (!response?.data?.redeemInvite) return null
    return response.data.redeemInvite.instanceId
  }

  return {
    invite,

    fetchInvite,
    checkInvite,
    addInvite,
    redeemInvite,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useInviteStore, import.meta.hot))
}

function extendInvite(invite: Invite): ExtendedInvite {
  return {
    ...invite,
    createdAtDate: new Date(invite.createdAt),
  }
}
