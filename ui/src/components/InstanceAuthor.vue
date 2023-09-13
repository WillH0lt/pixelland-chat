<template>
  <div class="flex items-center group p-1 mx-2 hover:bg-gray-darker mt-1">
    <img
      class="bg-accent h-12 w-12 hover:cursor-pointer hover:brightness-110 transition pixelated mr-4"
      :src="author.avatar"
    />

    <div class="flex flex-col">
      <div
        class="text-xl cursor-pointer hover:underline break-words overflow-x-hidden whitespace-nowrap text-ellipsis -mt-2"
      >
        {{ author.name + (author.roles.includes(Role.Banned) ? ' (banned)' : '') }}
      </div>
      <div>{{ timeSince }}</div>
    </div>
    <div class="flex-1" />
  </div>
</template>

<script setup lang="ts">
import { Role } from '@/graphql/types.gen'
import { ExtendedAuthor } from '@/types/ExtendedAuthor'

defineProps<{
  author: ExtendedAuthor
  timeSince: string
}>()
</script>
