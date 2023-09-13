package model

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID            uuid.UUID       `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UID           string          `json:"uid"`
	Name          string          `json:"name"`
	Avatar        string          `json:"avatar"`
	Bio           string          `json:"bio"`
	InstanceUsers []*InstanceUser ``
}

type Instance struct {
	gorm.Model
	ID               uuid.UUID       `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Name             string          `json:"name"`
	Description      string          `json:"description"`
	AuthorID         uuid.UUID       `json:"authorId" gorm:"type:uuid"`
	Author           *InstanceUser   ``
	ReadAccess       string          `json:"readAccess"`
	Icon             string          `json:"icon"`
	IsGroup          bool            ``
	ShowAuthor       bool            `json:"showAuthor"`
	ShowChat         bool            `json:"showChat"`
	ShowComments     bool            `json:"showComments"`
	ShowLikes        bool            `json:"showLikes"`
	LikesCount       int             `json:"likesCount"`
	Channels         []*Channel      ``
	Users            []*InstanceUser ``
	Invites          []*Invite       ``
	PrimaryChannelID uuid.UUID       `gorm:"type:uuid"`
	PrimaryChannel   *Channel        ``
}

type Channel struct {
	gorm.Model
	ID                 uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	AuthorID           uuid.UUID      `json:"authorId" gorm:"type:uuid"`
	Author             *InstanceUser  ``
	Rank               string         `json:"rank"`
	Name               string         `json:"name"`
	InstanceID         uuid.UUID      `json:"instanceId" gorm:"type:uuid"`
	Instance           *Instance      ``
	Messages           []*Message     ``
	Publishers         pq.StringArray `json:"publishers" gorm:"type:text[]"`
	Readers            pq.StringArray `json:"readers" gorm:"type:text[]"`
	LastMessageAddedAt *time.Time     `json:"lastMessagedAddedAt"`
	MessageCount       int            `json:"messageCount"`
	IsCategory         bool           `json:"isCategory"`
	IsComments         bool           `json:"isComments"`
}

type Message struct {
	gorm.Model
	ID        uuid.UUID     `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Text      string        `json:"text"`
	AuthorID  uuid.UUID     `json:"authorId" gorm:"type:uuid"`
	Author    *InstanceUser ``
	ChannelID uuid.UUID     `json:"channelId" gorm:"type:uuid"`
	Channel   *Channel      ``
}

type InstanceUser struct {
	gorm.Model
	ID         uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	InstanceID uuid.UUID `json:"instanceId" gorm:"type:uuid"`
	Instance   *Instance
	UserID     uuid.UUID `json:"userId" gorm:"type:uuid"`
	User       *User
	Name       string         `json:"name"`
	Avatar     string         `json:"avatar"`
	Bio        string         `json:"bio"`
	Roles      pq.StringArray `json:"roles" gorm:"type:text[]"`
	Rank       string         `json:"rank"`
	Pinned     bool           `json:"pinned"`
	LikedByMe  bool           `json:"likedByMe"`
	LikedAt    *time.Time     `json:"likedAt"`
}

type Invite struct {
	gorm.Model
	ID          uuid.UUID     `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	InstanceID  uuid.UUID     `json:"instanceId" gorm:"type:uuid"`
	Instance    *Instance     ``
	AuthorID    uuid.UUID     `json:"authorId" gorm:"type:uuid"`
	Author      *InstanceUser `gorm:"foreignKey:AuthorID"`
	Code        string        `json:"code"`
	ExpiresAt   *time.Time    `json:"expiresAt"`
	Redemptions *int          `json:"redemptions"`
}
