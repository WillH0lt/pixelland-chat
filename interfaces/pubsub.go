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
}

type PubsubClient struct {
	client *pubsub.Client
	config PubsubConfig
}

func InitPubSubClient(ctx context.Context, config PubsubConfig) error {

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
	pubsubClient = &PubsubClient{
		client: client,
		config: config,
	}

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

func (c *PubsubClient) PublishAuthorEvent(ctx context.Context, mutationType model.MutationType, author model.Author) error {
	mutationTypeStr := string(mutationType)
	if !strings.Contains(mutationTypeStr, "AUTHOR") {
		return errors.New("Invalid mutation type, must be author mutation")
	}

	return c.publishPubsubEvent(ctx, mutationType, author.InstanceID.String(), author)
}

func (c *PubsubClient) PublishInstanceEvent(ctx context.Context, mutationType model.MutationType, instance model.Instance) error {
	mutationTypeStr := string(mutationType)
	if !strings.Contains(mutationTypeStr, "INSTANCE") {
		return errors.New("Invalid mutation type, must be instance mutation")
	}

	return c.publishPubsubEvent(ctx, mutationType, instance.ID.String(), instance)
}

func (c *PubsubClient) publishPubsubEvent(ctx context.Context, mutationType model.MutationType, instanceID string, model interface{}) error {
	mutationTypeStr := string(mutationType)

	var topicName string
	if strings.Contains(mutationTypeStr, "INSTANCE") {
		topicName = c.config.InstanceEventsTopic
	} else if strings.Contains(mutationTypeStr, "AUTHOR") {
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
			"mutationType": mutationTypeStr,
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
