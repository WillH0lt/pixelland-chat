<template>
  <div
    class="flex group hover:bg-gray-darker"
    :class="{
      'bg-gray-darker': dropdownOpen,
    }"
  >
    <div class="flex-shrink-0 w-16">
      <img
        v-if="!message.compact"
        class="h-12 mx-2 my-1 bg-accent cursor-pointer"
        @click="$emit('showProfile', message)"
        :src="user.avatar"
      />
    </div>
    <div class="ml-2 flex-1 w-0">
      <div v-if="!message.compact" class="flex items-end">
        <a
          class="text-xl cursor-pointer hover:underline break-words overflow-x-hidden whitespace-nowrap text-ellipsis"
          :class="{
            'text-accent': user.roles.includes(Role.Moderator),
            'text-error': user.roles.includes(Role.Banned),
          }"
          @click="$emit('showProfile', message)"
        >
          {{ user.name + (user.roles.includes(Role.Banned) ? ' (banned)' : '') }}
        </a>
        <ElementHoverText v-if="user.roles.includes(Role.Member)" text="Editor" :side="SIDE.RIGHT">
          <img class="pixelated -translate-y-1/3 ml-1 h-4" src="/img/pencil.png" />
        </ElementHoverText>
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
      <div v-if="message.error">
        <div class="text-error text-sm">{{ message.error }}</div>
      </div>
    </div>
    <div
      v-if="
        user.id === authorStore.instanceUser.id ||
        (authorStore.isModerator && !user.roles.includes(Role.Moderator))
      "
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
import { ref } from 'vue'

import ChannelText from '@/components/ChannelText.vue'
import ElementDropdown from '@/components/ElementDropdown.vue'
import { Role } from '@/graphql/types.gen'
import { useAuthorStore } from '@/store/author'
import { useMessageStore } from '@/store/message'
import { ExtendedAuthor } from '@/types/ExtendedAuthor'
import { ExtendedMessage } from '@/types/ExtendedMessage'
import { SIDE } from '@/types/SideEnum'

import ElementHoverText from './ElementHoverText.vue'

const props = defineProps<{
  message: ExtendedMessage
  user: ExtendedAuthor
}>()

defineEmits<{
  showProfile: (message: ExtendedMessage) => void
}>()

const authorStore = useAuthorStore()
const dropdownOpen = ref(false)
const messageStore = useMessageStore()

const dropdownItems = ref([
  {
    text: 'delete',
    onClicked: () => {
      messageStore.removeMessage(props.message)
    },
  },
])
</script>
