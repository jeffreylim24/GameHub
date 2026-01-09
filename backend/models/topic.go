package models

import (
	"time"
)

// Topic represents a game that can be discussed
// Each topic is essentially a game (e.g., "The Legend of Zelda", "Elden Ring")
type Topic struct {
	TopicID     uint      `gorm:"primaryKey;autoIncrement" json:"topic_id"`
	Title       string    `gorm:"not null;size:200" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	CreatedBy   *uint     `gorm:"index" json:"created_by,omitempty"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relationships (belongs to)
	Creator User `gorm:"foreignKey:CreatedBy;references:UserID;constraint:OnDelete:SET NULL" json:"creator,omitempty"`
}
