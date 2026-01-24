// Clear all data from the database tables.
package main

import (
	"log"

	"github.com/jeffreylim24/GameHub/database"
	"github.com/jeffreylim24/GameHub/utils"
)

func main() {
	log.Println("Loading environment variables...")
	utils.LoadEnv()

	log.Println("Connecting to database...")
	db := database.Connect()

	log.Println("Clearing database tables...")
	if err := db.Exec("TRUNCATE TABLE comments, posts, topics, users RESTART IDENTITY CASCADE").Error; err != nil {
		log.Fatalf("Clear failed: %v", err)
	}

	log.Println("Database cleared.")
}
