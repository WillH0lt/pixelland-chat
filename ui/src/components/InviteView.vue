<template>
  <div class="w-full flex flex-col overflow-y-auto items-center overflow-x-hidden">
    <ElementHeader class="flex-shrink-0 w-full text-3xl" @close="$emit('close')"
      >Share
      {{
        instanceStore.instance.name ? `"${instanceStore.instance.name}"` : 'World'
      }}</ElementHeader
    >

    <div
      class="relative my-4 px-12 text-lg bg-gray-medium whitespace-nowrap overflow-x-scroll text-center"
      :class="{
        'opacity-50': loading,
      }"
    >
      {{ shareLink }}
      <div class="absolute inset-0 h-full w-full flex justify-center items-center" v-if="loading">
        <ElementLoadingIcon class="scale-[30%]" />
      </div>
    </div>

    <div class="flex w-full justify-center mt-4">
      <ElementButton class="w-fit" @click="copyLink">Copy Link</ElementButton>
    </div>
    <div class="text-accent transition" :class="{ 'opacity-0': !copiedVisible }">copied!</div>

    <div class="flex my-4 text-xl">
      <div class="mr-2">Anyone with link</div>
      <ElementSelection class="w-32" :items="shareTypes" v-model="shareType" />
    </div>

    <div class="my-2">{{ inviteDescription }}</div>

    <div
      class="mx-4 text-xl flex flex-col max-w-full w-80 flex-1"
      v-if="shareType === ShareType.Edit"
    >
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

      <div class="w-full text-error mt-8">{{ error }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'

import ElementButton from '@/components/ElementButton.vue'
import ElementDivider from '@/components/ElementDivider.vue'
import ElementHeader from '@/components/ElementHeader.vue'
import ElementLoadingIcon from '@/components/ElementLoadingIcon.vue'
import ElementSelection from '@/components/ElementSelection.vue'
import { Access } from '@/graphql/types.gen'
import { useAuthorStore } from '@/store/author'
import { useInstanceStore } from '@/store/instance'
import { useInviteStore } from '@/store/invite'
import { SelectionItem } from '@/types/SelectionItem'

const authorStore = useAuthorStore()
const instanceStore = useInstanceStore()
const inviteStore = useInviteStore()

enum ShareType {
  View = 'view',
  Edit = 'edit',
}

const loading = ref(false)
const copiedVisible = ref(false)
const shareType = ref(ShareType.View)
const code = ref('')
const advancedVisible = ref(false)

const shareLink = computed(() => {
  // let link = `${window.location.origin}/world/${route.params.slug as string}`

  return `${code.value || ''}`
})

const shareTypes = ref([
  {
    text: 'can view',
    key: ShareType.View,
    active: false,
  },
  {
    text: 'can edit',
    key: ShareType.Edit,
    active: false,
  },
])

watchEffect(() => {
  const [viewOption, editOption] = shareTypes.value

  // if (instanceStore.instance.)
  // if (worldStore.world.drawAccess === Access.Public) {
  //   viewOption.active = false
  //   editOption.active = true
  // } else {
  viewOption.active = true
  editOption.active = authorStore.isModerator
  // }

  for (const option of shareTypes.value) {
    if (option.active) {
      shareType.value = option.key
      break
    }
  }

  shareType.value = viewOption.active ? ShareType.View : ShareType.Edit
})

function copyLink() {
  navigator.clipboard.writeText(shareLink.value)
  copiedVisible.value = true
  setTimeout(() => {
    copiedVisible.value = false
  }, 1500)
}

watch(shareType, async newShareType => {
  if (newShareType === ShareType.Edit) {
    // && worldStore.world.drawAccess !== Access.Public) {
    loading.value = true
    await inviteStore.fetchInvite(instanceStore.instance.id)
    loading.value = false
  } else {
  }
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
    text: '6 hours',
    key: '360',
  },
  {
    text: '12 hours',
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

// async function createInvite() {
//   saving.value = true
//   error.value = ''
//   try {
//     const inviteInput = {
//       instanceId: instanceStore.instance.id,
//       expiresAt:
//         expiresAfter.value === NEVER_KEY
//           ? null
//           : new Date(Date.now() + parseInt(expiresAfter.value) * 60000).toISOString(),
//       redemptions: redemptions.value === NO_LIMIT_KEY ? null : parseInt(redemptions.value),
//     }

//     await inviteStore.addInvite(inviteInput)
//     // emit('close')
//   } catch (e) {
//     error.value = String(e)
//   }
//   saving.value = false
// }

// import { computed, onMounted, ref } from 'vue'
// import { useRouter } from 'vue-router'

// import ElementHeader from '@/components/ElementHeader.vue'
// import ElementInput from '@/components/ElementInput.vue'
// import { useAppStore } from '@/store/app'
// import { useInstanceStore } from '@/store/instance'
// import { useInviteStore } from '@/store/invite'
// import ElementSelection from '@/components/ElementSelection.vue'

// defineEmits(['close'])

// const router = useRouter()

// const appStore = useAppStore()
// const instanceStore = useInstanceStore()
// const inviteStore = useInviteStore()

// const loading = ref(true)
// const error = ref('')
// onMounted(async () => {
//   if (!inviteStore.invite) {
//     try {
//       await inviteStore.fetchInvite(instanceStore.instance.id)
//     } catch (err) {
//       error.value = err as string
//     }
//   }
//   loading.value = false
// })

// const inviteLink = computed(() => {
//   return appStore.inviteBasePath + inviteStore.invite?.code
// })
</script>
