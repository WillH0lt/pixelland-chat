package interfaces

import (
	"context"
	"errors"
	"os"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"
)

var authClient *auth.Client

func InitFirebaseClient(ctx context.Context, serviceAccountPath string) error {

	var app *firebase.App
	if _, err := os.Stat(serviceAccountPath); err == nil {
		opt := option.WithCredentialsFile(serviceAccountPath)
		app, err = firebase.NewApp(ctx, nil, opt)
		if err != nil {
			return err
		}
	} else if errors.Is(err, os.ErrNotExist) {
		app, err = firebase.NewApp(context.Background(), nil)
		if err != nil {
			return err
		}
	} else {
		return err
	}

	auth, err := app.Auth(ctx)
	if err != nil {
		return err
	}
	authClient = auth

	return nil
}

func GetAuthClient() *auth.Client {
	return authClient
}
