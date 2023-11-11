import * as Types from '../types.gen';

import * as Operations from './user.js';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type ReactiveFunction<TParam> = () => TParam;
export type UserQueryVariables = Types.Exact<{
  instancesFirst: Types.Scalars['Int'];
  instancesAfter: Types.Scalars['String'];
  channelsFirst: Types.Scalars['Int'];
  channelsAfter: Types.Scalars['String'];
  likesFirst: Types.Scalars['Int'];
  likesAfter: Types.Scalars['String'];
  authorsFirst: Types.Scalars['Int'];
  authorsAfter: Types.Scalars['String'];
  authorsRoles: Array<Types.Role> | Types.Role;
  messagesLast: Types.Scalars['Int'];
  messagesBefore: Types.Scalars['String'];
  notificationsLast: Types.Scalars['Int'];
  notificationsBefore: Types.Scalars['String'];
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: any, name: string, avatar: string, bio: string, uid: string, instancesConnection: { __typename?: 'UserInstancesConnection', edges: Array<{ __typename?: 'UserInstancesEdge', cursor: string, rank: string, pinned: boolean, likedByMe: boolean, node: { __typename?: 'Instance', id: any, name: string, readAccess: Types.Access, icon: string, createdAt: any, description: string, showAuthor: boolean, showChat: boolean, showLikes: boolean, showComments: boolean, likesCount: number, commentsCount: number, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any }, likesConnection: { __typename?: 'InstanceLikesConnection', edges: Array<{ __typename?: 'InstanceLikesEdge', cursor: string, likedAt: any, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, channelsConnection: { __typename?: 'InstanceChannelsConnection', edges: Array<{ __typename?: 'InstanceChannelsEdge', cursor: string, node: { __typename?: 'Channel', id: any, name: string, rank: string, instanceId: any, readers: Array<Types.Role>, publishers: Array<Types.Role>, createdAt: any, updatedAt: any, lastMessageAddedAt?: any | null, messageCount: number, isCategory: boolean, isComments: boolean, messagesConnection: { __typename?: 'ChannelMessagesConnection', edges: Array<{ __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, authorsConnection: { __typename?: 'InstanceAuthorsConnection', edges: Array<{ __typename?: 'InstanceAuthorsEdge', cursor: string, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } }, instanceUser: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, notificationsConnection: { __typename?: 'UserNotificationsConnection', hasUnread: boolean, edges: Array<{ __typename?: 'UserNotificationsEdge', cursor: string, node: { __typename?: 'Notification', id: any, kind: Types.NotificationKind, createdAt: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any }, instance?: { __typename?: 'Instance', id: any, name: string, readAccess: Types.Access, icon: string, createdAt: any, description: string, showAuthor: boolean, showChat: boolean, showLikes: boolean, showComments: boolean, likesCount: number, commentsCount: number, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any }, likesConnection: { __typename?: 'InstanceLikesConnection', edges: Array<{ __typename?: 'InstanceLikesEdge', cursor: string, likedAt: any, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, channelsConnection: { __typename?: 'InstanceChannelsConnection', edges: Array<{ __typename?: 'InstanceChannelsEdge', cursor: string, node: { __typename?: 'Channel', id: any, name: string, rank: string, instanceId: any, readers: Array<Types.Role>, publishers: Array<Types.Role>, createdAt: any, updatedAt: any, lastMessageAddedAt?: any | null, messageCount: number, isCategory: boolean, isComments: boolean, messagesConnection: { __typename?: 'ChannelMessagesConnection', edges: Array<{ __typename?: 'ChannelMessagesEdge', cursor: string, node: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } }, authorsConnection: { __typename?: 'InstanceAuthorsConnection', edges: Array<{ __typename?: 'InstanceAuthorsEdge', cursor: string, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } | null, message?: { __typename?: 'Message', id: any, text: string, createdAt: any, channelId: any, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } } | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } };

export type UserBadgesQueryVariables = Types.Exact<{
  userId: Types.Scalars['Uuid'];
  badgesFirst: Types.Scalars['Int'];
  badgesAfter: Types.Scalars['String'];
}>;


export type UserBadgesQuery = { __typename?: 'Query', userBadges: { __typename?: 'UserBadgesConnection', edges: Array<{ __typename?: 'UserBadgesEdge', cursor: string, count: number, badgedAt: any, node: { __typename?: 'Badge', id: any, name: string, icon: string } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export declare const user: import("graphql").DocumentNode;
export declare const userBadges: import("graphql").DocumentNode;

export function useUserQuery(variables: UserQueryVariables | VueCompositionApi.Ref<UserQueryVariables> | ReactiveFunction<UserQueryVariables>, options: VueApolloComposable.UseQueryOptions<UserQuery, UserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<UserQuery, UserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<UserQuery, UserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<UserQuery, UserQueryVariables>(Operations.user, variables, options);
}
export function useUserLazyQuery(variables: UserQueryVariables | VueCompositionApi.Ref<UserQueryVariables> | ReactiveFunction<UserQueryVariables>, options: VueApolloComposable.UseQueryOptions<UserQuery, UserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<UserQuery, UserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<UserQuery, UserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<UserQuery, UserQueryVariables>(Operations.user, variables, options);
}
export type UserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<UserQuery, UserQueryVariables>;
export function useUserBadgesQuery(variables: UserBadgesQueryVariables | VueCompositionApi.Ref<UserBadgesQueryVariables> | ReactiveFunction<UserBadgesQueryVariables>, options: VueApolloComposable.UseQueryOptions<UserBadgesQuery, UserBadgesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<UserBadgesQuery, UserBadgesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<UserBadgesQuery, UserBadgesQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<UserBadgesQuery, UserBadgesQueryVariables>(Operations.userBadges, variables, options);
}
export function useUserBadgesLazyQuery(variables: UserBadgesQueryVariables | VueCompositionApi.Ref<UserBadgesQueryVariables> | ReactiveFunction<UserBadgesQueryVariables>, options: VueApolloComposable.UseQueryOptions<UserBadgesQuery, UserBadgesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<UserBadgesQuery, UserBadgesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<UserBadgesQuery, UserBadgesQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<UserBadgesQuery, UserBadgesQueryVariables>(Operations.userBadges, variables, options);
}
export type UserBadgesQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<UserBadgesQuery, UserBadgesQueryVariables>;