<template>
  <div class="flex items-center p-1 mx-2 group mt-4">
    <Markdown
      class="text-xl text-white bg-gray-dark mt-2 ml-2 markdown"
      @click="handleLinkClicks($event, dialogStore)"
      :linkify="true"
      :breaks="true"
      :source="channel.name"
    />

    <!-- <div class="text-xl ml-2">
      {{ channel.name }}
    </div> -->
    <div class="flex-1" />
    <ElementDropdown
      v-if="categoryDropdownItems.length"
      :items="categoryDropdownItems"
      :side="SIDE.BOTTOM"
      :anchor="SIDE.LEFT"
      @click.stop
    >
      <img
        class="pixelated cursor-pointer invert h-5 mx-2 opacity-0 group-hover:opacity-80 hover:opacity-100 hover:scale-110"
        src="/img/dots.png"
      />
    </ElementDropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import Markdown from 'vue3-markdown-it'
import { useRouter } from 'vue-router'

import ElementDropdown from '@/components/ElementDropdown.vue'
import { useAuthorStore } from '@/store/author'
import { useChannelStore } from '@/store/channel'
import { useDialogStore } from '@/store/dialog'
import { DropdownItem } from '@/types/DropdownItem'
import { ExtendedChannel } from '@/types/ExtendedChannel'
import { SIDE } from '@/types/SideEnum'
import { handleLinkClicks } from '@/utils'

const props = defineProps<{
  channel: ExtendedChannel
}>()

const router = useRouter()
const authorStore = useAuthorStore()
const channelStore = useChannelStore()
const dialogStore = useDialogStore()

const categoryDropdownItems = ref<DropdownItem[]>([])
watchEffect(() => {
  categoryDropdownItems.value = []
  if (authorStore.isModerator) {
    categoryDropdownItems.value.push({
      text: 'Edit',
      onClicked: () => {
        router.push({ name: 'editCategory', params: { channelId: props.channel.id } })
      },
    })
    categoryDropdownItems.value.push({
      text: 'Delete',
      onClicked: async () => {
        showDeleteCategoryConfirmationDialog()
      },
    })
  }
})

function showDeleteCategoryConfirmationDialog() {
  dialogStore.showDialog({
    title: 'Wait a sec',
    text: `Are you sure you want to delete <span class="underline">${props.channel.name}</span> category?`,
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
