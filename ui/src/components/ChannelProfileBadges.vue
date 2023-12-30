<template>
  <div class="text-error" v-if="error">{{ error }}</div>
  <div class="flex flex-wrap w-full justify-between" v-if="!loading">
    <div v-for="badge in badges">
      <ElementHoverText :text="badge.name">
        <div class="relative w-16 h-16">
          <img class="absolute inset-0 w-full h-full pixelated" :src="badge.icon" />
          <div
            class="absolute top-0 right-0 bg-black text-accent px-2 text-sm translate-x-1 -translate-y-0.5"
            v-if="badge.count > 1"
          >
            x{{ badge.count }}
          </div>
        </div>
      </ElementHoverText>
    </div>
    <div class="w-full text-center" v-if="badges.length === 0">No badges yet!</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import ElementHoverText from '@/components/ElementHoverText.vue'
import { useUserBadgesQuery } from '@/graphql/queries/user.gen'
import { Badge } from '@/graphql/types.gen'
import { ExtendedBadge, extendBadge } from '@/types/ExtendedBadge'

const props = defineProps<{
  userId: string
}>()

const loading = ref(false)
const error = ref('')
const badges = ref<ExtendedBadge[]>([])

onMounted(async () => {
  loading.value = true
  const { onResult, onError } = await useUserBadgesQuery({
    userId: props.userId,
    badgesFirst: 5,
    badgesAfter: '',
  })

  onResult(result => {
    loading.value = false
    if (result.data?.userBadges.edges) {
      badges.value = result.data.userBadges.edges.map(edge => extendBadge(edge))
    }
  })

  onError(err => {
    loading.value = false
    error.value = err.message
  })
})
</script>
