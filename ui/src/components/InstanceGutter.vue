<!-- TODO abstract instance list into seperate component -->

<template>
  <div class="flex flex-col bg-gray-darkest">
    <draggable
      class="overflow-y-auto"
      v-model="instances"
      group="instances"
      item-key="id"
      :disabled="appStore.isMobile"
      :component-data="{
        tag: 'ul',
      }"
      animation="200"
      ghost-class=""
      :move="handleDragMove"
    >
      <template #item="{ element: instance }">
        <li class="list-none">
          <InstanceIcon :instance="instance" />
        </li>
      </template>
    </draggable>
    <div
      v-if="instanceStore.unpinnedInstance && instances.length"
      class="w-full h-4 bg-gray-dark"
    ></div>
    <!-- class="w-full border border-b border-black border-y-8" -->
    <draggable
      v-if="instanceStore.unpinnedInstance"
      class="overflow-y-auto"
      v-model="unpinnedInstances"
      :group="{ name: 'instances', pull: true, put: false }"
      item-key="id"
      :disabled="appStore.isMobile"
      :component-data="{
        tag: 'ul',
      }"
      animation="200"
      ghost-class=""
      :move="handleDragMove"
    >
      <template #item="{ element: instance }">
        <li class="list-none">
          <InstanceIcon :instance="instance" />
        </li>
      </template>
    </draggable>

    <img
      v-if="appStore.allowAddInstance && appStore.isLoggedIn"
      class="w-full p-6 pixelated cursor-pointer hover:bg-gray-dark"
      src="/img/plus.png"
      @click="$router.push({ name: 'createInstance' })"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Draggable from 'vuedraggable'

import InstanceIcon from '@/components/InstanceIcon.vue'
import { useAppStore } from '@/store/app'
import { useAuthorStore } from '@/store/author'
import { useInstanceStore } from '@/store/instance'
import { ExtendedInstance } from '@/types/ExtendedInstance'

const appStore = useAppStore()
const authorStore = useAuthorStore()
const instanceStore = useInstanceStore()

let lastMovedInstanceId = ''
function handleDragMove(evt: any) {
  lastMovedInstanceId = evt.draggedContext.element.id
}
const instances = computed({
  get: () => {
    return instanceStore.getInstances().filter(instance => instance.mutablePinned)
  },
  set: (instances: ExtendedInstance[]) => {
    if (instances.length <= 1) return

    let prevInstance: ExtendedInstance | null = null
    let movedInstance: ExtendedInstance | null = null

    const movedIndex = instances.findIndex(channel => channel.id === lastMovedInstanceId)
    if (movedIndex === -1) {
      return
    } else if (movedIndex === 0) {
      movedInstance = instances[movedIndex]
    } else {
      prevInstance = instances[movedIndex - 1]
      movedInstance = instances[movedIndex]
    }

    instanceStore.reorderInstance(
      {
        prevInstanceId: prevInstance?.id,
      },
      movedInstance.id
    )
  },
})

const unpinnedInstances = computed(() => {
  return [instanceStore.unpinnedInstance]
})
</script>
