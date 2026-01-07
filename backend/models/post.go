package models

import (
	"time"
)

// Post represents a discussion post within a topic (game)
// For now, can only contain text content. Future versions may support media attachments.
type Post struct {
	PostID      uint      `gorm:"primaryKey;autoIncrement" json:"post_id"`
	TopicID     uint      `gorm:"not null;index" json:"topic_id"`
	AuthorID    uint      `gorm:"not null;index" json:"author_id"`
	Title       string    `gorm:"not null;size:300" json:"title"`
	Content     string    `gorm:"type:text;not null" json:"content"`
	Category    string    `gorm:"size:50;default:'Discussion'" json:"category,omitempty"` // e.g., Discussion, Question, Review
	Platform    string    `gorm:"size:50" json:"platform,omitempty"`                      // e.g., PC, PlayStation, Xbox, Nintendo Switch
	HasSpoilers bool      `gorm:"default:false" json:"has_spoilers"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relationships (belongs to)
	Topic  Topic `json:"topic"`
	Author User  `gorm:"foreignKey:AuthorID" json:"author"`
}
