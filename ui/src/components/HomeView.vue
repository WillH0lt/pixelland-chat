<template>
  <div class="flex flex-col w-full h-full">
    <InstanceView
      class="flex-1 min-h-0"
      v-if="appStore.selectedPage === PAGE.INSTANCE"
      @close="$emit('close')"
    />
    <ProfileEditView
      class="flex-1 min-h-0"
      v-else-if="appStore.selectedPage === PAGE.PROFILE"
      @close="$emit('close')"
    />
    <NotificationsView
      class="flex-1 min-h-0"
      v-else-if="appStore.selectedPage === PAGE.NOTIFICATIONS"
      @close="$emit('close')"
    />
    <div class="w-full h-12 flex justify-stretch bg-[#191919]">
      <div
        class="relative bg-gray-darkest w-full opacity-50 group hover:opacity-100 transition cursor-pointer"
        v-for="page in pages"
        @click="appStore.selectedPage = page.kind"
        :class="{
          'opacity-100': appStore.selectedPage === page.kind,
        }"
      >
        <img
          class="w-8 h-8 my-2 m-auto pixelated group-hover:scale-110 transition"
          :src="page.logo"
        />
        <div
          v-if="page.notify"
          class="absolute top-1/2 right-1/2 translate-x-4 -translate-y-4 w-3 h-3 bg-accent"
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'

import InstanceView from '@/components/InstanceView.vue'
import NotificationsView from '@/components/NotificationsView.vue'
import ProfileEditView from '@/components/ProfileEditView.vue'
import { useAppStore } from '@/store/app'
import { useNotificationStore } from '@/store/notification'
import { PAGE } from '@/types/PageEnum'

const appStore = useAppStore()
const notificationsStore = useNotificationStore()

defineEmits(['close'])

const pages = computed(() => [
  {
    kind: PAGE.INSTANCE,
    logo: '/img/logo-square.png',
    notify: false,
  },
  {
    kind: PAGE.PROFILE,
    logo: 'https://avatars.dicebear.com/api/human/123.svg',
    notify: false,
  },
  {
    kind: PAGE.NOTIFICATIONS,
    logo: '/img/bell.png',
    notify: notificationsStore.hasUnread,
  },
])
</script>
