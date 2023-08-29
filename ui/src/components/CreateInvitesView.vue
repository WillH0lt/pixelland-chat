<template>
  <div class="w-full flex flex-col items-center">
    <ElementHeader @close="$emit('close')"></ElementHeader>

    <div class="mx-4 text-xl flex flex-col max-w-full w-80 flex-1">
      <div class="text-3xl mt-4">Edit Invite</div>

      <ElementDivider class="my-6" />

      <div class="flex items-center w-80 mb-8 last:mb-0">
        Expires After
        <div class="flex-1" />
        <ElementSelection :items="expiresAfterItems" v-model="expiresAfter" />
      </div>

      <div class="flex items-center w-80 last:mb-0">
        Number of Uses
        <div class="flex-1" />
        <ElementSelection :items="redemptionItems" v-model="redemptions" />
      </div>

      <ElementDivider class="my-6" />

      <div class="flex justify-center w-full mt-4">
        <ElementButton class="mx-4" @click="$emit('close')">Cancel</ElementButton>
        <ElementButton class="mx-4" @click="createInvite" :loading="saving"
          >Generate New Link</ElementButton
        >
      </div>
      <div class="w-full text-error mt-8">{{ error }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import ElementButton from '@/components/ElementButton.vue'
import ElementDivider from '@/components/ElementDivider.vue'
import ElementHeader from '@/components/ElementHeader.vue'
import ElementSelection from '@/components/ElementSelection.vue'
import { useInstanceStore } from '@/store/instance'
import { useInviteStore } from '@/store/invite'
import { SelectionItem } from '@/types/SelectionItem'

const instanceStore = useInstanceStore()
const inviteStore = useInviteStore()

const emit = defineEmits(['close'])

const NEVER_KEY = 'NEVER_KEY'
const expiresAfter = ref('10080')
const expiresAfterItems: SelectionItem[] = [
  {
    text: '30 minutes',
    key: '30',
  },
  {
    text: '1 hour',
    key: '60',
  },
  {
    text: '6 hour',
    key: '360',
  },
  {
    text: '12 hour',
    key: '720',
  },
  {
    text: '1 day',
    key: '1440',
  },
  {
    text: '7 days',
    key: '10080',
  },
  {
    text: 'Never',
    key: NEVER_KEY,
  },
]

const NO_LIMIT_KEY = 'NO_LIMIT_KEY'
const redemptions = ref(NO_LIMIT_KEY)
const redemptionItems: SelectionItem[] = [
  {
    text: 'No Limit',
    key: NO_LIMIT_KEY,
  },
  {
    text: '1 Use',
    key: '1',
  },
  {
    text: '5 Uses',
    key: '5',
  },
  {
    text: '10 Uses',
    key: '10',
  },
  {
    text: '25 Uses',
    key: '25',
  },
  {
    text: '50 Uses',
    key: '50',
  },
  {
    text: '100 Uses',
    key: '100',
  },
]

const saving = ref(false)
const error = ref('')

async function createInvite() {
  saving.value = true
  error.value = ''
  try {
    const inviteInput = {
      instanceId: instanceStore.instance.id,
      expiresAt:
        expiresAfter.value === NEVER_KEY
          ? null
          : new Date(Date.now() + parseInt(expiresAfter.value) * 60000).toISOString(),
      redemptions: redemptions.value === NO_LIMIT_KEY ? null : parseInt(redemptions.value),
    }

    await inviteStore.addInvite(inviteInput)
    emit('close')
  } catch (e) {
    error.value = String(e)
  }
  saving.value = false
}
</script>
