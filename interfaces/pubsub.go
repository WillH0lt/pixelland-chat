package interfaces

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"strings"

	"cloud.google.com/go/pubsub"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/wwwillw/pixelland-chat/graph/model"
	pixellandchat "github.com/wwwillw/pixelland-chat/pixellandchat"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/compute/v1"
)

var pubsubClient *PubsubClient

type PubsubConfig struct {
	ServiceAccountPath  string
	AuthorEventsTopic   string
	InstanceEventsTopic string
	UserEventsTopic     string
	Active              bool
	IsProd              bool
	PubsubProjectId     string
}

type PubsubClient struct {
	client *pubsub.Client
	config PubsubConfig
}

type PubsubData struct {
	Token   string
	Payload []byte
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

	projectId := config.PubsubProjectId
	if projectId == "" {
		var credentials *google.Credentials
		if _, err := os.Stat(config.ServiceAccountPath); err == nil {
			bytes, err := os.ReadFile(config.ServiceAccountPath)
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
		projectId = credentials.ProjectID
	}

	log.Info().Msgf("Initializing pubsub client for project %s", projectId)
	client, err := pubsub.NewClient(ctx, projectId)
	if err != nil {
		return err
	}
	pubsubClient.client = client

	return nil
}

func GetPubSubClient() *PubsubClient {
	return pubsubClient
}

func (c *PubsubClient) PublishUserEvent(ctx context.Context, kind model.NoticeKind, user pixellandchat.UserFragment) error {

	if !c.config.Active {
		log.Info().Msg("Not publishing user event because pubsub client is not active")
		return nil
	}

	kindStr := string(kind)
	if !strings.Contains(kindStr, "USER") {
		return errors.New("Invalid notice kind, must be a user notice")
	}

	return c.publishPubsubEvent(ctx, kindStr, uuid.Nil, user)
}

func (c *PubsubClient) PublishAuthorEvent(ctx context.Context, kind model.NoticeKind, author pixellandchat.AuthorFragment) error {

	if !c.config.Active {
		log.Info().Msg("Not publishing author event because pubsub client is not active")
		return nil
	}

	kindStr := string(kind)
	if !strings.Contains(kindStr, "AUTHOR") {
		msg := "Invalid mutation type, must be author mutation"
		log.Error().Msg(msg)
		return errors.New(msg)
	}

	return c.publishPubsubEvent(ctx, kindStr, author.InstanceId, author)
}

func (c *PubsubClient) PublishInstanceEvent(ctx context.Context, kind model.NoticeKind, instance pixellandchat.InstanceFragment) error {

	if !c.config.Active {
		log.Info().Msg("Not publishing instance event because pubsub client is not active")
		return nil
	}

	kindStr := string(kind)
	if !strings.Contains(kindStr, "INSTANCE") {
		return errors.New("Invalid mutation type, must be instance mutation")
	}

	return c.publishPubsubEvent(ctx, kindStr, instance.Id, instance)
}

func (c *PubsubClient) publishPubsubEvent(ctx context.Context, kind string, instanceID uuid.UUID, model interface{}) error {
	kindStr := string(kind)

	var topicName string
	if strings.Contains(kindStr, "INSTANCE") {
		topicName = c.config.InstanceEventsTopic
	} else if strings.Contains(kindStr, "AUTHOR") {
		topicName = c.config.AuthorEventsTopic
	} else if strings.Contains(kindStr, "USER") {
		topicName = c.config.UserEventsTopic
	} else {
		return errors.New("Invalid mutation type")
	}

	topic, err := getTopic(ctx, c.client, topicName)
	if err != nil {
		return err
	}

	payloadBytes, err := json.Marshal(model)
	if err != nil {
		return err
	}

	pubsubData := PubsubData{
		Token:   ctx.Value("token").(string),
		Payload: payloadBytes,
	}

	dataBytes, err := json.Marshal(pubsubData)
	if err != nil {
		return err
	}

	log.Info().Msgf("Publishing pubsub event: %s", instanceID.String())
	res := topic.Publish(ctx, &pubsub.Message{
		Data: dataBytes,
		Attributes: map[string]string{
			"instanceId":   instanceID.String(),
			"mutationType": kindStr,
		},
	})

	_, err = res.Get(ctx)
	if err != nil {
		log.Err(err).Msg("Failed to publish pubsub event")
		return err
	}

	return nil
}

func getTopic(ctx context.Context, client *pubsub.Client, name string) (*pubsub.Topic, error) {
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
