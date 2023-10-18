import * as Types from '../types.gen';

import * as Operations from './channel.js';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type ReactiveFunction<TParam> = () => TParam;
export type AddChannelMutationVariables = Types.Exact<{
  input: Types.ChannelInput;
  messagesLast?: Types.InputMaybe<Types.Scalars['Int']>;
  messagesBefore?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type AddChannelMutation = { __typename?: 'Mutation', addChannel: { __typename?: 'InstanceChannelsEdge', cursor: string, node: { __typename?: 'Channel', id: any, name: string, rank: string, instanceId: any, readers: Array<Types.Role>, publishers: Array<Types.Role>, createdAt: any, updatedAt: any, lastMessageAddedAt?: any | null, messageCount: number, isCategory: boolean, isComments: boolean, messagesConnection: { __typename?: 'ChannelMessagesConnection', edges: Array<{ __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } } };

export type UpdateChannelMutationVariables = Types.Exact<{
  input: Types.ChannelInput;
  channelId: Types.Scalars['Uuid'];
  messagesLast?: Types.InputMaybe<Types.Scalars['Int']>;
  messagesBefore?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type UpdateChannelMutation = { __typename?: 'Mutation', updateChannel: { __typename?: 'InstanceChannelsEdge', cursor: string, node: { __typename?: 'Channel', id: any, name: string, rank: string, instanceId: any, readers: Array<Types.Role>, publishers: Array<Types.Role>, createdAt: any, updatedAt: any, lastMessageAddedAt?: any | null, messageCount: number, isCategory: boolean, isComments: boolean, messagesConnection: { __typename?: 'ChannelMessagesConnection', edges: Array<{ __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } } };

export type ReorderChannelMutationVariables = Types.Exact<{
  input: Types.ChannelReorderInput;
  channelId: Types.Scalars['Uuid'];
  messagesLast?: Types.InputMaybe<Types.Scalars['Int']>;
  messagesBefore?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type ReorderChannelMutation = { __typename?: 'Mutation', reorderChannel: { __typename?: 'InstanceChannelsEdge', cursor: string, node: { __typename?: 'Channel', id: any, name: string, rank: string, instanceId: any, readers: Array<Types.Role>, publishers: Array<Types.Role>, createdAt: any, updatedAt: any, lastMessageAddedAt?: any | null, messageCount: number, isCategory: boolean, isComments: boolean, messagesConnection: { __typename?: 'ChannelMessagesConnection', edges: Array<{ __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } } };

export type RemoveChannelMutationVariables = Types.Exact<{
  channelId: Types.Scalars['Uuid'];
  messagesLast?: Types.InputMaybe<Types.Scalars['Int']>;
  messagesBefore?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type RemoveChannelMutation = { __typename?: 'Mutation', removeChannel: { __typename?: 'InstanceChannelsEdge', cursor: string, node: { __typename?: 'Channel', id: any, name: string, rank: string, instanceId: any, readers: Array<Types.Role>, publishers: Array<Types.Role>, createdAt: any, updatedAt: any, lastMessageAddedAt?: any | null, messageCount: number, isCategory: boolean, isComments: boolean, messagesConnection: { __typename?: 'ChannelMessagesConnection', edges: Array<{ __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } } };

export declare const addChannel: import("graphql").DocumentNode;
export declare const updateChannel: import("graphql").DocumentNode;
export declare const reorderChannel: import("graphql").DocumentNode;
export declare const removeChannel: import("graphql").DocumentNode;

export function useAddChannelMutation(options: VueApolloComposable.UseMutationOptions<AddChannelMutation, AddChannelMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AddChannelMutation, AddChannelMutationVariables>>) {
  return VueApolloComposable.useMutation<AddChannelMutation, AddChannelMutationVariables>(Operations.addChannel, options);
}
export type AddChannelMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AddChannelMutation, AddChannelMutationVariables>;
export function useUpdateChannelMutation(options: VueApolloComposable.UseMutationOptions<UpdateChannelMutation, UpdateChannelMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateChannelMutation, UpdateChannelMutationVariables>>) {
  return VueApolloComposable.useMutation<UpdateChannelMutation, UpdateChannelMutationVariables>(Operations.updateChannel, options);
}
export type UpdateChannelMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateChannelMutation, UpdateChannelMutationVariables>;
export function useReorderChannelMutation(options: VueApolloComposable.UseMutationOptions<ReorderChannelMutation, ReorderChannelMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<ReorderChannelMutation, ReorderChannelMutationVariables>>) {
  return VueApolloComposable.useMutation<ReorderChannelMutation, ReorderChannelMutationVariables>(Operations.reorderChannel, options);
}
export type ReorderChannelMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<ReorderChannelMutation, ReorderChannelMutationVariables>;
export function useRemoveChannelMutation(options: VueApolloComposable.UseMutationOptions<RemoveChannelMutation, RemoveChannelMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RemoveChannelMutation, RemoveChannelMutationVariables>>) {
  return VueApolloComposable.useMutation<RemoveChannelMutation, RemoveChannelMutationVariables>(Operations.removeChannel, options);
}
export type RemoveChannelMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RemoveChannelMutation, RemoveChannelMutationVariables>;