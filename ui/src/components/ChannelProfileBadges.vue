<template>
  <div class="text-error" v-if="error">{{ error }}</div>
  <div class="flex" v-if="!loading">
    <div v-for="badge in badges">
      <ElementHoverText :text="badge.name">
        <img class="w-16 h-16 m-2 pixelated" :src="badge.icon" />
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

const props = defineProps<{
  userId: string
}>()

const loading = ref(false)
const error = ref('')
const badges = ref<Badge[]>([])

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
      badges.value = result.data.userBadges.edges.map(edge => edge.node)
    }
  })

  onError(err => {
    loading.value = false
    error.value = err.message
  })
})
</script>
