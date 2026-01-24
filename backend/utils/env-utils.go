// Package utils provides environment and authentication helpers.
package utils

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// LoadEnv loads environment variables from a .env file.
func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}
}

// GetEnv retrieves an environment variable or returns a fallback value.
func GetEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

// ValidateJWTEnv validates that required JWT environment variables are set.
func ValidateJWTEnv() {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("FATAL: JWT_SECRET environment variable is not set. Please set it in your .env file.")
	}

	if len(jwtSecret) < 32 {
		log.Println("WARNING: JWT_SECRET is shorter than 32 characters. For security, use a longer secret.")
		log.Println("Generate a secure secret with: openssl rand -base64 32")
	}

	if expiryHours := os.Getenv("JWT_EXPIRY_HOURS"); expiryHours != "" {
		log.Printf("JWT token expiry set to: %s hours", expiryHours)
	} else {
		log.Println("JWT token expiry defaulting to: 24 hours")
	}

	log.Println("JWT configuration validated successfully")
}
