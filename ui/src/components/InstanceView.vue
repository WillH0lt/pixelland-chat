<template>
  <div class="flex flex-col absolute inset-0">
    <InstanceHeader class="h-14" @close="$emit('close')" />
    <div class="flex flex-1 overflow-auto w-full">
      <InstanceGutter class="w-20 h-full" />
      <div class="flex-1 flex flex-col">
        <InstanceAuthor
          v-if="instance.showAuthor"
          :author="instance.author"
          :time-since="instance.timeSince"
        />
        <InstanceDescription :instance="instance" />
        <InstanceLikes v-if="instance.showLikes" :instance-id="instance.id" />
        <InstanceBanned v-if="authorStore.isBanned" />
        <!-- <InstanceEmpty v-else-if="channels.length === 0" /> -->
        <InstanceChannels
          class="overflow-y-auto overflow-x-hidden flex-1"
          v-else-if="instance.showChat"
        />
        <InstanceComments
          class="overflow-y-auto overflow-x-hidden"
          v-if="instance.showComments && commentsChannel"
          :channel="commentsChannel"
          :class="instance.showChat ? 'max-h-[25vh]' : 'flex-1'"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

import InstanceAuthor from '@/components/InstanceAuthor.vue'
import InstanceBanned from '@/components/InstanceBanned.vue'
import InstanceChannels from '@/components/InstanceChannels.vue'
import InstanceComments from '@/components/InstanceComments.vue'
import InstanceDescription from '@/components/InstanceDescription.vue'
import InstanceEmpty from '@/components/InstanceEmpty.vue'
import InstanceGutter from '@/components/InstanceGutter.vue'
import InstanceHeader from '@/components/InstanceHeader.vue'
import InstanceLikes from '@/components/InstanceLikes.vue'
import { useAuthorStore } from '@/store/author'
import { useChannelStore } from '@/store/channel'
import { useInstanceStore } from '@/store/instance'

const authorStore = useAuthorStore()
const channelStore = useChannelStore()
const instanceStore = useInstanceStore()

const commentsChannel = computed(() => channelStore.getCommentsChannel(instanceStore.instance.id))
const instance = computed(() => instanceStore.instance)
</script>
