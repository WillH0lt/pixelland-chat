import * as Types from '../types.gen';

import * as Operations from './message.js';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type ReactiveFunction<TParam> = () => TParam;
export type AddMessageMutationVariables = Types.Exact<{
  input: Types.MessageInput;
}>;


export type AddMessageMutation = { __typename?: 'Mutation', addMessage: { __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, imageUrls?: Array<string> | null, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null }, repliedMessage?: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } } | null } } };

export type RemoveMessageMutationVariables = Types.Exact<{
  messageId: Types.Scalars['Uuid'];
}>;


export type RemoveMessageMutation = { __typename?: 'Mutation', removeMessage: { __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, imageUrls?: Array<string> | null, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null }, repliedMessage?: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } } | null } } };

export declare const addMessage: import("graphql").DocumentNode;
export declare const removeMessage: import("graphql").DocumentNode;

export function useAddMessageMutation(options: VueApolloComposable.UseMutationOptions<AddMessageMutation, AddMessageMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AddMessageMutation, AddMessageMutationVariables>>) {
  return VueApolloComposable.useMutation<AddMessageMutation, AddMessageMutationVariables>(Operations.addMessage, options);
}
export type AddMessageMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AddMessageMutation, AddMessageMutationVariables>;
export function useRemoveMessageMutation(options: VueApolloComposable.UseMutationOptions<RemoveMessageMutation, RemoveMessageMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RemoveMessageMutation, RemoveMessageMutationVariables>>) {
  return VueApolloComposable.useMutation<RemoveMessageMutation, RemoveMessageMutationVariables>(Operations.removeMessage, options);
}
export type RemoveMessageMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RemoveMessageMutation, RemoveMessageMutationVariables>;