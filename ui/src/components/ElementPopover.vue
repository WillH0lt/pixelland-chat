<template>
  <div class="fixed inset-0 z-50" ref="popoverRef" @mouseleave="emit('close')" @click.stop>
    <div class="absolute" ref="slotRef" :style="{ ...position }">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { PopoverOptions } from '@/types/PopoverOptions'
import { SIDE } from '@/types/SideEnum'

const emit = defineEmits(['close'])

const props = defineProps<{
  options: PopoverOptions
}>()

const popoverRef = ref()
const slotRef = ref()

const position = computed(() => {
  if (!slotRef.value)
    return {
      top: `0px`,
      left: `0px`,
    }

  let top = 0
  let left = 0

  const height = slotRef.value.clientHeight
  const width = slotRef.value.clientWidth

  const elRect = props.options.element.getBoundingClientRect()
  const outsideRect = popoverRef.value.getBoundingClientRect()

  const rect = {
    top: elRect.top - outsideRect.top,
    left: elRect.left - outsideRect.left,
    height: elRect.height,
    width: elRect.width,
  }

  if (props.options.anchor === SIDE.LEFT) {
    left = rect.left
  } else if (props.options.anchor === SIDE.RIGHT) {
    left = rect.left - width + rect.width
  } else if (props.options.anchor === SIDE.TOP) {
    top = rect.top
  } else if (props.options.anchor === SIDE.BOTTOM) {
    top = rect.top - height + rect.height
  }

  if (props.options.side === SIDE.LEFT) {
    left = rect.left - width
  } else if (props.options.side === SIDE.RIGHT) {
    left = rect.left + rect.width
  } else if (props.options.side === SIDE.TOP) {
    top = rect.top - height
  } else if (props.options.side === SIDE.BOTTOM) {
    top = rect.top + rect.height
  }

  // shift over if it's going off the screen
  if ([SIDE.TOP, SIDE.BOTTOM].includes(props.options.side)) {
    if (left < 0) {
      left = 4
    } else if (left + width > window.innerWidth) {
      left = window.innerWidth - width - 4
    }
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
  }
})

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
  popoverRef.value.addEventListener('click', handleOutsideClick)
  popoverRef.value.addEventListener('keydown', handleEscape)
})
onBeforeUnmount(() => {
  popoverRef.value.removeEventListener('click', handleOutsideClick)
  popoverRef.value.removeEventListener('keydown', handleEscape)
})
function handleOutsideClick(event: MouseEvent) {
  const withinBoundaries = event.composedPath().includes(slotRef.value)

  if (!withinBoundaries) {
    emit('close')
  }
}
function handleEscape(ev: KeyboardEvent) {
  if (ev.key === 'Escape') {
    emit('close')
  }
}
</script>
