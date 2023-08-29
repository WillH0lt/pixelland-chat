<template>
  <div
    class="w-full h-20 relative pixelated cursor-pointer hover:bg-gray-dark p-2"
    :class="{
      'bg-gray-dark border-l-4 border-accent pl-1': instance.id === instanceStore.instance.id,
    }"
    @click="instanceStore.setActiveInstance(instance.id)"
    @dblclick="emitter.emit('chat:instance:click', instance.id)"
  >
    <ElementHoverText :text="instance.name" :side="SIDE.RIGHT" :delayMillis="0">
      <img class="w-full h-16 object-cover hover:scale-110 transition" :src="instance.icon" />
    </ElementHoverText>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

import { emitter } from '@/Emitter'
import ElementHoverText from '@/components/ElementHoverText.vue'
import { Instance } from '@/graphql/types.gen'
import { useInstanceStore } from '@/store/instance'
import { SIDE } from '@/types/SideEnum'

defineProps({
  instance: {
    type: Object as PropType<Instance>,
    required: true,
  },
})

const instanceStore = useInstanceStore()
</script>
