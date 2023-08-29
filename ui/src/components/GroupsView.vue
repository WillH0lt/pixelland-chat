<template>
  <div class="w-full flex flex-col items-center">
    <ElementHeader @close="$emit('close')"></ElementHeader>

    <div class="mx-4 text-xl flex flex-col max-w-full w-80 flex-1">
      <div class="text-3xl mt-4">Direct Messages</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import ElementHeader from '@/components/ElementHeader.vue'
import { useInstanceStore } from '@/store/instance'
import { useUserStore } from '@/store/user'

const instanceStore = useInstanceStore()
const userStore = useUserStore()

// onMounted(async () => {
//   await userStore.fetchUser(uid, true)
// })
</script>
