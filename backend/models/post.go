package models

import (
	"time"
)

// Post represents a discussion post within a topic (game).
// For now, posts only contain text content; future versions may support media attachments.
type Post struct {
	PostID      uint      `gorm:"primaryKey;autoIncrement" json:"post_id"`
	TopicID     uint      `gorm:"not null;index" json:"topic_id"`
	AuthorID    *uint     `gorm:"index" json:"author_id,omitempty"`
	Title       string    `gorm:"not null;size:300" json:"title"`
	Content     string    `gorm:"type:text;not null" json:"content"`
	Category    string    `gorm:"size:50" json:"category,omitempty"` // e.g., Discussion, Question, Review, Highlight, Tips
	Platform    string    `gorm:"size:50" json:"platform,omitempty"` // e.g., PC, PlayStation, Xbox, Nintendo Switch
	HasSpoilers bool      `gorm:"default:false" json:"has_spoilers"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relationships (belongs to)
	Topic  Topic `gorm:"constraint:OnDelete:CASCADE" json:"topic"`
	Author User  `gorm:"foreignKey:AuthorID;constraint:OnDelete:SET NULL" json:"author,omitempty"`
}
