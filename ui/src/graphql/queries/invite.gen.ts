import * as Types from '../types.gen';

import * as Operations from './invite.js';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type ReactiveFunction<TParam> = () => TParam;
export type InviteQueryVariables = Types.Exact<{
  instanceId: Types.Scalars['Uuid'];
}>;


export type InviteQuery = { __typename?: 'Query', invite: { __typename?: 'Invite', id: any, instanceId: any, code: string, createdAt: any, expiresAt?: any | null, redemptions?: number | null, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role> } } };

export type CheckInviteQueryVariables = Types.Exact<{
  code: Types.Scalars['String'];
  channelsFirst?: Types.InputMaybe<Types.Scalars['Int']>;
  channelsAfter?: Types.InputMaybe<Types.Scalars['String']>;
  messagesLast?: Types.InputMaybe<Types.Scalars['Int']>;
  messagesBefore?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type CheckInviteQuery = { __typename?: 'Query', checkInvite: { __typename?: 'Invite', id: any, instanceId: any, code: string, createdAt: any, expiresAt?: any | null, redemptions?: number | null, instance?: { __typename?: 'Instance', id: any, name: string, readAccess: Types.Access, icon: string, createdAt: any, description: string, showAuthor: boolean, showChat: boolean, showLikes: boolean, showComments: boolean, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role> }, channelsConnection: { __typename?: 'InstanceChannelsConnection', edges: Array<{ __typename?: 'InstanceChannelsEdge', cursor: string, node: { __typename?: 'Channel', id: any, name: string, rank: string, instanceId: any, readers: Array<Types.Role>, publishers: Array<Types.Role>, createdAt: any, updatedAt: any, lastMessageAddedAt?: any | null, messageCount: number, isCategory: boolean, isComments: boolean, messagesConnection: { __typename?: 'ChannelMessagesConnection', edges: Array<{ __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role> } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } | null, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role> } } };

export declare const invite: import("graphql").DocumentNode;
export declare const checkInvite: import("graphql").DocumentNode;

export function useInviteQuery(variables: InviteQueryVariables | VueCompositionApi.Ref<InviteQueryVariables> | ReactiveFunction<InviteQueryVariables>, options: VueApolloComposable.UseQueryOptions<InviteQuery, InviteQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<InviteQuery, InviteQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<InviteQuery, InviteQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<InviteQuery, InviteQueryVariables>(Operations.invite, variables, options);
}
export function useInviteLazyQuery(variables: InviteQueryVariables | VueCompositionApi.Ref<InviteQueryVariables> | ReactiveFunction<InviteQueryVariables>, options: VueApolloComposable.UseQueryOptions<InviteQuery, InviteQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<InviteQuery, InviteQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<InviteQuery, InviteQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<InviteQuery, InviteQueryVariables>(Operations.invite, variables, options);
}
export type InviteQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<InviteQuery, InviteQueryVariables>;
export function useCheckInviteQuery(variables: CheckInviteQueryVariables | VueCompositionApi.Ref<CheckInviteQueryVariables> | ReactiveFunction<CheckInviteQueryVariables>, options: VueApolloComposable.UseQueryOptions<CheckInviteQuery, CheckInviteQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<CheckInviteQuery, CheckInviteQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<CheckInviteQuery, CheckInviteQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<CheckInviteQuery, CheckInviteQueryVariables>(Operations.checkInvite, variables, options);
}
export function useCheckInviteLazyQuery(variables: CheckInviteQueryVariables | VueCompositionApi.Ref<CheckInviteQueryVariables> | ReactiveFunction<CheckInviteQueryVariables>, options: VueApolloComposable.UseQueryOptions<CheckInviteQuery, CheckInviteQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<CheckInviteQuery, CheckInviteQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<CheckInviteQuery, CheckInviteQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<CheckInviteQuery, CheckInviteQueryVariables>(Operations.checkInvite, variables, options);
}
export type CheckInviteQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<CheckInviteQuery, CheckInviteQueryVariables>;