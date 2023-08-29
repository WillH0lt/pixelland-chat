<template>
  <div class="h-14 relative">
    <div class="flex items-center justify-center w-full h-full content-center">
      <slot></slot>
    </div>
    <img
      class="absolute top-0 left-0 pixelated cursor-pointer h-full p-3 pb-2 invert hover:scale-105"
      @click="$emit('close')"
      src="/img/left-caret.png"
    />
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'close'): void
}>()
</script>
