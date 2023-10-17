import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useAppStore } from '@/store/app'
import { useChannelStore } from '@/store/channel'
import { useMessageStore } from '@/store/message'
import { ExtendedChannel } from '@/types/ExtendedChannel'

const LOCALSTORAGE_UNREAD_KEY = 'unread_0'

export const useUnreadStore = defineStore('unread', () => {
  const route = useRoute()
  const appStore = useAppStore()
  const channelStore = useChannelStore()
  const messageStore = useMessageStore()

  // =========================================
  // state
  const channelLastViewed = ref<{ [channelId: string]: Date }>({})

  // try to load from local storage
  const cachedStr = localStorage.getItem(LOCALSTORAGE_UNREAD_KEY)
  if (cachedStr !== null) {
    try {
      const cached = JSON.parse(cachedStr) as { [channelId: string]: Date }
      if (cached) {
        for (const key in cached) {
          if (cached.hasOwnProperty(key)) {
            const element = cached[key]
            cached[key] = new Date(element)
          }
        }
        channelLastViewed.value = cached
      }
    } catch (error) {
      console.error(error)
    }
  }

  // react to tab visibility
  const tabOpen = ref(true)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      tabOpen.value = false
    } else {
      tabOpen.value = true
      if (route.params.channelId) {
        channelLastViewed.value[route.params.channelId as string] = new Date()
      }
    }
  })

  // react to page unload
  window.addEventListener('beforeunload', event => {
    if (route.params.channelId) {
      channelLastViewed.value[route.params.channelId as string] = new Date()
    }
  })

  // react to channel changes
  watch(
    () => route.params.channelId as string,
    (newChannelId: string, oldChannelId: string) => {
      if (newChannelId) channelLastViewed.value[newChannelId] = new Date()
      if (oldChannelId) channelLastViewed.value[oldChannelId] = new Date()
    }
  )

  // sync to local storage
  watch(
    channelLastViewed,
    () => {
      localStorage.setItem(LOCALSTORAGE_UNREAD_KEY, JSON.stringify(channelLastViewed.value))
    },
    { deep: true }
  )

  // =========================================
  // getters
  function channelHasUnread(channel: ExtendedChannel): Boolean {
    // currently visible
    const currentChannelId = route.params.channelId as string
    if (currentChannelId === channel.id && tabOpen.value && appStore.visible) {
      return false
    }
    // empty channel
    if (!channel.lastMessageAddedAtDate) {
      return false
    }
    // never viewed
    const lastViewed = channelLastViewed.value[channel.id]
    if (!lastViewed) {
      return false
    }
    // no messages loaded yet
    const messages = messageStore.getMessages(channel.id)
    if (messages.length === 0) {
      if (channel.lastMessageAddedAtDate.getTime() > lastViewed.getTime()) {
        return true
      } else {
        return false
      }
    }
    // last message is newer than last viewed
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.createdAtDate.getTime() > lastViewed.getTime()) {
      return true
    }
    // no unread messages
    return false
  }

  function instanceHasUnread(instanceId: string): boolean {
    for (const channel of channelStore.getChannels(instanceId)) {
      if (channelHasUnread(channel)) {
        return true
      }
    }
    return false
  }

  // =========================================
  // actions
  return {
    channelHasUnread,
    instanceHasUnread,
  }
})
