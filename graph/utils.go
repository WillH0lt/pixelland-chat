package graph

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"math/rand"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/jinzhu/copier"
	"github.com/rs/zerolog/log"

	"github.com/google/uuid"
	"github.com/wwwillw/pixelland-chat/graph/model"
	"github.com/wwwillw/pixelland-chat/interfaces"
)

func toCursorHash(v interface{}) string {
	switch v.(type) {
	case time.Time:
		return base64.StdEncoding.EncodeToString([]byte("time.Time|" + v.(time.Time).Format(time.RFC3339)))
	case int:
		return base64.StdEncoding.EncodeToString([]byte("int|" + strconv.Itoa(v.(int))))
	case string:
		return base64.StdEncoding.EncodeToString([]byte("string|" + v.(string)))
	default:
		log.Error().Msgf("cannot create cursor from type %T", v)
		return ""
	}
}

func fromCursorHash(cursor string) (interface{}, error) {
	b, err := base64.StdEncoding.DecodeString(cursor)
	if err != nil {
		return nil, err
	}

	t := strings.Split(string(b), "|")
	if len(t) < 2 {
		return nil, fmt.Errorf("invalid cursor")
	}

	switch t[0] {
	case "time.Time":
		return time.Parse(time.RFC3339, t[1])
	case "int":
		return strconv.Atoi(t[1])
	case "string":
		return t[1], nil
	default:
		return nil, fmt.Errorf("can't decode cursor")
	}
}

func hasUnion(a []string, b []string) bool {
	for _, v := range a {
		if contains(b, v) {
			return true
		}
	}

	return false
}

func contains(set []string, val string) bool {
	for _, v := range set {
		if v == val {
			return true
		}
	}

	return false
}

func RemoveFromSlice(slice []string, element string) []string {
	for i := len(slice) - 1; i >= 0; i-- {
		if slice[i] == element {
			slice = append(slice[:i], slice[i+1:]...)
		}
	}

	return slice
}

func assertCanPublish(user model.InstanceUser, channel model.Channel) error {
	if err := assertIsNotBanned(user); err != nil {
		return err
	}
	if contains(channel.Publishers, "ALL_USERS") {
		return nil
	}
	if hasUnion(user.Roles, channel.Publishers) {
		return nil
	}
	return errors.New("You don't have permission to perform this action")
}

func assertCanRead(user model.InstanceUser, channel model.Channel) error {
	if err := assertIsNotBanned(user); err != nil {
		return err
	}
	if contains(channel.Readers, "ALL_USERS") {
		return nil
	}
	if hasUnion(user.Roles, channel.Readers) {
		return nil
	}
	return errors.New("You don't have permission to perform this action")

}

func upsertCaller(ctx context.Context) (*model.User, error) {
	parsed := parseContext(ctx)

	user := model.User{}

	if parsed.Uid == "" {
		return &user, nil
	}
	db := interfaces.GetDatabase()

	if err := db.Where(model.User{UID: parsed.Uid}).FirstOrCreate(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func getCallerInstanceUser(ctx context.Context, instanceId uuid.UUID) (*model.InstanceUser, error) {
	db := interfaces.GetDatabase()

	instance := model.Instance{}
	instance.ID = instanceId
	if err := db.Where(instance).First(&instance).Error; err != nil {
		return nil, err
	}

	parsed := parseContext(ctx)

	if parsed.Uid == "" {
		instanceUser := model.InstanceUser{}
		instanceUser.InstanceID = instanceId
		instanceUser.Instance = &instance
		instanceUser.CreatedAt = time.Now()

		return &instanceUser, nil
	}

	user, err := upsertCaller(ctx)
	if err != nil {
		return nil, err
	}

	instanceUser := model.InstanceUser{
		InstanceID: instanceId,
		UserID:     user.ID,
		Avatar:     user.Avatar,
		Name:       user.Name,
		Bio:        user.Bio,
	}
	if err := db.Where(model.InstanceUser{
		UserID:     user.ID,
		InstanceID: instanceId,
	}).FirstOrCreate(&instanceUser).Error; err != nil {
		return nil, err
	}

	instanceUser.Instance = &instance

	return &instanceUser, nil
}

func sendChannelNotice(streamObservers *sync.Map, channel *model.Channel, kind model.NoticeKind) {
	streamObservers.Range(func(_, v interface{}) bool {
		observer := v.(*StreamObserver)
		if observer.InstanceId == channel.InstanceID && hasUnion(observer.Roles, channel.Readers) {
			notice := createChannelStreamNotice(channel, kind)
			observer.Stream <- notice
		}
		return true
	})
}

func sendLikeNotice(streamObservers *sync.Map, edge *model.InstanceLikesEdge, kind model.NoticeKind) {
	streamObservers.Range(func(_, v interface{}) bool {
		observer := v.(*StreamObserver)
		if observer.InstanceId == edge.Node.InstanceID {
			notice := &model.Notice{
				Kind:              kind,
				InstanceLikesEdge: edge,
			}
			observer.Stream <- notice
		}
		return true
	})
}

func sendMessageNotice(streamObservers *sync.Map, message *model.Message, channel *model.Channel, kind model.NoticeKind) {
	streamObservers.Range(func(_, v interface{}) bool {
		observer := v.(*StreamObserver)
		if observer.InstanceId == channel.InstanceID && hasUnion(observer.Roles, channel.Readers) {
			notice := &model.Notice{
				Kind:                kind,
				ChannelMessagesEdge: createChannelMessagesEdge(message),
			}

			observer.Stream <- notice
		}
		return true
	})
}

func sendAuthorNotice(streamObservers *sync.Map, author *model.Author, kind model.NoticeKind) {
	streamObservers.Range(func(_, v interface{}) bool {
		observer := v.(*StreamObserver)
		if observer.InstanceId == author.InstanceID {
			notice := &model.Notice{
				Kind:   kind,
				Author: author,
			}
			observer.Stream <- notice
		}
		return true
	})
}

func sendInstanceUserNotice(streamObservers *sync.Map, user *model.User, kind model.NoticeKind) {
	streamObservers.Range(func(_, v interface{}) bool {
		observer := v.(*StreamObserver)
		// TODO somehow send to each person who can see the user
		// if observer.instanceId == edge.InstanceID {
		notice := &model.Notice{
			Kind: kind,
			User: user,
		}
		observer.Stream <- notice
		// }
		return true
	})
}

func sendInstanceNotice(streamObservers *sync.Map, instance *model.Instance, kind model.NoticeKind) {
	streamObservers.Range(func(_, v interface{}) bool {
		observer := v.(*StreamObserver)
		if observer.InstanceId == instance.ID {
			notice := &model.Notice{
				Kind:     kind,
				Instance: instance,
			}
			observer.Stream <- notice
		}
		return true
	})
}

func sendUserNotificationNotice(streamObservers *sync.Map, notification *model.Notification) {
	streamObservers.Range(func(_, v interface{}) bool {
		observer := v.(*StreamObserver)
		if observer.UserId == notification.UserID {
			notice := &model.Notice{
				Kind:                  model.NoticeKindNotificationAdded,
				UserNotificationsEdge: createUserNotificationsEdge(notification),
			}
			observer.Stream <- notice
		}

		return true
	})
}

func refreshInstanceStreamRoles(streamObservers *sync.Map, instanceUser *model.InstanceUser) {
	observer, ok := streamObservers.Load(instanceUser.ID)
	if ok {
		roles := append(instanceUser.Roles, model.RoleAllUsers.String())
		observer.(*StreamObserver).Roles = roles
	}
}

func rolesToStrings(roles []model.Role) []string {
	roleStrings := []string{}
	for _, role := range roles {
		roleStrings = append(roleStrings, role.String())
	}
	return roleStrings
}

func stringsToRoles(roleStrings []string) []model.Role {
	roles := []model.Role{}
	for _, roleStr := range roleStrings {
		role := model.Role(roleStr)
		roles = append(roles, role)
	}
	return roles
}

func assertHasRole(roles []string, role model.Role) error {
	if role == model.RoleAllUsers {
		return nil
	}

	hasRole := contains(roles, role.String())
	if !hasRole {
		return errors.New("You don't have permission to perform this action")
	}
	return nil
}

func assertIsAdmin(instanceUser model.InstanceUser) error {
	if err := assertIsNotBanned(instanceUser); err != nil {
		return err
	}
	return assertHasRole(instanceUser.Roles, model.RoleAdmin)
}

func assertIsNotAdmin(instanceUser model.InstanceUser) error {
	if err := assertHasRole(instanceUser.Roles, model.RoleAdmin); err != nil {
		return nil
	} else {
		return errors.New("User is an admin")
	}
}

func assertIsModerator(instanceUser model.InstanceUser) error {
	if err := assertIsNotBanned(instanceUser); err != nil {
		return err
	}
	return assertHasRole(instanceUser.Roles, model.RoleModerator)
}

func assertIsNotBanned(instanceUser model.InstanceUser) error {
	if err := assertHasRole(instanceUser.Roles, model.RoleBanned); err != nil {
		return nil
	} else {
		return errors.New("User is banned from this instance")
	}
}

func createUserInstancesEdge(instanceUser *model.InstanceUser, instance *model.Instance) *model.UserInstancesEdge {
	cursor := toCursorHash(instanceUser.CreatedAt)
	return &model.UserInstancesEdge{
		Cursor:       cursor,
		Node:         instance,
		InstanceUser: instanceUserToAuthor(instanceUser),
		Rank:         instanceUser.Rank,
		Pinned:       instanceUser.Pinned,
		LikedByMe:    instanceUser.LikedByMe,
	}
}

func createUserNotificationsEdge(notification *model.Notification) *model.UserNotificationsEdge {
	cursor := toCursorHash(notification.CreatedAt)

	return &model.UserNotificationsEdge{
		Cursor: cursor,
		Node:   notification,
	}
}

func createInstanceLikesEdge(instanceUser *model.InstanceUser) *model.InstanceLikesEdge {
	cursor := toCursorHash(*instanceUser.LikedAt)

	return &model.InstanceLikesEdge{
		Cursor:  cursor,
		LikedAt: *instanceUser.LikedAt,
		Node:    instanceUserToAuthor(instanceUser),
	}
}

func createInstanceAuthorsEdge(instanceUser *model.InstanceUser) *model.InstanceAuthorsEdge {
	cursor := toCursorHash(*&instanceUser.CreatedAt)

	return &model.InstanceAuthorsEdge{
		Cursor: cursor,
		Node:   instanceUserToAuthor(instanceUser),
	}
}

func createChannelMessagesEdge(message *model.Message) *model.ChannelMessagesEdge {
	cursor := toCursorHash(message.CreatedAt)

	return &model.ChannelMessagesEdge{
		Cursor: cursor,
		Node:   message,
	}
}

func createUserBadgesEdge(userBadge *model.UserBadge) *model.UserBadgesEdge {
	cursor := toCursorHash(userBadge.CreatedAt)

	return &model.UserBadgesEdge{
		Cursor:   cursor,
		Count:    userBadge.Count,
		BadgedAt: userBadge.CreatedAt,
		Node:     userBadge.Badge,
	}
}

func createAppBadgesEdge(badge *model.Badge) *model.AppBadgesEdge {
	cursor := toCursorHash(badge.CreatedAt)

	return &model.AppBadgesEdge{
		Cursor: cursor,
		Node:   badge,
	}
}

func createChannelStreamNotice(channel *model.Channel, kind model.NoticeKind) *model.Notice {
	edge := createInstanceChannelsEdge(channel)
	return &model.Notice{
		Kind:                 kind,
		InstanceChannelsEdge: edge,
	}
}

func createInstanceChannelsEdge(channel *model.Channel) *model.InstanceChannelsEdge {
	cursor := toCursorHash(channel.Rank)

	return &model.InstanceChannelsEdge{
		Cursor: cursor,
		Node:   channel,
	}
}

func populateChannelFromInput(channel *model.Channel, input model.ChannelInput) error {
	// TODO allow multiple roles once custom roles are supported
	if len(input.Readers) != 1 {
		return fmt.Errorf("only one reader role is allowed")
	}
	if len(input.Publishers) != 1 {
		return fmt.Errorf("only one publisher role is allowed")
	}

	channel.Name = input.Name
	channel.Readers = rolesToStrings(input.Readers)
	channel.Publishers = rolesToStrings(input.Publishers)
	channel.InstanceID = input.InstanceID
	channel.IsCategory = input.IsCategory

	return nil
}

func populateInstanceFromInput(instance *model.Instance, input model.InstanceInput) {
	if input.ID != nil {
		instance.ID = *input.ID
	}
	instance.Name = input.Name
	instance.ReadAccess = string(input.ReadAccess)
	instance.Icon = input.Icon
	instance.Description = input.Description
	instance.ShowAuthor = input.ShowAuthor
	instance.ShowChat = input.ShowChat
	instance.ShowComments = input.ShowComments
	instance.ShowLikes = input.ShowLikes
}

func generateInviteCode() string {
	return randString(16)
}

func randString(n int) string {
	letterBytes := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}

func instanceUserToAuthor(instanceUser *model.InstanceUser) *model.Author {
	author := model.Author{}
	copier.Copy(&author, &instanceUser)
	author.Roles = stringsToRoles(instanceUser.Roles)
	return &author
	// return &model.Author{
	// 	ID:         instanceUser.ID,
	// 	UserID:     instanceUser.UserID,
	// 	InstanceID: instanceUser.InstanceID,
	// 	Name:       instanceUser.Name,
	// 	Avatar:     instanceUser.Avatar,
	// 	Bio:        instanceUser.Bio,
	// 	Roles:      stringsToRoles(instanceUser.Roles),
	// 	CreatedAt:  instanceUser.CreatedAt,
	// }
}

func userToInstanceUser(user *model.User, instance model.Instance, roles []string) *model.InstanceUser {
	return &model.InstanceUser{
		UserID:     user.ID,
		InstanceID: instance.ID,
		Instance:   &instance,
		Name:       user.Name,
		Avatar:     user.Avatar,
		Bio:        user.Bio,
		Roles:      roles,
	}
}

type ParsedContext struct {
	Uid    string
	Claims map[string]interface{}
	Token  string
}

func parseContext(ctx context.Context) ParsedContext {

	p := ParsedContext{}

	uidVal := ctx.Value("uid")
	uid, ok := uidVal.(string)
	if ok {
		p.Uid = uid
	}

	claimsVal := ctx.Value("claims")
	claims, ok := claimsVal.(map[string]interface{})
	if ok {
		p.Claims = claims
	}

	tokenVal := ctx.Value("token")
	token, ok := tokenVal.(string)
	if ok {
		p.Token = token
	}

	return p
}

func createNotificationCommentAdded(userID uuid.UUID, message *model.Message) (*model.Notification, error) {
	db := interfaces.GetDatabase()

	if message.Author == nil {
		if err := db.Model(message).Association("Author").Find(&message.Author); err != nil {
			return nil, err
		}
	}

	notification := model.Notification{
		Kind:       model.NotificationKindCommentAdded.String(),
		UserID:     userID,
		AuthorID:   message.Author.ID,
		Author:     message.Author,
		InstanceID: &message.Author.InstanceID,
		MessageID:  &message.ID,
	}

	if err := db.Where(notification).FirstOrCreate(&notification).Error; err != nil {
		return nil, err
	}

	return &notification, nil
}

func createNotificationReplyAdded(message *model.Message, reply *model.Message) (*model.Notification, error) {
	db := interfaces.GetDatabase()

	if message.Author == nil {
		if err := db.Model(message).Association("Author").Find(&message.Author); err != nil {
			return nil, err
		}
	}

	if reply.Author == nil {
		if err := db.Model(reply).Association("Author").Find(&reply.Author); err != nil {
			return nil, err
		}
	}

	notification := model.Notification{
		Kind:       model.NotificationKindReplyAdded.String(),
		UserID:     message.Author.UserID,
		AuthorID:   reply.Author.ID,
		Author:     reply.Author,
		InstanceID: &reply.Author.InstanceID,
		MessageID:  &message.ID,
		ReplyID:    &reply.ID,
	}

	if err := db.Where(notification).FirstOrCreate(&notification).Error; err != nil {
		return nil, err
	}

	return &notification, nil
}

func createNotificationLikeAdded(userID uuid.UUID, author *model.InstanceUser) (*model.Notification, error) {
	db := interfaces.GetDatabase()

	notification := model.Notification{
		Kind:       model.NotificationKindLikeAdded.String(),
		UserID:     userID,
		AuthorID:   author.ID,
		Author:     author,
		InstanceID: &author.InstanceID,
	}

	if err := db.Where(notification).FirstOrCreate(&notification).Error; err != nil {
		return nil, err
	}

	return &notification, nil
}
