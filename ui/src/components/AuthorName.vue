<template>
  <div class="flex items-center">
    <a
      class="overflow-x-hidden whitespace-nowrap"
      :class="{
        '!text-accent': roles.includes(Role.Moderator),
        '!text-error': roles.includes(Role.Banned),
        'cursor-pointer text-xl hover:underline text-ellipsis break-words': !inReply,
        'text-lg text-white hover:text-white': inReply,
      }"
    >
      {{ name + (roles.includes(Role.Banned) ? ' (banned)' : '') }}
    </a>
    <ElementHoverText v-if="roles.includes(Role.Member) && !inReply" text="Editor" :side="SIDE.RIGHT">
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
