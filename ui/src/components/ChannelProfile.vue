<template>
  <div class="bg-gray-darker flex flex-col" @click.stop>
    <div class="h-14 bg-gray-light -mb-14" />
    <div class="flex items-start">
      <img class="h-24 m-2" :src="user.avatar" />
      <div
        class="ml-auto mr-3 h-14 flex flex-col justify-center"
        v-if="authorStore.instanceUser.id === user.id"
      >
        <img
          class="w-10 h-10 pixelated hover:scale-110 transition cursor-pointer"
          src="/img/edit.png"
          @click="appStore.selectedPage = PAGE.PROFILE"
        />
      </div>
    </div>
    <div class="flex items-end w-full -mt-14">
      <div class="h-8" />
      <div class="ml-auto mr-3 my-2 flex flex-row">
        <ElementHoverText :text="btn.hoverText" v-for="btn of actionButtons">
          <img
            class="w-8 h-8 pixelated hover:scale-110 hover:opacity-60 transition cursor-pointer opacity-25"
            :src="btn.icon"
            @click="showConfirmationDialog(btn)"
          />
        </ElementHoverText>
      </div>
    </div>
    <div class="text-2xl mx-2 mt-4 flex">
      <div>{{ user.name }}&#8203;</div>
      <div class="text-gray-medium ml-2">#{{ getSlug(user.userId) }}</div>
    </div>
    <div class="w-full border-b-2 border-black my-1" />
    <Markdown
      class="text-xl max-h-48 mx-2 pr-6 overflow-y-auto break-words markdown"
      @click="handleLinkClicks($event, dialogStore)"
      :linkify="true"
      :breaks="true"
      :source="user.bio"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import Markdown from 'vue3-markdown-it'

import antiSkullImg from '@/assets/anti-skull.png'
import downArrowImg from '@/assets/down-arrow.png'
import pencilMinusImg from '@/assets/pencil-minus.png'
import pencilPlusImg from '@/assets/pencil-plus.png'
import skullImg from '@/assets/skull.png'
import upArrowImg from '@/assets/up-arrow.png'
import { Author, Role } from '@/graphql/types.gen'
import { useAppStore } from '@/store/app'
import { useAuthorStore } from '@/store/author'
import { useDialogStore } from '@/store/dialog'
import { PAGE } from '@/types/PageEnum'
import { handleLinkClicks } from '@/utils'

import ElementHoverText from './ElementHoverText.vue'

const appStore = useAppStore()

const props = defineProps<{
  user: Author
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const authorStore = useAuthorStore()
const dialogStore = useDialogStore()

// close profile when clicking outside or pressing escape
onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
  window.addEventListener('click', handleOutsideClick)
  window.addEventListener('keydown', handleEscape)
})
onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick)
  window.removeEventListener('keydown', handleEscape)
})
function handleOutsideClick() {
  emit('close')
}
function handleEscape(ev: KeyboardEvent) {
  if (ev.key === 'Escape') {
    emit('close')
  }
}

function getSlug(userId: string) {
  const len = 4
  const base = userId.substring(userId.length - len)
  let slug = ''
  for (let i = 0; i < base.length; i++) {
    const code = base[i].charCodeAt(0) - 97
    slug += Math.abs(code % 10)
  }

  return slug
}

interface ActionButton {
  icon: string
  hoverText: string
  dialogTitle: string
  dialogText: string
  dialogFnc: Function
}

const actionButtons = ref([] as ActionButton[])
watchEffect(() => {
  actionButtons.value = []

  const myRoles = authorStore.instanceUser.roles
  const theirRoles = props.user.roles

  // make editor
  if (
    myRoles.includes(Role.Moderator) &&
    !theirRoles.includes(Role.Banned) &&
    !theirRoles.includes(Role.Member)
  ) {
    actionButtons.value.push({
      icon: pencilPlusImg,
      hoverText: 'Add Editor',
      dialogTitle: 'Wait a second',
      dialogText: `Are you sure you want to make <span class="underline">${props.user.name}</span> an editor?`,
      dialogFnc: () => authorStore.addRole(props.user.id, Role.Member),
    })
  }
  // remove editor
  if (myRoles.includes(Role.Moderator) && theirRoles.includes(Role.Member)) {
    actionButtons.value.push({
      icon: pencilMinusImg,
      hoverText: 'Remove Editor',
      dialogTitle: 'Wait a second',
      dialogText: `Are you sure you want to remove <span class="underline">${props.user.name}</span> as an editor?`,
      dialogFnc: () => authorStore.removeRole(props.user.id, Role.Member),
    })
  }

  // make moderator
  if (myRoles.includes(Role.Admin) && !theirRoles.includes(Role.Moderator)) {
    actionButtons.value.push({
      icon: upArrowImg,
      hoverText: 'Add Mod',
      dialogTitle: 'Wait a second',
      dialogText: `Are you sure you want to make <span class="underline">${props.user.name}</span> a moderator?`,
      dialogFnc: () => authorStore.addRole(props.user.id, Role.Moderator),
    })
  }
  // remove moderator
  if (myRoles.includes(Role.Admin) && theirRoles.includes(Role.Moderator)) {
    actionButtons.value.push({
      icon: downArrowImg,
      hoverText: 'Remove Mod',
      dialogTitle: 'Wait a second',
      dialogText: `Are you sure you want to remove <span class="underline">${props.user.name}</span> as a moderator?`,
      dialogFnc: () => authorStore.removeRole(props.user.id, Role.Moderator),
    })
  }

  if (authorStore.instanceUser.id === props.user.id) return

  // ban
  if (
    myRoles.includes(Role.Moderator) &&
    !theirRoles.includes(Role.Banned) &&
    !theirRoles.includes(Role.Moderator)
  ) {
    actionButtons.value.push({
      icon: skullImg,
      hoverText: 'Ban',
      dialogTitle: 'Wait a second',
      dialogText: `Are you sure you want to ban <span class="underline">${props.user.name}</span>?`,
      dialogFnc: () => authorStore.addRole(props.user.id, Role.Banned),
    })
  }
  // unban
  if (myRoles.includes(Role.Moderator) && theirRoles.includes(Role.Banned)) {
    actionButtons.value.push({
      icon: antiSkullImg,
      hoverText: 'Unban',
      dialogTitle: 'Wait a second',
      dialogText: `Are you sure you want to unban <span class="underline">${props.user.name}</span>?`,
      dialogFnc: () => authorStore.removeRole(props.user.id, Role.Banned),
    })
  }
})

function showConfirmationDialog(button: ActionButton) {
  dialogStore.showDialog({
    title: button.dialogTitle,
    text: button.dialogText,
    buttons: [
      {
        text: 'cancel',
        onClicked: () => {
          dialogStore.hideDialog()
        },
      },
      {
        text: 'confirm',
        onClicked: async () => {
          await button.dialogFnc()
          dialogStore.hideDialog()
        },
      },
    ],
  })
}
</script>
