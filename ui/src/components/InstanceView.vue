<template>
  <div class="flex flex-col absolute inset-0">
    <InstanceHeader class="h-14" @close="$emit('close')" />
    <div class="flex flex-1 overflow-auto w-full">
      <InstanceGutter class="w-20 h-full" />
      <div class="flex-1 flex flex-col">
        <InstanceDescription :instance="instanceStore.instance" />
        <InstanceBanned v-if="authorStore.isBanned" />
        <InstanceEmpty v-else-if="channels.length === 0" />
        <InstanceChannels v-else class="" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

import InstanceBanned from '@/components/InstanceBanned.vue'
import InstanceChannels from '@/components/InstanceChannels.vue'
import InstanceDescription from '@/components/InstanceDescription.vue'
import InstanceEmpty from '@/components/InstanceEmpty.vue'
import InstanceGutter from '@/components/InstanceGutter.vue'
import InstanceHeader from '@/components/InstanceHeader.vue'
import { useAuthorStore } from '@/store/author'
import { useChannelStore } from '@/store/channel'
import { useInstanceStore } from '@/store/instance'

const authorStore = useAuthorStore()
const channelStore = useChannelStore()
const instanceStore = useInstanceStore()

const channels = computed(() => channelStore.getChannels(instanceStore.instance.id))
</script>
