import * as Types from '../types.gen';

import * as Operations from './channel.js';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type ReactiveFunction<TParam> = () => TParam;
export type ChannelQueryVariables = Types.Exact<{
  id: Types.Scalars['Uuid'];
  messagesLast: Types.Scalars['Int'];
  messagesBefore: Types.Scalars['String'];
}>;


export type ChannelQuery = { __typename?: 'Query', channel: { __typename?: 'Channel', id: any, name: string, rank: string, instanceId: any, readers: Array<Types.Role>, publishers: Array<Types.Role>, createdAt: any, updatedAt: any, lastMessageAddedAt?: any | null, messageCount: number, isCategory: boolean, isComments: boolean, messagesConnection: { __typename?: 'ChannelMessagesConnection', edges: Array<{ __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, repliedMessageId?: any | null, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } };

export declare const channel: import("graphql").DocumentNode;

export function useChannelQuery(variables: ChannelQueryVariables | VueCompositionApi.Ref<ChannelQueryVariables> | ReactiveFunction<ChannelQueryVariables>, options: VueApolloComposable.UseQueryOptions<ChannelQuery, ChannelQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<ChannelQuery, ChannelQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<ChannelQuery, ChannelQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<ChannelQuery, ChannelQueryVariables>(Operations.channel, variables, options);
}
export function useChannelLazyQuery(variables: ChannelQueryVariables | VueCompositionApi.Ref<ChannelQueryVariables> | ReactiveFunction<ChannelQueryVariables>, options: VueApolloComposable.UseQueryOptions<ChannelQuery, ChannelQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<ChannelQuery, ChannelQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<ChannelQuery, ChannelQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<ChannelQuery, ChannelQueryVariables>(Operations.channel, variables, options);
}
export type ChannelQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<ChannelQuery, ChannelQueryVariables>;