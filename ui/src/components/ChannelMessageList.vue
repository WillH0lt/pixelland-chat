<template>
  <div ref="scrollerRef" class="overflow-auto" @scroll="handleScroll">
    <div v-if="hasPreviousPage" class="flex justify-center items-center w-full h-14">
      <ElementLoadingIcon class="scale-50 invert" />
    </div>
    <ChannelMessage
      v-for="message in messages"
      :key="message.id"
      :id="message.id"
      :message="message"
      :replied-message="message.repliedMessageId ? (messages.find((messageToFind) => message.repliedMessageId === messageToFind.id) || { author: { name: 'Unknown' }, text: 'Message not loaded...' }) as unknown as Message : undefined /* I'm not sure if this is the best way to do this but it removes the error :) */"
      :user="authorStore.getUser(message.authorId)"
      @show-profile="showProfile"
    />
    <ChannelProfile
      v-if="profileMessage"
      :author="authorStore.getUser(profileMessage.authorId)"
      @close="profileMessage = null"
      class="absolute left-16 w-72 bg-gray-darkest"
      :style="{
        top: profileTop + 'px',
        height: profileHeight + 'px',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import ChannelMessage from '@/components/ChannelMessage.vue'
import ChannelProfile from '@/components/ChannelProfile.vue'
import ElementLoadingIcon from '@/components/ElementLoadingIcon.vue'
import { useAuthorStore } from '@/store/author'
import { useMessageStore } from '@/store/message'
import { ExtendedMessage } from '@/types/ExtendedMessage'
import { Message } from '@/graphql/types.gen'

const props = defineProps<{
  channelId: string
}>()

const messageStore = useMessageStore()
const authorStore = useAuthorStore()

const messages = computed(() => {
  return messageStore.getMessages(props.channelId)
})

const hasPreviousPage = computed(() => {
  return messageStore.getHasPreviousPage(props.channelId)
})

const loading = computed(() => {
  return messageStore.getLoading(props.channelId)
})

const scrollerRef = ref()
let lockedToBottom = true
let observer: ResizeObserver
let cancelRefresh: NodeJS.Timeout | null = null
onMounted(() => {
  // Handles when onscreen keyboard is opened/closed
  observer = new ResizeObserver(async () => {
    if (!lockedToBottom) return
    await nextTick()

    if (!scrollerRef.value) return
    scrollerRef.value.scrollTop = scrollerRef.value.scrollHeight
  })

  observer.observe(scrollerRef.value)

  messageStore.fetchMessages(props.channelId)

  cancelRefresh = setInterval(() => {
    messageStore.refreshTimeSince(props.channelId)
  }, 1000 * 10)
})

onUnmounted(() => {
  observer.disconnect()
  if (cancelRefresh) clearInterval(cancelRefresh)
})

watch(
  () => messages.value.length,
  async (_, oldValue) => {
    if (isScrolledToBottom() || isScrolledToTop()) {
      // maintain same offset from bottom
      const { scrollHeight, scrollTop } = scrollerRef.value

      // for some reason the scrollHeight changes after setting scrollTop for the first time
      // so it needs to be set twice
      await nextTick()
      if (!scrollerRef.value) return

      scrollerRef.value.scrollTop = scrollTop + (scrollerRef.value.scrollHeight - scrollHeight)
      if (oldValue === 0) {
        // wait a second for all heights to render
        await new Promise(resolve => setTimeout(resolve, 1000))

        // exit if component is unmounted during timeeout
        if (!scrollerRef.value) return

        scrollerRef.value.scrollTop = scrollTop + (scrollerRef.value.scrollHeight - scrollHeight)
      }
    }
  }
)

// if initial load doesn't fill the screen, load more messages
watch(loading, async loading => {
  if (!loading && hasPreviousPage.value) {
    if (isScrolledToBottom() && isScrolledToTop()) {
      messageStore.fetchMessages(props.channelId)
    }
  }
})

const composeText = computed(() => {
  return messageStore.getComposeText(props.channelId)
})
// Handles when text compose changes size
watch(composeText, async () => {
  if (isScrolledToBottom()) {
    await nextTick()
    await nextTick()
    scrollerRef.value.scrollTop = scrollerRef.value.scrollHeight
  }
})

function isScrolledToTop() {
  return scrollerRef.value.scrollTop < 20
}

function isScrolledToBottom() {
  const { clientHeight, scrollHeight, scrollTop } = scrollerRef.value
  return scrollHeight - scrollTop - clientHeight < 20
}

function handleScroll(event: Event) {
  const { scrollTop } = event.target as HTMLElement
  if (scrollTop < 10 && hasPreviousPage.value && !loading.value) {
    messageStore.fetchMessages(props.channelId)
  }
  lockedToBottom = isScrolledToBottom()
}

// show profile
const profileMessage = ref<ExtendedMessage | null>(null)
const profileTop = ref(0)
const profileHeight = ref(384)
function showProfile(message: ExtendedMessage) {
  const messageElement = document.getElementById(message.id)
  if (!messageElement) return
  const rect = messageElement.getBoundingClientRect()
  const scrollerRect = scrollerRef.value.getBoundingClientRect()
  profileTop.value = Math.min(
    rect.top,
    scrollerRect.top + scrollerRef.value.clientHeight - profileHeight.value
  )
  profileMessage.value = message
}
</script>
