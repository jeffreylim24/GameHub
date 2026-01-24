package validation

import (
	"strings"
)

// ValidateUsername returns an error message if the username is invalid.
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

// ValidatePassword returns an error message if the password is invalid.
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
