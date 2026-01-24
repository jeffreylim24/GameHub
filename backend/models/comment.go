package models

import (
	"time"
)

// Comment represents a reply to a post.
type Comment struct {
	CommentID   uint      `gorm:"primaryKey;autoIncrement" json:"comment_id"`
	PostID      uint      `gorm:"not null;index" json:"post_id"`
	AuthorID    *uint     `gorm:"index" json:"author_id,omitempty"`
	Content     string    `gorm:"type:text;not null" json:"content"`
	HasSpoilers bool      `gorm:"default:false" json:"has_spoilers"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relationships (belongs to)
	Post   Post `gorm:"constraint:OnDelete:CASCADE" json:"post"`
	Author User `gorm:"foreignKey:AuthorID;constraint:OnDelete:SET NULL" json:"author,omitempty"`
}
