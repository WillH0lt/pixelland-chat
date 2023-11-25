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

const dialogStore = useDialogStore()

const props = defineProps<{
  text: string
}>()

function rainbowNice(str: string) {
  const pattern = new RegExp(`\(nice)\(?![\w-])`, 'ig')
  const formatted = str.replace(pattern, v => `<span class="rainbow">${v}</span>`)

  return formatted
}

const formattedText = computed(() => {
  let t = props.text
  t = t.trim()
  t = linkifyStr(t, { defaultProtocol: 'https' })
  t = rainbowNice(t)
  return t
})
</script>

<style>
.rainbow {
  background: linear-gradient(to right, #6666ff, #0099ff, #00ff00, #ff3399, #6666ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: rainbow_animation 6s ease-in-out infinite;
  background-size: 400% 100%;
}

@keyframes rainbow_animation {
  0%,
  100% {
    background-position: 0 0;
  }

  50% {
    background-position: 100% 0;
  }
}
</style>
