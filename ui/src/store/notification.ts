import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useAddLikeMutation, useRemoveLikeMutation } from '@/graphql/mutations/likes.gen'
import { useInstanceQuery } from '@/graphql/queries/instance.gen'
import { useUserQuery } from '@/graphql/queries/user.gen'
import { Author, UserNotificationsConnection, UserNotificationsEdge } from '@/graphql/types.gen'
import { useAppStore } from '@/store/app'
import { useAuthorStore } from '@/store/author'
import { ExtendedNotification } from '@/types/ExtendedNotification'
import { timeSince } from '@/utils'

export const useNotificationStore = defineStore('notifications', () => {
  const authorStore = useAuthorStore()
  const appStore = useAppStore()

  // =========================================
  // state
  const notifications = ref<{ [notificationId: string]: ExtendedNotification }>({})
  const hasUnread = ref(false)
  const loading = ref(false)
  const hasNextPage = ref(true)
  const cursor = ref<string>('')

  // =========================================
  // getters
  function getNotifications(): ExtendedNotification[] {
    return Object.values(notifications.value)
  }

  // =========================================
  // actions
  function reset() {
    notifications.value = {}
    hasUnread.value = false
    loading.value = false
    hasNextPage.value = true
    cursor.value = ''
  }

  function handleNotificationsAdded(edges: readonly UserNotificationsEdge[]) {
    for (const edge of edges) {
      const notification = extendNotification(edge)
      notifications.value[edge.node.id] = notification
    }

    const authors = edges
      .map(edge => edge.node.author)
      .filter(author => author !== null) as Author[]
    authorStore.handleAuthorsAdded(authors)
  }

  async function fetchNotifications() {
    const { onResult, onError } = useUserQuery({
      notificationsLast: 50,
      notificationsBefore: cursor.value,
      instancesFirst: 0,
      instancesAfter: '',
      channelsFirst: 0,
      channelsAfter: '',
      likesFirst: 0,
      likesAfter: '',
      authorsFirst: 0,
      authorsAfter: '',
      authorsRoles: [],
      messagesLast: 0,
      messagesBefore: '',
    })

    loading.value = true
    const notificationsConnection = await new Promise<UserNotificationsConnection>(
      (resolve, reject) => {
        onError(error => {
          reject(error.message)
        })
        onResult(result => {
          if (result.error) {
            reject(result.error.message)
          }
          resolve(result.data.user.notificationsConnection)
        })
      }
    )

    hasNextPage.value = notificationsConnection.pageInfo.hasNextPage
    if (notificationsConnection.edges.length > 0) {
      cursor.value = notificationsConnection.edges[notificationsConnection.edges.length - 1].cursor
    }

    hasUnread.value = false

    handleNotificationsAdded(notificationsConnection.edges)
    loading.value = false
  }

  return {
    hasUnread,
    hasNextPage,
    loading,

    getNotifications,

    reset,
    handleNotificationsAdded,
    fetchNotifications,
  }
})

function extendNotification(edge: UserNotificationsEdge): ExtendedNotification {
  const notificationAddedDate = new Date(edge.node.createdAt)
  const notificationAddedTimeSince = timeSince(notificationAddedDate)

  return {
    ...edge.node,
    notificationAddedDate,
    notificationAddedTimeSince,
  }
}
