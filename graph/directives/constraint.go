package directives

import (
	"context"
	"encoding/json"
	"fmt"
	"unicode/utf8"

	"github.com/99designs/gqlgen/graphql"
)

func ConstraintDirective(ctx context.Context, obj interface{}, next graphql.Resolver, min float64, max float64) (interface{}, error) {

	args := obj.(map[string]interface{})
	fieldName := *graphql.GetPathContext(ctx).Field
	val := args[fieldName]

	switch val.(type) {
	case int64, int32, int16, int8, int:
		i := val.(int64)
		if i < int64(min) || i > int64(max) {
			return nil, fmt.Errorf("integer value out of range")
		}
	case json.Number:
		i, err := val.(json.Number).Float64()
		if err != nil {
			return nil, fmt.Errorf("cant convert number to float")
		}
		if i < float64(min) || i > float64(max) {
			return nil, fmt.Errorf("number value out of range")
		}
	case string:
		s := val.(string)
		count := utf8.RuneCountInString(s)
		if count < int(min) || count > int(max) {
			return nil, fmt.Errorf("text length out of range")
		}
	default:
		return nil, fmt.Errorf("cant apply constraint to this variable of this type")
	}

	return next(ctx)
}
