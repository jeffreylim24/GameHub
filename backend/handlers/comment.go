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

type CommentHandler struct {
	db *gorm.DB
}

// Constructor for CommentHandler
func NewCommentHandler(db *gorm.DB) *CommentHandler {
	return &CommentHandler{db: db}
}

// Creates a new comment
func (h *CommentHandler) CreateComment(w http.ResponseWriter, r *http.Request) {
	var comment models.Comment

	if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrInvalidRequestPayload)
		return
	}

	if errMsg := validation.ValidateCommentContent(comment.Content); errMsg != "" {
		RespondWithError(w, http.StatusBadRequest, errMsg)
		return
	}

	if validation.IsIDZero(comment.AuthorID) {
		RespondWithError(w, http.StatusBadRequest, validation.ErrUserIDRequired)
		return
	}

	var author models.User
	if err := h.db.First(&author, comment.AuthorID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			RespondWithError(w, http.StatusBadRequest, ErrCreatorNotExist)
			return
		}

		log.Printf("Database error in CreateComment (checking author): %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	if validation.IsIDZero(comment.PostID) {
		RespondWithError(w, http.StatusBadRequest, validation.ErrPostIDRequired)
		return
	}

	var post models.Post
	if err := h.db.First(&post, comment.PostID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			RespondWithError(w, http.StatusBadRequest, ErrPostNotFound)
			return
		}

		log.Printf("Database error in CreateComment (checking post): %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	result := h.db.Create(&comment)
	if result.Error != nil {
		log.Printf("Database error in CreateComment: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusCreated, comment)
}

// Retrieves all comments
func (h *CommentHandler) GetComments(w http.ResponseWriter, r *http.Request) {
	var comments []models.Comment

	result := h.db.Find(&comments)
	if result.Error != nil {
		log.Printf("Database error in GetComments: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusOK, comments)
}

// Retrieves a specific comment by ID
func (h *CommentHandler) GetComment(w http.ResponseWriter, r *http.Request) {
	commentID := chi.URLParam(r, "id")
	var comment models.Comment

	result := h.db.First(&comment, commentID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			RespondWithError(w, http.StatusNotFound, ErrCommentNotFound)
			return
		}
		log.Printf("Database error in GetComment: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusOK, comment)
}

// Updates an existing comment
func (h *CommentHandler) UpdateComment(w http.ResponseWriter, r *http.Request) {
	commentID := chi.URLParam(r, "id")

	var existingComment models.Comment
	result := h.db.First(&existingComment, commentID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			RespondWithError(w, http.StatusNotFound, ErrCommentNotFound)
			return
		}
		log.Printf("Database error in UpdateComment: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	var updateData models.Comment
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrInvalidRequestPayload)
		return
	}

	if existingComment.Content == updateData.Content &&
		existingComment.HasSpoilers == updateData.HasSpoilers {
		RespondWithError(w, http.StatusBadRequest, ErrNoChangesDetected)
		return
	}

	if existingComment.Content != updateData.Content {
		if errMsg := validation.ValidateCommentContent(updateData.Content); errMsg != "" {
			RespondWithError(w, http.StatusBadRequest, errMsg)
			return
		}
		existingComment.Content = updateData.Content
	}

	if existingComment.HasSpoilers != updateData.HasSpoilers {
		existingComment.HasSpoilers = updateData.HasSpoilers
	}

	result = h.db.Save(&existingComment)
	if result.Error != nil {
		log.Printf("Database error in UpdateComment: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusOK, existingComment)
}

// Deletes a comment by ID
func (h *CommentHandler) DeleteComment(w http.ResponseWriter, r *http.Request) {
	commentID := chi.URLParam(r, "id")

	result := h.db.Delete(&models.Comment{}, commentID)
	if result.Error != nil {
		log.Printf("Database error in DeleteComment: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}
	if result.RowsAffected == 0 {
		RespondWithError(w, http.StatusNotFound, ErrCommentNotFound)
		return
	}

	RespondWithNoContent(w)
}
