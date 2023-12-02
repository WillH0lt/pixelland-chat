import * as Types from '../types.gen';

import * as Operations from './likes.js';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type ReactiveFunction<TParam> = () => TParam;
export type AddLikeMutationVariables = Types.Exact<{
  instanceId: Types.Scalars['Uuid'];
}>;


export type AddLikeMutation = { __typename?: 'Mutation', addLike: { __typename?: 'InstanceLikesEdge', cursor: string, likedAt: any, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } } };

export type RemoveLikeMutationVariables = Types.Exact<{
  instanceId: Types.Scalars['Uuid'];
}>;


export type RemoveLikeMutation = { __typename?: 'Mutation', removeLike: { __typename?: 'InstanceLikesEdge', cursor: string, likedAt: any, node: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any, banReason?: string | null } } };

export declare const addLike: import("graphql").DocumentNode;
export declare const removeLike: import("graphql").DocumentNode;

export function useAddLikeMutation(options: VueApolloComposable.UseMutationOptions<AddLikeMutation, AddLikeMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AddLikeMutation, AddLikeMutationVariables>>) {
  return VueApolloComposable.useMutation<AddLikeMutation, AddLikeMutationVariables>(Operations.addLike, options);
}
export type AddLikeMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AddLikeMutation, AddLikeMutationVariables>;
export function useRemoveLikeMutation(options: VueApolloComposable.UseMutationOptions<RemoveLikeMutation, RemoveLikeMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RemoveLikeMutation, RemoveLikeMutationVariables>>) {
  return VueApolloComposable.useMutation<RemoveLikeMutation, RemoveLikeMutationVariables>(Operations.removeLike, options);
}
export type RemoveLikeMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RemoveLikeMutation, RemoveLikeMutationVariables>;