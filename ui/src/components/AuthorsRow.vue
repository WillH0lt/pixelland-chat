<template>
  <div class="flex group hover:bg-gray-darker">
    <div class="flex-shrink-0 w-16">
      <img
        class="h-12 mx-2 my-1 bg-accent cursor-pointer"
        @click="$emit('showProfile', author)"
        :src="author.avatar"
      />
    </div>
    <div class="ml-2 flex-1 w-0">
      <div class="flex flex-col">
        <AuthorName
          :name="author.name"
          :roles="author.roles"
          @click="$emit('showProfile', author)"
        />
        <div class="text-gray-light min-w-fit">
          {{ verb }} {{ timeSince ?? author.createdAtTimeSince }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthorName from '@/components/AuthorName.vue'
import { Role } from '@/graphql/types.gen'
import { ExtendedAuthor } from '@/types/ExtendedAuthor'

interface Props {
  author: ExtendedAuthor
  verb?: string
  timeSince?: string
}

withDefaults(defineProps<Props>(), {
  verb: 'Joined',
})

defineEmits<{
  showProfile: (author: ExtendedAuthor) => void
}>()
</script>
