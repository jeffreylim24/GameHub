package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jeffreylim24/GameHub/models"
	"github.com/jeffreylim24/GameHub/validation"
	"gorm.io/gorm"
)

type UserHandler struct {
	db *gorm.DB
}

// Constructor for UserHandler
func NewUserHandler(db *gorm.DB) *UserHandler {
	return &UserHandler{db: db}
}

// Creates a new user
func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrInvalidRequestPayload)
		return
	}

	if errMsg := validation.ValidateUsername(user.Username); errMsg != "" {
		RespondWithError(w, http.StatusBadRequest, errMsg)
		return
	}

	result := h.db.Create(&user)
	if result.Error != nil {
		if validation.IsUniqueConstraintError(result.Error) {
			RespondWithError(w, http.StatusConflict, ErrUsernameExists)
			return
		}

		log.Printf("Database error in CreateUser: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusCreated, user)
}

// Retrieves all users
func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	var users []models.User

	result := h.db.Find(&users)
	if result.Error != nil {
		log.Printf("Database error in GetUsers: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusOK, users)
}

// Retrieves a single user by ID
func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")
	var user models.User

	result := h.db.First(&user, userID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			RespondWithError(w, http.StatusNotFound, ErrUserNotFound)
		} else {
			log.Printf("Database error in GetUser: %v", result.Error)
			RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		}
		return
	}

	RespondWithJSON(w, http.StatusOK, user)
}

// Updates an existing user
func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")

	var existingUser models.User
	result := h.db.First(&existingUser, userID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			RespondWithError(w, http.StatusNotFound, ErrUserNotFound)
		} else {
			log.Printf("Database error in UpdateUser: %v", result.Error)
			RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		}
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

// Deletes a user by ID
// Sets all user's content to CreatedBy/AuthorID = 0 before deletion
func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")

	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			RespondWithError(w, http.StatusNotFound, ErrUserNotFound)
			return
		}
		log.Printf("Database error in DeleteUser (checking user): %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	tx := h.db.Begin()
	if tx.Error != nil {
		log.Printf("Database error in DeleteUser (starting transaction): %v", tx.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	if err := tx.Model(&models.Topic{}).Where("created_by = ?", userID).Update("created_by", 0).Error; err != nil {
		tx.Rollback()
		log.Printf("Database error in DeleteUser (updating topics): %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	if err := tx.Model(&models.Post{}).Where("author_id = ?", userID).Update("author_id", 0).Error; err != nil {
		tx.Rollback()
		log.Printf("Database error in DeleteUser (updating posts): %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	if err := tx.Model(&models.Comment{}).Where("author_id = ?", userID).Update("author_id", 0).Error; err != nil {
		tx.Rollback()
		log.Printf("Database error in DeleteUser (updating comments): %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	if err := tx.Delete(&models.User{}, userID).Error; err != nil {
		tx.Rollback()
		log.Printf("Database error in DeleteUser (deleting user): %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("Database error in DeleteUser (committing transaction): %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithNoContent(w)
}
