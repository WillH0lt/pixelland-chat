package directives

import (
	"context"
	"fmt"

	"github.com/99designs/gqlgen/graphql"
)

func AuthDirective(ctx context.Context, obj interface{}, next graphql.Resolver, accessLevel string) (interface{}, error) {
	val := ctx.Value("uid")
	uid, ok := val.(string)
	if !ok {
		uid = ""
	}

	claims, ok := ctx.Value("claims").(map[string]interface{})
	if !ok {
		claims = map[string]interface{}{}
	}

	if accessLevel == "admin" && claims["admin"] != true {
		return nil, fmt.Errorf("You must be an admin to perform this action")
	} else if accessLevel == "user" && uid == "" {
		return nil, fmt.Errorf("You must be logged in to perform this action")
	}

	return next(ctx)
}
