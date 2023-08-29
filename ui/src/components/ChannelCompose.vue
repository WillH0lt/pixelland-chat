<template>
  <div class="flex items-center mt-2" ref="composeRef">
    <img
      class="bg-accent h-12 w-12 mx-2 hover:cursor-pointer hover:brightness-110 transition pixelated"
      :src="authorStore.instanceUser?.avatar"
      @click="emitter.emit('chat:user:edit')"
    />
    <ElementTextArea
      v-if="appStore.verified && appStore.isLoggedIn"
      class="flex-1 text-xl pr-8 text-black bg-gray-light placeholder:text-gray-dark"
      :placeholder="messagePlaceholder"
      placeholder-color="error"
      v-model:text="text"
      :editable="editable && canPublish"
      maxlength="1024"
      @keydown.stop
      @keydown.enter.exact.prevent="onEnterDown"
    />
    <div v-else class="flex-1 text-xl h-full text-black bg-gray-light flex items-center pl-2">
      <div v-if="!appStore.isLoggedIn">
        👋 You must
        <a class="underline hover:cursor-pointer" @click="emitter.emit('chat:login:request')"
          >log in</a
        >
        to join chat.
      </div>
      <div v-else-if="!appStore.verified">
        👋 Please
        <a class="underline hover:cursor-pointer" @click="emitter.emit('chat:verify:request')"
          >verify your email</a
        >
        to join chat.
      </div>
    </div>
    <img
      v-if="canPublish"
      class="h-6 pixelated -mr-6 -translate-x-8 opacity-80 grayscale hover:scale-105 cursor-pointer hover:grayscale-0 transition"
      @click="emojiPickerVisible = !emojiPickerVisible"
      src="/img/emoji.svg"
    />
    <img
      class="m-2 h-8 pixelated cursor-pointer invert opacity-80 hover:opacity-100 hover:scale-105 transition"
      @click="submit"
      src="/img/send.png"
    />
    <div
      v-if="emojiPickerVisible"
      class="fixed w-full h-full inset-0"
      @click="emojiPickerVisible = false"
    >
      <ChannelEmojiPicker
        class="absolute right-2"
        :style="{
          bottom: `${emojiPickerBottom}px`,
        }"
        @select="onEmojiSelect"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { emitter } from '@/Emitter'
import ChannelEmojiPicker from '@/components/ChannelEmojiPicker.vue'
import ElementTextArea from '@/components/ElementTextArea.vue'
import { Role } from '@/graphql/types.gen'
import { useAppStore } from '@/store/app'
import { useAuthorStore } from '@/store/author'
import { useChannelStore } from '@/store/channel'
import { useMessageStore } from '@/store/message'
import { getMostPermissiveRole } from '@/utils'

const props = defineProps<{
  channelId: string
}>()

const appStore = useAppStore()
const channelStore = useChannelStore()
const authorStore = useAuthorStore()
const messageStore = useMessageStore()

const editable = ref(true)
const emojiPickerVisible = ref(false)

const channel = computed(() => {
  return channelStore.channels[props.channelId]
})

const canPublish = computed(() => {
  return (
    appStore.isLoggedIn &&
    appStore.verified &&
    !authorStore.isBanned &&
    (channel.value.publishers.includes(Role.AllUsers) ||
      hasUnion(channel.value.publishers as Role[], authorStore.instanceUser.roles as Role[]))
  )
})

const messagePlaceholder = computed(() => {
  if (canPublish.value) {
    return 'send message...'
  } else if (!appStore.isLoggedIn) {
    return '👋 log in to send messages'
  } else if (!appStore.verified) {
    return '👋 verify your email to send messages'
  } else if (authorStore.isBanned) {
    return '💀 you are banned'
  }

  const role = getMostPermissiveRole(channel.value.publishers as Role[])
  const roleString = role === Role.Moderator ? 'mod' : role.toLowerCase()
  return `Only ${roleString}s can post here.`
})

const text = computed({
  get: () => {
    return messageStore.getComposeText(props.channelId)
  },
  set: val => {
    messageStore.setComposeText(props.channelId, val)
  },
})

function onEmojiSelect(emoji: string) {
  text.value += emoji
  emojiPickerVisible.value = false
}

async function onEnterDown(ev: Event) {
  ev.preventDefault()
  await submit()
}

async function submit() {
  if (!appStore.connected) {
    return
  }

  // don't allow publishing just spaces
  if (!text.value.replace(' ', '').length) {
    return
  }

  // if the text isn't editable it means user we're already publishing a message
  if (!editable.value) {
    return
  }

  const publishableText = text.value

  // reset text box
  text.value = ''

  // publish the message
  editable.value = false

  await messageStore.addMessage({
    text: publishableText,
    channelId: props.channelId,
  })
  editable.value = true
}

function hasUnion(rolesA: Role[], rolesB: Role[]) {
  return rolesA.some(r => rolesB.includes(r))
}

// handle resize
const composeRef = ref()
const emojiPickerBottom = ref(0)
let observer: ResizeObserver
onMounted(() => {
  observer = new ResizeObserver(async () => {
    emojiPickerBottom.value = composeRef.value.clientHeight + 10
  })
  observer.observe(composeRef.value)
})
onUnmounted(() => {
  observer.disconnect()
})
</script>