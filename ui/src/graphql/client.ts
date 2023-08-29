import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { HttpLink, split } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

import { DEFAULT_API_HOST } from '@/constants'

const { link, wsClient } = createLink('', DEFAULT_API_HOST)

// Cache implementation
const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
  },
})

let activeSocket: any = undefined
let pongWaitTimeout: NodeJS.Timeout | undefined = undefined
export function createLink(token: string, apiHost: string) {
  const wsHost = apiHost.replace('http', 'ws')
  const authorizationHeader = token ? `Bearer ${token}` : ''
  const wsClient = createClient({
    url: wsHost,
    keepAlive: 10000,
    shouldRetry: () => true,
    retryAttempts: Infinity,
    connectionParams: {
      Authorization: authorizationHeader,
    },
    on: {
      connected: socket => (activeSocket = socket),
      ping: received => {
        if (received) return

        // wait 5 seconds for the pong and then close the connection
        pongWaitTimeout = setTimeout(() => {
          if (activeSocket?.readyState !== WebSocket.OPEN) return
          activeSocket.close(4408, 'Request Timeout')
        }, 5000)
      },
      pong: received => {
        if (!received) return
        clearTimeout(pongWaitTimeout)
      },
    },
  })

  const wsLink = new GraphQLWsLink(wsClient)

  // HTTP connection to the API
  const httpLink = new HttpLink({
    // You should use an absolute URL here
    uri: apiHost,
  })

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    httpLink
  )

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: authorizationHeader,
      },
    }
  })

  return {
    link: authLink.concat(link),
    wsClient,
  }
}
