package handlers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jeffreylim24/GameHub/models"
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

	if validation.IsNullableIDInvalid(topic.CreatedBy) {
		RespondWithError(w, http.StatusBadRequest, validation.ErrUserIDRequired)
		return
	}

	var creator models.User
	if err := h.db.First(&creator, *topic.CreatedBy).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			RespondWithError(w, http.StatusBadRequest, ErrCreatorNotExist)
			return
		}
		log.Printf("Database error in CreateTopic (checking creator): %v", err)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

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

// Retrieves all topics
func (h *TopicHandler) GetTopics(w http.ResponseWriter, r *http.Request) {
	var topics []models.Topic

	result := h.db.Preload("Creator").Order("created_at DESC").Find(&topics)
	if result.Error != nil {
		log.Printf("Database error in GetTopics: %v", result.Error)
		RespondWithError(w, http.StatusInternalServerError, ErrInternalServer)
		return
	}

	RespondWithJSON(w, http.StatusOK, topics)
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
