<template>
  <div>
    <div @click="showPopover()" ref="elementRef">
      <slot></slot>
    </div>
    <transition name="appear">
      <ElementPopover v-if="popoverVisible" @close="hidePopover()" :options="popoverOptions">
        <div
          ref="dropdownMenuRef"
          class="p-2 text-xl cursor-pointer bg-black transition text-center whitespace-nowrap"
          :class="{
            'bg-gray-dark hover:bg-gray-dark': item.loading,
            'hover:bg-accent hover:text-black': item.active,
            'text-gray-medium': !item.active,
            'text-accent': item.selected,
          }"
          :style="{
            'min-width': `${elementRef.getBoundingClientRect().width}px`,
          }"
          v-for="item of itemsWithDefaults"
          @click="handleItemClick(item)"
        >
          <div class="relative">
            <div
              :class="{
                'opacity-70': item.loading,
              }"
            >
              {{ item.text }}
            </div>
            <ElementLoadingIcon v-if="item.loading" class="absolute inset-1/2 scale-[40%] invert" />
          </div>
        </div>
      </ElementPopover>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import ElementLoadingIcon from '@/components/ElementLoadingIcon.vue'
import ElementPopover from '@/components/ElementPopover.vue'
import { DropdownItem } from '@/types/DropdownItem'
import { initPopoverOptions } from '@/types/PopoverOptions'
import { SIDE } from '@/types/SideEnum'

interface Props {
  items: DropdownItem[]
  args?: any
  side?: SIDE
  anchor?: SIDE
}

const props = withDefaults(defineProps<Props>(), {
  side: SIDE.LEFT,
  anchor: SIDE.TOP,
})

const emit = defineEmits<{
  (event: 'open'): void
  (event: 'close'): void
  (event: 'select', item: DropdownItem): void
}>()

const elementRef = ref()
const dropdownMenuRef = ref()
const popoverVisible = ref(false)

const popoverOptions = ref(
  initPopoverOptions({
    side: props.side,
    anchor: props.anchor,
  })
)

const itemsWithDefaults = computed(() => {
  return props.items.map(item => {
    return {
      ...item,
      loading: item.loading ?? false,
      active: item.active ?? true,
      selected: item.selected ?? false,
    }
  })
})

async function showPopover() {
  popoverVisible.value = true
  emit('open')
}

function hidePopover() {
  popoverVisible.value = false
  emit('close')
}

onMounted(async () => {
  popoverOptions.value.element = elementRef.value
})

async function handleItemClick(item: DropdownItem) {
  if (!item.active) return

  emit('select', item)
  item.loading = true
  if (item.onClicked) await item.onClicked(props.args)
  hidePopover()
  item.loading = false
}
</script>
