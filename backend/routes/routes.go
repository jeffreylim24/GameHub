// Package routes wires HTTP routes and middleware for the API.
package routes

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jeffreylim24/GameHub/handlers"
	authmw "github.com/jeffreylim24/GameHub/middleware"
	"gorm.io/gorm"
)

// getCORSAllowedOrigins parses CORS_ALLOWED_ORIGINS into a slice of origins.
// Supports comma-separated values and falls back to "http://localhost:5173".
func getCORSAllowedOrigins() []string {
	originsEnv := os.Getenv("CORS_ALLOWED_ORIGINS")

	if originsEnv == "" {
		return []string{"http://localhost:5173"}
	}

	origins := strings.Split(originsEnv, ",")
	var trimmedOrigins []string
	for _, origin := range origins {
		trimmed := strings.TrimSpace(origin)
		if trimmed != "" {
			trimmedOrigins = append(trimmedOrigins, trimmed)
		}
	}

	if len(trimmedOrigins) == 0 {
		return []string{"http://localhost:5173"}
	}

	return trimmedOrigins
}

// SetupRouter sets up the router with all routes and middleware.
func SetupRouter(db *gorm.DB) http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)

	// Log CORS configuration for debugging
	allowedOrigins := getCORSAllowedOrigins()
	log.Printf("CORS allowed origins: %v", allowedOrigins)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		handlers.RespondWithJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	userHandler := handlers.NewUserHandler(db)
	authHandler := handlers.NewAuthHandler(db)
	topicHandler := handlers.NewTopicHandler(db)
	postHandler := handlers.NewPostHandler(db)
	commentHandler := handlers.NewCommentHandler(db)

	r.Route("/api", func(r chi.Router) {
		r.Post("/auth/register", authHandler.Register)
		r.Post("/auth/login", authHandler.Login)
		r.With(authmw.RequireAuth).Get("/auth/me", authHandler.GetCurrentUser)

		r.Get("/users", userHandler.GetUsers)
		r.Get("/users/{id}", userHandler.GetUser)
		r.With(authmw.RequireAuth).Put("/users/{id}", userHandler.UpdateUser)
		r.With(authmw.RequireAuth).Delete("/users/{id}", userHandler.DeleteUser)

		r.Get("/topics", topicHandler.GetTopics)
		r.Get("/topics/{id}", topicHandler.GetTopic)
		r.With(authmw.RequireAuth).Post("/topics", topicHandler.CreateTopic)
		r.With(authmw.RequireAdmin).Put("/topics/{id}", topicHandler.UpdateTopic)
		r.With(authmw.RequireAdmin).Delete("/topics/{id}", topicHandler.DeleteTopic)

		r.Get("/posts", postHandler.GetPosts)
		r.Get("/posts/{id}", postHandler.GetPost)
		r.With(authmw.RequireAuth).Post("/posts", postHandler.CreatePost)
		r.With(authmw.RequireAuth).Put("/posts/{id}", postHandler.UpdatePost)
		r.With(authmw.RequireAuth).Delete("/posts/{id}", postHandler.DeletePost)

		r.Get("/comments", commentHandler.GetComments)
		r.Get("/comments/{id}", commentHandler.GetComment)
		r.With(authmw.RequireAuth).Post("/comments", commentHandler.CreateComment)
		r.With(authmw.RequireAuth).Put("/comments/{id}", commentHandler.UpdateComment)
		r.With(authmw.RequireAuth).Delete("/comments/{id}", commentHandler.DeleteComment)
	})

	return r
}
