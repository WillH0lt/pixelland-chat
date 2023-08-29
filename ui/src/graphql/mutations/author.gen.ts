import * as Types from '../types.gen';

import * as Operations from './author.js';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type ReactiveFunction<TParam> = () => TParam;
export type AddRoleMutationVariables = Types.Exact<{
  authorId: Types.Scalars['Uuid'];
  role: Types.Role;
}>;


export type AddRoleMutation = { __typename?: 'Mutation', addRole: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role> } };

export type RemoveRoleMutationVariables = Types.Exact<{
  authorId: Types.Scalars['Uuid'];
  role: Types.Role;
}>;


export type RemoveRoleMutation = { __typename?: 'Mutation', removeRole: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role> } };

export declare const addRole: import("graphql").DocumentNode;
export declare const removeRole: import("graphql").DocumentNode;

export function useAddRoleMutation(options: VueApolloComposable.UseMutationOptions<AddRoleMutation, AddRoleMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AddRoleMutation, AddRoleMutationVariables>>) {
  return VueApolloComposable.useMutation<AddRoleMutation, AddRoleMutationVariables>(Operations.addRole, options);
}
export type AddRoleMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AddRoleMutation, AddRoleMutationVariables>;
export function useRemoveRoleMutation(options: VueApolloComposable.UseMutationOptions<RemoveRoleMutation, RemoveRoleMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RemoveRoleMutation, RemoveRoleMutationVariables>>) {
  return VueApolloComposable.useMutation<RemoveRoleMutation, RemoveRoleMutationVariables>(Operations.removeRole, options);
}
export type RemoveRoleMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RemoveRoleMutation, RemoveRoleMutationVariables>;