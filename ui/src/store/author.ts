import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { NULL_UUID } from '@/constants'
import { useAddRoleMutation, useRemoveRoleMutation } from '@/graphql/mutations/author.gen'
import { Author, Role, User } from '@/graphql/types.gen'
import { useChannelStore } from '@/store/channel'
import { useInstanceStore } from '@/store/instance'
import { useUserStore } from '@/store/user'
import { ExtendedAuthor } from '@/types/ExtendedAuthor'
import { extendAuthor } from '@/utils'

export const useAuthorStore = defineStore('author', () => {
  const channelStore = useChannelStore()
  const instanceStore = useInstanceStore()
  const userStore = useUserStore()
  // =========================================
  // state
  const allAuthors = reactive<{ [id: string]: ExtendedAuthor }>({})

  // =========================================
  // getters
  const instanceUser = computed(() => {
    const author = Object.values(allAuthors).find(
      c => c.userId === userStore.user.id && c.instanceId === instanceStore.instance.id
    )
    return (
      author ??
      extendAuthor({
        id: NULL_UUID,
        instanceId: instanceStore.instance.id,
        userId: userStore.user.id,
        roles: [],
        avatar: userStore.user.avatar,
        name: userStore.user.name,
        bio: userStore.user.bio,
        createdAt: new Date().toISOString(),
      })
    )
  })
  const isAdmin = computed(() => {
    return instanceUser.value.roles.includes(Role.Admin)
  })
  const isModerator = computed(() => {
    return instanceUser.value.roles.includes(Role.Moderator)
  })
  const isBanned = computed(() => {
    return instanceUser.value.roles.includes(Role.Banned)
  })
  function getUser(id: string) {
    return allAuthors[id] ?? ({} as ExtendedAuthor)
  }

  // =========================================
  // actions
  async function addRole(authorId: string, role: Role) {
    const { mutate } = useAddRoleMutation({
      variables: {
        authorId,
        role,
      },
    })

    const result = await mutate()

    if (!result?.data?.addRole) return
    handleAuthorUpdated(result.data.addRole)
  }

  async function removeRole(authorId: string, role: Role) {
    const { mutate } = useRemoveRoleMutation({
      variables: {
        authorId,
        role,
      },
    })

    const result = await mutate()

    if (!result?.data?.removeRole) return
    handleAuthorUpdated(result.data.removeRole)
  }

  async function handleAuthorUpdated(updatedAuthor: Author) {
    allAuthors[updatedAuthor.id] = extendAuthor(updatedAuthor)

    // if user's roles were updated, we need to refresh the channels that are visible
    if (updatedAuthor.userId === userStore.user.id) {
      channelStore.refreshChannels(updatedAuthor.instanceId)
    }
  }

  function handleUserUpdated(updatedUser: User) {
    // TODO move to user store when adding multiple instances
    const author = Object.values(allAuthors).find(c => c.userId === updatedUser.id)
    if (author) {
      allAuthors[author.id] = {
        ...author,
        name: updatedUser.name,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
      }
    }
  }

  function handleAuthorsAdded(addedAuthors: Author[]) {
    for (const addedAuthor of addedAuthors) {
      allAuthors[addedAuthor.id] = extendAuthor(addedAuthor)
    }
  }

  return {
    allAuthors,
    instanceUser,
    isAdmin,
    isModerator,
    isBanned,
    getUser,

    addRole,
    removeRole,
    handleAuthorUpdated,
    handleUserUpdated,
    handleAuthorsAdded,
  }
})
