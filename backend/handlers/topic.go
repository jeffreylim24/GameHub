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

type TopicHandler struct {
	db *gorm.DB
}

// Constructor for TopicHandler
func NewTopicHandler(db *gorm.DB) *TopicHandler {
	return &TopicHandler{db: db}
}

// Creates a new topic
func (h *TopicHandler) CreateTopic(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(UserContextKey).(*utils.Claims)
	if !ok {
		RespondWithError(w, http.StatusUnauthorized, "Authentication required")
		return
	}

	var topic models.Topic

	if err := json.NewDecoder(r.Body).Decode(&topic); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrInvalidRequestPayload)
		return
	}

	if errMsg := validation.ValidateTopicTitle(topic.Title); errMsg != "" {
		RespondWithError(w, http.StatusBadRequest, errMsg)
		return
	}

	if errMsg := validation.ValidateTopicDescription(topic.Description); errMsg != "" {
		RespondWithError(w, http.StatusBadRequest, errMsg)
		return
	}

	topic.CreatedBy = &claims.UserID

	result := h.db.Create(&topic)
	if result.Error != nil {
		if validation.IsUniqueConstraintError(result.Error) {
			RespondWithError(w, http.StatusConflict, ErrTopicTitleExists)
			return
		}
		log.Printf("Database error in CreateTopic: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusCreated, topic)
}

// Retrieves all topics with pagination
// Query params: ?page=1&page_size=20 (both optional, these are defaults)
func (h *TopicHandler) GetTopics(w http.ResponseWriter, r *http.Request) {
	// Step 1: Parse pagination parameters from the request
	// This extracts ?page=X&page_size=Y from the URL, with sensible defaults
	params := pagination.ParseParams(r)

	// Step 2: Count total topics BEFORE applying limit/offset
	// We need this to calculate total pages and has_next/has_previous
	var totalCount int64
	if err := h.db.Model(&models.Topic{}).Count(&totalCount).Error; err != nil {
		log.Printf("Database error counting topics: %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	// Step 3: Fetch the actual page of data
	// - Preload("Creator") loads the related User who created this topic
	// - Order() sorts by newest first
	// - Limit() restricts how many rows to return (page_size)
	// - Offset() skips rows for previous pages
	var topics []models.Topic
	result := h.db.Preload("Creator").
		Order("created_at DESC").
		Limit(params.PageSize).
		Offset(params.Offset).
		Find(&topics)

	if result.Error != nil {
		log.Printf("Database error in GetTopics: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	// Step 4: Build and return the paginated response
	// This wraps the data with pagination metadata
	response := pagination.NewResponse(topics, params, totalCount)
	RespondWithJSON(w, http.StatusOK, response)
}

// Retrieves a single topic by ID
func (h *TopicHandler) GetTopic(w http.ResponseWriter, r *http.Request) {
	topicID := chi.URLParam(r, "id")
	var topic models.Topic

	result := h.db.Preload("Creator").First(&topic, topicID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			RespondWithError(w, http.StatusNotFound, ErrTopicNotFound)
			return
		}

		log.Printf("Database error in GetTopic: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusOK, topic)
}

// Updates an existing topic
func (h *TopicHandler) UpdateTopic(w http.ResponseWriter, r *http.Request) {
	topicID := chi.URLParam(r, "id")

	var existingTopic models.Topic
	result := h.db.First(&existingTopic, topicID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			RespondWithError(w, http.StatusNotFound, ErrTopicNotFound)
		} else {
			log.Printf("Database error in UpdateTopic: %v", result.Error)
			RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		}
		return
	}

	var updateData models.Topic
	err := json.NewDecoder(r.Body).Decode(&updateData)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrInvalidRequestPayload)
		return
	}

	if existingTopic.Title == updateData.Title && existingTopic.Description == updateData.Description {
		RespondWithError(w, http.StatusBadRequest, ErrNoChangesDetected)
		return
	}

	if updateData.Title != existingTopic.Title {
		if errMsg := validation.ValidateTopicTitle(updateData.Title); errMsg != "" {
			RespondWithError(w, http.StatusBadRequest, errMsg)
			return
		}
		existingTopic.Title = updateData.Title
	}

	if updateData.Description != existingTopic.Description {
		if errMsg := validation.ValidateTopicDescription(updateData.Description); errMsg != "" {
			RespondWithError(w, http.StatusBadRequest, errMsg)
			return
		}
		existingTopic.Description = updateData.Description
	}

	result = h.db.Save(&existingTopic)
	if result.Error != nil {
		if validation.IsUniqueConstraintError(result.Error) {
			RespondWithError(w, http.StatusConflict, ErrTopicTitleExists)
			return
		}
		log.Printf("Database error in UpdateTopic: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusOK, existingTopic)
}

// Deletes a topic by ID
func (h *TopicHandler) DeleteTopic(w http.ResponseWriter, r *http.Request) {
	topicID := chi.URLParam(r, "id")

	result := h.db.Delete(&models.Topic{}, topicID)
	if result.Error != nil {
		log.Printf("Database error in DeleteTopic: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	if result.RowsAffected == 0 {
		RespondWithError(w, http.StatusNotFound, ErrTopicNotFound)
		return
	}

	RespondWithNoContent(w)
}
