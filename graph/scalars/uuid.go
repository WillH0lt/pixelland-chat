package scalars

import (
	"io"
	"strconv"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"
)

func MarshalUuid(id uuid.UUID) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		io.WriteString(w, strconv.Quote(id.String()))
	})
}

func UnmarshalUuid(v interface{}) (uuid.UUID, error) {
	return uuid.Parse(v.(string))
}
