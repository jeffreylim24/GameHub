package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/jeffreylim24/GameHub/database"
	"github.com/jeffreylim24/GameHub/models"
	"github.com/jeffreylim24/GameHub/routes"
	"github.com/jeffreylim24/GameHub/utils"
)

func main() {
	log.Println("Loading environment variables...")
	utils.LoadEnv()

	log.Println("Validating JWT configuration...")
	utils.ValidateJWTEnv()

	log.Println("Connecting to database...")
	db := database.Connect()

	log.Println("Running migrations...")
	database.Migrate(db, &models.User{}, &models.Topic{}, &models.Post{}, &models.Comment{})

	log.Println("Setting up router...")
	r := routes.SetupRouter(db)

	port := utils.GetEnv("SERVER_PORT", "8080")
	serverAddr := fmt.Sprintf(":%s", port)
	log.Printf("Server starting on %s", serverAddr)
	log.Fatal(http.ListenAndServe(serverAddr, r))
}
