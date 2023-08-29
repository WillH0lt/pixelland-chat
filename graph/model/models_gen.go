// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"fmt"
	"io"
	"strconv"
	"time"

	"github.com/google/uuid"
)

type Author struct {
	ID         uuid.UUID `json:"id"`
	UserID     uuid.UUID `json:"userId"`
	InstanceID uuid.UUID `json:"instanceId"`
	Roles      []Role    `json:"roles"`
	Name       string    `json:"name"`
	Avatar     string    `json:"avatar"`
	Bio        string    `json:"bio"`
}

type ChannelInput struct {
	Name       string    `json:"name"`
	InstanceID uuid.UUID `json:"instanceId"`
	Publishers []Role    `json:"publishers"`
	Readers    []Role    `json:"readers"`
	IsCategory bool      `json:"isCategory"`
}

type ChannelMessagesConnection struct {
	PageInfo *PageInfo              `json:"pageInfo"`
	Edges    []*ChannelMessagesEdge `json:"edges"`
}

type ChannelMessagesEdge struct {
	Cursor string   `json:"cursor"`
	Node   *Message `json:"node"`
}

type ChannelReorderInput struct {
	PrevChannelID *uuid.UUID `json:"prevChannelId"`
}

type Group struct {
	ID                 uuid.UUID                  `json:"id"`
	ChannelID          uuid.UUID                  `json:"channelId"`
	CreatedAt          time.Time                  `json:"createdAt"`
	Members            []*Author                  `json:"members"`
	MessagesConnection *ChannelMessagesConnection `json:"messagesConnection"`
}

type GroupInput struct {
	Invitees []uuid.UUID `json:"invitees"`
}

type InstanceChannelsConnection struct {
	PageInfo *PageInfo               `json:"pageInfo"`
	Edges    []*InstanceChannelsEdge `json:"edges"`
}

type InstanceChannelsEdge struct {
	Cursor string   `json:"cursor"`
	Node   *Channel `json:"node"`
}

type InstanceInput struct {
	ID          *uuid.UUID `json:"id"`
	Name        string     `json:"name"`
	ReadAccess  Access     `json:"readAccess"`
	Icon        string     `json:"icon"`
	Description string     `json:"description"`
}

type InstancePinInput struct {
	Pinned bool `json:"pinned"`
}

type InstanceReorderInput struct {
	PrevInstanceID *uuid.UUID `json:"prevInstanceId"`
}

type InstanceStreamNotification struct {
	Mutation             MutationType          `json:"mutation"`
	ChannelMessagesEdge  *ChannelMessagesEdge  `json:"channelMessagesEdge"`
	UserInstancesEdge    *UserInstancesEdge    `json:"userInstancesEdge"`
	InstanceChannelsEdge *InstanceChannelsEdge `json:"instanceChannelsEdge"`
	Instance             *Instance             `json:"instance"`
	User                 *User                 `json:"user"`
	Author               *Author               `json:"author"`
}

type InviteInput struct {
	InstanceID  uuid.UUID  `json:"instanceId"`
	ExpiresAt   *time.Time `json:"expiresAt"`
	Redemptions *int       `json:"redemptions"`
}

type MessageInput struct {
	Text      string    `json:"text"`
	ChannelID uuid.UUID `json:"channelId"`
}

type PageInfo struct {
	HasPreviousPage bool `json:"hasPreviousPage"`
	HasNextPage     bool `json:"hasNextPage"`
}

type UserGroupsConnection struct {
	PageInfo *PageInfo         `json:"pageInfo"`
	Edges    []*UserGroupsEdge `json:"edges"`
}

type UserGroupsEdge struct {
	Cursor string `json:"cursor"`
	Node   *Group `json:"node"`
}

type UserInput struct {
	Name   string `json:"name"`
	Avatar string `json:"avatar"`
	Bio    string `json:"bio"`
}

type UserInstancesConnection struct {
	PageInfo *PageInfo            `json:"pageInfo"`
	Edges    []*UserInstancesEdge `json:"edges"`
}

type UserInstancesEdge struct {
	Cursor       string    `json:"cursor"`
	Node         *Instance `json:"node"`
	InstanceUser *Author   `json:"instanceUser"`
	Rank         string    `json:"rank"`
	Pinned       bool      `json:"pinned"`
}

type Access string

const (
	AccessPublic  Access = "PUBLIC"
	AccessPrivate Access = "PRIVATE"
)

var AllAccess = []Access{
	AccessPublic,
	AccessPrivate,
}

func (e Access) IsValid() bool {
	switch e {
	case AccessPublic, AccessPrivate:
		return true
	}
	return false
}

func (e Access) String() string {
	return string(e)
}

func (e *Access) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = Access(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Access", str)
	}
	return nil
}

func (e Access) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type MutationType string

const (
	MutationTypeMessageAdded    MutationType = "MESSAGE_ADDED"
	MutationTypeMessageRemoved  MutationType = "MESSAGE_REMOVED"
	MutationTypeChannelAdded    MutationType = "CHANNEL_ADDED"
	MutationTypeChannelUpdated  MutationType = "CHANNEL_UPDATED"
	MutationTypeChannelRemoved  MutationType = "CHANNEL_REMOVED"
	MutationTypeAuthorUpdated   MutationType = "AUTHOR_UPDATED"
	MutationTypeUserUpdated     MutationType = "USER_UPDATED"
	MutationTypeInstanceUpdated MutationType = "INSTANCE_UPDATED"
	MutationTypeInstanceRemoved MutationType = "INSTANCE_REMOVED"
)

var AllMutationType = []MutationType{
	MutationTypeMessageAdded,
	MutationTypeMessageRemoved,
	MutationTypeChannelAdded,
	MutationTypeChannelUpdated,
	MutationTypeChannelRemoved,
	MutationTypeAuthorUpdated,
	MutationTypeUserUpdated,
	MutationTypeInstanceUpdated,
	MutationTypeInstanceRemoved,
}

func (e MutationType) IsValid() bool {
	switch e {
	case MutationTypeMessageAdded, MutationTypeMessageRemoved, MutationTypeChannelAdded, MutationTypeChannelUpdated, MutationTypeChannelRemoved, MutationTypeAuthorUpdated, MutationTypeUserUpdated, MutationTypeInstanceUpdated, MutationTypeInstanceRemoved:
		return true
	}
	return false
}

func (e MutationType) String() string {
	return string(e)
}

func (e *MutationType) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = MutationType(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid MutationType", str)
	}
	return nil
}

func (e MutationType) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type Role string

const (
	RoleAdmin     Role = "ADMIN"
	RoleModerator Role = "MODERATOR"
	RoleMember    Role = "MEMBER"
	RoleBanned    Role = "BANNED"
	RoleAllUsers  Role = "ALL_USERS"
)

var AllRole = []Role{
	RoleAdmin,
	RoleModerator,
	RoleMember,
	RoleBanned,
	RoleAllUsers,
}

func (e Role) IsValid() bool {
	switch e {
	case RoleAdmin, RoleModerator, RoleMember, RoleBanned, RoleAllUsers:
		return true
	}
	return false
}

func (e Role) String() string {
	return string(e)
}

func (e *Role) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = Role(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Role", str)
	}
	return nil
}

func (e Role) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}