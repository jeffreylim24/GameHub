package database

import (
	"fmt"
	"log"
	"os"

	"github.com/jeffreylim24/GameHub/utils"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Establishes a connection to the PostgreSQL database
func Connect() *gorm.DB {
	var dsn string

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL != "" {
		log.Println("Using DATABASE_URL for connection")
		dsn = databaseURL
	} else {
		log.Println("Using individual DB environment variables")
		host := utils.GetEnv("DB_HOST", "localhost")
		user := utils.GetEnv("DB_USER", "gamehub_user")
		password := os.Getenv("DB_PASSWORD") // No fallback for security
		dbname := utils.GetEnv("DB_NAME", "gamehub")
		port := utils.GetEnv("DB_PORT", "5432")
		sslmode := utils.GetEnv("DB_SSLMODE", "disable")
		timezone := utils.GetEnv("DB_TZ", "Asia/Singapore")

		if password == "" {
			log.Fatal("DB_PASSWORD environment variable is required")
		}

		dsn = fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
			host, user, password, dbname, port, sslmode, timezone,
		)
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		TranslateError: true,
	})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connection established")
	return db
}

// Migrates the provided models to the database
func Migrate(db *gorm.DB, models ...interface{}) {
	for _, model := range models {
		log.Printf("Migrating: %T", model)

		err := db.AutoMigrate(model)
		if err != nil {
			log.Printf("ERROR migrating %T: %v", model, err)
			log.Fatal("Migration failed, stopping program")
		}

		log.Printf("%T migrated successfully", model)
	}
}
