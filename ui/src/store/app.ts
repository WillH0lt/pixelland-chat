import { provideApolloClient } from '@vue/apollo-composable'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { DEFAULT_API_HOST, NULL_UUID } from '@/constants'
import { apolloClient, createLink } from '@/graphql/client'
import { useAuthorStore } from '@/store/author'

export const useAppStore = defineStore('app', () => {
  provideApolloClient(apolloClient)
  const authorStore = useAuthorStore()

  // =========================================
  // state
  const apiHost = ref(DEFAULT_API_HOST)
  const allowAddInstance = ref(false)
  const externalizeSettings = ref(false)
  const externalizeInvites = ref(false)
  const inviteBasePath = ref('example.com/invite/')
  const isMobile = ref(false)
  const noun = ref('instance')
  const _token = ref('')
  const verified = ref(true)
  const visible = ref(true)
  const connected = ref(false)
  const isSuperAdmin = ref(false)

  // =========================================
  // getters
  const isLoggedIn = computed(() => {
    return authorStore.instanceUser.id !== NULL_UUID
  })
  const nounCapitalized = computed(() => noun.value.charAt(0).toUpperCase() + noun.value.slice(1))
  const token = computed({
    get: () => _token.value,
    set: (value: string) => {
      _token.value = value
      const { link, wsClient } = createLink(value, apiHost.value)
      wsClient.on('connected', () => {
        connected.value = true
      })
      wsClient.on('error', () => {
        connected.value = false
      })
      apolloClient.setLink(link)
    },
  })

  window.addEventListener('touchstart', () => {
    // checking if mobile based on touch event
    isMobile.value = true
  })

  return {
    apiHost,
    allowAddInstance,
    externalizeInvites,
    externalizeSettings,
    inviteBasePath,
    isMobile,
    noun,
    verified,
    visible,
    connected,

    isSuperAdmin,
    isLoggedIn,
    nounCapitalized,
    token,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
