package handlers

import (
	"encoding/json"
	"net/http"
)

// Sends a JSON error response with the specified status code
func RespondWithError(w http.ResponseWriter, statusCode int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

// Sends a JSON response with the specified status code and payload
func RespondWithJSON(w http.ResponseWriter, statusCode int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(payload)
}

// Sends a 204 No Content response
func RespondWithNoContent(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNoContent)
}
