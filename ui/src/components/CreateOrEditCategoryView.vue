<template>
  <div class="w-full flex flex-col items-center" @keydown.enter="createOrUpdateCategory">
    <ElementHeader @close="$emit('close')"></ElementHeader>

    <div class="mx-4 text-xl flex flex-col max-w-full w-80 flex-1">
      <div class="text-3xl mt-4">{{ editing ? 'Edit' : 'Create' }} Category</div>

      <ElementDivider class="my-6" />

      <div class="mb-1">Category Name</div>
      <ElementInput class="max-w-sm w-full" :attr="{ maxlength: 32 }" v-model="categoryName" />

      <ElementDivider class="my-6" />

      <div class="w-80">
        <div class="flex items-center w-full mb-8 last:mb-0">
          {{ accessDropdown.label }}
          <div class="flex-1" />
          <ElementSelection :items="accessDropdown.roles" v-model="accessDropdown.selection">
          </ElementSelection>
        </div>
      </div>

      <ElementDivider class="my-6" />

      <div class="flex justify-center w-full mt-4">
        <ElementButton class="mx-4 w-20" @click="$emit('close')">Cancel</ElementButton>
        <ElementButton class="mx-4" @click="createOrUpdateCategory" :loading="saving">{{
          editing ? 'Save' : 'Create'
        }}</ElementButton>
      </div>
      <div class="w-full text-error mt-8">{{ error }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import ElementButton from '@/components/ElementButton.vue'
import ElementDivider from '@/components/ElementDivider.vue'
import ElementHeader from '@/components/ElementHeader.vue'
import ElementInput from '@/components/ElementInput.vue'
import ElementSelection from '@/components/ElementSelection.vue'
import { Access, Role } from '@/graphql/types.gen'
import { useAuthorStore } from '@/store/author'
import { useChannelStore } from '@/store/channel'
import { useInstanceStore } from '@/store/instance'
import { SelectionItem } from '@/types/SelectionItem'
import { getMostPermissiveRole } from '@/utils'

const route = useRoute()
const channelStore = useChannelStore()
const instanceStore = useInstanceStore()
const authorStore = useAuthorStore()

const emit = defineEmits(['close'])

const categoryName = ref('')
const saving = ref(false)
const error = ref('')
const editing = computed(() => route.name === 'editCategory')

const readRoles: SelectionItem[] = []
if (authorStore.instanceUser?.roles.includes(Role.Admin)) {
  readRoles.push({
    text: 'Admins',
    key: Role.Admin,
  })
}
if (authorStore.instanceUser?.roles.includes(Role.Moderator)) {
  readRoles.push({
    text: 'Moderators',
    key: Role.Moderator,
  })
}
if (authorStore.instanceUser?.roles.includes(Role.Member)) {
  readRoles.push({
    text: 'Members',
    key: Role.Member,
  })
}
if (instanceStore.instance.readAccess === Access.Public) {
  readRoles.push({
    text: 'Everyone',
    key: Role.AllUsers,
  })
}

const accessDropdown = ref({
  label: 'Who can see it?',
  selection: readRoles[readRoles.length - 1].key,
  roles: JSON.parse(JSON.stringify(readRoles)),
})

if (route.params.channelId) {
  const category = channelStore.channels[route.params.channelId as string]
  if (!category) {
    error.value = `could not find category`
  } else {
    categoryName.value = category.name

    accessDropdown.value.selection = getMostPermissiveRole(category.readers as Role[])
  }
}

async function createOrUpdateCategory() {
  saving.value = true
  error.value = ''
  try {
    const channelInput = {
      name: categoryName.value,
      instanceId: instanceStore.instance.id,
      readers: [accessDropdown.value.selection as Role],
      publishers: [Role.Moderator],
      isCategory: true,
    }

    if (editing.value) {
      await channelStore.updateChannel(channelInput, route.params.channelId as string)
    } else {
      await channelStore.addChannel(channelInput)
    }
    emit('close')
  } catch (e) {
    error.value = String(e)
  }
  saving.value = false
}
</script>
