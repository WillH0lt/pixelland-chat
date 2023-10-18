<template>
  <div class="flex flex-col">
    <HomeHeader
      @close="$emit('close')"
      :items="instanceDropdownItems"
      :title="instanceStore.instance.name"
    />
    <div class="flex flex-1 overflow-auto w-full">
      <InstanceGutter class="w-20 h-full" />
      <div class="flex-1 flex flex-col">
        <InstanceAuthor
          v-if="instance.showAuthor"
          :author="instanceAuthor"
          :time-since="instance.timeSince"
        />
        <InstanceDescription :instance="instance" />
        <InstanceLikes v-if="instance.showLikes" :instance-id="instance.id" />
        <InstanceBanned v-if="authorStore.isBanned" />
        <!-- <InstanceEmpty v-else-if="channels.length === 0" /> -->
        <InstanceChannels
          class="overflow-y-auto overflow-x-hidden flex-1"
          v-else-if="instance.showChat"
        />
        <InstanceComments
          class="overflow-y-auto overflow-x-hidden"
          v-if="instance.showComments && commentsChannel"
          :channel="commentsChannel"
          :class="instance.showChat ? 'max-h-[25vh]' : 'flex-1'"
          :key="commentsChannel.id"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import { emitter } from '@/Emitter'
import HomeHeader from '@/components/HomeHeader.vue'
import InstanceAuthor from '@/components/InstanceAuthor.vue'
import InstanceBanned from '@/components/InstanceBanned.vue'
import InstanceChannels from '@/components/InstanceChannels.vue'
import InstanceComments from '@/components/InstanceComments.vue'
import InstanceDescription from '@/components/InstanceDescription.vue'
import InstanceGutter from '@/components/InstanceGutter.vue'
import InstanceLikes from '@/components/InstanceLikes.vue'
import { Role, TagKind } from '@/graphql/types.gen'
import { useAppStore } from '@/store/app'
import { useAuthorStore } from '@/store/author'
import { useChannelStore } from '@/store/channel'
import { useInstanceStore } from '@/store/instance'
import { DropdownItem } from '@/types/DropdownItem'
import { extendAuthor } from '@/utils'

const router = useRouter()
const appStore = useAppStore()
const authorStore = useAuthorStore()
const channelStore = useChannelStore()
const instanceStore = useInstanceStore()

const commentsChannel = computed(() => channelStore.getCommentsChannel(instanceStore.instance.id))
const instance = computed(() => instanceStore.instance)
const instanceAuthor = computed(() => extendAuthor(instanceStore.instance.author))

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
  instanceDropdownItems.value.push({
    text: `View Editors`,
    onClicked: () => {
      router.push({
        name: 'authors',
        params: { instanceId: instanceStore.instance.id },
        query: { roles: [Role.Member] },
      })
    },
  })
  if (authorStore.isModerator) {
    instanceDropdownItems.value.push({
      text: `View Banned`,
      onClicked: () => {
        router.push({
          name: 'authors',
          params: { instanceId: instanceStore.instance.id },
          query: { roles: [Role.Banned] },
        })
      },
    })
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
  if (appStore.isSuperAdmin) {
    instanceDropdownItems.value.push({
      text: 'Add Featured Tag',
      onClicked: () => {
        instanceStore.tagInstance(instanceStore.instance.id, { tag: TagKind.Featured })
      },
    })

    instanceDropdownItems.value.push({
      text: 'Remove Featured Tag',
      onClicked: () => {
        instanceStore.untagInstance(instanceStore.instance.id, { tag: TagKind.Featured })
      },
    })
  }
})
</script>
