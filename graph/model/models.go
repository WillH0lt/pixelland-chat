package model

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Base struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()" copier:"Id"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

type User struct {
	Base
	UID                 string          `json:"uid"`
	Name                string          `json:"name"`
	Avatar              string          `json:"avatar"`
	Bio                 string          `json:"bio"`
	InstanceUsers       []*InstanceUser ``
	Notifications       []*Notification ``
	ReadNotificationsAt *time.Time      ``
	Badges              []*Badge        `gorm:"many2many:user_badges;"`
}

type Instance struct {
	Base
	Name        string        `json:"name"`
	Description string        `json:"description"`
	AuthorID    uuid.UUID     `json:"authorId" gorm:"type:uuid" copier:"AuthorID"`
	Author      *InstanceUser `gorm:"constraint:OnDelete:CASCADE;"`
	ReadAccess  string        `json:"readAccess"`
	Icon        string        `json:"icon"`
	// IsGroup          bool            ``
	ShowAuthor       bool            `json:"showAuthor"`
	ShowChat         bool            `json:"showChat"`
	ShowComments     bool            `json:"showComments"`
	ShowLikes        bool            `json:"showLikes"`
	LikesCount       int             `json:"likesCount"`
	CommentsCount    int             `json:"commentsCount"`
	Channels         []*Channel      `gorm:"constraint:OnDelete:CASCADE;"`
	Users            []*InstanceUser `gorm:"constraint:OnDelete:CASCADE;"`
	Invites          []*Invite       `gorm:"constraint:OnDelete:CASCADE;"`
	PrimaryChannelID uuid.UUID       `gorm:"type:uuid"`
	PrimaryChannel   *Channel        ``
}

type Channel struct {
	Base
	AuthorID           uuid.UUID      `json:"authorId" gorm:"type:uuid"`
	Author             *InstanceUser  ``
	Rank               string         `json:"rank"`
	Name               string         `json:"name"`
	InstanceID         uuid.UUID      `json:"instanceId" gorm:"type:uuid" copier:"InstanceId"`
	Instance           *Instance      ``
	Messages           []*Message     `gorm:"constraint:OnDelete:CASCADE;"`
	Publishers         pq.StringArray `json:"publishers" gorm:"type:text[]"`
	Readers            pq.StringArray `json:"readers" gorm:"type:text[]"`
	LastMessageAddedAt *time.Time     `json:"lastMessagedAddedAt"`
	MessageCount       int            `json:"messageCount"`
	IsCategory         bool           `json:"isCategory"`
	IsComments         bool           `json:"isComments"`
}

type Message struct {
	Base
	Text             string        `json:"text"`
	AuthorID         uuid.UUID     `json:"authorId" gorm:"type:uuid" copier:"AuthorId"`
	Author           *InstanceUser ``
	ChannelID        uuid.UUID     `json:"channelId" gorm:"type:uuid" copier:"ChannelId"`
	Channel          *Channel      ``
	RepliedMessageID *uuid.UUID    `json:"repliedMessageId" gorm:"type:uuid" copier:"RepliedMessageId"`
}

type InstanceUser struct {
	Base
	InstanceID uuid.UUID `json:"instanceId" gorm:"type:uuid" copier:"InstanceId"`
	Instance   *Instance
	UserID     uuid.UUID `json:"userId" gorm:"type:uuid" copier:"UserId"`
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
	Base
	InstanceID  uuid.UUID     `json:"instanceId" gorm:"type:uuid" copier:"InstanceId"`
	Instance    *Instance     ``
	AuthorID    uuid.UUID     `json:"authorId" gorm:"type:uuid" copier:"AuthorId"`
	Author      *InstanceUser `gorm:"foreignKey:AuthorID"`
	Code        string        `json:"code"`
	ExpiresAt   *time.Time    `json:"expiresAt"`
	Redemptions *int          `json:"redemptions"`
}

type Notification struct {
	Base
	Kind       string    `json:"kind"`
	UserID     uuid.UUID `json:"userId" gorm:"type:uuid" copier:"UserID"`
	User       *User
	AuthorID   uuid.UUID     `json:"authorId" gorm:"type:uuid" copier:"AuthorId"`
	Author     *InstanceUser ``
	InstanceID *uuid.UUID    `json:"instanceId" gorm:"type:uuid" copier:"InstanceID"`
	Instance   *Instance     ``
	MessageID  *uuid.UUID    `json:"messageId" gorm:"type:uuid" copier:"MessageID"`
	Message    *Message      ``
	ReplyID    *uuid.UUID    `json:"replyId" gorm:"type:uuid" copier:"ReplyID"`
	Reply      *Message      ``
}

type UserBadge struct {
	Base
	UserID  uuid.UUID `gorm:"primaryKey"`
	BadgeID uuid.UUID `gorm:"primaryKey"`
	Badge   *Badge    ``
	Count   int       ``
}

func (u *UserBadge) BeforeCreate(tx *gorm.DB) (err error) {
	u.Count = 1
	return nil
}

type Badge struct {
	Base
	Name string `json:"name"`
	Icon string `json:"icon"`
}

// // used to create resolver, not a db table
// type Author struct {
// 	Base
// 	UserID     uuid.UUID `json:"userId" copier:"UserId"`
// 	InstanceID uuid.UUID `json:"instanceId" copier:"InstanceId"`
// 	Roles      []Role    `json:"roles"`
// 	Name       string    `json:"name"`
// 	Avatar     string    `json:"avatar"`
// 	Bio        string    `json:"bio"`
// }
