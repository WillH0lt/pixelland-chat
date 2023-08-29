<template>
  <div class="w-full flex flex-col justify-left items-start">
    <div v-if="label" class="ml-2 -mb-1">
      {{ label }}
    </div>
    <input
      v-bind="attr"
      ref="inputRef"
      class="px-2 py-[8px] w-full bg-gray-darkest transition hover:brightness-110 focus:brightness-110 focus:outline-none"
      :class="[
        {
          'hover:brightness-110 focus:brightness-110':
            attr.readonly !== undefined ? attr.readonly : true,
        },
        `placeholder:bg-${placeholderColor}`,
      ]"
      v-model="model"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
  attr: {
    type: Object,
    required: false,
    default: {},
  },
  label: {
    type: String,
    required: false,
    default: '',
  },
  placeholderColor: {
    type: String,
    required: false,
    default: 'gray-dark',
  },
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get() {
    return props.modelValue.toString()
  },
  set(value) {
    emit('update:modelValue', value.toString())
  },
})
</script>
