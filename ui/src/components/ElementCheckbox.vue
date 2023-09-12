<template>
  <label class="checkbox-outer">
    <input type="checkbox" v-model="model" />
    <span class="checkmark"></span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<style scoped>
.checkbox-outer {
  width: 25px;
  height: 25px;
  position: relative;
  display: block;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.checkbox-outer input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.checkbox-outer:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a orange background */
.checkbox-outer input:checked ~ .checkmark {
  background-color: #f29f52;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.checkbox-outer input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.checkbox-outer .checkmark:after {
  left: 10px;
  top: 6px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
