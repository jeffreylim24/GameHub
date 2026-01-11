package validation

import (
	"strings"
)

// Checks if a username is valid
// Returns an error message if invalid, empty string if valid
func ValidateUsername(username string) string {
	username = strings.TrimSpace(username)
	if len(username) == 0 {
		return ErrUsernameRequired
	}
	if len(username) < UsernameMinLength {
		return ErrUsernameMinLength
	}
	if len(username) > UsernameMaxLength {
		return ErrUsernameMaxLength
	}

	return ""
}

// Checks if a password is valid
// Returns an error message if invalid, empty string if valid
func ValidatePassword(password string) string {
	if len(password) == 0 {
		return ErrPasswordRequired
	}
	if len(password) < PasswordMinLength {
		return ErrPasswordMinLength
	}
	if len(password) > PasswordMaxLength {
		return ErrPasswordMaxLength
	}

	return ""
}

func ValidateRole(role string) string {
	if role != "user" && role != "admin" {
		return ErrInvalidRole
	}
	return ""
}
