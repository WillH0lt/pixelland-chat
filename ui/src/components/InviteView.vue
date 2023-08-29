<template>
  <div class="w-full flex flex-col items-center">
    <ElementHeader @close="$emit('close')"></ElementHeader>

    <div v-if="error">{{ error }}</div>
    <div v-else-if="loading">loading...</div>
    <div v-else>
      <div class="mx-4 text-xl flex flex-col max-w-full w-80 flex-1">
        <div class="text-3xl mt-4">Your invite link</div>

        <ElementInput class="mt-4" v-model="inviteLink" :attr="{ readonly: true }"></ElementInput>

        <div class="my-2">{{ inviteDescription }}</div>

        <div
          class="text-accent underline cursor-pointer"
          @click="router.push({ name: 'createInvite' })"
        >
          Edit invite link
        </div>
      </div>

      <router-view @close="router.back()" v-slot="{ Component, route }" @keydown.stop>
        <transition name="slide">
          <component
            v-if="route.name !== 'invite'"
            :is="Component"
            class="absolute inset-0 bg-gray-dark"
          />
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import ElementHeader from '@/components/ElementHeader.vue'
import ElementInput from '@/components/ElementInput.vue'
import { useAppStore } from '@/store/app'
import { useInstanceStore } from '@/store/instance'
import { useInviteStore } from '@/store/invite'

defineEmits(['close'])

const router = useRouter()

const appStore = useAppStore()
const instanceStore = useInstanceStore()
const inviteStore = useInviteStore()

const loading = ref(true)
const error = ref('')
onMounted(async () => {
  if (!inviteStore.invite) {
    try {
      await inviteStore.fetchInvite(instanceStore.instance.id)
    } catch (err) {
      error.value = err as string
    }
  }
  loading.value = false
})

const inviteLink = computed(() => {
  return appStore.inviteBasePath + inviteStore.invite?.code
})

const inviteDescription = computed(() => {
  const expiresAt = inviteStore.invite?.expiresAt
  const redemptions = inviteStore.invite?.redemptions

  let desc = 'Invite link'
  if (expiresAt) {
    desc += ` expires in ${timeUntil(new Date(expiresAt))}`
  }
  if (expiresAt && redemptions) {
    desc += ' and'
  }
  if (redemptions) {
    desc += ` can be used ${redemptions} more time${redemptions === 1 ? '' : 's'}`
  }
  if (!expiresAt && !redemptions) {
    desc += ' never expires'
  }
  desc += '.'

  return desc
})

function timeUntil(date: Date) {
  const days = Math.round((date.getTime() - Date.now()) / 1000 / 60 / 60 / 24)
  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'}`
  }
  const hours = Math.round((date.getTime() - Date.now()) / 1000 / 60 / 60)
  if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`
  }
  const minutes = Math.round((date.getTime() - Date.now()) / 1000 / 60)
  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'}`
  }
  const seconds = Math.round((date.getTime() - Date.now()) / 1000)
  return `${seconds} second${seconds === 1 ? '' : 's'}}`
}
</script>
