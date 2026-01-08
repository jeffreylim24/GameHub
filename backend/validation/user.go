package validation

import "strings"

// Checks if a username is valid
// Returns an error message if invalid, empty string if valid
func ValidateUsername(username string) string {
	if strings.TrimSpace(username) == "" {
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
