// Package models defines database models for the GameHub backend.
package models

import (
	"time"
)

// User represents a user in the system.
type User struct {
	UserID       uint      `gorm:"primaryKey;autoIncrement" json:"user_id"`
	Username     string    `gorm:"uniqueIndex;not null;size:50" json:"username"`
	PasswordHash string    `gorm:"not null;size:72" json:"-"`
	Role         string    `gorm:"not null;default:'user';size:16" json:"role"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
}
