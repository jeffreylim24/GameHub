package main

import (
	"log"
	"net/http"

	"github.com/jeffreylim24/GameHub/database"
	"github.com/jeffreylim24/GameHub/models"
	"github.com/jeffreylim24/GameHub/routes"
)

func main() {
	log.Println("Connecting to database...")
	db := database.Connect()

	log.Println("Running migrations...")
	database.Migrate(db, &models.User{}, &models.Topic{}, &models.Post{}, &models.Comment{})

	log.Println("Setting up router...")
	r := routes.SetupRouter(db)

	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", r)) // For development purposes only, adjust port in production
}
