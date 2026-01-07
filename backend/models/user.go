package models

import (
	"time"
)

// User represents a user in the system
// Using simple username-based auth (like when2meet.com)
type User struct {
	UserID    uint      `gorm:"primaryKey;autoIncrement" json:"user_id"`
	Username  string    `gorm:"uniqueIndex;not null;size:50" json:"username"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}
