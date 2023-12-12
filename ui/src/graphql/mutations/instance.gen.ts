import * as Types from '../types.gen';

import * as Operations from './instance.js';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type ReactiveFunction<TParam> = () => TParam;
export type AddInstanceMutationVariables = Types.Exact<{
  input: Types.InstanceInput;
  channelsFirst: Types.Scalars['Int'];
  channelsAfter: Types.Scalars['String'];
  likesFirst: Types.Scalars['Int'];
  likesAfter: Types.Scalars['String'];
  authorsFirst: Types.Scalars['Int'];
  authorsAfter: Types.Scalars['String'];
  authorsRoles: Array<Types.Role> | Types.Role;
  messagesLast: Types.Scalars['Int'];
  messagesBefore: Types.Scalars['String'];
}>;


export type AddInstanceMutation = { __typename?: 'Mutation', addInstance: { __typename?: 'UserInstancesEdge', cursor: string, rank: string, pinned: boolean, likedByMe: boolean, node: { __typename?: 'Instance', id: any, name: string, readAccess: Types.Access, icon: string, createdAt: any, description: string, showAuthor: boolean, showChat: boolean, showLikes: boolean, showComments: boolean, likesCount: number, commentsCount: number, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null }, likesConnection: { __typename?: 'InstanceLikesConnection', edges: Array<{ __typename?: 'InstanceLikesEdge', cursor: string, likedAt: any, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, channelsConnection: { __typename?: 'InstanceChannelsConnection', edges: Array<{ __typename?: 'InstanceChannelsEdge', cursor: string, node: { __typename?: 'Channel', id: any, name: string, rank: string, instanceId: any, readers: Array<Types.Role>, publishers: Array<Types.Role>, createdAt: any, updatedAt: any, lastMessageAddedAt?: any | null, messageCount: number, isCategory: boolean, isComments: boolean, messagesConnection: { __typename?: 'ChannelMessagesConnection', edges: Array<{ __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, imageUrls?: Array<string> | null, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null }, repliedMessage?: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, authorsConnection: { __typename?: 'InstanceAuthorsConnection', edges: Array<{ __typename?: 'InstanceAuthorsEdge', cursor: string, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } }, instanceUser: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } } };

export type UpdateInstanceMutationVariables = Types.Exact<{
  instanceId: Types.Scalars['Uuid'];
  input: Types.InstanceInput;
  channelsFirst: Types.Scalars['Int'];
  channelsAfter: Types.Scalars['String'];
  likesFirst: Types.Scalars['Int'];
  likesAfter: Types.Scalars['String'];
  authorsFirst: Types.Scalars['Int'];
  authorsAfter: Types.Scalars['String'];
  authorsRoles: Array<Types.Role> | Types.Role;
  messagesLast: Types.Scalars['Int'];
  messagesBefore: Types.Scalars['String'];
}>;


export type UpdateInstanceMutation = { __typename?: 'Mutation', updateInstance: { __typename?: 'UserInstancesEdge', cursor: string, rank: string, pinned: boolean, likedByMe: boolean, node: { __typename?: 'Instance', id: any, name: string, readAccess: Types.Access, icon: string, createdAt: any, description: string, showAuthor: boolean, showChat: boolean, showLikes: boolean, showComments: boolean, likesCount: number, commentsCount: number, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null }, likesConnection: { __typename?: 'InstanceLikesConnection', edges: Array<{ __typename?: 'InstanceLikesEdge', cursor: string, likedAt: any, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, channelsConnection: { __typename?: 'InstanceChannelsConnection', edges: Array<{ __typename?: 'InstanceChannelsEdge', cursor: string, node: { __typename?: 'Channel', id: any, name: string, rank: string, instanceId: any, readers: Array<Types.Role>, publishers: Array<Types.Role>, createdAt: any, updatedAt: any, lastMessageAddedAt?: any | null, messageCount: number, isCategory: boolean, isComments: boolean, messagesConnection: { __typename?: 'ChannelMessagesConnection', edges: Array<{ __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, imageUrls?: Array<string> | null, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null }, repliedMessage?: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, authorsConnection: { __typename?: 'InstanceAuthorsConnection', edges: Array<{ __typename?: 'InstanceAuthorsEdge', cursor: string, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } }, instanceUser: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } } };

export type RemoveInstanceMutationVariables = Types.Exact<{
  instanceId: Types.Scalars['Uuid'];
  channelsFirst: Types.Scalars['Int'];
  channelsAfter: Types.Scalars['String'];
  likesFirst: Types.Scalars['Int'];
  likesAfter: Types.Scalars['String'];
  authorsFirst: Types.Scalars['Int'];
  authorsAfter: Types.Scalars['String'];
  authorsRoles: Array<Types.Role> | Types.Role;
  messagesLast: Types.Scalars['Int'];
  messagesBefore: Types.Scalars['String'];
}>;


export type RemoveInstanceMutation = { __typename?: 'Mutation', removeInstance: { __typename?: 'UserInstancesEdge', cursor: string, rank: string, pinned: boolean, likedByMe: boolean, node: { __typename?: 'Instance', id: any, name: string, readAccess: Types.Access, icon: string, createdAt: any, description: string, showAuthor: boolean, showChat: boolean, showLikes: boolean, showComments: boolean, likesCount: number, commentsCount: number, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null }, likesConnection: { __typename?: 'InstanceLikesConnection', edges: Array<{ __typename?: 'InstanceLikesEdge', cursor: string, likedAt: any, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, channelsConnection: { __typename?: 'InstanceChannelsConnection', edges: Array<{ __typename?: 'InstanceChannelsEdge', cursor: string, node: { __typename?: 'Channel', id: any, name: string, rank: string, instanceId: any, readers: Array<Types.Role>, publishers: Array<Types.Role>, createdAt: any, updatedAt: any, lastMessageAddedAt?: any | null, messageCount: number, isCategory: boolean, isComments: boolean, messagesConnection: { __typename?: 'ChannelMessagesConnection', edges: Array<{ __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, imageUrls?: Array<string> | null, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null }, repliedMessage?: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, authorsConnection: { __typename?: 'InstanceAuthorsConnection', edges: Array<{ __typename?: 'InstanceAuthorsEdge', cursor: string, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } }, instanceUser: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } } };

export type ReorderInstanceMutationVariables = Types.Exact<{
  input: Types.InstanceReorderInput;
  instanceId: Types.Scalars['Uuid'];
  channelsFirst: Types.Scalars['Int'];
  channelsAfter: Types.Scalars['String'];
  likesFirst: Types.Scalars['Int'];
  likesAfter: Types.Scalars['String'];
  authorsFirst: Types.Scalars['Int'];
  authorsAfter: Types.Scalars['String'];
  authorsRoles: Array<Types.Role> | Types.Role;
  messagesLast: Types.Scalars['Int'];
  messagesBefore: Types.Scalars['String'];
}>;


export type ReorderInstanceMutation = { __typename?: 'Mutation', reorderInstance: { __typename?: 'UserInstancesEdge', cursor: string, rank: string, pinned: boolean, likedByMe: boolean, node: { __typename?: 'Instance', id: any, name: string, readAccess: Types.Access, icon: string, createdAt: any, description: string, showAuthor: boolean, showChat: boolean, showLikes: boolean, showComments: boolean, likesCount: number, commentsCount: number, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null }, likesConnection: { __typename?: 'InstanceLikesConnection', edges: Array<{ __typename?: 'InstanceLikesEdge', cursor: string, likedAt: any, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, channelsConnection: { __typename?: 'InstanceChannelsConnection', edges: Array<{ __typename?: 'InstanceChannelsEdge', cursor: string, node: { __typename?: 'Channel', id: any, name: string, rank: string, instanceId: any, readers: Array<Types.Role>, publishers: Array<Types.Role>, createdAt: any, updatedAt: any, lastMessageAddedAt?: any | null, messageCount: number, isCategory: boolean, isComments: boolean, messagesConnection: { __typename?: 'ChannelMessagesConnection', edges: Array<{ __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, imageUrls?: Array<string> | null, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null }, repliedMessage?: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, authorsConnection: { __typename?: 'InstanceAuthorsConnection', edges: Array<{ __typename?: 'InstanceAuthorsEdge', cursor: string, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } }, instanceUser: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } } };

export type PinInstanceMutationVariables = Types.Exact<{
  input: Types.InstancePinInput;
  instanceId: Types.Scalars['Uuid'];
  channelsFirst: Types.Scalars['Int'];
  channelsAfter: Types.Scalars['String'];
  likesFirst: Types.Scalars['Int'];
  likesAfter: Types.Scalars['String'];
  authorsFirst: Types.Scalars['Int'];
  authorsAfter: Types.Scalars['String'];
  authorsRoles: Array<Types.Role> | Types.Role;
  messagesLast: Types.Scalars['Int'];
  messagesBefore: Types.Scalars['String'];
}>;


export type PinInstanceMutation = { __typename?: 'Mutation', pinInstance: { __typename?: 'UserInstancesEdge', cursor: string, rank: string, pinned: boolean, likedByMe: boolean, node: { __typename?: 'Instance', id: any, name: string, readAccess: Types.Access, icon: string, createdAt: any, description: string, showAuthor: boolean, showChat: boolean, showLikes: boolean, showComments: boolean, likesCount: number, commentsCount: number, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null }, likesConnection: { __typename?: 'InstanceLikesConnection', edges: Array<{ __typename?: 'InstanceLikesEdge', cursor: string, likedAt: any, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, channelsConnection: { __typename?: 'InstanceChannelsConnection', edges: Array<{ __typename?: 'InstanceChannelsEdge', cursor: string, node: { __typename?: 'Channel', id: any, name: string, rank: string, instanceId: any, readers: Array<Types.Role>, publishers: Array<Types.Role>, createdAt: any, updatedAt: any, lastMessageAddedAt?: any | null, messageCount: number, isCategory: boolean, isComments: boolean, messagesConnection: { __typename?: 'ChannelMessagesConnection', edges: Array<{ __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, imageUrls?: Array<string> | null, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null }, repliedMessage?: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, authorsConnection: { __typename?: 'InstanceAuthorsConnection', edges: Array<{ __typename?: 'InstanceAuthorsEdge', cursor: string, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } }, instanceUser: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } } };

export declare const addInstance: import("graphql").DocumentNode;
export declare const updateInstance: import("graphql").DocumentNode;
export declare const removeInstance: import("graphql").DocumentNode;
export declare const reorderInstance: import("graphql").DocumentNode;
export declare const pinInstance: import("graphql").DocumentNode;

export function useAddInstanceMutation(options: VueApolloComposable.UseMutationOptions<AddInstanceMutation, AddInstanceMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AddInstanceMutation, AddInstanceMutationVariables>>) {
  return VueApolloComposable.useMutation<AddInstanceMutation, AddInstanceMutationVariables>(Operations.addInstance, options);
}
export type AddInstanceMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AddInstanceMutation, AddInstanceMutationVariables>;
export function useUpdateInstanceMutation(options: VueApolloComposable.UseMutationOptions<UpdateInstanceMutation, UpdateInstanceMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateInstanceMutation, UpdateInstanceMutationVariables>>) {
  return VueApolloComposable.useMutation<UpdateInstanceMutation, UpdateInstanceMutationVariables>(Operations.updateInstance, options);
}
export type UpdateInstanceMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateInstanceMutation, UpdateInstanceMutationVariables>;
export function useRemoveInstanceMutation(options: VueApolloComposable.UseMutationOptions<RemoveInstanceMutation, RemoveInstanceMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RemoveInstanceMutation, RemoveInstanceMutationVariables>>) {
  return VueApolloComposable.useMutation<RemoveInstanceMutation, RemoveInstanceMutationVariables>(Operations.removeInstance, options);
}
export type RemoveInstanceMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RemoveInstanceMutation, RemoveInstanceMutationVariables>;
export function useReorderInstanceMutation(options: VueApolloComposable.UseMutationOptions<ReorderInstanceMutation, ReorderInstanceMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<ReorderInstanceMutation, ReorderInstanceMutationVariables>>) {
  return VueApolloComposable.useMutation<ReorderInstanceMutation, ReorderInstanceMutationVariables>(Operations.reorderInstance, options);
}
export type ReorderInstanceMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<ReorderInstanceMutation, ReorderInstanceMutationVariables>;
export function usePinInstanceMutation(options: VueApolloComposable.UseMutationOptions<PinInstanceMutation, PinInstanceMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<PinInstanceMutation, PinInstanceMutationVariables>>) {
  return VueApolloComposable.useMutation<PinInstanceMutation, PinInstanceMutationVariables>(Operations.pinInstance, options);
}
export type PinInstanceMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<PinInstanceMutation, PinInstanceMutationVariables>;