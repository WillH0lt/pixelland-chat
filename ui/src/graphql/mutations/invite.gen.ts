import * as Types from '../types.gen';

import * as Operations from './invite.js';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type ReactiveFunction<TParam> = () => TParam;
export type AddInviteMutationVariables = Types.Exact<{
  input: Types.InviteInput;
}>;


export type AddInviteMutation = { __typename?: 'Mutation', addInvite: { __typename?: 'Invite', id: any, instanceId: any, code: string, createdAt: any, expiresAt?: any | null, redemptions?: number | null, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } } };

export type RedeemInviteMutationVariables = Types.Exact<{
  code: Types.Scalars['String'];
}>;


export type RedeemInviteMutation = { __typename?: 'Mutation', redeemInvite: { __typename?: 'Invite', id: any, instanceId: any, code: string, createdAt: any, expiresAt?: any | null, redemptions?: number | null, author: { __typename?: 'Author', id: any, userId: any, instanceId: any, name: string, avatar: string, bio: string, roles: Array<Types.Role>, createdAt: any } } };

export declare const addInvite: import("graphql").DocumentNode;
export declare const redeemInvite: import("graphql").DocumentNode;

export function useAddInviteMutation(options: VueApolloComposable.UseMutationOptions<AddInviteMutation, AddInviteMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AddInviteMutation, AddInviteMutationVariables>>) {
  return VueApolloComposable.useMutation<AddInviteMutation, AddInviteMutationVariables>(Operations.addInvite, options);
}
export type AddInviteMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AddInviteMutation, AddInviteMutationVariables>;
export function useRedeemInviteMutation(options: VueApolloComposable.UseMutationOptions<RedeemInviteMutation, RedeemInviteMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RedeemInviteMutation, RedeemInviteMutationVariables>>) {
  return VueApolloComposable.useMutation<RedeemInviteMutation, RedeemInviteMutationVariables>(Operations.redeemInvite, options);
}
export type RedeemInviteMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RedeemInviteMutation, RedeemInviteMutationVariables>;