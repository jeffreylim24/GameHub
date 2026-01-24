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

// CommentHandler handles HTTP requests for comment operations.
type CommentHandler struct {
	db *gorm.DB
}

// NewCommentHandler creates a new CommentHandler with the given database connection.
func NewCommentHandler(db *gorm.DB) *CommentHandler {
	return &CommentHandler{db: db}
}

// CreateComment creates a new comment on a post.
func (h *CommentHandler) CreateComment(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(UserContextKey).(*utils.Claims)
	if !ok {
		RespondWithError(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	var comment models.Comment

	if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrInvalidRequestPayload)
		return
	}

	if errMsg := validation.ValidateCommentContent(comment.Content); errMsg != "" {
		RespondWithError(w, http.StatusBadRequest, errMsg)
		return
	}

	comment.AuthorID = &claims.UserID

	if validation.IsIDZero(comment.PostID) {
		RespondWithError(w, http.StatusBadRequest, validation.ErrPostIDRequired)
		return
	}

	var post models.Post
	if err := h.db.First(&post, comment.PostID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
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

	if err := h.db.Preload("Author").First(&comment, comment.CommentID).Error; err != nil {
		log.Printf("Database error in CreateComment (preloading author): %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusCreated, comment)
}

// GetComments returns paginated comments with optional filters, sorted by oldest first.
// Query params: page, page_size, post_id, author_id.
func (h *CommentHandler) GetComments(w http.ResponseWriter, r *http.Request) {
	params := pagination.ParseParams(r)

	query := h.db.Model(&models.Comment{})

	postID := r.URL.Query().Get("post_id")
	authorID := r.URL.Query().Get("author_id")

	if postID != "" {
		query = query.Where("post_id = ?", postID)
	}
	if authorID != "" {
		query = query.Where("author_id = ?", authorID)
	}

	var totalCount int64
	if err := query.Count(&totalCount).Error; err != nil {
		log.Printf("Database error counting comments: %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	var comments []models.Comment
	result := query.Preload("Author").Preload("Post.Topic").
		Order("created_at ASC").
		Limit(params.PageSize).
		Offset(params.Offset).
		Find(&comments)

	if result.Error != nil {
		log.Printf("Database error in GetComments: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	response := pagination.NewResponse(comments, params, totalCount)
	RespondWithJSON(w, http.StatusOK, response)
}

// GetComment returns a single comment by ID.
func (h *CommentHandler) GetComment(w http.ResponseWriter, r *http.Request) {
	commentID := chi.URLParam(r, "id")
	var comment models.Comment

	result := h.db.Preload("Author").Preload("Post.Topic").First(&comment, commentID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			RespondWithError(w, http.StatusNotFound, ErrCommentNotFound)
			return
		}
		log.Printf("Database error in GetComment: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusOK, comment)
}

// UpdateComment updates an existing comment's content or spoiler flag.
func (h *CommentHandler) UpdateComment(w http.ResponseWriter, r *http.Request) {
	commentID := chi.URLParam(r, "id")

	claims, ok := r.Context().Value(UserContextKey).(*utils.Claims)
	if !ok {
		RespondWithError(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	var existingComment models.Comment
	result := h.db.First(&existingComment, commentID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			RespondWithError(w, http.StatusNotFound, ErrCommentNotFound)
			return
		}
		log.Printf("Database error in UpdateComment: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	if claims.Role != ROLE_ADMIN && (existingComment.AuthorID == nil || claims.UserID != *existingComment.AuthorID) {
		RespondWithError(w, http.StatusForbidden, "You can only update your own comment")
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

	if err := h.db.Preload("Author").First(&existingComment, existingComment.CommentID).Error; err != nil {
		log.Printf("Database error in UpdateComment (preloading author): %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusOK, existingComment)
}

// DeleteComment removes a comment by ID.
func (h *CommentHandler) DeleteComment(w http.ResponseWriter, r *http.Request) {
	commentID := chi.URLParam(r, "id")

	claims, ok := r.Context().Value(UserContextKey).(*utils.Claims)
	if !ok {
		RespondWithError(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	var existingComment models.Comment
	result := h.db.First(&existingComment, commentID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			RespondWithError(w, http.StatusNotFound, ErrCommentNotFound)
			return
		}
		log.Printf("Database error in DeleteComment: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	if claims.Role != ROLE_ADMIN && (existingComment.AuthorID == nil || claims.UserID != *existingComment.AuthorID) {
		RespondWithError(w, http.StatusForbidden, "You can only delete your own comment")
		return
	}

	result = h.db.Delete(&existingComment)
	if result.Error != nil {
		log.Printf("Database error in DeleteComment: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithNoContent(w)
}
