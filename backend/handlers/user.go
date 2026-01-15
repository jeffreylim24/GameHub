package handlers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jeffreylim24/GameHub/models"
	"github.com/jeffreylim24/GameHub/pagination"
	"github.com/jeffreylim24/GameHub/utils"
	"github.com/jeffreylim24/GameHub/validation"
	"gorm.io/gorm"
)

// UserHandler handles HTTP requests for user operations.
type UserHandler struct {
	db *gorm.DB
}

// NewUserHandler creates a new UserHandler with the given database connection.
func NewUserHandler(db *gorm.DB) *UserHandler {
	return &UserHandler{db: db}
}

// GetUsers returns paginated users.
func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	params := pagination.ParseParams(r)

	var totalCount int64
	if err := h.db.Model(&models.User{}).Count(&totalCount).Error; err != nil {
		log.Printf("Database error counting users: %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	var users []models.User
	result := h.db.Order("created_at DESC").
		Limit(params.PageSize).
		Offset(params.Offset).
		Find(&users)

	if result.Error != nil {
		log.Printf("Database error in GetUsers: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	response := pagination.NewResponse(users, params, totalCount)
	RespondWithJSON(w, http.StatusOK, response)
}

// GetUser returns a single user by ID.
func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")
	var user models.User

	result := h.db.First(&user, userID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			RespondWithError(w, http.StatusNotFound, ErrUserNotFound)
		} else {
			log.Printf("Database error in GetUser: %v", result.Error)
			RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		}
		return
	}

	RespondWithJSON(w, http.StatusOK, user)
}

// UpdateUser updates an existing user's username.
func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")

	claims, ok := r.Context().Value(UserContextKey).(*utils.Claims)
	if !ok {
		RespondWithError(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	var existingUser models.User
	result := h.db.First(&existingUser, userID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			RespondWithError(w, http.StatusNotFound, ErrUserNotFound)
		} else {
			log.Printf("Database error in UpdateUser: %v", result.Error)
			RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		}
		return
	}

	if claims.UserID != existingUser.UserID && claims.Role != ROLE_ADMIN {
		RespondWithError(w, http.StatusForbidden, "You can only update your own account")
		return
	}

	var updateData models.User
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrInvalidRequestPayload)
		return
	}

	if existingUser.Username == updateData.Username {
		RespondWithError(w, http.StatusBadRequest, ErrNoChangesDetected)
		return
	}

	if errMsg := validation.ValidateUsername(updateData.Username); errMsg != "" {
		RespondWithError(w, http.StatusBadRequest, errMsg)
		return
	}

	existingUser.Username = updateData.Username

	result = h.db.Save(&existingUser)
	if result.Error != nil {
		if validation.IsUniqueConstraintError(result.Error) {
			RespondWithError(w, http.StatusConflict, ErrUsernameExists)
			return
		}

		log.Printf("Database error in UpdateUser: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusOK, existingUser)
}

// DeleteUser removes a user by ID.
func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")

	claims, ok := r.Context().Value(UserContextKey).(*utils.Claims)
	if !ok {
		RespondWithError(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	var existingUser models.User
	result := h.db.First(&existingUser, userID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			RespondWithError(w, http.StatusNotFound, ErrUserNotFound)
		} else {
			log.Printf("Database error in DeleteUser: %v", result.Error)
			RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		}
		return
	}

	if claims.UserID != existingUser.UserID && claims.Role != ROLE_ADMIN {
		RespondWithError(w, http.StatusForbidden, "You can only delete your own account")
		return
	}

	result = h.db.Delete(&existingUser)
	if result.Error != nil {
		log.Printf("Database error in DeleteUser: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithNoContent(w)
}
