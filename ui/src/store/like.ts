import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useAddLikeMutation, useRemoveLikeMutation } from '@/graphql/mutations/likes.gen'
import { useInstanceQuery } from '@/graphql/queries/instance.gen'
import { InstanceLikesConnection, InstanceLikesEdge } from '@/graphql/types.gen'
import { useAuthorStore } from '@/store/author'
import { ExtendedLike } from '@/types/ExtendedLike'
import { extendAuthor, timeSince } from '@/utils'

export const useLikeStore = defineStore('like', () => {
  const authorStore = useAuthorStore()

  // =========================================
  // state
  const likes = ref<{ [likeId: string]: ExtendedLike }>({})
  const likedByMe = ref(false)
  const likesCount = ref(0)
  const loading = ref(false)
  const hasNextPage = ref(true)
  const cursor = ref<string>('')

  // =========================================
  // getters
  function getLikes(): ExtendedLike[] {
    return Object.values(likes.value)
  }

  // =========================================
  // actions
  function reset() {
    likes.value = {}
    likedByMe.value = false
    likesCount.value = 0
    loading.value = false
    hasNextPage.value = true
    cursor.value = ''
  }

  function _handleLikesAdded(edges: readonly InstanceLikesEdge[]) {
    for (const edge of edges) {
      const like = extendLike(edge)
      likes.value[edge.node.id] = like
    }

    authorStore.handleAuthorsAdded(edges.map(edge => edge.node))
  }

  function handleLikeAdded(edge: InstanceLikesEdge) {
    _handleLikesAdded([edge])

    likesCount.value++
    if (edge.node.userId === authorStore.instanceUser.userId) {
      likedByMe.value = true
    }
  }

  function handleLikeRemoved(edge: InstanceLikesEdge) {
    likesCount.value--
    delete likes.value[edge.node.id]
    if (edge.node.userId === authorStore.instanceUser.userId) {
      likedByMe.value = false
    }
  }

  async function addLike(instanceId: string) {
    const { mutate } = useAddLikeMutation({
      variables: { instanceId },
    })

    likedByMe.value = true
    await mutate()
  }

  async function removeLike(instanceId: string) {
    const { mutate } = useRemoveLikeMutation({
      variables: { instanceId },
    })

    likedByMe.value = false
    await mutate()
  }

  async function fetchLikes(instanceId: string) {
    const { onResult, onError } = useInstanceQuery({
      id: instanceId,
      likesFirst: 50,
      likesAfter: cursor.value,
    })

    loading.value = true
    const likesConnection = await new Promise<InstanceLikesConnection>((resolve, reject) => {
      onError(error => {
        reject(error.message)
      })
      onResult(result => {
        if (result.error) {
          reject(result.error.message)
        }
        resolve(result.data.instance.node.likesConnection)
      })
    })

    hasNextPage.value = likesConnection.pageInfo.hasNextPage
    if (likesConnection.edges.length > 0) {
      cursor.value = likesConnection.edges[likesConnection.edges.length - 1].cursor
    }

    _handleLikesAdded(likesConnection.edges)
    loading.value = false
  }

  return {
    likes,
    likesCount,
    likedByMe,
    hasNextPage,
    loading,

    getLikes,

    reset,
    addLike,
    removeLike,
    handleLikeAdded,
    handleLikeRemoved,
    fetchLikes,
  }
})

function extendLike(edge: InstanceLikesEdge): ExtendedLike {
  const author = extendAuthor(edge.node)
  const likedAtDate = new Date(edge.likedAt)
  const likedAtTimeSince = timeSince(likedAtDate)

  return {
    ...author,
    likedAtDate,
    likedAtTimeSince,
  }
}
