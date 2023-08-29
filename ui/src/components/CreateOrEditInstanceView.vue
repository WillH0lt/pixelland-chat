<template>
  <div class="w-full flex flex-col items-center" @keydown.enter="createOrUpdateInstance">
    <ElementHeader @close="$emit('close')"></ElementHeader>

    <div class="mx-4 text-xl flex flex-col max-w-full w-80 flex-1">
      <!-- <div class="text-3xl mt-4">Let's get things set up</div> -->
      <div class="text-3xl mt-4">{{ editing ? 'Settings' : 'Create Instance' }}</div>

      <ElementDivider class="my-6" />

      <div class="mb-1">What's this {{ appStore.noun }} called?</div>
      <ElementInput
        class="max-w-sm w-full mb-2"
        :attr="{ maxlength: 32, placeholder: 'name' }"
        v-model="instanceName"
      />

      <div class="mb-1">Add a description</div>
      <ElementTextArea
        class="text-xl text-white bg-gray-darkest"
        focusColor="gray-darkest"
        placeholder="description"
        v-model:text="instanceDescription"
        maxlength="1024"
        @keydown.stop
      />

      <ElementDivider class="my-6" />
      <!-- 
      <div class="w-80">
        <div class="flex items-center w-full mb-8 last:mb-0">
          {{ accessOption.label }}
          <div class="flex-1" />
          <ElementSelection :items="accessOption.items" v-model="accessOption.selection" />
        </div>
      </div>

      <ElementDivider class="my-6" /> -->

      <div class="flex justify-center w-full mt-4">
        <ElementButton class="mx-4 w-20" @click="$emit('close')">Cancel</ElementButton>
        <ElementButton class="mx-4" @click="createOrUpdateInstance" :loading="saving">{{
          editing ? 'Save' : 'Create'
        }}</ElementButton>
      </div>
      <div class="w-full text-error mt-8">{{ error }}</div>
      <!-- <div v-if="editing">
        <ElementDivider class="my-6" />
        <div class="flex justify-center w-full mt-4">
          <ElementButton class="mx-4" @click="deleteInstance" hoverColor="error"
            >Delete {{ appStore.nounCapitalized }}</ElementButton
          >
        </div>
      </div> -->
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
import ElementTextArea from '@/components/ElementTextArea.vue'
import { Access } from '@/graphql/types.gen'
import { useAppStore } from '@/store/app'
import { useDialogStore } from '@/store/dialog'
import { useInstanceStore } from '@/store/instance'
import { SelectionItem } from '@/types/SelectionItem'
import { generateAvatar } from '@/utils'
import { createInstanceInput, getInstanceInput } from '@/utils'

const route = useRoute()
const appStore = useAppStore()
const dialogStore = useDialogStore()
const instanceStore = useInstanceStore()

const editing = computed(() => route.name === 'editInstance')

const emit = defineEmits(['close'])

const saving = ref(false)
const error = ref('')
const instanceName = ref('')
const instanceDescription = ref('')

// const access: SelectionItem[] = [
//   {
//     text: 'People I Invite',
//     key: Access.Private,
//   },
//   {
//     text: 'Everyone',
//     key: Access.Public,
//   },
// ]

// interface AccessOption {
//   label: string
//   selection: Access
//   items: SelectionItem[]
// }

// const accessOption = ref<AccessOption>({
//   label: 'Who can see it?',
//   selection: Access.Public,
//   items: JSON.parse(JSON.stringify(access)),
// })

onMounted(() => {
  if (!editing.value) return
  instanceName.value = instanceStore.instance.name
  instanceDescription.value = instanceStore.instance.description
  // accessOption.value.selection = instanceStore.instance.readAccess
})

async function createOrUpdateInstance() {
  saving.value = true
  error.value = ''
  try {
    let input
    if (editing.value) {
      input = getInstanceInput(instanceStore.instance)
    } else {
      input = createInstanceInput()
    }

    input = {
      ...input,
      name: instanceName.value,
      description: instanceDescription.value,
    }

    if (!editing.value) {
      await instanceStore.addInstance(input)
    } else {
      await instanceStore.updateInstance(instanceStore.instance.id, input)
    }
    emit('close')
  } catch (e) {
    error.value = String(e)
  }
  saving.value = false
}

// function deleteInstance() {
//   dialogStore.showDialog({
//     title: `Are you sure you want to delete <span class="underline">${
//       instanceStore.instance.name || 'this world'
//     }</span>?`,
//     text: "This can't be undone.",
//     buttons: [
//       {
//         text: 'Cancel',
//       },
//       {
//         text: 'Delete',
//         onClicked: async () => {
//           await instanceStore.removeInstance(instanceStore.instance.id)
//           dialogStore.hideDialog()
//         },
//       },
//     ],
//   })
// }
</script>
