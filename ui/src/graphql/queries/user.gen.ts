import * as Types from '../types.gen';

import * as Operations from './user.js';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type ReactiveFunction<TParam> = () => TParam;
export type UserQueryVariables = Types.Exact<{
  uid: Types.Scalars['String'];
  instancesFirst?: Types.InputMaybe<Types.Scalars['Int']>;
  instancesAfter?: Types.InputMaybe<Types.Scalars['String']>;
  channelsFirst?: Types.InputMaybe<Types.Scalars['Int']>;
  channelsAfter?: Types.InputMaybe<Types.Scalars['String']>;
  likesFirst?: Types.InputMaybe<Types.Scalars['Int']>;
  likesAfter?: Types.InputMaybe<Types.Scalars['String']>;
  messagesLast?: Types.InputMaybe<Types.Scalars['Int']>;
  messagesBefore?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: any, name: string, avatar: string, bio: string, instancesConnection: { __typename?: 'UserInstancesConnection', edges: Array<{ __typename?: 'UserInstancesEdge', cursor: string, rank: string, pinned: boolean, likedByMe: boolean, node: { __typename?: 'Instance', id: any, name: string, readAccess: Types.Access, icon: string, createdAt: any, description: string, showAuthor: boolean, showChat: boolean, showLikes: boolean, showComments: boolean, likesCount: number, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role> }, likesConnection: { __typename?: 'InstanceLikesConnection', edges: Array<{ __typename?: 'InstanceLikesEdge', cursor: string, likedAt: any, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role> } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, channelsConnection: { __typename?: 'InstanceChannelsConnection', edges: Array<{ __typename?: 'InstanceChannelsEdge', cursor: string, node: { __typename?: 'Channel', id: any, name: string, rank: string, instanceId: any, readers: Array<Types.Role>, publishers: Array<Types.Role>, createdAt: any, updatedAt: any, lastMessageAddedAt?: any | null, messageCount: number, isCategory: boolean, isComments: boolean, messagesConnection: { __typename?: 'ChannelMessagesConnection', edges: Array<{ __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role> } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } }, instanceUser: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role> } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } };

export declare const user: import("graphql").DocumentNode;

export function useUserQuery(variables: UserQueryVariables | VueCompositionApi.Ref<UserQueryVariables> | ReactiveFunction<UserQueryVariables>, options: VueApolloComposable.UseQueryOptions<UserQuery, UserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<UserQuery, UserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<UserQuery, UserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<UserQuery, UserQueryVariables>(Operations.user, variables, options);
}
export function useUserLazyQuery(variables: UserQueryVariables | VueCompositionApi.Ref<UserQueryVariables> | ReactiveFunction<UserQueryVariables>, options: VueApolloComposable.UseQueryOptions<UserQuery, UserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<UserQuery, UserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<UserQuery, UserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<UserQuery, UserQueryVariables>(Operations.user, variables, options);
}
export type UserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<UserQuery, UserQueryVariables>;