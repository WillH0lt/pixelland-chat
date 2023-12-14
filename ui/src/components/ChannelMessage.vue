<template>
  <div
    class="flex group hover:bg-gray-darker"
    :class="{
      'bg-gray-darker': dropdownOpen,
    }"
  >
    <div class="flex-shrink-0 w-16">
      <img
        v-if="!message.compact || repliedMessage"
        class="h-12 mx-2 my-1 bg-accent cursor-pointer"
        :class="{ 'mt-8': repliedMessage }"
        @click="$emit('showProfile', message)"
        :src="user.avatar"
      />
    </div>
    <div class="ml-2 flex-1 w-0">
      <div v-if="repliedMessage" class="h-6 flex flex-row gap-2 items-center">
        <div class="border-gray-medium w-16 h-3 border-l-2 border-t-2 self-end"></div>
        <AuthorName
          :name="repliedMessage.author.name"
          :roles="repliedMessage.author.roles"
          :inReply="true"
        />
        <p class="text-ellipsis w-full text-lg text-gray-light overflow-x-hidden whitespace-nowrap">
          {{ repliedMessage.text }}
        </p>
      </div>
      <div v-if="!message.compact || repliedMessage" class="flex items-end">
        <AuthorName :name="user.name" :roles="user.roles" @click="$emit('showProfile', message)" />
        <div class="text-gray-light ml-1 min-w-fit">{{ message.timeSince }}</div>
      </div>
      <ChannelText
        class="text-xl leading-6 transition"
        :class="{
          'text-gray-light': message.saved,
          'text-gray-medium': !message.saved,
        }"
        :text="message.text"
      />
      <div v-if="message.imageUrls">
        <div class="flex flex-row gap-2 mt-2">
          <img
            v-for="imageUrl in message.imageUrls"
            class="h-28 w-28 mb-2 cursor-pointer hover:scale-105 transition-all"
            :src="imageUrl"
            @click="showZoomedImage(imageUrl)"
          />
        </div>
      </div>
      <div v-if="message.error">
        <div class="text-error text-sm">{{ message.error }}</div>
      </div>
    </div>
    <div
      v-if="appStore.isLoggedIn"
      class="ml-auto mr-3 flex items-center justify-center md:invisible md:group-hover:visible"
    >
      <ElementDropdown
        :items="dropdownItems"
        @open="dropdownOpen = true"
        @close="dropdownOpen = false"
        :side="SIDE.BOTTOM"
        :anchor="SIDE.RIGHT"
      >
        <img
          class="h-7 px-2 pixelated invert opacity-40 cursor-pointer hover:opacity-80 hover:scale-110 transition"
          src="/img/dots.png"
        />
      </ElementDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import AuthorName from '@/components/AuthorName.vue'
import ChannelText from '@/components/ChannelText.vue'
import ElementDropdown from '@/components/ElementDropdown.vue'
import { Maybe, Message, Role } from '@/graphql/types.gen'
import { useAppStore } from '@/store/app'
import { useAuthorStore } from '@/store/author'
import { useMessageStore } from '@/store/message'
import { DropdownItem } from '@/types/DropdownItem'
import { ExtendedAuthor } from '@/types/ExtendedAuthor'
import { ExtendedMessage } from '@/types/ExtendedMessage'
import { SIDE } from '@/types/SideEnum'
import { useDialogStore } from '@/store/dialog'

const appStore = useAppStore()
const dialogStore = useDialogStore()

const props = defineProps<{
  message: ExtendedMessage
  repliedMessage: Maybe<Message> | undefined
  user: ExtendedAuthor
}>()

defineEmits<{
  showProfile: (message: ExtendedMessage) => void
}>()

const authorStore = useAuthorStore()
const dropdownOpen = ref(false)
const messageStore = useMessageStore()

function showZoomedImage(url: string) {
  dialogStore.showDialog({
    title: 'Zoomed Image',
    text: `Taken by <span class="underline">${props.user.name}</span>`,
    imageUrl: url,
  })
}

const dropdownItems = computed(() => {
  const items: DropdownItem[] = [
    {
      text: 'reply',
      onClicked: () => {
        messageStore.setReplyingTo(props.message.channelId, props.message as unknown as Message)
      },
    },
  ]

  if (
    props.message.authorId === authorStore.instanceUser.id ||
    (authorStore.isModerator && !props.user.roles.includes(Role.Moderator))
  ) {
    items.push({
      text: 'delete',
      onClicked: () => {
        messageStore.removeMessage(props.message)
      },
    })
  }

  return items
})
</script>
