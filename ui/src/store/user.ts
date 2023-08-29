import { defineStore } from 'pinia'
import { ref } from 'vue'

import { NULL_UUID } from '@/constants'
import { useUpdateUserMutation } from '@/graphql/mutations/user.gen'
import { User, UserInput } from '@/graphql/types.gen'
import { useInstanceStore } from '@/store/instance'
import { generateAvatar } from '@/utils'

export const useUserStore = defineStore('user', () => {
  const instanceStore = useInstanceStore()
  // =========================================
  // state
  const user = ref<User>({
    id: NULL_UUID,
    name: '',
    avatar: generateAvatar(),
  } as User)

  // =========================================
  // actions
  async function updateUser(input: UserInput) {
    const { mutate } = useUpdateUserMutation({
      variables: { input, instancesFirst: 50 },
    })
    const result = await mutate()

    if (!result?.data?.updateUser) {
      throw new Error('Failed to update user')
    }

    user.value = result.data.updateUser
    const edges = result?.data?.updateUser?.instancesConnection?.edges ?? []
    instanceStore.handleInstancesAdded(edges)
    return user.value
  }

  return {
    user,

    updateUser,
  }
})
