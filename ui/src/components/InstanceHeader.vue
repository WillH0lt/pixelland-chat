<template>
  <div class="flex items-center justify-center h-full content-center bg-gray-darkest">
    <ElementHoverText text="close" :side="SIDE.BOTTOM">
      <img
        class="pixelated cursor-pointer h-7 m-2 hover:scale-105"
        @click="$emit('close')"
        src="/img/x.png"
      />
    </ElementHoverText>
    <div
      class="flex-1 text-2xl text-center hover:underline hover:cursor-pointer"
      @click="emitter.emit('chat:instance:click', instanceStore.instance.id)"
    >
      {{ instanceStore.instance.name }}
    </div>
    <ElementHoverText v-if="instanceDropdownItems.length" text="settings" :side="SIDE.BOTTOM">
      <ElementDropdown :items="instanceDropdownItems" :side="SIDE.BOTTOM" :anchor="SIDE.LEFT">
        <img class="pixelated cursor-pointer invert h-7 m-2 hover:scale-105" src="/img/dots.png" />
      </ElementDropdown>
    </ElementHoverText>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import { emitter } from '@/Emitter'
import ElementDropdown from '@/components/ElementDropdown.vue'
import ElementHoverText from '@/components/ElementHoverText.vue'
import { useAppStore } from '@/store/app'
import { useAuthorStore } from '@/store/author'
import { useInstanceStore } from '@/store/instance'
import { DropdownItem } from '@/types/DropdownItem'
import { SIDE } from '@/types/SideEnum'

const router = useRouter()
const appStore = useAppStore()
const authorStore = useAuthorStore()
const instanceStore = useInstanceStore()

const instanceDropdownItems = ref<DropdownItem[]>([])
watchEffect(() => {
  instanceDropdownItems.value = []
  if (appStore.isLoggedIn) {
    instanceDropdownItems.value.push({
      text: `${instanceStore.instance.mutablePinned ? 'Unp' : 'P'}in ${appStore.nounCapitalized}`,
      onClicked: () => {
        instanceStore.pinInstance(
          { pinned: !instanceStore.instance.mutablePinned },
          instanceStore.instance.id
        )
      },
    })
  }
  if (authorStore.isModerator) {
    instanceDropdownItems.value.push({
      text: 'Add Channel',
      onClicked: () => {
        router.push({ name: 'createChannel' })
      },
    })
    instanceDropdownItems.value.push({
      text: 'Add Category',
      onClicked: () => {
        router.push({ name: 'createCategory' })
      },
    })
    if (!appStore.externalizeInvites) {
      instanceDropdownItems.value.push({
        text: 'Invite',
        onClicked: () => {
          router.push({ name: 'invite' })
        },
      })
    }
  }
  if (authorStore.isAdmin) {
    instanceDropdownItems.value.push({
      text: `${appStore.nounCapitalized} Settings`,
      onClicked: () => {
        if (appStore.externalizeSettings) {
          emitter.emit('chat:instance:edit', instanceStore.instance.id)
        } else {
          router.push({ name: 'editInstance' })
        }
      },
    })
  }
})
</script>
