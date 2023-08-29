<template>
  <Picker
    :data="emojiIndex"
    title="Pick your emoji…"
    emoji="point_up"
    style="width: 13.8em"
    :native="true"
    :showPreview="false"
    :showCategories="false"
    :showSkinTones="false"
    @select="handleEmojiSelect"
  />
</template>

<script setup lang="ts">
import emojiData from 'emoji-mart-vue-fast/data/all.json'
import { EmojiIndex, Picker } from 'emoji-mart-vue-fast/src'

const emit = defineEmits<{
  (event: 'select', emoji: string): void
}>()

const emojiIndex = new EmojiIndex(emojiData)

function handleEmojiSelect(emoji: { native: string }) {
  emit('select', emoji.native)
}
</script>
