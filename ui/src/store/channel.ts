import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

import {
  useAddChannelMutation,
  useRemoveChannelMutation,
  useReorderChannelMutation,
  useUpdateChannelMutation,
} from '@/graphql/mutations/channel.gen'
import { useInstanceQuery } from '@/graphql/queries/instance.gen'
import {
  ChannelInput,
  ChannelReorderInput,
  InstanceChannelsEdge,
  UserInstancesEdge,
} from '@/graphql/types.gen'
import { ExtendedChannel } from '@/types/ExtendedChannel'

export const useChannelStore = defineStore('channel', () => {
  // =========================================
  // state
  const channels = ref<{ [channelId: string]: ExtendedChannel }>({})

  // =========================================
  // getters
  function channel(channelId: string): ExtendedChannel | undefined {
    return channels.value[channelId]
  }

  function getChannels(instanceId: string): ExtendedChannel[] {
    return Object.values(channels.value)
      .filter(channel => channel.instanceId === instanceId)
      .filter(channel => channel.isComments === false)
      .sort((a, b) => a.mutableRank - b.mutableRank)
  }

  function getCommentsChannel(instanceId: string): ExtendedChannel | undefined {
    const commentChannels = Object.values(channels.value)
      .filter(channel => channel.instanceId === instanceId)
      .filter(channel => channel.isComments === true)

    if (commentChannels.length === 0) {
      return undefined
    } else {
      return commentChannels[0]
    }
  }

  // =========================================
  // actions
  async function addChannel(input: ChannelInput) {
    const { mutate } = useAddChannelMutation({
      variables: { input },
    })

    await mutate()
  }

  async function updateChannel(input: ChannelInput, channelId: string) {
    const { mutate } = useUpdateChannelMutation({
      variables: { input, channelId },
    })

    await mutate()
  }

  // TODO
  async function refreshChannels(instanceId: string) {
    const instanceChannels = getChannels(instanceId)
    for (const channel of instanceChannels) {
      delete channels.value[channel.id]
    }

    const { onResult, onError } = useInstanceQuery({
      id: instanceId,
      channelsFirst: 50,
    })

    const userInstancesEdge = await new Promise<UserInstancesEdge>((resolve, reject) => {
      onError(error => {
        reject(error.message)
      })
      onResult(result => {
        if (result.error) {
          reject(result.error.message)
        }
        resolve(result.data.instance)
      })
    })

    handleChannelsAdded(userInstancesEdge.node.channelsConnection.edges)
  }

  async function reorderChannel(input: ChannelReorderInput, channelId: string) {
    const channel = channels.value[channelId]
    const prevRank = input.prevChannelId ? channels.value[input.prevChannelId].mutableRank : -1
    const sortedChannels = getChannels(channel.instanceId)
    const prevIndex = sortedChannels.findIndex(c => c.id === input.prevChannelId)
    let nextRank: number
    if (prevIndex === -1) {
      nextRank = sortedChannels[0].mutableRank
    } else if (prevIndex === sortedChannels.length - 1) {
      nextRank = sortedChannels[sortedChannels.length - 1].mutableRank + 1
    } else {
      nextRank = sortedChannels[prevIndex + 1].mutableRank
    }

    channel.mutableRank = (prevRank + nextRank) / 2

    const { mutate } = useReorderChannelMutation({
      variables: { input, channelId },
    })

    await mutate()
  }

  async function removeChannel(channelId: string) {
    const { mutate } = useRemoveChannelMutation({
      variables: { channelId },
    })

    await mutate()
  }

  function handleChannelsAdded(edges: readonly InstanceChannelsEdge[]) {
    for (const edge of edges) {
      channels.value[edge.node.id] = extendChannel(edge)
    }
    if (edges.length > 0) {
      computeRank(getChannels(edges[0].node.instanceId))
    }
  }

  function handleChannelUpdated(edge: InstanceChannelsEdge) {
    channels.value[edge.node.id] = extendChannel(edge)
    computeRank(getChannels(edge.node.instanceId))
  }

  function handleChannelRemoved(edge: InstanceChannelsEdge) {
    delete channels.value[edge.node.id]
  }

  return {
    channels,

    channel,
    getChannels,
    getCommentsChannel,
    addChannel,
    updateChannel,
    reorderChannel,
    removeChannel,
    refreshChannels,
    handleChannelsAdded,
    handleChannelUpdated,
    handleChannelRemoved,
  }
})

function extendChannel(edge: InstanceChannelsEdge): ExtendedChannel {
  return {
    ...edge.node,
    cursor: edge.cursor,
    updatedAtDate: new Date(edge.node.updatedAt),
    lastMessageAddedAtDate: edge.node.lastMessageAddedAt
      ? new Date(edge.node.lastMessageAddedAt)
      : undefined,
    mutableRank: 0, //edge.node.rank,
    mutableMessageCount: edge.node.messageCount,
  }
}

function computeRank(channels: ExtendedChannel[]) {
  const sorted = channels.sort((a, b) => (a.rank > b.rank ? 1 : -1))
  for (let i = 0; i < sorted.length; i++) {
    channels[i].mutableRank = i
  }
}
