<template>
  <textarea
    :contenteditable="editable"
    ref="textareaRef"
    :type="type"
    :placeholder="placeholder"
    class="form-control w-full px-2 py-[8px] resize-none max-h-full overflow-hidden break-words bg-clip-padding transition focus:outline-none focus:shadow-none"
    :class="classes"
    rows="1"
    :readonly="!editable"
    :value="text"
    @input="onInput"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    required: false,
    default: '',
  },
  text: {
    type: String,
    required: false,
    default: '',
  },
  editable: {
    type: Boolean,
    required: false,
    default: true,
  },
  type: {
    type: String,
    required: false,
    default: 'text',
  },
  focusColor: {
    type: String,
    required: false,
    default: 'white',
  },
})

const classes = computed(() => {
  const classes = [`hover:bg-${props.focusColor}`, `focus:bg-${props.focusColor}`]
  if (!props.editable) {
    classes.push(`hover:bg-${props.focusColor}`)
    classes.push(`focus:bg-${props.focusColor}`)
  }
  return classes
})

const emit = defineEmits(['update:text'])
const textareaRef = ref()

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  const text = target.value
  emit('update:text', text)
}

async function updateTextareaHeight() {
  await nextTick()
  const contentHeight = calculateContentHeight(textareaRef.value, 28)
  textareaRef.value.style.height = contentHeight + 'px'
}

watch(() => props.text, updateTextareaHeight)

updateTextareaHeight()

function calculateContentHeight(ta: HTMLTextAreaElement, scanAmount: number) {
  // via https://stackoverflow.com/a/1761203
  var origHeight = ta.style.height,
    height = ta.offsetHeight,
    scrollHeight = ta.scrollHeight,
    overflow = ta.style.overflow
  /// only bother if the ta is bigger than content
  if (height >= scrollHeight) {
    /// check that our browser supports changing dimension
    /// calculations mid-way through a function call...
    ta.style.height = height + scanAmount + 'px'
    /// because the scrollbar can cause calculation problems
    ta.style.overflow = 'hidden'
    /// by checking that scrollHeight has updated
    if (scrollHeight < ta.scrollHeight) {
      /// now try and scan the ta's height downwards
      /// until scrollHeight becomes larger than height
      while (ta.offsetHeight >= ta.scrollHeight) {
        ta.style.height = (height -= scanAmount) + 'px'
      }
      /// be more specific to get the exact height
      while (ta.offsetHeight < ta.scrollHeight) {
        ta.style.height = height++ + 'px'
      }
      /// reset the ta back to it's original height
      ta.style.height = origHeight
      /// put the overflow back
      ta.style.overflow = overflow
      return height
    }
  } else {
    return scrollHeight
  }
}
</script>
