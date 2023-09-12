<template>
  <div class="flex items-center group p-1 mx-2 hover:bg-gray-darker mt-1">
    <!-- <img class="pixelated h-10 w-10 rounded-full" :src="author.avatar" /> -->
    <img
      class="bg-accent h-12 w-12 hover:cursor-pointer hover:brightness-110 transition pixelated mr-4"
      :src="author.avatar"
    />

    <div class="flex flex-col">
      <div
        class="text-xl cursor-pointer hover:underline break-words overflow-x-hidden whitespace-nowrap text-ellipsis -mt-2"
      >
        <!-- @click="$emit('showProfile', message)" -->
        {{ author.name + (author.roles.includes(Role.Banned) ? ' (banned)' : '') }}
      </div>
      <div>{{ timeSince }}</div>
    </div>
    <!-- <img
          v-if="user.roles.includes(Role.Member)"
          class="pixelated -translate-y-1/3 ml-1 h-4"
          src="/img/edit.png"
        /> -->

    <!-- @click="emitter.emit('chat:user:edit')" -->
    <div class="flex-1" />
  </div>
  <!-- <hr class="border-gray-medium mx-2" /> -->
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import Markdown from 'vue3-markdown-it'

import ElementDropdown from '@/components/ElementDropdown.vue'
import { instanceStream } from '@/graphql/subscriptions/instanceStream'
import { Role } from '@/graphql/types.gen'
import { router } from '@/router'
import { useAuthorStore } from '@/store/author'
import { useDialogStore } from '@/store/dialog'
import { DropdownItem } from '@/types/DropdownItem'
import { ExtendedAuthor } from '@/types/ExtendedAuthor'
import { SIDE } from '@/types/SideEnum'
import { handleLinkClicks } from '@/utils'

defineProps<{
  author: ExtendedAuthor
  timeSince: string
}>()

// const authorStore = useAuthorStore()
// const dialogStore = useDialogStore()

// const items = ref<DropdownItem[]>([])
// watchEffect(() => {
//   items.value = []
//   if (authorStore.isModerator) {
//     items.value.push({
//       text: 'Edit',
//       onClicked: () => {
//         router.push({ name: 'editInstance', params: { instanceId: props.instance.id } })
//       },
//     })
//   }
// })
</script>
