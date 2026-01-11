package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/jeffreylim24/GameHub/handlers"
	"github.com/jeffreylim24/GameHub/utils"
)

// RequireAuth is middleware that validates JWT tokens and requires authentication
func RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			handlers.RespondWithError(w, http.StatusUnauthorized, "Authorization header required")
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			handlers.RespondWithError(w, http.StatusUnauthorized, "Invalid authorization header format")
			return
		}

		tokenString := parts[1]

		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			handlers.RespondWithError(w, http.StatusUnauthorized, "Invalid or expired token")
			return
		}

		ctx := context.WithValue(r.Context(), handlers.UserContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetUserFromContext extracts the user claims from the request context
func GetUserFromContext(r *http.Request) (*utils.Claims, bool) {
	claims, ok := r.Context().Value(handlers.UserContextKey).(*utils.Claims)
	return claims, ok
}

// IsAdmin checks if the authenticated user has admin role
func IsAdmin(claims *utils.Claims) bool {
	return claims.Role == handlers.ROLE_ADMIN
}

// IsOwnerOrAdmin checks if the user is either the owner of the resource or an admin
func IsOwnerOrAdmin(claims *utils.Claims, resourceOwnerID uint) bool {
	return claims.UserID == resourceOwnerID || IsAdmin(claims)
}

// RequireAdmin is middleware that requires authentication AND admin role
// This is self-contained and DOES NOT require chaining with RequireAuth
func RequireAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			handlers.RespondWithError(w, http.StatusUnauthorized, "Authorization header required")
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			handlers.RespondWithError(w, http.StatusUnauthorized, "Invalid authorization header format")
			return
		}

		tokenString := parts[1]

		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			handlers.RespondWithError(w, http.StatusUnauthorized, "Invalid or expired token")
			return
		}

		if !IsAdmin(claims) {
			handlers.RespondWithError(w, http.StatusForbidden, "Admin access required")
			return
		}

		ctx := context.WithValue(r.Context(), handlers.UserContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
