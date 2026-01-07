package main

import (
	"github.com/jeffreylim24/GameHub/database"
	"github.com/jeffreylim24/GameHub/models"
)

func main() {
	// Connect to the database
	db := database.Connect()

	// Migrate the database schemas
	database.Migrate(db, &models.User{}, &models.Topic{}, &models.Post{}, &models.Comment{})
}
