<template>
  <div class="flex flex-col m-2 border-gray-medium border-t">
    <div class="mx-2 text-xl">Comments ({{ channel.mutableMessageCount }})</div>
    <ChannelMessageList :channelId="channel.id" />
    <div>
      <div
        class="w-full text-center hover:underline cursor-pointer hover:text-accent m-2 text-xl"
        v-if="!composing"
        @click="composing = true"
      >
        + Add Comment
      </div>
      <ChannelCompose class="my-2" v-else :channelId="channel.id" @send="composing = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import ChannelCompose from '@/components/ChannelCompose.vue'
import ChannelMessageList from '@/components/ChannelMessageList.vue'
import { useMessageStore } from '@/store/message'
import { ExtendedChannel } from '@/types/ExtendedChannel'

const route = useRoute()
const messageStore = useMessageStore()

const props = defineProps<{
  channel: ExtendedChannel
}>()

const composing = ref(false)

watch(
  () => route.path,
  () => {
    composing.value = false
  }
)

watch(
  () => messageStore.getReplyingTo(props.channel.id),
  replyingTo => {
    composing.value = !!replyingTo
  }
)
</script>
