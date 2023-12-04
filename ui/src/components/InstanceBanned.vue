<template>
  <div class="flex flex-col items-center text-center mx-10">
    <img class="pixelated max-w-sm w-full" :src="skullImg" />
    <div class="text-4xl text-error">You have been banned from this canvas.</div>
  </div>
</template>
<script setup lang="ts">
import skullImg from '@/assets/skull.png'
</script>
