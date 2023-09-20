<template>
  <div class="flex group hover:bg-gray-darker">
    <div class="flex-shrink-0 w-16">
      <img
        class="h-12 mx-2 my-1 bg-accent cursor-pointer"
        @click="$emit('showProfile', notification)"
        :src="author.avatar"
      />
    </div>
    <div class="flex flex-col ml-2 flex-1 w-full">
      <div class="text-lg">
        <span class="cursor-pointer hover:underline" @click="$emit('showProfile', notification)">
          {{ author.name }}
        </span>
        <span v-if="notification.kind === NotificationKind.LikeAdded"> liked </span>
        <span v-if="notification.kind === NotificationKind.CommentAdded"> commented on </span>
        <span
          class="cursor-pointer hover:underline"
          v-if="notification.instance"
          @click="emitter.emit('chat:instance:click', notification.instance!.id)"
        >
          {{ notification.instance.name || `your ${appStore.noun}` }}
        </span>
      </div>
      <div class="ml-1 min-w-fit" v-if="notification.kind === NotificationKind.CommentAdded">
        {{ notification.message?.text }}
      </div>
      <div class="text-gray-light ml-1 min-w-fit">
        {{ notification.notificationAddedTimeSince }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { emitter } from '@/Emitter'
import { NotificationKind } from '@/graphql/types.gen'
import { useAppStore } from '@/store/app'
import { ExtendedAuthor } from '@/types/ExtendedAuthor'
import { ExtendedNotification } from '@/types/ExtendedNotification'

const appStore = useAppStore()
defineProps<{
  notification: ExtendedNotification
  author: ExtendedAuthor
}>()

defineEmits<{
  showProfile: (notification: ExtendedNotification) => void
}>()
</script>
