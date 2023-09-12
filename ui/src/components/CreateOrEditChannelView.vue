<template>
  <div class="w-full flex flex-col overflow-y-auto" @keydown.enter="createOrUpdateChannel">
    <ElementHeader class="flex-shrink-0" @close="$emit('close')"></ElementHeader>

    <div class="mx-auto text-xl flex flex-col max-w-full w-80 flex-1 items-center">
      <div class="text-3xl mt-4">{{ editing ? 'Edit' : 'Create' }} Channel</div>

      <ElementDivider class="my-6" />

      <div class="mb-1">Channel Name</div>
      <ElementInput class="max-w-sm w-full" :attr="{ maxlength: 32 }" v-model="channelName" />

      <ElementDivider class="my-6" />

      <div class="w-80">
        <div class="flex items-center w-full mb-8 last:mb-0" v-for="option of accessOptions">
          {{ option.label }}
          <div class="flex-1" />
          <ElementSelection
            :items="option.roles"
            v-model="option.selection"
            @update:modelValue="onSelectionUpdate"
          >
          </ElementSelection>
        </div>
      </div>

      <!-- <ElementDivider class="my-6" />

      <div class="mb-2">Special Words</div>

      <ElementInput class="max-w-sm w-full" :attr="{ maxlength: 32 }" v-model="channelName" /> -->

      <!-- <ElementSelection
        :items="option.roles"
        v-model="option.selection"
        @update:modelValue="onSelectionUpdate"
      >
      </ElementSelection>
       <ElementButton class="w-2">+</ElementButton> -->

      <ElementDivider class="my-6" />

      <div class="flex justify-center w-full mt-4">
        <ElementButton class="mx-4 w-20" @click="$emit('close')">Cancel</ElementButton>
        <ElementButton class="mx-4" @click="createOrUpdateChannel" :loading="saving">{{
          editing ? 'Save' : 'Create'
        }}</ElementButton>
      </div>
      <div class="w-full text-error mt-8">{{ error }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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

const channelName = ref('')
const saving = ref(false)
const error = ref('')

const editing = computed(() => route.name === 'editChannel')

const allRoles = {
  [Role.Admin]: {
    text: 'Just Me',
    key: Role.Admin,
  },
  [Role.Moderator]: {
    text: 'Moderators',
    key: Role.Moderator,
  },
  [Role.Member]: {
    text: 'Editors',
    key: Role.Member,
  },
  [Role.AllUsers]: {
    text: 'Everyone',
    key: Role.AllUsers,
  },
}

const readRoles: SelectionItem[] = []
const publishRoles: SelectionItem[] = []
if (authorStore.instanceUser?.roles.includes(Role.Admin)) {
  readRoles.push(allRoles[Role.Admin])
  publishRoles.push(allRoles[Role.Admin])
}
if (authorStore.instanceUser?.roles.includes(Role.Moderator)) {
  readRoles.push(allRoles[Role.Moderator])
  publishRoles.push(allRoles[Role.Moderator])
}
if (authorStore.instanceUser?.roles.includes(Role.Member)) {
  readRoles.push(allRoles[Role.Member])
  publishRoles.push(allRoles[Role.Member])
}
if (instanceStore.instance.readAccess === Access.Public) {
  readRoles.push(allRoles[Role.AllUsers])
  publishRoles.push(allRoles[Role.AllUsers])
}

const accessOptions = ref([
  {
    label: 'Who can read?',
    selection: readRoles[readRoles.length - 1].key,
    roles: JSON.parse(JSON.stringify(readRoles)),
  },
  {
    label: 'Who can post?',
    selection: publishRoles[publishRoles.length - 1].key,
    roles: JSON.parse(JSON.stringify(publishRoles)),
  },
])

function onSelectionUpdate() {
  const { roles: readRoles, selection: readSelection } = accessOptions.value[0]
  const { roles: publishRoles, selection: publishSelection } = accessOptions.value[1]

  const readIndex = readRoles.findIndex((r: SelectionItem) => r.key === readSelection)
  const publishIndex = publishRoles.findIndex((r: SelectionItem) => r.key === publishSelection)

  if (readIndex < publishIndex) {
    accessOptions.value[1].selection = readSelection
  }

  for (let i = 0; i < publishRoles.length; i++) {
    publishRoles[i].active = readIndex >= i
  }
}

onMounted(() => {
  if (route.params.channelId) {
    const channel = channelStore.channels[route.params.channelId as string]
    if (!channel) {
      error.value = 'could not find channel'
      return
    }

    channelName.value = channel.name
    accessOptions.value[0].selection = getMostPermissiveRole(channel.readers as Role[])
    accessOptions.value[1].selection = getMostPermissiveRole(channel.publishers as Role[])

    onSelectionUpdate()
  }
})

async function createOrUpdateChannel() {
  const { selection: readSelection } = accessOptions.value[0]
  const { selection: publishSelection } = accessOptions.value[1]

  saving.value = true
  error.value = ''
  try {
    const channelInput = {
      name: channelName.value,
      instanceId: instanceStore.instance.id,
      readers: [readSelection as Role],
      publishers: [publishSelection as Role],
      isCategory: false,
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
