<template>
  <div class="flex group hover:bg-gray-darker">
    <div class="flex-shrink-0 w-16">
      <img
        class="h-12 mx-2 my-1 bg-accent cursor-pointer"
        @click="$emit('showProfile', like)"
        :src="like.avatar"
      />
    </div>
    <div class="ml-2 flex-1 w-0">
      <div class="flex flex-col">
        <a
          class="text-xl cursor-pointer hover:underline break-words overflow-x-hidden whitespace-nowrap text-ellipsis"
          :class="{
            'text-accent': like.roles.includes(Role.Moderator),
            'text-error': like.roles.includes(Role.Banned),
          }"
          @click="$emit('showProfile', like)"
        >
          {{ like.name + (like.roles.includes(Role.Banned) ? ' (banned)' : '') }}
        </a>
        <div class="text-gray-light ml-1 min-w-fit">Liked {{ like.likedAtTimeSince }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Role } from '@/graphql/types.gen'
import { ExtendedLike } from '@/types/ExtendedLike'

defineProps<{
  like: ExtendedLike
}>()

defineEmits<{
  showProfile: (like: ExtendedLike) => void
}>()
</script>
