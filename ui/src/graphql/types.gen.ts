export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Time: string;
  Uuid: string;
};

export const Access = {
  Private: 'PRIVATE',
  Public: 'PUBLIC'
} as const;

export type Access = typeof Access[keyof typeof Access];
export type AppBadgesConnection = {
  readonly __typename?: 'AppBadgesConnection';
  readonly edges: ReadonlyArray<AppBadgesEdge>;
  readonly pageInfo: PageInfo;
};

export type AppBadgesEdge = {
  readonly __typename?: 'AppBadgesEdge';
  readonly cursor: Scalars['String'];
  readonly node: Badge;
};

export type Author = {
  readonly __typename?: 'Author';
  readonly avatar: Scalars['String'];
  readonly banReason?: Maybe<Scalars['String']>;
  readonly bio: Scalars['String'];
  readonly createdAt: Scalars['Time'];
  readonly id: Scalars['Uuid'];
  readonly instanceId: Scalars['Uuid'];
  readonly name: Scalars['String'];
  readonly roles: ReadonlyArray<Role>;
  readonly userId: Scalars['Uuid'];
};

export type Badge = {
  readonly __typename?: 'Badge';
  readonly icon: Scalars['String'];
  readonly id: Scalars['Uuid'];
  readonly name: Scalars['String'];
};

export type BadgeInput = {
  readonly icon: Scalars['String'];
  readonly name: Scalars['String'];
};

export type Channel = {
  readonly __typename?: 'Channel';
  readonly createdAt: Scalars['Time'];
  readonly id: Scalars['Uuid'];
  readonly instanceId: Scalars['Uuid'];
  readonly isCategory: Scalars['Boolean'];
  readonly isComments: Scalars['Boolean'];
  readonly lastMessageAddedAt?: Maybe<Scalars['Time']>;
  readonly messageCount: Scalars['Int'];
  readonly messagesConnection: ChannelMessagesConnection;
  readonly name: Scalars['String'];
  readonly publishers: ReadonlyArray<Role>;
  readonly rank: Scalars['String'];
  readonly readers: ReadonlyArray<Role>;
  readonly updatedAt: Scalars['Time'];
};


export type ChannelMessagesConnectionArgs = {
  before?: Scalars['String'];
  last?: Scalars['Int'];
};

export type ChannelInput = {
  readonly instanceId: Scalars['Uuid'];
  readonly isCategory: Scalars['Boolean'];
  readonly name: Scalars['String'];
  readonly publishers: ReadonlyArray<Role>;
  readonly readers: ReadonlyArray<Role>;
};

export type ChannelMessagesConnection = {
  readonly __typename?: 'ChannelMessagesConnection';
  readonly edges: ReadonlyArray<ChannelMessagesEdge>;
  readonly pageInfo: PageInfo;
};

export type ChannelMessagesEdge = {
  readonly __typename?: 'ChannelMessagesEdge';
  readonly cursor: Scalars['String'];
  readonly node: Message;
};

export type ChannelReorderInput = {
  readonly prevChannelId?: InputMaybe<Scalars['Uuid']>;
};

export type Instance = {
  readonly __typename?: 'Instance';
  readonly author: Author;
  readonly authorsConnection: InstanceAuthorsConnection;
  readonly channelsConnection: InstanceChannelsConnection;
  readonly commentsCount: Scalars['Int'];
  readonly createdAt: Scalars['Time'];
  readonly description: Scalars['String'];
  readonly icon: Scalars['String'];
  readonly id: Scalars['Uuid'];
  readonly likesConnection: InstanceLikesConnection;
  readonly likesCount: Scalars['Int'];
  readonly name: Scalars['String'];
  readonly readAccess: Access;
  readonly showAuthor: Scalars['Boolean'];
  readonly showChat: Scalars['Boolean'];
  readonly showComments: Scalars['Boolean'];
  readonly showLikes: Scalars['Boolean'];
};


export type InstanceAuthorsConnectionArgs = {
  after?: Scalars['String'];
  first?: Scalars['Int'];
  roles: ReadonlyArray<Role>;
};


export type InstanceChannelsConnectionArgs = {
  after?: Scalars['String'];
  first?: Scalars['Int'];
};


export type InstanceLikesConnectionArgs = {
  after?: Scalars['String'];
  first?: Scalars['Int'];
};

export type InstanceAuthorsConnection = {
  readonly __typename?: 'InstanceAuthorsConnection';
  readonly edges: ReadonlyArray<InstanceAuthorsEdge>;
  readonly pageInfo: PageInfo;
};

export type InstanceAuthorsEdge = {
  readonly __typename?: 'InstanceAuthorsEdge';
  readonly cursor: Scalars['String'];
  readonly node: Author;
};

export type InstanceChannelsConnection = {
  readonly __typename?: 'InstanceChannelsConnection';
  readonly edges: ReadonlyArray<InstanceChannelsEdge>;
  readonly pageInfo: PageInfo;
};

export type InstanceChannelsEdge = {
  readonly __typename?: 'InstanceChannelsEdge';
  readonly cursor: Scalars['String'];
  readonly node: Channel;
};

export type InstanceInput = {
  readonly description: Scalars['String'];
  readonly icon: Scalars['String'];
  readonly id?: InputMaybe<Scalars['Uuid']>;
  readonly name: Scalars['String'];
  readonly readAccess: Access;
  readonly showAuthor: Scalars['Boolean'];
  readonly showChat: Scalars['Boolean'];
  readonly showComments: Scalars['Boolean'];
  readonly showLikes: Scalars['Boolean'];
};

export type InstanceLikesConnection = {
  readonly __typename?: 'InstanceLikesConnection';
  readonly edges: ReadonlyArray<InstanceLikesEdge>;
  readonly pageInfo: PageInfo;
};

export type InstanceLikesEdge = {
  readonly __typename?: 'InstanceLikesEdge';
  readonly cursor: Scalars['String'];
  readonly likedAt: Scalars['Time'];
  readonly node: Author;
};

export type InstancePinInput = {
  readonly pinned: Scalars['Boolean'];
};

export type InstanceReorderInput = {
  readonly prevInstanceId?: InputMaybe<Scalars['Uuid']>;
};

export type Invite = {
  readonly __typename?: 'Invite';
  readonly author: Author;
  readonly code: Scalars['String'];
  readonly createdAt: Scalars['Time'];
  readonly expiresAt?: Maybe<Scalars['Time']>;
  readonly id: Scalars['Uuid'];
  readonly instance?: Maybe<Instance>;
  readonly instanceId: Scalars['Uuid'];
  readonly redemptions?: Maybe<Scalars['Int']>;
};

export type InviteInput = {
  readonly expiresAt?: InputMaybe<Scalars['Time']>;
  readonly instanceId: Scalars['Uuid'];
  readonly redemptions?: InputMaybe<Scalars['Int']>;
};

export type Message = {
  readonly __typename?: 'Message';
  readonly author: Author;
  readonly channelId: Scalars['Uuid'];
  readonly createdAt: Scalars['Time'];
  readonly id: Scalars['Uuid'];
  readonly imageUrls?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly repliedMessage?: Maybe<Message>;
  readonly text: Scalars['String'];
};

export type MessageInput = {
  readonly channelId: Scalars['Uuid'];
  readonly imageUrls?: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly repliedMessageId?: InputMaybe<Scalars['Uuid']>;
  readonly text: Scalars['String'];
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly addBadge: Badge;
  readonly addChannel: InstanceChannelsEdge;
  readonly addInstance: UserInstancesEdge;
  readonly addInvite: Invite;
  readonly addLike: InstanceLikesEdge;
  readonly addMessage: ChannelMessagesEdge;
  readonly addRole: Author;
  readonly assignBadge: Badge;
  readonly pinInstance: UserInstancesEdge;
  readonly redeemInvite: Invite;
  readonly removeBadge: Badge;
  readonly removeChannel: InstanceChannelsEdge;
  readonly removeInstance: UserInstancesEdge;
  readonly removeInvite: Invite;
  readonly removeLike: InstanceLikesEdge;
  readonly removeMessage: ChannelMessagesEdge;
  readonly removeRole: Author;
  readonly reorderChannel: InstanceChannelsEdge;
  readonly reorderInstance: UserInstancesEdge;
  readonly unassignBadge: Badge;
  readonly updateBadge: Badge;
  readonly updateChannel: InstanceChannelsEdge;
  readonly updateInstance: UserInstancesEdge;
  readonly updateUser: User;
};


export type MutationAddBadgeArgs = {
  input: BadgeInput;
};


export type MutationAddChannelArgs = {
  input: ChannelInput;
};


export type MutationAddInstanceArgs = {
  input: InstanceInput;
};


export type MutationAddInviteArgs = {
  input: InviteInput;
};


export type MutationAddLikeArgs = {
  instanceId: Scalars['Uuid'];
};


export type MutationAddMessageArgs = {
  input: MessageInput;
};


export type MutationAddRoleArgs = {
  authorId: Scalars['Uuid'];
  banReason?: InputMaybe<Scalars['String']>;
  role: Role;
};


export type MutationAssignBadgeArgs = {
  badgeId: Scalars['Uuid'];
  userId: Scalars['Uuid'];
};


export type MutationPinInstanceArgs = {
  input: InstancePinInput;
  instanceId: Scalars['Uuid'];
};


export type MutationRedeemInviteArgs = {
  code: Scalars['String'];
};


export type MutationRemoveBadgeArgs = {
  badgeId: Scalars['Uuid'];
};


export type MutationRemoveChannelArgs = {
  channelId: Scalars['Uuid'];
};


export type MutationRemoveInstanceArgs = {
  instanceId: Scalars['Uuid'];
};


export type MutationRemoveInviteArgs = {
  inviteId: Scalars['Uuid'];
};


export type MutationRemoveLikeArgs = {
  instanceId: Scalars['Uuid'];
};


export type MutationRemoveMessageArgs = {
  messageId: Scalars['Uuid'];
};


export type MutationRemoveRoleArgs = {
  authorId: Scalars['Uuid'];
  role: Role;
};


export type MutationReorderChannelArgs = {
  channelId: Scalars['Uuid'];
  input: ChannelReorderInput;
};


export type MutationReorderInstanceArgs = {
  input: InstanceReorderInput;
  instanceId: Scalars['Uuid'];
};


export type MutationUnassignBadgeArgs = {
  badgeId: Scalars['Uuid'];
  userId: Scalars['Uuid'];
};


export type MutationUpdateBadgeArgs = {
  badgeId: Scalars['Uuid'];
  input: BadgeInput;
};


export type MutationUpdateChannelArgs = {
  channelId: Scalars['Uuid'];
  input: ChannelInput;
};


export type MutationUpdateInstanceArgs = {
  input: InstanceInput;
  instanceId: Scalars['Uuid'];
};


export type MutationUpdateUserArgs = {
  input: UserInput;
};

export type Notice = {
  readonly __typename?: 'Notice';
  readonly author?: Maybe<Author>;
  readonly badge?: Maybe<Badge>;
  readonly channelMessagesEdge?: Maybe<ChannelMessagesEdge>;
  readonly instance?: Maybe<Instance>;
  readonly instanceChannelsEdge?: Maybe<InstanceChannelsEdge>;
  readonly instanceLikesEdge?: Maybe<InstanceLikesEdge>;
  readonly kind: NoticeKind;
  readonly user?: Maybe<User>;
  readonly userInstancesEdge?: Maybe<UserInstancesEdge>;
  readonly userNotificationsEdge?: Maybe<UserNotificationsEdge>;
};

export const NoticeKind = {
  AuthorUpdated: 'AUTHOR_UPDATED',
  BadgeAdded: 'BADGE_ADDED',
  ChannelAdded: 'CHANNEL_ADDED',
  ChannelRemoved: 'CHANNEL_REMOVED',
  ChannelUpdated: 'CHANNEL_UPDATED',
  InstanceRemoved: 'INSTANCE_REMOVED',
  InstanceUpdated: 'INSTANCE_UPDATED',
  LikeAdded: 'LIKE_ADDED',
  LikeRemoved: 'LIKE_REMOVED',
  MessageAdded: 'MESSAGE_ADDED',
  MessageRemoved: 'MESSAGE_REMOVED',
  NotificationAdded: 'NOTIFICATION_ADDED',
  UserUpdated: 'USER_UPDATED'
} as const;

export type NoticeKind = typeof NoticeKind[keyof typeof NoticeKind];
export type Notification = {
  readonly __typename?: 'Notification';
  readonly author?: Maybe<Author>;
  readonly badge?: Maybe<Badge>;
  readonly createdAt: Scalars['Time'];
  readonly id: Scalars['Uuid'];
  readonly instance?: Maybe<Instance>;
  readonly kind: NotificationKind;
  readonly message?: Maybe<Message>;
  readonly reply?: Maybe<Message>;
};

export const NotificationKind = {
  BadgeAdded: 'BADGE_ADDED',
  CommentAdded: 'COMMENT_ADDED',
  LikeAdded: 'LIKE_ADDED',
  ReplyAdded: 'REPLY_ADDED'
} as const;

export type NotificationKind = typeof NotificationKind[keyof typeof NotificationKind];
export type PageInfo = {
  readonly __typename?: 'PageInfo';
  readonly hasNextPage: Scalars['Boolean'];
  readonly hasPreviousPage: Scalars['Boolean'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly author: Author;
  readonly badges: AppBadgesConnection;
  readonly channel: Channel;
  readonly checkInvite: Invite;
  readonly instance: UserInstancesEdge;
  readonly instanceUserListByIds: ReadonlyArray<Author>;
  readonly invite: Invite;
  readonly user: User;
  readonly userBadges: UserBadgesConnection;
};


export type QueryAuthorArgs = {
  id: Scalars['Uuid'];
};


export type QueryBadgesArgs = {
  after?: Scalars['String'];
  first?: Scalars['Int'];
};


export type QueryChannelArgs = {
  id: Scalars['Uuid'];
};


export type QueryCheckInviteArgs = {
  code: Scalars['String'];
};


export type QueryInstanceArgs = {
  id: Scalars['Uuid'];
};


export type QueryInstanceUserListByIdsArgs = {
  instanceId: Scalars['Uuid'];
  instanceUserIds: ReadonlyArray<Scalars['Uuid']>;
};


export type QueryInviteArgs = {
  instanceId: Scalars['Uuid'];
};


export type QueryUserBadgesArgs = {
  after?: Scalars['String'];
  first?: Scalars['Int'];
  userId: Scalars['Uuid'];
};

export const Role = {
  Admin: 'ADMIN',
  AllUsers: 'ALL_USERS',
  Banned: 'BANNED',
  Member: 'MEMBER',
  Moderator: 'MODERATOR'
} as const;

export type Role = typeof Role[keyof typeof Role];
export type Subscription = {
  readonly __typename?: 'Subscription';
  readonly stream: Notice;
};


export type SubscriptionStreamArgs = {
  instanceId: Scalars['Uuid'];
};

export type User = {
  readonly __typename?: 'User';
  readonly avatar: Scalars['String'];
  readonly bio: Scalars['String'];
  readonly id: Scalars['Uuid'];
  readonly instancesConnection: UserInstancesConnection;
  readonly name: Scalars['String'];
  readonly notificationsConnection: UserNotificationsConnection;
  readonly uid: Scalars['String'];
};


export type UserInstancesConnectionArgs = {
  after?: Scalars['String'];
  first?: Scalars['Int'];
};


export type UserNotificationsConnectionArgs = {
  before?: Scalars['String'];
  last?: Scalars['Int'];
};

export type UserBadgesConnection = {
  readonly __typename?: 'UserBadgesConnection';
  readonly edges: ReadonlyArray<UserBadgesEdge>;
  readonly pageInfo: PageInfo;
};

export type UserBadgesEdge = {
  readonly __typename?: 'UserBadgesEdge';
  readonly badgedAt: Scalars['Time'];
  readonly count: Scalars['Int'];
  readonly cursor: Scalars['String'];
  readonly node: Badge;
};

export type UserInput = {
  readonly avatar: Scalars['String'];
  readonly bio: Scalars['String'];
  readonly name: Scalars['String'];
};

export type UserInstancesConnection = {
  readonly __typename?: 'UserInstancesConnection';
  readonly edges: ReadonlyArray<UserInstancesEdge>;
  readonly pageInfo: PageInfo;
};

export type UserInstancesEdge = {
  readonly __typename?: 'UserInstancesEdge';
  readonly cursor: Scalars['String'];
  readonly instanceUser: Author;
  readonly likedByMe: Scalars['Boolean'];
  readonly node: Instance;
  readonly pinned: Scalars['Boolean'];
  readonly rank: Scalars['String'];
};

export type UserNotificationsConnection = {
  readonly __typename?: 'UserNotificationsConnection';
  readonly edges: ReadonlyArray<UserNotificationsEdge>;
  readonly hasUnread: Scalars['Boolean'];
  readonly pageInfo: PageInfo;
};

export type UserNotificationsEdge = {
  readonly __typename?: 'UserNotificationsEdge';
  readonly cursor: Scalars['String'];
  readonly node: Notification;
};
