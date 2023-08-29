import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

import {
  useAddInstanceMutation,
  usePinInstanceMutation,
  useRemoveInstanceMutation,
  useReorderInstanceMutation,
  useUpdateInstanceMutation,
} from '@/graphql/mutations/instance.gen'
import { useInstanceQuery } from '@/graphql/queries/instance.gen'
import { useInstanceStreamSubscription } from '@/graphql/subscriptions/instanceStream.gen'
import {
  Instance,
  InstanceChannelsEdge,
  InstanceInput,
  InstancePinInput,
  InstanceReorderInput,
  MutationType,
  UserInstancesEdge,
} from '@/graphql/types.gen'
import { useAuthorStore } from '@/store/author'
import { useChannelStore } from '@/store/channel'
import { useMessageStore } from '@/store/message'
import { ExtendedInstance } from '@/types/ExtendedInstance'
import { timeSince } from '@/utils'

export const useInstanceStore = defineStore('instance', () => {
  const channelStore = useChannelStore()
  const authorStore = useAuthorStore()
  const messageStore = useMessageStore()
  let stopInstanceStream: () => void = () => null

  // =========================================
  // state
  const instances = ref<{ [instanceId: string]: ExtendedInstance }>({})
  const activeInstanceId = ref<string>('')
  const primaryInstanceId = ref<string>('')

  // =========================================
  // getters
  const instance = computed(() => {
    return instances.value[activeInstanceId.value] ?? ({} as ExtendedInstance)
  })
  const unpinnedInstance = computed(() => {
    return getInstances().find(i => i.id === primaryInstanceId.value && !i.mutablePinned)
  })
  function getInstances() {
    return Object.values(instances.value).sort((a, b) => a.mutableRank - b.mutableRank)
  }

  // =========================================
  // actions
  async function setActiveInstance(instanceId: string) {
    if (instanceId === activeInstanceId.value) return

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

    handleInstancesAdded([userInstancesEdge])
    channelStore.handleChannelsAdded(userInstancesEdge.node.channelsConnection.edges)

    const instance = userInstancesEdge.node

    stopInstanceStream()

    activeInstanceId.value = instance.id

    // subscribe to instance stream
    const { onResult: onInstanceStreamResult, stop } = useInstanceStreamSubscription({
      instanceId: instance.id,
    })
    stopInstanceStream = stop
    onInstanceStreamResult(result => {
      if (!result.data?.instanceStream) return
      const { mutation, channelMessagesEdge, instanceChannelsEdge, author, user, instance } =
        result.data.instanceStream

      if (mutation === MutationType.MessageAdded && channelMessagesEdge) {
        messageStore.handleMessagesAdded([channelMessagesEdge])
      } else if (mutation === MutationType.MessageRemoved && channelMessagesEdge) {
        messageStore.handleMessageRemoved(channelMessagesEdge)
      } else if (mutation === MutationType.ChannelAdded && instanceChannelsEdge) {
        channelStore.handleChannelsAdded([instanceChannelsEdge])
      } else if (mutation === MutationType.ChannelUpdated && instanceChannelsEdge) {
        channelStore.handleChannelUpdated(instanceChannelsEdge)
      } else if (mutation === MutationType.ChannelRemoved && instanceChannelsEdge) {
        channelStore.handleChannelRemoved(instanceChannelsEdge)
      } else if (mutation === MutationType.AuthorUpdated && author) {
        authorStore.handleAuthorUpdated(author)
      } else if (mutation === MutationType.UserUpdated && user) {
        authorStore.handleUserUpdated(user)
      } else if (mutation === MutationType.InstanceUpdated && instance) {
        const extendedInstance = instances.value[instance.id] ?? ({} as ExtendedInstance)
        instances.value[instance.id] = mergeInstance(instance, extendedInstance)
      }
      // TODO handle instance removed mutation
    })
  }

  async function addInstance(input: InstanceInput): Promise<UserInstancesEdge | undefined> {
    const { mutate } = useAddInstanceMutation({
      variables: {
        input,
      },
    })

    const result = await mutate()

    const edge = result?.data?.addInstance
    if (edge) {
      handleInstancesAdded([edge])
      await setActiveInstance(edge.node.id)
      primaryInstanceId.value = edge.node.id
    }

    return edge
  }

  async function removeInstance(instanceId: string) {
    const { mutate } = useRemoveInstanceMutation({
      variables: {
        instanceId,
      },
    })

    await mutate()

    if (instanceId === activeInstanceId.value) {
      const sortedInstances = getInstances()
      if (sortedInstances.length > 0) {
        await setActiveInstance(sortedInstances[0].id)
      } else {
        activeInstanceId.value = ''
      }
    }

    delete instances.value[instanceId]
  }

  async function reorderInstance(input: InstanceReorderInput, instanceId: string) {
    const instance = instances.value[instanceId]
    const prevRank = input.prevInstanceId ? instances.value[input.prevInstanceId].mutableRank : -1
    const sortedInstances = getInstances()
    const prevIndex = sortedInstances.findIndex(i => i.id === input.prevInstanceId)
    let nextRank: number
    if (prevIndex === -1) {
      nextRank = sortedInstances[0].mutableRank
    } else if (prevIndex === sortedInstances.length - 1) {
      nextRank = sortedInstances[sortedInstances.length - 1].mutableRank + 1
    } else {
      nextRank = sortedInstances[prevIndex + 1].mutableRank
    }

    instance.mutableRank = (prevRank + nextRank) / 2
    instance.mutablePinned = true

    const { mutate } = useReorderInstanceMutation({
      variables: { input, instanceId },
    })

    const result = await mutate()

    if (result?.data?.reorderInstance) {
      handleInstancesAdded([result?.data?.reorderInstance])
    }
  }

  async function pinInstance(input: InstancePinInput, instanceId: string) {
    const instance = instances.value[instanceId]
    const sortedInstances = getInstances()
    if (input.pinned && sortedInstances.length > 0) {
      instance.mutableRank = sortedInstances[sortedInstances.length - 1].mutableRank + 1
    }
    instance.mutablePinned = input.pinned

    const { mutate } = usePinInstanceMutation({
      variables: { input, instanceId },
    })

    const result = await mutate()

    // if (!input.pinned && instanceId !== primaryInstanceId.value) {
    //   delete instances.value[instanceId]
    // }

    if (result?.data?.pinInstance) {
      handleInstancesAdded([result?.data?.pinInstance])
    }
  }

  async function updateInstance(instanceId: string, input: InstanceInput) {
    const { mutate } = useUpdateInstanceMutation({
      variables: {
        instanceId,
        input,
      },
    })

    const result = await mutate()

    const edge = result?.data?.updateInstance
    if (edge) {
      handleInstancesAdded([edge])
    }
  }

  function handleInstancesAdded(edges: UserInstancesEdge[]) {
    for (const edge of edges) {
      instances.value[edge.node.id] = extendInstance(edge)
      authorStore.handleAuthorsAdded([edge.instanceUser])
    }
    computeRank(getInstances())
  }

  return {
    instances,
    primaryInstanceId,

    instance,
    unpinnedInstance,
    getInstances,

    setActiveInstance,
    addInstance,
    updateInstance,
    removeInstance,
    reorderInstance,
    pinInstance,
    handleInstancesAdded,
  }
})

function mergeInstance(instance: Instance, extendedInstance: ExtendedInstance): ExtendedInstance {
  return {
    ...extendedInstance,
    ...instance,
  }
}

function extendInstance(edge: UserInstancesEdge): ExtendedInstance {
  const extendedInstance = edge.node as ExtendedInstance
  extendedInstance.mutableRank = 0
  extendedInstance.rank = edge.rank
  extendedInstance.mutablePinned = edge.pinned
  extendedInstance.createdAtDate = new Date(extendedInstance.createdAt)
  extendedInstance.timeSince = timeSince(extendedInstance.createdAtDate)
  return extendedInstance
}

function computeRank(instances: ExtendedInstance[]) {
  const sorted = instances.sort((a, b) => (a.rank > b.rank ? 1 : -1))
  for (let i = 0; i < sorted.length; i++) {
    instances[i].mutableRank = i
  }
}
