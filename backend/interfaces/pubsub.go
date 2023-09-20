package interfaces

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
	"strings"

	"cloud.google.com/go/pubsub"
	"github.com/rs/zerolog/log"
	"github.com/wwwillw/pixelland-chat/graph/model"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/compute/v1"
)

var pubsubClient *PubsubClient

type PubsubConfig struct {
	ServiceAccountPath  string
	AuthorEventsTopic   string
	InstanceEventsTopic string
	// UserEventsTopic     string
	Active bool
}

type PubsubClient struct {
	client *pubsub.Client
	config PubsubConfig
}

func InitPubSubClient(ctx context.Context, config PubsubConfig) error {

	pubsubClient = &PubsubClient{
		client: nil,
		config: config,
	}

	if !config.Active {
		log.Info().Msg("Pubsub client is not active")
		return nil
	}

	var credentials *google.Credentials
	if _, err := os.Stat(config.ServiceAccountPath); err == nil {
		bytes, err := ioutil.ReadFile(config.ServiceAccountPath)
		if err != nil {
			return err
		}

		credentials, err = google.CredentialsFromJSON(ctx, bytes, compute.ComputeScope)
		if err != nil {
			return err
		}
	} else if errors.Is(err, os.ErrNotExist) {
		credentials, err = google.FindDefaultCredentials(ctx, compute.ComputeScope)
		if err != nil {
			return err
		}
	} else {
		return err
	}

	client, err := pubsub.NewClient(ctx, credentials.ProjectID)
	if err != nil {
		return err
	}
	pubsubClient.client = client

	return nil
}

func createTopicIfNotExists(ctx context.Context, client *pubsub.Client, name string) (*pubsub.Topic, error) {
	topic := client.Topic(name)
	ok, err := topic.Exists(ctx)
	if err != nil {
		log.Err(err)
		return nil, err
	}
	if ok {
		return topic, nil
	}
	topic, err = client.CreateTopic(ctx, name)
	if err != nil {
		log.Err(err).Msg("Failed to create the topic")
		return nil, err
	}
	return topic, nil
}

// func (c *PubsubClient) PublishUserEvent(ctx context.Context, kind model.NoticeKind, user model.User) error {

// 	if !c.config.Active {
// 		log.Info().Msg("Not publishing user event because pubsub client is not active")
// 		return nil
// 	}

// 	kindStr := string(kind)
// 	if !strings.Contains(kindStr, "USER") {
// 		return errors.New("Invalid notice kind, must be a user notice")
// 	}

// 	return c.publishPubsubEvent(ctx, kind, uuid.Nil.String(), user)
// }

func (c *PubsubClient) PublishAuthorEvent(ctx context.Context, kind model.NoticeKind, author model.Author) error {

	if !c.config.Active {
		log.Info().Msg("Not publishing author event because pubsub client is not active")
		return nil
	}

	kindStr := string(kind)
	if !strings.Contains(kindStr, "AUTHOR") {
		return errors.New("Invalid mutation type, must be author mutation")
	}

	return c.publishPubsubEvent(ctx, kind, author.InstanceID.String(), author)
}

func (c *PubsubClient) PublishInstanceEvent(ctx context.Context, kind model.NoticeKind, instance model.Instance) error {

	if !c.config.Active {
		log.Info().Msg("Not publishing instance event because pubsub client is not active")
		return nil
	}

	kindStr := string(kind)
	if !strings.Contains(kindStr, "INSTANCE") {
		return errors.New("Invalid mutation type, must be instance mutation")
	}

	return c.publishPubsubEvent(ctx, kind, instance.ID.String(), instance)
}

func (c *PubsubClient) publishPubsubEvent(ctx context.Context, kind model.NoticeKind, instanceID string, model interface{}) error {
	kindStr := string(kind)

	var topicName string
	if strings.Contains(kindStr, "INSTANCE") {
		topicName = c.config.InstanceEventsTopic
	} else if strings.Contains(kindStr, "AUTHOR") {
		topicName = c.config.AuthorEventsTopic
	} else {
		return errors.New("Invalid mutation type")
	}

	topic, err := createTopicIfNotExists(ctx, c.client, topicName)
	if err != nil {
		return err
	}

	bytes, err := json.Marshal(model)
	if err != nil {
		return err
	}

	log.Info().Msgf("Publishing instance event: %s", instanceID)
	res := topic.Publish(ctx, &pubsub.Message{
		Data: bytes,
		Attributes: map[string]string{
			"instanceId":   instanceID,
			"mutationType": kindStr,
		},
	})

	_, err = res.Get(ctx)
	if err != nil {
		return err
	}

	return nil
}

func GetPubSubClient() *PubsubClient {
	return pubsubClient
}
