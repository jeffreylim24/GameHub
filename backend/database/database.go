package database

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect() *gorm.DB {
	dsn := "host=localhost user=gamehub_user password=gamehub555 dbname=gamehub port=5432 sslmode=disable TimeZone=Asia/Singapore"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connection established")
	return db
}

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
