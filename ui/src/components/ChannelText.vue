<template>
  <span
    class="break-words whitespace-pre-wrap"
    v-html="formattedText"
    @click="handleLinkClicks($event, dialogStore)"
  />
</template>

<script setup lang="ts">
import linkifyStr from 'linkify-string'
import { computed } from 'vue'

import { useDialogStore } from '@/store/dialog'
import { handleLinkClicks } from '@/utils'
import { spookifyString } from '@/utils'

const dialogStore = useDialogStore()

const props = defineProps<{
  text: string
}>()

const formattedText = computed(() => {
  let t = props.text
  t = t.trim()
  t = linkifyStr(t, { defaultProtocol: 'https' })
  t = spookifyString(t)
  return t
})
</script>
