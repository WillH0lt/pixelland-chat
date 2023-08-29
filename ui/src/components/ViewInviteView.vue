<template>
  <div class="absolute inset-0 bg-gray-dark z-50">
    <ElementHeader @close="$emit('close')"></ElementHeader>
    <div
      v-if="error"
      class="w-full h-full flex items-center justify-center text-error text-center text-2xl"
    >
      {{ error }}
    </div>
    <div
      v-else-if="loading"
      class="w-full h-full flex items-center justify-center text-white text-2xl"
    >
      Loading...
    </div>
    <div v-else class="w-full h-full flex flex-col items-center justify-center">
      <div class="text-2xl mb-12">
        You've been invited to join
        <span class="underline">{{ invite.instance?.name ?? '' }}</span
        >!
      </div>
      <div class="flex text-2xl">
        <ElementButton class="m-2" @click="$emit('close')">Cancel</ElementButton>
        <ElementButton class="m-2" @click="acceptInvite()" :loading="invitePending"
          >Accept Invite</ElementButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import ElementButton from '@/components/ElementButton.vue'
import ElementHeader from '@/components/ElementHeader.vue'
import { useInstanceStore } from '@/store/instance'
import { useInviteStore } from '@/store/invite'
import { ExtendedInvite } from '@/types/ExtendedInvite'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()
const inviteStore = useInviteStore()
const instanceStore = useInstanceStore()

const loading = ref(true)
const error = ref('')
const invite = ref({} as ExtendedInvite)
const invitePending = ref(false)

onMounted(async () => {
  try {
    const response = await inviteStore.checkInvite(route.params.code as string)
    invite.value = response as ExtendedInvite
    loading.value = false
  } catch (e) {
    error.value = e as string
  }
})

async function acceptInvite() {
  invitePending.value = true
  try {
    await inviteStore.redeemInvite(route.params.code as string)
    instanceStore.setActiveInstance(invite.value.instanceId)
    emit('close')
  } catch (e) {
    error.value = e as string
    invitePending.value = false
  }
}
</script>
