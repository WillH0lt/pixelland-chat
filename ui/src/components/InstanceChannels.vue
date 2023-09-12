<template>
  <draggable
    class="overflow-y-auto mb-2 border-t border-gray-medium mx-2"
    v-model="channels"
    item-key="id"
    :disabled="!authorStore.isModerator || appStore.isMobile"
    :component-data="{
      tag: 'ul',
    }"
    animation="200"
    ghost-class=""
    :move="handleDragMove"
  >
    <template #item="{ element: channel }">
      <li class="list-none">
        <InstanceCategory v-if="channel.isCategory" :channel="channel" />
        <InstanceChannel v-else :channel="channel" />
      </li>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Draggable from 'vuedraggable'

import InstanceCategory from '@/components/InstanceCategory.vue'
import InstanceChannel from '@/components/InstanceChannel.vue'
import { useAppStore } from '@/store/app'
import { useAuthorStore } from '@/store/author'
import { useChannelStore } from '@/store/channel'
import { useInstanceStore } from '@/store/instance'
import { ExtendedChannel } from '@/types/ExtendedChannel'

const appStore = useAppStore()
const instanceStore = useInstanceStore()
const channelStore = useChannelStore()
const authorStore = useAuthorStore()

let lastMovedChannelId = ''
function handleDragMove(evt: any) {
  lastMovedChannelId = evt.draggedContext.element.id
}
const channels = computed({
  get: () => channelStore.getChannels(instanceStore.instance.id),
  set: (channels: ExtendedChannel[]) => {
    // handle reordered channels
    if (channels.length <= 1) return

    let prevChannel: ExtendedChannel | null = null
    let movedChannel: ExtendedChannel | null = null

    const movedIndex = channels.findIndex(channel => channel.id === lastMovedChannelId)
    if (movedIndex === -1) {
      return
    } else if (movedIndex === 0) {
      movedChannel = channels[movedIndex]
    } else {
      prevChannel = channels[movedIndex - 1]
      movedChannel = channels[movedIndex]
    }

    channelStore.reorderChannel(
      {
        prevChannelId: prevChannel?.id,
      },
      movedChannel.id
    )
  },
})
</script>
