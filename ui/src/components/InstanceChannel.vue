<template>
  <div
    class="flex items-center p-1 mx-2 group hover:bg-gray-darker cursor-pointer"
    @click="router.push({ name: 'channel', params: { channelId: channel.id } })"
  >
    <img class="w-4 h-4 pixelated invert opacity-80 group-hover:opacity-100" src="/img/hex.png" />
    <div
      class="ml-2 text-xl group-hover:text-white text-gray-light"
      :class="{
        '!text-accent': unreadStore.channelHasUnread(channel),
      }"
    >
      {{ channel.name }}
    </div>
    <div class="flex-1" />
    <ElementDropdown
      v-if="channelDropdownItems.length"
      :items="channelDropdownItems"
      :side="SIDE.BOTTOM"
      :anchor="SIDE.LEFT"
      @click.stop
    >
      <img
        class="pixelated cursor-pointer invert h-5 m-2 opacity-0 group-hover:opacity-80 hover:opacity-100 hover:scale-110"
        src="/img/dots.png"
      />
    </ElementDropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import ElementDropdown from '@/components/ElementDropdown.vue'
import { useAuthorStore } from '@/store/author'
import { useChannelStore } from '@/store/channel'
import { useDialogStore } from '@/store/dialog'
import { useUnreadStore } from '@/store/unread'
import { DropdownItem } from '@/types/DropdownItem'
import { ExtendedChannel } from '@/types/ExtendedChannel'
import { SIDE } from '@/types/SideEnum'

const props = defineProps<{
  channel: ExtendedChannel
}>()

const router = useRouter()
const authorStore = useAuthorStore()
const channelStore = useChannelStore()
const dialogStore = useDialogStore()
const unreadStore = useUnreadStore()

const channelDropdownItems = ref<DropdownItem[]>([])
watchEffect(() => {
  channelDropdownItems.value = []
  if (authorStore.isModerator) {
    channelDropdownItems.value.push({
      text: 'Edit',
      onClicked: () => {
        router.push({ name: 'editChannel', params: { channelId: props.channel.id } })
      },
    })
    channelDropdownItems.value.push({
      text: 'Delete',
      onClicked: async () => {
        showDeleteChannelConfirmationDialog()
      },
    })
  }
})

function showDeleteChannelConfirmationDialog() {
  dialogStore.showDialog({
    title: 'Wait a sec',
    text: `Are you sure you want to delete #${props.channel.name} channel?`,
    buttons: [
      {
        text: 'cancel',
        onClicked: () => {},
      },
      {
        text: 'confirm',
        onClicked: async () => {
          await channelStore.removeChannel(props.channel.id)
        },
      },
    ],
  })
}
</script>
