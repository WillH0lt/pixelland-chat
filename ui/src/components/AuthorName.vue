<template>
  <div class="flex items-center">
    <a
      class="break-words overflow-x-hidden whitespace-nowrap text-ellipsis"
      :class="{
        '!text-accent': roles.includes(Role.Moderator),
        '!text-error': roles.includes(Role.Banned),
        'text-white hover:text-white': inReply,
        'cursor-pointer text-xl hover:underline': !inReply,
        'text-lg': inReply,
      }"
    >
      {{ name + (roles.includes(Role.Banned) ? ' (banned)' : '') }}
    </a>
    <ElementHoverText v-if="roles.includes(Role.Member)" text="Editor" :side="SIDE.RIGHT">
      <img class="pixelated ml-1 h-4" src="/img/pencil.png" />
    </ElementHoverText>
  </div>
</template>

<script setup lang="ts">
import ElementHoverText from '@/components/ElementHoverText.vue'
import { Role } from '@/graphql/types.gen'
import { SIDE } from '@/types/SideEnum'

defineProps<{
  name: string
  roles: readonly Role[]
  inReply?: boolean
}>()
</script>
