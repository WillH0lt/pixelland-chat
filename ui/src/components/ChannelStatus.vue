<template>
  <div
    class="h-2 flex items-center w-full transition-[height]"
    :class="{
      'h-4': !appStore.connected,
    }"
  >
    <div v-if="!appStore.connected" class="text-sm animated-ellipsis ml-16">
      Lost connection. Trying to reconnect
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
</script>

<style scoped>
.animated-ellipsis::after {
  display: inline-block;
  animation: animated-ellipsis-keyframes steps(1, end) 1s infinite;
  content: '';
}

@keyframes animated-ellipsis-keyframes {
  0% {
    content: '';
  }
  25% {
    content: '.';
  }
  50% {
    content: '..';
  }
  75% {
    content: '...';
  }
  100% {
    content: '';
  }
}
</style>
