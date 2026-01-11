package handlers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jeffreylim24/GameHub/models"
	"github.com/jeffreylim24/GameHub/utils"
	"github.com/jeffreylim24/GameHub/validation"
	"gorm.io/gorm"
)

type PostHandler struct {
	db *gorm.DB
}

// Constructor for PostHandler
func NewPostHandler(db *gorm.DB) *PostHandler {
	return &PostHandler{db: db}
}

// Creates a new post
func (h *PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(UserContextKey).(*utils.Claims)
	if !ok {
		RespondWithError(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	var post models.Post

	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrInvalidRequestPayload)
		return
	}

	if errMsg := validation.ValidatePostTitle(post.Title); errMsg != "" {
		RespondWithError(w, http.StatusBadRequest, errMsg)
		return
	}

	if errMsg := validation.ValidatePostContent(post.Content); errMsg != "" {
		RespondWithError(w, http.StatusBadRequest, errMsg)
		return
	}

	if errMsg := validation.ValidatePostCategory(post.Category); errMsg != "" {
		RespondWithError(w, http.StatusBadRequest, errMsg)
		return
	}

	if errMsg := validation.ValidatePostPlatform(post.Platform); errMsg != "" {
		RespondWithError(w, http.StatusBadRequest, errMsg)
		return
	}

	// Set the author ID from the authenticated user (ignore any author_id from request body)
	post.AuthorID = &claims.UserID

	if validation.IsIDZero(post.TopicID) {
		RespondWithError(w, http.StatusBadRequest, validation.ErrTopicIDRequired)
		return
	}

	var topic models.Topic
	if err := h.db.First(&topic, post.TopicID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			RespondWithError(w, http.StatusBadRequest, ErrTopicNotFound)
			return
		}

		log.Printf("Database error in CreatePost (checking topic): %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	result := h.db.Create(&post)
	if result.Error != nil {
		log.Printf("Database error in CreatePost: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusCreated, post)
}

// Retrieves all posts
func (h *PostHandler) GetPosts(w http.ResponseWriter, r *http.Request) {
	var posts []models.Post

	query := h.db.Model(&models.Post{})

	topicID := r.URL.Query().Get("topic_id")
	category := r.URL.Query().Get("category")
	platform := r.URL.Query().Get("platform")
	authorID := r.URL.Query().Get("author_id")

	if topicID != "" {
		query = query.Where("topic_id = ?", topicID)
	}
	if category != "" {
		query = query.Where("category = ?", category)
	}
	if platform != "" {
		query = query.Where("platform = ?", platform)
	}
	if authorID != "" {
		query = query.Where("author_id = ?", authorID)
	}

	result := query.Preload("Author").Preload("Topic").Order("created_at DESC").Find(&posts)
	if result.Error != nil {
		log.Printf("Database error in GetPosts: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusOK, posts)
}

// Retrieves a single post by ID
func (h *PostHandler) GetPost(w http.ResponseWriter, r *http.Request) {
	postID := chi.URLParam(r, "id")
	var post models.Post

	result := h.db.Preload("Author").Preload("Topic").First(&post, postID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			RespondWithError(w, http.StatusNotFound, ErrPostNotFound)
			return
		}
		log.Printf("Database error in GetPost: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusOK, post)
}

// Updates an existing post
func (h *PostHandler) UpdatePost(w http.ResponseWriter, r *http.Request) {
	postID := chi.URLParam(r, "id")

	claims, ok := r.Context().Value(UserContextKey).(*utils.Claims)
	if !ok {
		RespondWithError(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	var existingPost models.Post
	result := h.db.First(&existingPost, postID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			RespondWithError(w, http.StatusNotFound, ErrPostNotFound)
			return
		}
		log.Printf("Database error in UpdatePost: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	if existingPost.AuthorID == nil || (claims.UserID != *existingPost.AuthorID && claims.Role != ROLE_ADMIN) {
		RespondWithError(w, http.StatusForbidden, "You can only update your own post")
		return
	}

	var updateData models.Post
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrInvalidRequestPayload)
		return
	}

	if existingPost.Title == updateData.Title && existingPost.Content == updateData.Content &&
		existingPost.Category == updateData.Category && existingPost.Platform == updateData.Platform &&
		existingPost.HasSpoilers == updateData.HasSpoilers {
		RespondWithError(w, http.StatusBadRequest, ErrNoChangesDetected)
		return
	}

	if updateData.Title != existingPost.Title {
		if errMsg := validation.ValidatePostTitle(updateData.Title); errMsg != "" {
			RespondWithError(w, http.StatusBadRequest, errMsg)
			return
		}
		existingPost.Title = updateData.Title
	}

	if updateData.Content != existingPost.Content {
		if errMsg := validation.ValidatePostContent(updateData.Content); errMsg != "" {
			RespondWithError(w, http.StatusBadRequest, errMsg)
			return
		}
		existingPost.Content = updateData.Content
	}

	if updateData.Category != existingPost.Category {
		if errMsg := validation.ValidatePostCategory(updateData.Category); errMsg != "" {
			RespondWithError(w, http.StatusBadRequest, errMsg)
			return
		}
		existingPost.Category = updateData.Category
	}

	if updateData.Platform != existingPost.Platform {
		if errMsg := validation.ValidatePostPlatform(updateData.Platform); errMsg != "" {
			RespondWithError(w, http.StatusBadRequest, errMsg)
			return
		}
		existingPost.Platform = updateData.Platform
	}

	existingPost.HasSpoilers = updateData.HasSpoilers

	result = h.db.Save(&existingPost)
	if result.Error != nil {
		log.Printf("Database error in UpdatePost: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	if err := h.db.Preload("Author").Preload("Topic").First(&existingPost, existingPost.PostID).Error; err != nil {
		log.Printf("Database error in UpdatePost (preloading relationships): %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusOK, existingPost)
}

// Deletes a post by ID
func (h *PostHandler) DeletePost(w http.ResponseWriter, r *http.Request) {
	postID := chi.URLParam(r, "id")

	claims, ok := r.Context().Value(UserContextKey).(*utils.Claims)
	if !ok {
		RespondWithError(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	var existingPost models.Post
	result := h.db.First(&existingPost, postID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			RespondWithError(w, http.StatusNotFound, ErrPostNotFound)
			return
		}
		log.Printf("Database error in DeletePost: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	if existingPost.AuthorID == nil || (claims.UserID != *existingPost.AuthorID && claims.Role != ROLE_ADMIN) {
		RespondWithError(w, http.StatusForbidden, "You can only delete your own post")
		return
	}

	result = h.db.Delete(&existingPost)
	if result.Error != nil {
		log.Printf("Database error in DeletePost: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithNoContent(w)
}
