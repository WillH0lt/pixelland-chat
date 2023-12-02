<template>
  <div
    class="absolute inset-0 min-h-screen max-w-full min-w-full flex flex-col justify-center items-center bg-opacity-80 bg-black z-20"
    @click="$emit('close')"
    @click.stop
  >
    <img
      class="absolute w-14 top-4 right-4 pixelated cursor-pointer hover:scale-105"
      @click="$emit('close')"
      src="/img/x.png"
    />
    <div class="max-w-sm flex flex-col items-center text-center px-4" @click.stop>
      <div class="text-5xl" v-html="props.options.title" />
      <div class="text-3xl mt-3" v-html="props.options.text" />
      <div class="text-xl mt-3" v-html="props.options.subtext" />
      <div v-if="props.options.showGiveReason">
        <textarea
          class="w-[50dvw] text-2xl resize-none mt-3 border border-gray-medium focus:border-white placeholder:text-gray-medium text-white outline-none bg-transparent transition-colors duration-300 px-2 p-1"
          v-model="props.options.givenReason"
          placeholder="Give a reason... (recommended)"
          rows="4"
        />
      </div>
      <div class="flex w-full justify-center mt-7">
        <ElementButton
          v-for="button in props.options.buttons"
          class="text-3xl mx-4"
          @click="handleClicked(button)"
          :loading="button.loading"
        >
          {{ button.text }}
        </ElementButton>
      </div>
      <div class="text-error text-xl mt-8">{{ errorMessage }}&#8203;</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

import ElementButton from '@/components/ElementButton.vue'
import { useDialogStore } from '@/store/dialog'
import { DialogButton, DialogOptions } from '@/types/DialogOptions'

defineEmits(['close'])

const props = defineProps<{
  options: DialogOptions
}>()
const errorMessage = ref('')

const dialogStore = useDialogStore()

async function handleClicked(button: DialogButton) {
  try {
    if (button.onClicked) {
      if (button.onClicked.constructor.name === 'AsyncFunction') {
        button.loading = true
      }
      await button.onClicked()
    }
    button.loading = false
    dialogStore.hideDialog()
  } catch (err) {
    errorMessage.value = err as string
    button.loading = false
  }
}

window.addEventListener('keydown', handleKeyDown)
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    dialogStore.hideDialog()
  } else if (e.key === 'Enter') {
    handleClicked(props.options.buttons[props.options.buttons.length - 1])
  }
}
</script>
