package directives

import (
	"context"
	"fmt"

	"github.com/99designs/gqlgen/graphql"
)

func AuthDirective(ctx context.Context, obj interface{}, next graphql.Resolver, required *bool) (interface{}, error) {
	val := ctx.Value("uid")
	uid, ok := val.(string)
	if !ok {
		uid = ""
	}

	if *required && uid == "" {
		return nil, fmt.Errorf("You must be logged in to perform this action")
	}

	// user := &model.User{}
	// user.UID = uid

	// if uid != "" {
	// 	db := common.GetDatabase()
	// 	if err := db.FirstOrCreate(&user, user).Error; err != nil {
	// 		return nil, err
	// 	}
	// }

	return next(context.WithValue(ctx, "uid", uid))
}
