// Package middleware provides HTTP middleware for authentication and authorization.
package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/jeffreylim24/GameHub/handlers"
	"github.com/jeffreylim24/GameHub/utils"
)

// RequireAuth validates JWT tokens and requires authentication.
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

// GetUserFromContext extracts user claims from the request context.
func GetUserFromContext(r *http.Request) (*utils.Claims, bool) {
	claims, ok := r.Context().Value(handlers.UserContextKey).(*utils.Claims)
	return claims, ok
}

// IsAdmin reports whether the authenticated user has the admin role.
func IsAdmin(claims *utils.Claims) bool {
	return claims.Role == handlers.ROLE_ADMIN
}

// IsOwnerOrAdmin reports whether the user owns the resource or is an admin.
func IsOwnerOrAdmin(claims *utils.Claims, resourceOwnerID uint) bool {
	return claims.UserID == resourceOwnerID || IsAdmin(claims)
}

// RequireAdmin requires authentication and the admin role.
// This is self-contained and does not require chaining with RequireAuth.
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
