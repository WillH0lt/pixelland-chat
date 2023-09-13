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

	"github.com/rs/zerolog/log"

	"github.com/google/uuid"
	"github.com/wwwillw/pixelland-chat/graph/model"
	"github.com/wwwillw/pixelland-chat/interfaces"
)

func toCursorHash(v interface{}) (string, error) {
	switch v.(type) {
	case time.Time:
		return base64.StdEncoding.EncodeToString([]byte("time.Time|" + v.(time.Time).Format(time.RFC3339))), nil
	case int:
		return base64.StdEncoding.EncodeToString([]byte("int|" + strconv.Itoa(v.(int)))), nil
	case string:
		return base64.StdEncoding.EncodeToString([]byte("string|" + v.(string))), nil
	default:
		return "", fmt.Errorf("cannot create cursor from type %T", v)
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
	uid := ctx.Value("uid").(string)
	user := model.User{}

	if uid == "" {
		return &user, nil
	}
	db := interfaces.GetDatabase()

	if err := db.Where(model.User{UID: uid}).FirstOrCreate(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func getCallerInstanceUser(ctx context.Context, instanceId uuid.UUID) (*model.InstanceUser, error) {
	db := interfaces.GetDatabase()

	instance := model.Instance{}
	if err := db.Where(model.Instance{ID: instanceId}).First(&instance).Error; err != nil {
		return nil, err
	}

	uid := ctx.Value("uid").(string)
	if uid == "" {
		return &model.InstanceUser{
			InstanceID: instanceId,
			Instance:   &instance,
		}, nil
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

func sendChannelNotification(instanceStreamObservers sync.Map, channel *model.Channel, mutationType model.MutationType) {
	instanceStreamObservers.Range(func(_, v interface{}) bool {
		observer := v.(*InstanceStreamObserver)
		if observer.instanceId == channel.InstanceID && hasUnion(observer.roles, channel.Readers) {
			notification, err := createChannelStreamNotification(channel, mutationType)
			if err != nil {
				return false
			}
			observer.stream <- notification
		}
		return true
	})
}

func sendLikeNotification(instanceStreamObservers sync.Map, edge *model.InstanceLikesEdge, mutationType model.MutationType) {
	instanceStreamObservers.Range(func(_, v interface{}) bool {
		observer := v.(*InstanceStreamObserver)
		if observer.instanceId == edge.Node.InstanceID {
			notification, err := createLikeStreamNotification(edge, mutationType)
			if err != nil {
				return false
			}
			observer.stream <- notification
		}
		return true
	})
}

func sendMessageNotification(instanceStreamObservers sync.Map, message *model.Message, channel *model.Channel, mutationType model.MutationType) {
	instanceStreamObservers.Range(func(_, v interface{}) bool {
		observer := v.(*InstanceStreamObserver)
		if observer.instanceId == channel.InstanceID && hasUnion(observer.roles, channel.Readers) {
			notification, err := createMessageStreamNotification(message, mutationType)
			if err != nil {
				return false
			}
			observer.stream <- notification
		}
		return true
	})
}

func sendAuthorNotification(instanceStreamObservers sync.Map, author *model.Author, mutationType model.MutationType) {
	instanceStreamObservers.Range(func(_, v interface{}) bool {
		observer := v.(*InstanceStreamObserver)
		if observer.instanceId == author.InstanceID {
			notification := &model.InstanceStreamNotification{
				Mutation: mutationType,
				Author:   author,
			}
			observer.stream <- notification
		}
		return true
	})
}

func sendUserNotification(instanceStreamObservers sync.Map, user *model.User, mutationType model.MutationType) {
	instanceStreamObservers.Range(func(_, v interface{}) bool {
		observer := v.(*InstanceStreamObserver)
		// TODO somehow send to each person who can see the user
		// if observer.instanceId == edge.InstanceID {
		notification := &model.InstanceStreamNotification{
			Mutation: mutationType,
			User:     user,
		}
		observer.stream <- notification
		// }
		return true
	})
}

func sendInstanceNotification(instanceStreamObservers sync.Map, instance *model.Instance, mutationType model.MutationType) {
	instanceStreamObservers.Range(func(_, v interface{}) bool {
		observer := v.(*InstanceStreamObserver)
		log.Info().Msgf("UpdateInstance: %+v", instance)
		if observer.instanceId == instance.ID {
			notification := &model.InstanceStreamNotification{
				Mutation: mutationType,
				Instance: instance,
			}
			observer.stream <- notification
		}
		return true
	})
}

func refreshInstanceStreamRoles(instanceStreamObservers sync.Map, instanceUser *model.InstanceUser) {
	observer, ok := instanceStreamObservers.Load(instanceUser.ID)
	if ok {
		roles := append(instanceUser.Roles, model.RoleAllUsers.String())
		observer.(*InstanceStreamObserver).roles = roles
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

func createUserInstancesEdge(instanceUser *model.InstanceUser, instance *model.Instance) (*model.UserInstancesEdge, error) {
	cursor, err := toCursorHash(instanceUser.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &model.UserInstancesEdge{
		Cursor:       cursor,
		Node:         instance,
		InstanceUser: instanceUserToAuthor(instanceUser),
		Rank:         instanceUser.Rank,
		Pinned:       instanceUser.Pinned,
		LikedByMe:    instanceUser.LikedByMe,
	}, nil
}

func createInstanceLikesEdge(instanceUser *model.InstanceUser) (*model.InstanceLikesEdge, error) {
	cursor, err := toCursorHash(*instanceUser.LikedAt)
	if err != nil {
		return nil, err
	}
	return &model.InstanceLikesEdge{
		Cursor:  cursor,
		LikedAt: *instanceUser.LikedAt,
		Node:    instanceUserToAuthor(instanceUser),
	}, nil
}

func createUserGroupsEdge(instance *model.Instance, members []*model.InstanceUser) (*model.UserGroupsEdge, error) {
	cursor, err := toCursorHash(instance.UpdatedAt)
	if err != nil {
		return nil, err
	}

	memberAuthors := []*model.Author{}
	for _, member := range members {
		memberAuthor := instanceUserToAuthor(member)
		memberAuthors = append(memberAuthors, memberAuthor)
	}

	return &model.UserGroupsEdge{
		Cursor: cursor,
		Node: &model.Group{
			ID:        instance.ID,
			ChannelID: instance.PrimaryChannelID,
			CreatedAt: instance.CreatedAt,
			Members:   memberAuthors,
		},
	}, nil
}

func createChannelMessagesEdge(message *model.Message) (*model.ChannelMessagesEdge, error) {
	cursor, err := toCursorHash(message.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &model.ChannelMessagesEdge{
		Cursor: cursor,
		Node:   message,
	}, nil
}

func createLikeStreamNotification(edge *model.InstanceLikesEdge, mutation model.MutationType) (*model.InstanceStreamNotification, error) {
	return &model.InstanceStreamNotification{
		Mutation:          mutation,
		InstanceLikesEdge: edge,
	}, nil
}

func createMessageStreamNotification(message *model.Message, mutation model.MutationType) (*model.InstanceStreamNotification, error) {
	edge, err := createChannelMessagesEdge(message)
	if err != nil {
		return nil, err
	}

	return &model.InstanceStreamNotification{
		Mutation:            mutation,
		ChannelMessagesEdge: edge,
	}, nil
}

func createInstanceChannelsEdge(channel *model.Channel) (*model.InstanceChannelsEdge, error) {
	cursor, err := toCursorHash(channel.Rank)
	if err != nil {
		return nil, err
	}

	return &model.InstanceChannelsEdge{
		Cursor: cursor,
		Node:   channel,
	}, nil
}

func createChannelStreamNotification(channel *model.Channel, mutation model.MutationType) (*model.InstanceStreamNotification, error) {
	edge, err := createInstanceChannelsEdge(channel)
	if err != nil {
		return nil, err
	}

	return &model.InstanceStreamNotification{
		Mutation:             mutation,
		InstanceChannelsEdge: edge,
	}, nil
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

func populateInstanceFromInput(instance *model.Instance, input model.InstanceInput) error {
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

	return nil
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
	return &model.Author{
		ID:         instanceUser.ID,
		UserID:     instanceUser.UserID,
		InstanceID: instanceUser.InstanceID,
		Name:       instanceUser.Name,
		Avatar:     instanceUser.Avatar,
		Bio:        instanceUser.Bio,
		Roles:      stringsToRoles(instanceUser.Roles),
	}
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
