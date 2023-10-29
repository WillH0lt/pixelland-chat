<template>
  <div class="flex flex-col" v-if="channel">
    <ElementHeader
      class="border-b-black border-b-4 border-solid bg-gray-darkest"
      @close="$emit('close')"
    >
      <img class="pixelated cursor-pointer h-5 m-2 invert" src="/img/hex.png" />
      <div class="text-center text-2xl mb-1">{{ channel.name }}</div>
    </ElementHeader>
    <ChannelMessageList class="flex-1" :channelId="channel.id" />
    <ChannelCompose :channelId="channel.id" />
    <ChannelStatus />
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import ChannelCompose from '@/components/ChannelCompose.vue'
import ChannelMessageList from '@/components/ChannelMessageList.vue'
import ChannelStatus from '@/components/ChannelStatus.vue'
import ElementHeader from '@/components/ElementHeader.vue'
import { useChannelStore } from '@/store/channel'
import { useInstanceStore } from '@/store/instance'

const emit = defineEmits(['close'])

const router = useRouter()
const channelStore = useChannelStore()
const instanceStore = useInstanceStore()
const channel = computed(() => {
  const channelId = router.currentRoute.value.params.channelId as string
  return channelStore.channels[channelId]
})

watchEffect(() => {
  if (!channel.value || instanceStore.instance.id !== channel.value.instanceId) {
    emit('close')
  }
})
</script>
