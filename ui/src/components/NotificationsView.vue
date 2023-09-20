<template>
  <div class="flex flex-col">
    <HomeHeader
      class="border-b-black border-b-4 border-solid bg-gray-darkest"
      @close="$emit('close')"
      :items="[]"
      title="Notifications"
    />
    <div ref="scrollerRef" class="overflow-auto flex-1" @scroll="handleScroll">
      <NotificationRow
        v-for="notification in notifications"
        :key="notification.id"
        :id="notification.id"
        :notification="notification"
        :author="authorStore.getUser(notification.author.id)"
        @show-profile="showProfile"
      />
      <div
        v-if="notificationStore.hasNextPage"
        class="flex justify-center items-center w-full h-14"
      >
        <ElementLoadingIcon class="scale-50 invert" />
      </div>
      <ChannelProfile
        v-if="profileAnchor"
        :user="authorStore.getUser(profileAnchor.author.id)"
        @close="profileAnchor = null"
        class="absolute left-16 w-72 bg-gray-darkest"
        :style="{
          top: profileTop + 'px',
          height: profileHeight + 'px',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import ChannelProfile from '@/components/ChannelProfile.vue'
import ElementLoadingIcon from '@/components/ElementLoadingIcon.vue'
import HomeHeader from '@/components/HomeHeader.vue'
import NotificationRow from '@/components/NotificationsRow.vue'
import { Author } from '@/graphql/types.gen'
import { useAuthorStore } from '@/store/author'
import { useNotificationStore } from '@/store/notification'
import { ExtendedNotification } from '@/types/ExtendedNotification'

const router = useRouter()
const notificationStore = useNotificationStore()
const authorStore = useAuthorStore()

const notifications = computed(() => {
  return notificationStore.getNotifications()
})

const loading = computed(() => {
  return notificationStore.loading
})

const scrollerRef = ref()
let observer: ResizeObserver
onMounted(() => {
  // Handles when onscreen keyboard is opened/closed
  observer = new ResizeObserver(async () => {
    await nextTick()
    if (!scrollerRef.value) return
    scrollerRef.value.scrollTop = scrollerRef.value.scrollHeight
  })

  observer.observe(scrollerRef.value)

  notificationStore.fetchNotifications()
})

onUnmounted(() => {
  observer.disconnect()
})

// if initial load doesn't fill the screen, load more messages
watch(loading, async loading => {
  if (!loading && notificationStore.hasNextPage) {
    if (isScrolledToBottom()) {
      notificationStore.fetchNotifications()
    }
  }
})

function isScrolledToBottom() {
  const { clientHeight, scrollHeight, scrollTop } = scrollerRef.value
  return scrollHeight - scrollTop - clientHeight < 20
}

function handleScroll() {
  if (isScrolledToBottom() && notificationStore.hasNextPage && !notificationStore.loading) {
    notificationStore.fetchNotifications()
  }
}

// show profile
const profileAnchor = ref<ExtendedNotification | null>(null)
const profileTop = ref(0)
const profileHeight = ref(384)
function showProfile(notification: ExtendedNotification) {
  const element = document.getElementById(notification.id)
  if (!element) return
  const rect = element.getBoundingClientRect()
  const scrollerRect = scrollerRef.value.getBoundingClientRect()
  profileTop.value = Math.min(
    rect.top,
    scrollerRect.top + scrollerRef.value.clientHeight - profileHeight.value
  )
  profileAnchor.value = notification
}
</script>
