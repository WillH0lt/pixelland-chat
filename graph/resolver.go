package graph

import (
	"encoding/json"
	"io/ioutil"
	"sync"

	goaway "github.com/TwiN/go-away"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"

	"github.com/wwwillw/pixelland-chat/graph/directives"
	"github.com/wwwillw/pixelland-chat/graph/model"
)

type InstanceStreamObserver struct {
	instanceId uuid.UUID
	roles      []string
	stream     chan *model.InstanceStreamNotification
}

type Resolver struct {
	InstanceStreamObservers sync.Map
	MessageLog              sync.Map
	ProfanityDetector       *goaway.ProfanityDetector
}

func New() Config {

	bytes, err := ioutil.ReadFile("./assets/profanities.json")
	if err != nil {
		log.Fatal().Err(err).Msg("Error reading file")
	}

	var profanities []string
	err = json.Unmarshal(bytes, &profanities)
	if err != nil {
		log.Fatal().Err(err).Msg("Error unmarshalling portals")
	}

	falsePositives := []string{}
	falseNegatives := []string{}
	profanityDetector := goaway.NewProfanityDetector().WithCustomDictionary(profanities, falsePositives, falseNegatives)

	return Config{
		Resolvers: &Resolver{
			InstanceStreamObservers: sync.Map{},
			MessageLog:              sync.Map{},
			ProfanityDetector:       profanityDetector,
		},
		Directives: DirectiveRoot{
			Constraint: directives.ConstraintDirective,
			Auth:       directives.AuthDirective,
		},
	}
}
