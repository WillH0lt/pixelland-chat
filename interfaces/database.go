package interfaces

import (
	"encoding/binary"
	"fmt"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	gorm_zerolog "github.com/wei840222/gorm-zerolog"
	"github.com/wwwillw/pixelland-chat/graph/model"
	"github.com/xissy/lexorank"
	"gopkg.in/loremipsum.v1"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	DbName   string
	Password string
	SslMode  string
}

type Database struct {
	*gorm.DB
}

var db_instance Database

// Opening the database and create singleton client instance
func InitDatabase(config DatabaseConfig, retries int) (*Database, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s dbname=%s password=%s sslmode=%s",
		config.Host, config.Port, config.User, config.DbName, config.Password, config.SslMode)

	log.Info().Msgf("Connecting to database: %s", dsn)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	for err != nil {
		log.Warn().Err(err).Msg("Failed to connect to database, retrying...")
		if retries > 1 {
			retries--
			time.Sleep(5 * time.Second)
			db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
				Logger: gorm_zerolog.New(),
			})
			continue
		}
		panic(err)
	}

	log.Info().Msg("Successfully connected to database")

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(30)
	sqlDB.SetConnMaxLifetime(time.Hour)

	db_instance = Database{db}

	return &db_instance, nil
}

func (db *Database) RunMigrations() error {
	log.Info().Msg("running database migrations")
	return db.AutoMigrate(
		&model.User{},
		&model.Instance{},
		&model.Channel{},
		&model.Message{},
		&model.InstanceUser{},
		&model.Invite{},
		&model.Notification{},
		&model.Tag{},
	)
}

func (db *Database) DropAll() error {
	log.Info().Msg("dropping database tables")
	return db.Migrator().DropTable(
		&model.Instance{},
		&model.Channel{},
		&model.Message{},
		&model.InstanceUser{},
		&model.Invite{},
	)
}

func (db *Database) Seed() error {
	log.Info().Msg("Seeding database")
	loremIpsumGenerator := loremipsum.New()

	adminUser := model.User{}
	adminUser.ID = uuid.MustParse("3f6f51e4-aa2c-452c-a1b2-140bd7198ad1")
	adminUser.UID = "JenRxFv73kScEjTx4t0iH6l0ZdB3"
	if err := db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		UpdateAll: true,
	}).Create(&adminUser).Error; err != nil {
		return err
	}

	overworldInstanceUserId := uuid.MustParse("3f6f51e4-aa2c-452c-a1b2-140bd7198ad5")
	overworldInstance := model.Instance{
		Name:         "Overworld",
		ReadAccess:   model.AccessPublic.String(),
		ShowAuthor:   true,
		ShowChat:     true,
		ShowLikes:    true,
		ShowComments: true,
		Icon:         "https://storage.googleapis.com/pixelland_dev_tiles/db9238ed-8377-4600-9b17-c0ecd06c3f23/0.png",
		Description:  loremIpsumGenerator.Sentence(),
	}
	overworldInstance.ID = uuid.MustParse("db9238ed-8377-4600-9b17-c0ecd06c3f23")
	if err := db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		UpdateAll: true,
	}).Create(&overworldInstance).Error; err != nil {
		return err
	}

	overworldInstanceUser := model.InstanceUser{
		InstanceID: overworldInstance.ID,
		UserID:     adminUser.ID,
		Roles:      []string{model.RoleMember.String(), model.RoleModerator.String(), model.RoleAdmin.String()},
		Rank:       "u",
		Avatar:     "https://avatars.dicebear.com/api/human/abcdef.svg",
		Name:       "Will",
		Bio:        "I am a human",
	}
	overworldInstanceUser.ID = overworldInstanceUserId

	if err := db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		UpdateAll: true,
	}).Create(&overworldInstanceUser).Error; err != nil {
		return err
	}

	overworldCommentschannel := model.Channel{
		InstanceID: overworldInstance.ID,
		Name:       "Comments",
		Readers:    []string{model.RoleAllUsers.String()},
		Publishers: []string{model.RoleAllUsers.String()},
		Rank:       "a",
		AuthorID:   overworldInstanceUser.ID,
		IsComments: true,
	}
	overworldCommentschannel.ID = uuid.MustParse("3f6f51e4-aa2c-452c-abdf-140bd7198a23")
	if err := db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		UpdateAll: true,
	}).Create(&overworldCommentschannel).Error; err != nil {
		return err
	}

	overworldInstance.AuthorID = overworldInstanceUser.ID
	overworldInstance.Author = &overworldInstanceUser
	if err := db.Save(&overworldInstance).Error; err != nil {
		return err
	}

	var i uint16
	for i = 0; i < 30; i++ {
		b := make([]byte, 16)
		binary.LittleEndian.PutUint16(b, i)
		id, _ := uuid.FromBytes(b)
		rank, _ := lexorank.Rank(strconv.Itoa(int(i)), strconv.Itoa(int(i+1)))
		channel := model.Channel{
			InstanceID: overworldInstance.ID,
			Name:       strconv.Itoa(int(i)),
			Readers:    []string{model.RoleAllUsers.String()},
			Publishers: []string{model.RoleAllUsers.String()},
			Rank:       rank,
			AuthorID:   overworldInstanceUser.ID,
		}
		channel.ID = id
		if err := db.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "id"}},
			UpdateAll: true,
		}).Create(&channel).Error; err != nil {
			return err
		}
	}

	return nil
}

// GetSqlClient returns the singleton database instance
func GetDatabase() *Database {
	return &db_instance
}
