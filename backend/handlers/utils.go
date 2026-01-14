// Package handlers provides HTTP request handlers for all API endpoints.
package handlers

import (
	"encoding/json"
	"net/http"
)

// RespondWithError writes a JSON error response with the given status code and message.
func RespondWithError(w http.ResponseWriter, statusCode int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

// RespondWithJSON writes a JSON response with the given status code and payload.
func RespondWithJSON(w http.ResponseWriter, statusCode int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(payload)
}

// RespondWithNoContent writes a 204 No Content response.
func RespondWithNoContent(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNoContent)
}
