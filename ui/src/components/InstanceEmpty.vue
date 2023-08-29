<template>
  <div class="flex flex-col items-center mt-24 w-full">
    <div class="w-full flex flex-col items-center mt-24">
      <div class="text-2xl">Not much going on here...</div>
      <div class="w-full flex flex-col items-center mt-8" v-if="authorStore.isAdmin">
        <div class="">If you'd like to get something started you can add a channel</div>
        <ElementButton class="w-28 mt-4" @click="router.push({ name: 'createChannel' })"
          >Add Channel</ElementButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import ElementButton from '@/components/ElementButton.vue'
import { useAuthorStore } from '@/store/author'

const router = useRouter()
const authorStore = useAuthorStore()
</script>
