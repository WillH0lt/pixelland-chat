package pixellandchat

import (
	"net/http"

	"github.com/Khan/genqlient/graphql"
)

type authedTransport struct {
	wrapped http.RoundTripper
	token   string
}

func (t *authedTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	req.Header.Set("authorization", "Bearer "+t.token)
	return t.wrapped.RoundTrip(req)
}

func getHttpClient(token string) (*http.Client, error) {
	httpClient := &http.Client{
		Transport: &authedTransport{
			wrapped: http.DefaultTransport,
			token:   token,
		},
	}

	return httpClient, nil
}

func GetClient(apiUrl string, token string) (graphql.Client, error) {
	httpClient, err := getHttpClient(token)
	if err != nil {
		return nil, err
	}

	graphqlClient := graphql.NewClient(apiUrl, httpClient)

	return graphqlClient, nil
}
