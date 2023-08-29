<template>
  <ElementDropdown
    :items="dropdownItems"
    :side="side"
    :anchor="anchor"
    @select="(item: DropdownItem) => (model = items.find(i => i.text === item.text)!.key)"
  >
    <div
      class="flex items-center justify-center w-40 text-center bg-gray-darkest cursor-pointer hover:brightness-110"
    >
      <div class="w-5/6">{{ selected.text }}</div>
      <div class="w-1/6">
        <img src="/img/down-caret.png" class="inline-block w-3 h-3 pixelated invert" />
      </div>
    </div>
  </ElementDropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import ElementDropdown from '@/components/ElementDropdown.vue'
import { DropdownItem } from '@/types/DropdownItem'
import { SelectionItem } from '@/types/SelectionItem'
import { SIDE } from '@/types/SideEnum'

const emit = defineEmits(['update:modelValue', 'update'])

interface Props {
  items: SelectionItem[]
  side?: SIDE
  anchor?: SIDE
  modelValue: string
}

const props = withDefaults(defineProps<Props>(), {
  side: SIDE.BOTTOM,
  anchor: SIDE.LEFT,
})

const dropdownItems = computed(() => {
  return props.items.map(item => {
    return {
      text: item.text,
      active: item.active,
      selected: item.text === selected.value.text,
    } as DropdownItem
  })
})

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const selected = computed(() => {
  return props.items.find(item => item.key === model.value)!
})
</script>
