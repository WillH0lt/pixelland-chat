<template>
  <div class="flex flex-col">
    <ElementHeader
      class="border-b-black border-b-4 border-solid bg-gray-darkest"
      @close="$emit('close')"
    >
      <div class="text-center text-2xl mb-1">{{ title }}</div>
    </ElementHeader>
    <div ref="scrollerRef" class="overflow-auto flex-1" @scroll="handleScroll">
      <AuthorsRow
        v-for="author in authors"
        :key="author.id"
        :id="author.id"
        :author="author"
        @show-profile="showProfile"
      />
      <div v-if="hasNextPage" class="flex justify-center items-center w-full h-14">
        <ElementLoadingIcon class="scale-50 invert" />
      </div>
      <ChannelProfile
        v-if="profileAnchor && profileAuthor"
        :author="profileAuthor"
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
import { useInstanceQuery } from '@/graphql/queries/instance.gen'
import { InstanceAuthorsConnection, Role } from '@/graphql/types.gen'
import { ExtendedAuthor } from '@/types/ExtendedAuthor'
import { extendAuthor } from '@/utils'

const router = useRouter()

const roles = router.currentRoute.value.query.roles as Role[]
const authors = ref<ExtendedAuthor[]>([])
const hasNextPage = ref(false)
const cursor = ref('')
const loading = ref(false)

const title = computed(() => {
  if (roles.length === 1) {
    if (roles[0] === Role.Member) {
      return 'Editors'
    } else if (roles[0] === Role.Banned) {
      return 'Banned'
    }
  }

  return ''
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

  fetchAuthors()
})

onUnmounted(() => {
  observer.disconnect()
})

// if initial load doesn't fill the screen, load more messages
watch(loading, async loading => {
  if (!loading && hasNextPage.value) {
    if (isScrolledToBottom()) {
      fetchAuthors()
    }
  }
})

function isScrolledToBottom() {
  const { clientHeight, scrollHeight, scrollTop } = scrollerRef.value
  return scrollHeight - scrollTop - clientHeight < 20
}

function handleScroll() {
  if (isScrolledToBottom() && hasNextPage.value && !loading.value) {
    fetchAuthors()
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
const profileAuthor = computed(() => {
  if (!profileAnchor.value) return null
  for (const author of authors.value) {
    if (author.id === profileAnchor.value.id) {
      return author
    }
  }
  return null
})

async function fetchAuthors() {
  loading.value = true
  const { onResult, onError } = useInstanceQuery({
    id: instanceId.value,
    authorsRoles: roles,
    authorsFirst: 50,
    authorsAfter: cursor.value,
    channelsFirst: 0,
    channelsAfter: '',
    likesFirst: 0,
    likesAfter: '',
    messagesLast: 0,
    messagesBefore: '',
  })

  const authorsConnection = await new Promise<InstanceAuthorsConnection>((resolve, reject) => {
    onError(error => {
      reject(error.message)
    })
    onResult(result => {
      if (result.error) {
        reject(result.error.message)
      }
      resolve(result.data.instance.node.authorsConnection)
    })
  })

  hasNextPage.value = authorsConnection.pageInfo.hasNextPage
  if (authorsConnection.edges.length > 0) {
    cursor.value = authorsConnection.edges[authorsConnection.edges.length - 1].cursor
  }

  authors.value = authors.value.concat(authorsConnection.edges.map(edge => extendAuthor(edge.node)))
  loading.value = false
}
</script>
