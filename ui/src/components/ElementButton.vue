<template>
  <div
    :id="id"
    class="relative bg-white text-black px-4 pb-1 text-center hover:cursor-pointer transition"
    :class="[
      {
        'hover:bg-white hover:cursor-default': loading,
      },
      `hover:bg-${hoverColor}`,
    ]"
    @click.stop
    @click="handleClick"
  >
    <div
      :class="{
        'opacity-30': loading,
      }"
    >
      <slot></slot>
    </div>
    <ElementLoadingIcon v-if="loading" class="absolute inset-1/2 scale-[40%]" />
  </div>
</template>

<script setup lang="ts">
import ElementLoadingIcon from '@/components/ElementLoadingIcon.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  id: {
    type: String,
    required: false,
    default: '',
  },
  hoverColor: {
    type: String,
    required: false,
    default: 'accent',
  },
})

const emit = defineEmits(['click'])

function handleClick(e: MouseEvent) {
  if (!props.loading) {
    emit('click', e)
  }
}
</script>
