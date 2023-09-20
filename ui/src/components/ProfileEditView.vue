<template>
  <div
    class="flex flex-col text-2xl w-full items-center overflow-y-auto overflow-x-hidden"
    @click.stop
  >
    <HomeHeader @close="$emit('close')" :items="[]" title="My Profile" />
    <div class="relative group w-40 h-40 cursor-pointer block-border mt-20" @click="getAvatar">
      <img class="w-full h-full bg-accent pixelated hover:brightness-50" :src="avatar" />
    </div>
    <div class="flex w-full justify-center items-center">
      <div class="cursor-pointer mx-2 text-accent hover:underline" @click="getAvatar">Edit</div>
      <!-- <img class="pixelated w-6 h-6" src="/img/edit.png" /> -->
    </div>
    <ElementInput
      class="mt-9 text-lg w-96 max-w-full px-8"
      label="Display Name"
      v-model="name"
      :attr="{ maxlength: 32 }"
    />
    <div class="flex flex-col items-start justify-start text-lg mt-6 w-96 max-w-full px-8">
      <div class="ml-2 -mb-1">About Me</div>
      <textarea
        class="w-full px-2 py-[8px] form-control break-words bg-gray-darkest bg-clip-padding transition focus:outline-none focus:shadow-none"
        v-model="bio"
        :maxlength="1024"
      />
    </div>
    <div
      class="text-accent opacity-0"
      :class="{
        'opacity-100': !dirty && hasSaved,
      }"
    >
      Saved!
    </div>
    <Transition>
      <div class="w-full flex justify-center" v-if="dirty">
        <ElementButton class="mx-4" @click="reset"> Reset </ElementButton>
        <ElementButton class="mx-4" @click="save" :loading="saving"> Save </ElementButton>
      </div>
    </Transition>
    <div
      class="text-error opacity-0"
      :class="{
        'opacity-100': error,
      }"
    >
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import ElementButton from '@/components/ElementButton.vue'
import ElementInput from '@/components/ElementInput.vue'
import HomeHeader from '@/components/HomeHeader.vue'
import { useAuthorStore } from '@/store/author'
import { useUserStore } from '@/store/user'

const authorStore = useAuthorStore()
const userStore = useUserStore()

const saving = ref(false)
const hasSaved = ref(false)
const error = ref('')
const name = ref(authorStore.instanceUser.name)
const bio = ref(authorStore.instanceUser.bio)
const avatar = ref(authorStore.instanceUser.avatar)

const dirty = computed(() => {
  return (
    authorStore.instanceUser.name !== name.value ||
    authorStore.instanceUser.bio !== bio.value ||
    authorStore.instanceUser.avatar !== avatar.value
  )
})

function getAvatar() {
  console.log(authorStore.instanceUser.name, name.value)
}

function reset() {
  name.value = authorStore.instanceUser.name
  bio.value = authorStore.instanceUser.bio
  avatar.value = authorStore.instanceUser.avatar
}

async function save() {
  saving.value = true
  hasSaved.value = true
  try {
    await userStore.updateUser({
      name: name.value,
      bio: bio.value,
      avatar: avatar.value,
    })
    saving.value = false
  } catch (err) {
    saving.value = false
    error.value = String(err)
  }
}
</script>

<style scoped>
textarea::placeholder {
  color: #555;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
