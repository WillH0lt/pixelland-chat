<template>
  <div class="flex items-center mx-2">
    <HeartIcon
      class="h-8 w-8 cursor-pointer hover:brightness-110 hover:scale-110 transition pixelated mx-2"
      :fill="likedByMe ? '#e61a30' : '#909090'"
      @click="toggleLike"
    />
    <div
      class="text-xl cursor-pointer hover:bg-gray-darker p-2 transition"
      @click="router.push({ name: 'likes', params: { instanceId: props.instanceId } })"
    >
      {{ likesCount }} like{{ likesCount === 1 ? '' : 's' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import HeartIcon from '@/icons/HeartIcon.vue'
import { useLikeStore } from '@/store/like'

const router = useRouter()
const props = defineProps<{
  instanceId: string
}>()

const likeStore = useLikeStore()

const likedByMe = computed(() => likeStore.likedByMe)
const likesCount = computed(() => likeStore.likesCount)

function toggleLike() {
  if (likedByMe.value) {
    likeStore.removeLike(props.instanceId)
  } else {
    likeStore.addLike(props.instanceId)
  }
}
</script>
