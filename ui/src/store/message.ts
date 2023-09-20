import { acceptHMRUpdate, defineStore } from 'pinia'
import { nextTick, reactive } from 'vue'

import { useAddMessageMutation, useRemoveMessageMutation } from '@/graphql/mutations/message.gen'
import { useChannelQuery } from '@/graphql/queries/channel.gen'
import {
  Author,
  ChannelMessagesConnection,
  ChannelMessagesEdge,
  Message,
  MessageInput,
} from '@/graphql/types.gen'
import { useAuthorStore } from '@/store/author'
import { useChannelStore } from '@/store/channel'
import { useUserStore } from '@/store/user'
import { ExtendedMessage } from '@/types/ExtendedMessage'
import { timeSince } from '@/utils'

const UNSAVED_ID = 'UNSAVED_ID'

export const useMessageStore = defineStore('message', () => {
  const authorStore = useAuthorStore()
  const channelStore = useChannelStore()
  const userStore = useUserStore()

  // these variables store all channel state, keyed by channelId
  const allMessages = reactive<{ [channelId: string]: ExtendedMessage[] }>({})
  const allHasPreviousPage = reactive<{ [channelId: string]: boolean }>({})
  const allLoading = reactive<{ [channelId: string]: boolean }>({})
  const allComposeText = reactive<{ [channelId: string]: string }>({})

  // =========================================
  // getters
  function getMessages(channelId: string): ExtendedMessage[] {
    return allMessages[channelId] || []
  }

  function getHasPreviousPage(channelId: string): boolean {
    if (allHasPreviousPage[channelId] === undefined) return true
    return allHasPreviousPage[channelId]
  }

  function getLoading(channelId: string): boolean {
    if (allLoading[channelId] === undefined) return false
    return allLoading[channelId]
  }

  function getComposeText(channelId: string): string {
    return allComposeText[channelId] || ''
  }

  // =========================================
  // setters
  function setComposeText(channelId: string, text: string) {
    allComposeText[channelId] = text
  }

  // =========================================
  // actions
  function fetchMessages(channelId: string) {
    const hasPreviousPage = getHasPreviousPage(channelId)
    const loading = getLoading(channelId)
    if (!hasPreviousPage || loading) return

    allLoading[channelId] = true
    const messages = getMessages(channelId)
    const { onResult } = useChannelQuery({
      id: channelId,
      messagesLast: 50,
      messagesBefore: messages.length ? messages[0].cursor : undefined,
    })

    const sub = onResult(result => {
      allLoading[channelId] = result.loading
      if (!result.data?.channel) return
      if (result.data.channel.messagesConnection) {
        const connection = result.data.channel.messagesConnection
        handleMessagesAdded(connection.edges)
        allHasPreviousPage[channelId] = connection.pageInfo.hasPreviousPage
      }
      sub.off()
    })
  }

  async function addMessage(message: MessageInput) {
    const { mutate } = useAddMessageMutation({
      variables: { input: message },
    })

    addUnsaved(allMessages, message, authorStore.instanceUser)

    try {
      await mutate()

      const channel = channelStore.channel(message.channelId)
      if (channel) channel.mutableMessageCount++
    } catch (error: any) {
      const msg = "Couldn't send message. " + error.message
      const unsaved = getUnsaved(allMessages, message)
      if (!unsaved) return
      unsaved.error = msg

      // force rerender of message list since message is changing height
      const messages = allMessages[message.channelId]
      messages.splice(messages.indexOf(unsaved), 1)
      await nextTick()
      messages.push(unsaved)
    }
  }

  async function removeMessage(message: ExtendedMessage) {
    const { mutate } = useRemoveMessageMutation({
      variables: { messageId: message.id },
    })
    const fakeEdge = { node: { ...message, author: {} as Author }, cursor: '' }
    removeEdge(allMessages, fakeEdge)
    await mutate()

    const channel = channelStore.channel(message.channelId)
    if (channel) channel.mutableMessageCount--
  }

  function refreshTimeSince(channelId: string) {
    const messages = getMessages(channelId)
    messages.forEach(message => {
      message.timeSince = timeSince(message.createdAtDate)
    })
  }

  function handleMessagesAdded(edges: readonly ChannelMessagesEdge[]) {
    if (!edges.length) return
    if (edges[0].node.author.userId === userStore.user.id) {
      removeUnsaved(allMessages, edges[0])
    }
    appendEdges(allMessages, edges)
    const authors = edges.map(edge => edge.node.author)
    authorStore.handleAuthorsAdded(authors)
  }

  function handleMessageRemoved(edge: ChannelMessagesEdge) {
    removeEdge(allMessages, edge)
  }

  return {
    // getters
    getLoading,
    getMessages,
    getHasPreviousPage,
    getComposeText,

    // setters
    setComposeText,

    // actions
    fetchMessages,
    addMessage,
    removeMessage,
    handleMessagesAdded,
    handleMessageRemoved,
    refreshTimeSince,
  }
})

// =========================================
// helpers

function addUnsaved(
  allMessages: { [channelId: string]: ExtendedMessage[] },
  message: MessageInput,
  author: Author
) {
  appendEdges(allMessages, [
    {
      cursor: '',
      node: {
        id: UNSAVED_ID,
        author,
        createdAt: new Date().toISOString(),
        ...message,
      } as Message,
    },
  ])
}

function removeUnsaved(
  allMessages: { [channelId: string]: ExtendedMessage[] },
  edge: ChannelMessagesEdge
) {
  if (!allMessages[edge.node.channelId]) return
  const messages = allMessages[edge.node.channelId]
  const index = messages.findIndex(m => !m.saved && m.text === edge.node.text)
  if (index !== -1) {
    messages.splice(index, 1)
  }
}

function getUnsaved(
  allMessages: { [channelId: string]: ExtendedMessage[] },
  message: MessageInput
): ExtendedMessage | undefined {
  if (!allMessages[message.channelId]) return
  const messages = allMessages[message.channelId]
  const unsavedMessage = messages.find(
    m => !m.saved && m.text === message.text && m.error === undefined
  )
  return unsavedMessage
}

function appendEdges(
  allMessages: { [channelId: string]: ExtendedMessage[] },
  edges: readonly ChannelMessagesEdge[]
) {
  if (!edges.length) return
  if (!allMessages[edges[0].node.channelId]) {
    allMessages[edges[0].node.channelId] = []
  }
  const newMessages = edges.map(edge => extendMessage(edge))
  allMessages[edges[0].node.channelId].push(...newMessages)
  allMessages[edges[0].node.channelId].sort(
    (a, b) => a.createdAtDate.getTime() - b.createdAtDate.getTime()
  )
  updateCompactness(allMessages[edges[0].node.channelId])
}

function removeEdge(
  allMessages: { [channelId: string]: ExtendedMessage[] },
  edge: ChannelMessagesEdge
) {
  const messages = allMessages[edge.node.channelId]
  const index = messages.findIndex(m => m.id === edge.node.id)
  if (index !== -1) {
    messages.splice(index, 1)
  }
  updateCompactness(messages)
}

function extendMessage(edge: ChannelMessagesEdge): ExtendedMessage {
  const message = edge.node as Message
  const createdAtDate = new Date(message.createdAt)
  return {
    ...message,
    createdAtDate: createdAtDate,
    timeSince: timeSince(createdAtDate),
    compact: false,
    saved: message.id !== UNSAVED_ID,
    cursor: edge.cursor,
    authorId: message.author.id,
  }
}

function updateCompactness(messages: ExtendedMessage[]) {
  if (!messages.length) return

  messages[0].compact = false

  for (let i = 1; i < messages.length; i++) {
    const message = messages[i]
    const prevMessage = messages[i - 1]
    message.compact =
      message.authorId === prevMessage.authorId &&
      message.createdAtDate.getTime() - prevMessage.createdAtDate.getTime() < 1000 * 60 * 2
  }
}
