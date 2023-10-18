<template>
  <div class="flex group hover:bg-gray-darker">
    <div class="flex-shrink-0 w-16">
      <img
        class="h-12 mx-2 my-1 bg-accent cursor-pointer"
        @click="$emit('showProfile', author)"
        :src="author.avatar"
      />
    </div>
    <div class="ml-2 flex-1 w-0">
      <div class="flex flex-col">
        <a
          class="text-xl cursor-pointer hover:underline break-words overflow-x-hidden whitespace-nowrap text-ellipsis"
          :class="{
            'text-accent': author.roles.includes(Role.Moderator),
            'text-error': author.roles.includes(Role.Banned),
          }"
          @click="$emit('showProfile', author)"
        >
          {{ author.name + (author.roles.includes(Role.Banned) ? ' (banned)' : '') }}
        </a>
        <div class="text-gray-light min-w-fit">
          {{ verb }} {{ timeSince ?? author.createdAtTimeSince }}
        </div>
        <!-- <div class="text-gray-light ml-1 min-w-fit">Liked {{ author.likedAtTimeSince }}</div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mergeProps } from 'vue'

import { Role } from '@/graphql/types.gen'
import { ExtendedAuthor } from '@/types/ExtendedAuthor'

interface Props {
  author: ExtendedAuthor
  verb?: string
  timeSince?: string
}

withDefaults(defineProps<Props>(), {
  verb: 'Joined',
})

defineEmits<{
  showProfile: (author: ExtendedAuthor) => void
}>()
</script>
