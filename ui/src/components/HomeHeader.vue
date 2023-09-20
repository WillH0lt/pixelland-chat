<template>
  <div class="h-14 w-full flex items-center justify-center h-full content-center bg-[#191919]">
    <ElementHoverText text="close" :side="SIDE.BOTTOM">
      <img
        class="pixelated cursor-pointer h-7 m-2 hover:scale-105"
        @click="$emit('close')"
        src="/img/x.png"
      />
    </ElementHoverText>
    <div class="flex-1 text-2xl text-center">
      {{ title }}
    </div>
    <ElementHoverText v-if="items.length" text="settings" :side="SIDE.BOTTOM">
      <ElementDropdown :items="items" :side="SIDE.BOTTOM" :anchor="SIDE.LEFT">
        <img class="pixelated cursor-pointer invert h-7 m-2 hover:scale-105" src="/img/dots.png" />
      </ElementDropdown>
    </ElementHoverText>
  </div>
</template>

<script setup lang="ts">
import ElementDropdown from '@/components/ElementDropdown.vue'
import ElementHoverText from '@/components/ElementHoverText.vue'
import { DropdownItem } from '@/types/DropdownItem'
import { SIDE } from '@/types/SideEnum'

defineProps<{
  items: DropdownItem[]
  title: string
}>()
</script>
