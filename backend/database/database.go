package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Retrieves an environment variable or returns a fallback value
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

// Establishes a connection to the PostgreSQL database
func Connect() *gorm.DB {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	host := getEnv("DB_HOST", "localhost")
	user := getEnv("DB_USER", "gamehub_user")
	password := os.Getenv("DB_PASSWORD") // No fallback for security
	dbname := getEnv("DB_NAME", "gamehub")
	port := getEnv("DB_PORT", "5432")
	sslmode := getEnv("DB_SSLMODE", "disable")
	timezone := getEnv("DB_TZ", "Asia/Singapore")

	if password == "" {
		log.Fatal("DB_PASSWORD environment variable is required")
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		host, user, password, dbname, port, sslmode, timezone,
	)

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
