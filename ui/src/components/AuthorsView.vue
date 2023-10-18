<template>
  <div class="flex flex-col">
    <ElementHeader
      class="border-b-black border-b-4 border-solid bg-gray-darkest"
      @close="$emit('close')"
    >
    </ElementHeader>
    <div ref="scrollerRef" class="overflow-auto flex-1" @scroll="handleScroll">
      <AuthorsRow
        v-for="author in authors"
        :key="author.id"
        :id="author.id"
        :author="author"
        @show-profile="showProfile"
      />
      <div v-if="authorStore.hasNextPage" class="flex justify-center items-center w-full h-14">
        <ElementLoadingIcon class="scale-50 invert" />
      </div>
      <ChannelProfile
        v-if="profileAnchor"
        :user="authorStore.getUser(profileAnchor.id)"
        @close="profileAnchor = null"
        class="absolute left-16 w-72 bg-gray-darkest"
        :style="{
          top: profileTop + 'px',
          height: profileHeight + 'px',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import AuthorsRow from '@/components/AuthorsRow.vue'
import ChannelProfile from '@/components/ChannelProfile.vue'
import ElementHeader from '@/components/ElementHeader.vue'
import ElementLoadingIcon from '@/components/ElementLoadingIcon.vue'
import { useAuthorStore } from '@/store/author'
import { ExtendedAuthor } from '@/types/ExtendedAuthor'

const router = useRouter()
const authorStore = useAuthorStore()

const authors = computed(() => {
  return authorStore.getAuthors()
})

const loading = computed(() => {
  return authorStore.loading
})

const instanceId = computed(() => {
  return router.currentRoute.value.params.instanceId as string
})

const scrollerRef = ref()
let observer: ResizeObserver
onMounted(() => {
  // Handles when onscreen keyboard is opened/closed
  observer = new ResizeObserver(async () => {
    await nextTick()
    if (!scrollerRef.value) return
    scrollerRef.value.scrollTop = scrollerRef.value.scrollHeight
  })

  observer.observe(scrollerRef.value)

  authorStore.fetchAuthors(instanceId.value)
})

onUnmounted(() => {
  observer.disconnect()
})

// if initial load doesn't fill the screen, load more messages
watch(loading, async loading => {
  if (!loading && authorStore.hasNextPage) {
    if (isScrolledToBottom()) {
      authorStore.fetchAuthors(instanceId.value)
    }
  }
})

function isScrolledToBottom() {
  const { clientHeight, scrollHeight, scrollTop } = scrollerRef.value
  return scrollHeight - scrollTop - clientHeight < 20
}

function handleScroll() {
  if (isScrolledToBottom() && authorStore.hasNextPage && !authorStore.loading) {
    authorStore.fetchAuthors(instanceId.value)
  }
}

// show profile
const profileAnchor = ref<ExtendedAuthor | null>(null)
const profileTop = ref(0)
const profileHeight = ref(384)
function showProfile(author: ExtendedAuthor) {
  const authorElement = document.getElementById(author.id)
  if (!authorElement) return
  const rect = authorElement.getBoundingClientRect()
  const scrollerRect = scrollerRef.value.getBoundingClientRect()
  profileTop.value = Math.min(
    rect.top,
    scrollerRect.top + scrollerRef.value.clientHeight - profileHeight.value
  )
  profileAnchor.value = author
}
</script>
