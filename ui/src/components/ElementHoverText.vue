<template>
  <div>
    <div @mouseenter="show" @mouseleave="hide" @mousedown="hide" ref="elementRef">
      <slot></slot>
    </div>

    <transition name="appear">
      <div
        v-if="visible"
        class="fixed z-50 px-2 py-3 -translate-x-1/2"
        :style="{ ...position }"
        ref="hoverTextRef"
      >
        <div class="bg-accent text-black shadow-md text-lg px-2">
          {{ text }}
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, triggerRef } from 'vue'

import { SIDE } from '@/types/SideEnum'

interface Props {
  text: string
  side?: SIDE
  delayMillis?: number
}

const props = withDefaults(defineProps<Props>(), {
  side: SIDE.BOTTOM,
  delayMillis: 500,
})

const elementRef = ref()
const hoverTextRef = ref()
const visible = ref(false)

const position = computed(() => {
  if (!elementRef.value || !hoverTextRef.value)
    return {
      top: '0px',
      left: '0px',
    }

  const rect = elementRef.value.getBoundingClientRect()
  const hoverTextRect = hoverTextRef.value.getBoundingClientRect()
  let top = 0
  let left = 0
  if (props.side === SIDE.BOTTOM) {
    top = rect.top + rect.height
    left = rect.left + rect.width / 2
  } else if (props.side === SIDE.TOP) {
    top = rect.top - rect.height
    left = rect.left + rect.width / 2
  } else if (props.side === SIDE.LEFT) {
    top = rect.top + rect.height / 2
    left = rect.left - rect.width
  } else if (props.side === SIDE.RIGHT) {
    top = rect.top + rect.height / 2 - hoverTextRect.height / 2
    left = rect.left + rect.width + hoverTextRect.width / 2
  }
  // shift over if it's going off the screen
  if ([SIDE.TOP, SIDE.BOTTOM].includes(props.side)) {
    if (left < 0) {
      left = 0
    } else if (left + rect.width > window.innerWidth) {
      left = window.innerWidth - rect.width
    }
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
  }
})

function handleResize() {
  triggerRef(elementRef)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

let pendingTimeout: NodeJS.Timeout
function show() {
  pendingTimeout = setTimeout(() => {
    visible.value = true
  }, props.delayMillis)
}

function hide() {
  if (pendingTimeout) clearTimeout(pendingTimeout)
  visible.value = false
}

// function getClientOffset (el, stopEl) {
//   /// tail-called optimize
//   function getOffset(el, stopEl, left = 0, top = 0) {
//     if (el === stopEl) {
//       return { left, top }
//     }
//     return getOffset(
//       el.offsetParent,
//       stopEl,
//       left + el.offsetLeft,
//       top + el.offsetTop
//     )
//   }
//   return getOffset(el, stopEl)
// }
</script>
