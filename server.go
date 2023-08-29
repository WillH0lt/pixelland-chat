package main

import (
	"context"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/gorilla/websocket"
	"github.com/kelseyhightower/envconfig"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/urfave/cli"
	"github.com/wwwillw/pixelland-chat/graph"
	"github.com/wwwillw/pixelland-chat/interfaces"
)

type Specification struct {
	Port                string `default:"8081"`
	Debug               bool   `default:"true"`
	SqlHost             string `default:"localhost" split_words:"true"`
	SqlPort             int    `default:"5432" split_words:"true"`
	SqlUser             string `default:"postgres" split_words:"true"`
	SqlPassword         string `default:"123" split_words:"true"`
	SqlDbName           string `default:"pixellandchat" split_words:"true"`
	SqlSslMode          string `default:"disable" split_words:"true"`
	SeedDb              bool   `default:"false" split_words:"true"`
	ServiceAccountPath  string `default:"/etc/credentials/pixelland-admin-service-account.json" split_words:"true"`
	EnforceAuth         bool   `default:"false" split_words:"true"`
	AuthorEventsTopic   string `default:"author_events" split_words:"true"`
	InstanceEventsTopic string `default:"instance_events" split_words:"true"`
}

func init() {
	rand.Seed(time.Now().UnixNano())
	if os.Getenv("CHAT_DEBUG") == "false" {
		zerolog.LevelFieldName = "severity"
		zerolog.TimestampFieldName = "timestamp"
		zerolog.TimeFieldFormat = time.RFC3339Nano
	} else {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	}
}

func main() {
	app := cli.NewApp()
	app.Name = "pixelland-chat"
	app.Action = run
	app.Run(os.Args)
}

func run(args *cli.Context) error {
	var s Specification
	err := envconfig.Process("chat", &s)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to read environment variables")
	}

	dbConfig := interfaces.DatabaseConfig{
		Host:     s.SqlHost,
		Port:     s.SqlPort,
		User:     s.SqlUser,
		Password: s.SqlPassword,
		DbName:   s.SqlDbName,
		SslMode:  s.SqlSslMode,
	}

	db, err := interfaces.InitDatabase(dbConfig, 5)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to initialize db")
	}
	if s.SeedDb {
		if err = db.DropAll(); err != nil {
			log.Fatal().Err(err).Msg("Failed to drop all tables")
		}
	}
	if err = db.RunMigrations(); err != nil {
		log.Fatal().Err(err).Msg("Failed to run db migrations")
	}
	if s.SeedDb {
		if err = db.Seed(); err != nil {
			log.Fatal().Err(err).Msg("Failed to seed db")
		}
	}

	ctx := context.Background()
	if s.EnforceAuth {
		if err := interfaces.InitFirebaseClient(ctx, s.ServiceAccountPath); err != nil {
			log.Fatal().Err(err).Msg("Failed to initialize firebase client")
		}
	}

	if !s.Debug {
		pubsubConfig := interfaces.PubsubConfig{
			ServiceAccountPath:  s.ServiceAccountPath,
			AuthorEventsTopic:   s.AuthorEventsTopic,
			InstanceEventsTopic: s.InstanceEventsTopic,
		}
		if err := interfaces.InitPubSubClient(ctx, pubsubConfig); err != nil {
			log.Fatal().Err(err).Msg("Failed to initialize pubsub client")
		}
	}

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "X-PINGOTHER"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	srv := handler.New(graph.NewExecutableSchema(graph.New()))

	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
		Upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
		InitFunc: func(ctx context.Context, initPayload transport.InitPayload) (context.Context, error) {
			val := initPayload["Authorization"]
			authHeader, ok := val.(string)
			if !ok {
				authHeader = ""
			}
			return updateAuthContext(ctx, authHeader, s.EnforceAuth), nil
		},
	})

	if s.Debug {
		log.Info().Msg("GraphQL introspection enabled")
		srv.Use(extension.Introspection{})
		router.Handle("/", playground.Handler("PixelLand Chat", "/graphql"))
	}

	router.Handle("/", http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusOK)
		},
	))

	router.Handle("/healthz", http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusOK)
		},
	))

	router.Handle("/graphql", http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("authorization")
			ctx := updateAuthContext(r.Context(), authHeader, s.EnforceAuth)
			srv.ServeHTTP(w, r.WithContext(ctx))
		},
	))

	log.Info().Msg("Server started on port " + s.Port)
	if err := http.ListenAndServe(":"+s.Port, router); err != nil {
		log.Fatal().Err(err).Msg("Failed to start server")
	}

	return nil
}

func updateAuthContext(ctx context.Context, authHeader string, enforceAuth bool) context.Context {
	authHeaderParts := strings.Split(authHeader, "Bearer ")
	if len(authHeaderParts) <= 1 {
		return context.WithValue(ctx, "uid", "")
	}

	tokenStr := authHeaderParts[1]

	auth := interfaces.GetAuthClient()
	uid := ""
	if enforceAuth {
		token, err := auth.VerifyIDToken(ctx, tokenStr)
		if err != nil {
			log.Warn().Err(err).Msg("error verifying ID token")
			return ctx
		}
		uid = token.UID
	} else {
		uid = tokenStr
	}

	return context.WithValue(ctx, "uid", uid)
}
