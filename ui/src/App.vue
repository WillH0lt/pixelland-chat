<template>
  <div class="absolute inset-0 bg-gray-dark" v-if="error">Error: {{ error }}</div>
  <div class="absolute inset-0 bg-gray-dark" v-else-if="loading">Loading</div>
  <div class="absolute inset-0 bg-gray-dark" v-else>
    <InstanceView class="h-full" @close="emitter.emit('chat:close')" />
    <router-view @close="router.back()" v-slot="{ Component, route }" @keydown.stop>
      <transition name="slide">
        <component
          v-if="route.name !== 'home'"
          :is="Component"
          class="absolute inset-0 bg-gray-dark"
        />
      </transition>
    </router-view>
  </div>
  <transition name="appear">
    <ElementDialog
      v-if="dialogStore.visible"
      @close="dialogStore.visible = false"
      :options="dialogStore.options"
    />
  </transition>
</template>

<script setup lang="ts">
import { Chatty } from '@looker/chatty'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { emitter } from '@/Emitter'
import ElementDialog from '@/components/ElementDialog.vue'
import InstanceView from '@/components/InstanceView.vue'
import { useAppStore } from '@/store/app'
import { useChannelStore } from '@/store/channel'
import { useDialogStore } from '@/store/dialog'
import { useInstanceStore } from '@/store/instance'
import { useMessageStore } from '@/store/message'
import { useNotificationStore } from '@/store/notification'
import { useUnreadStore } from '@/store/unread'
import { useUserStore } from '@/store/user'
import {
  ConnectUserRequest,
  SetInstanceReqeuest,
  SetTokenRequest,
  SetVisibilityRequest,
  ViewInviteRequest,
} from '@/types/HostRequestTypes'
import { MODE } from '@/types/ModeEnum'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const channelStore = useChannelStore()
const dialogStore = useDialogStore()
const instanceStore = useInstanceStore()
const messageStore = useMessageStore()
const notificationStore = useNotificationStore()
const unreadStore = useUnreadStore()
const userStore = useUserStore()

const loading = ref(true)
const error = ref('')

// // update css --chat-app-height
// // used to set body height taking into account mobile device UI
// const updateAppHeight = () => {
//   const doc = document.documentElement
//   doc.style.setProperty('--chat-app-height', `${window.innerHeight}px`)
// }
// window.addEventListener('resize', updateAppHeight)
// updateAppHeight()

// update css --app-height
// used to set body height taking into account mobile device UI
const updateAppHeight = () => {
  const doc = document.documentElement
  doc.style.setProperty('--app-height', `${window.innerHeight}px`)
}
window.addEventListener('resize', updateAppHeight)
updateAppHeight()

const hasUnreadMessages = computed(() => unreadStore.instanceHasUnread(instanceStore.instance.id))
const hasUnreadNotifications = computed(() => notificationStore.hasUnread)

onMounted(async () => {
  const params = extractUrlParams()
  if (params.api_host) {
    appStore.apiHost = params.api_host
  }
  if (params.noun) {
    appStore.noun = params.noun
  }
  if (params.externalizeSettings) {
    appStore.externalizeSettings = params.externalizeSettings === 'true'
  }
  if (params.allowAddInstance) {
    appStore.allowAddInstance = params.allowAddInstance === 'true'
  }
  if (params.externalizeInvites) {
    appStore.externalizeInvites = params.externalizeInvites === 'true'
  }
  if (params.inviteBasePath) {
    appStore.inviteBasePath = params.inviteBasePath
  }
  if (params.isSuperAdmin) {
    appStore.isSuperAdmin = params.isSuperAdmin === 'true'
  }

  if (
    import.meta.env.MODE === MODE.PROD ||
    import.meta.env.MODE === MODE.STAGING ||
    window !== window.parent // in iframe
  ) {
    const host = await Chatty.createClient()
      .on('chat:user:connect', connectUser)
      .on('chat:instance:set', setInstance)
      .on('chat:invite:view', viewInvite)
      .on('chat:visibility:set', (setVisibilityRequest: SetVisibilityRequest) => {
        appStore.visible = setVisibilityRequest.visible
      })
      .on('chat:token:set', (setTokenRequest: SetTokenRequest) => {
        appStore.token = setTokenRequest.token
        if (setTokenRequest.verified !== undefined) {
          appStore.verified = setTokenRequest.verified
        }
      })
      .on('chat:image:add', (payload: { url: string }) => {
        let activeChannelId: string | undefined
        if (route.params.channelId) {
          activeChannelId = route.params.channelId as string
        } else {
          const instanceId = instanceStore.instance.id
          const commentsChannel = channelStore.getCommentsChannel(instanceId)
          activeChannelId = commentsChannel?.id
        }
        if (activeChannelId) {
          messageStore.setComposeImage(activeChannelId, payload.url)
        }
      })
      .build()
      .connect()
      .catch(console.error)

    emitter.on('chat:close', () => host?.send('chat:close'))
    emitter.on('chat:instance:edit', instanceId => host?.send('chat:instance:edit', { instanceId }))
    emitter.on('chat:instance:click', instanceId =>
      host?.send('chat:instance:click', { instanceId })
    )
    emitter.on('chat:login:request', () => host?.send('chat:login:request'))
    emitter.on('chat:verify:request', () => host?.send('chat:verify:request'))
    emitter.on('chat:user:edit', () => host?.send('chat:user:edit'))
    emitter.on('chat:image:request', () => host?.send('chat:image:request'))

    watch(hasUnreadMessages, () => {
      host?.send('chat:messages:unread', { hasUnread: hasUnreadMessages.value })
    })
    watch(hasUnreadNotifications, () => {
      host?.send('chat:notifications:unread', { hasUnread: hasUnreadNotifications.value })
    })
  } else {
    const token = 'JenRxFv73kScEjTx4t0iH6l0ZdB3'
    await connectUser({
      name: 'SJDKLFJSDF*J lksdj',
      bio: `just a person`,
      avatar: 'https://avatars.dicebear.com/api/human/123.svg',
      token: token,
      verified: true,
    })

    // const token = ''
    await setInstance({
      instanceId: 'db9238ed-8377-4600-9b17-c0ecd06c3f23',
      token: token,
      verified: true,
    })

    appStore.isSuperAdmin = true

    // setTimeout(() => {
    //   router.push({ name: 'viewInvite', params: { code: 'rQMyXZEX' } })
    // }, 0)
  }
})

async function setInstance({ instanceId, token, verified }: SetInstanceReqeuest) {
  appStore.token = token
  if (verified !== undefined) {
    appStore.verified = verified
  }
  try {
    await instanceStore.setActiveInstance(instanceId)
    instanceStore.primaryInstanceId = instanceId
  } catch (err) {
    console.log(err)
    error.value = err as string
  }

  loading.value = false
}

async function connectUser(connectUserRequest: ConnectUserRequest) {
  appStore.token = connectUserRequest.token
  if (connectUserRequest.verified !== undefined) {
    appStore.verified = connectUserRequest.verified
  }
  try {
    await userStore.updateUser({
      name: connectUserRequest.name,
      bio: connectUserRequest.bio,
      avatar: connectUserRequest.avatar,
    })
  } catch (err) {
    error.value = err as string
  }
}

async function viewInvite(viewInviteRequest: ViewInviteRequest) {
  router.push({ name: 'viewInvite', params: { code: viewInviteRequest.code } })
}

function extractUrlParams() {
  const params: { [key: string]: string } = {}
  const fullQuery = window.location.search.substring(1)
  const paramStrings = fullQuery.split('&')
  for (let i = 0; i < paramStrings.length; i++) {
    const [key, val] = paramStrings[i].split('=').map(decodeURIComponent)
    params[key] = val
  }
  return params
}
</script>
<style>
.appear-enter-active,
.appear-leave-active {
  transition: opacity 0.15s ease;
}

.appear-enter-from,
.appear-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
