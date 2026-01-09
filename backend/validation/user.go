package validation

import "strings"

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
