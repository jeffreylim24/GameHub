package handlers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/jeffreylim24/GameHub/models"
	"github.com/jeffreylim24/GameHub/utils"
	"github.com/jeffreylim24/GameHub/validation"
	"gorm.io/gorm"
)

type AuthHandler struct {
	db *gorm.DB
}

// Constructor for AuthHandler
func NewAuthHandler(db *gorm.DB) *AuthHandler {
	return &AuthHandler{db: db}
}

// RegisterRequest represents the registration request payload
type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// LoginRequest represents the login request payload
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// AuthResponse represents the authentication response with user data and token
type AuthResponse struct {
	User  models.User `json:"user"`
	Token string      `json:"token"`
}

// Register creates a new user account with hashed password
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrInvalidRequestPayload)
		return
	}

	if errMsg := validation.ValidateUsername(req.Username); errMsg != "" {
		RespondWithError(w, http.StatusBadRequest, errMsg)
		return
	}

	if errMsg := validation.ValidatePassword(req.Password); errMsg != "" {
		RespondWithError(w, http.StatusBadRequest, errMsg)
		return
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		log.Printf("Error hashing password in Register: %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	// All users registered via this endpoint are assigned the "user" role
	// Admin accounts must be created directly in the database
	user := models.User{
		Username:     req.Username,
		PasswordHash: hashedPassword,
		Role:         "user",
	}

	result := h.db.Create(&user)
	if result.Error != nil {
		if validation.IsUniqueConstraintError(result.Error) {
			RespondWithError(w, http.StatusConflict, ErrUsernameExists)
			return
		}

		log.Printf("Database error in Register: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	token, err := utils.GenerateJWT(user.UserID, user.Username, user.Role)
	if err != nil {
		log.Printf("Error generating JWT in Register: %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	response := AuthResponse{
		User:  user,
		Token: token,
	}
	RespondWithJSON(w, http.StatusCreated, response)
}

// Authenticates a user and returns a JWT token
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrInvalidRequestPayload)
		return
	}

	if errMsg := validation.ValidateUsername(req.Username); errMsg != "" {
		RespondWithError(w, http.StatusBadRequest, errMsg)
		return
	}

	var user models.User
	result := h.db.Where("LOWER(username) = LOWER(?)", req.Username).First(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			RespondWithError(w, http.StatusUnauthorized, ErrInvalidCredentials)
		} else {
			log.Printf("Database error in Login: %v", result.Error)
			RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		}
		return
	}

	if err := utils.CheckPassword(user.PasswordHash, req.Password); err != nil {
		RespondWithError(w, http.StatusUnauthorized, ErrInvalidCredentials)
		return
	}

	token, err := utils.GenerateJWT(user.UserID, user.Username, user.Role)
	if err != nil {
		log.Printf("Error generating JWT in Login: %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	response := AuthResponse{
		User:  user,
		Token: token,
	}
	RespondWithJSON(w, http.StatusOK, response)
}
