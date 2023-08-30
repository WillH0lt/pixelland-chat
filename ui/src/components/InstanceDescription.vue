<template>
  <div
    v-if="instance.description !== ''"
    class="flex items-center group p-1 mx-2 hover:bg-gray-darker"
  >
    <Markdown
      class="w-5/6 text-xl text-white bg-gray-dark group-hover:bg-gray-darker markdown"
      @click="handleLinkClicks($event, dialogStore)"
      :linkify="true"
      :breaks="true"
      :source="instance.description"
      id="world-description"
    />
    <div class="flex-1" />
    <ElementDropdown
      v-if="items.length"
      :items="items"
      :side="SIDE.BOTTOM"
      :anchor="SIDE.LEFT"
      @click.stop
    >
      <img
        class="pixelated cursor-pointer invert h-5 m-2 opacity-0 group-hover:opacity-80 hover:opacity-100 hover:scale-110"
        src="/img/dots.png"
      />
    </ElementDropdown>
  </div>
  <div
    v-else-if="authorStore.isModerator"
    class="flex items-center text-xl text-gray-medium p-1 m-2 hover:underline hover:cursor-pointer"
    @click="router.push({ name: 'editInstance', params: { instanceId: instance.id } })"
  >
    add description
  </div>
  <hr v-if="instance.description !== ''" class="border-gray-medium mx-2" />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import Markdown from 'vue3-markdown-it'

import ElementDropdown from '@/components/ElementDropdown.vue'
import { router } from '@/router'
import { useAuthorStore } from '@/store/author'
import { useDialogStore } from '@/store/dialog'
import { DropdownItem } from '@/types/DropdownItem'
import { ExtendedInstance } from '@/types/ExtendedInstance'
import { SIDE } from '@/types/SideEnum'
import { handleLinkClicks } from '@/utils'

const props = defineProps<{
  instance: ExtendedInstance
}>()

const authorStore = useAuthorStore()
const dialogStore = useDialogStore()

const items = ref<DropdownItem[]>([])
watchEffect(() => {
  items.value = []
  if (authorStore.isModerator) {
    items.value.push({
      text: 'Edit',
      onClicked: () => {
        router.push({ name: 'editInstance', params: { instanceId: props.instance.id } })
      },
    })
  }
})
</script>
