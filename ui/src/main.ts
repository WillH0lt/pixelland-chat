import { DefaultApolloClient } from '@vue/apollo-composable'
import { createPinia } from 'pinia'
import { PiniaLogger } from 'pinia-logger'
import { createApp, h, provide } from 'vue'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

import App from '@/App.vue'
import '@/emoji-mart.css'
import { apolloClient } from '@/graphql/client'
import { router } from '@/router'
import '@/style.css'

async function initializeApp() {
  const pinia = createPinia()
  // pinia.use(
  //   PiniaLogger({
  //     expanded: true,
  //     disabled: import.meta.env.PROD,
  //   })
  // )

  createApp({
    setup() {
      provide(DefaultApolloClient, apolloClient)
    },
    render: () => h(App),
  })
    .use(pinia)
    .use(PerfectScrollbar)
    .use(router)
    .mount('#app')

  // since we are using memory history, we need to manually navigate to the home page
  router.push({ name: 'home' })
}

initializeApp()
