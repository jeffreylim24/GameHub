package validation

import "strings"

// Checks if the given error is a unique constraint violation
func IsUniqueConstraintError(err error) bool {
	if err == nil {
		return false
	}
	errMsg := err.Error()
	return strings.Contains(errMsg, "duplicate key value") ||
		strings.Contains(errMsg, "UNIQUE constraint failed") ||
		strings.Contains(errMsg, "violates unique constraint")
}

// Checks if the given ID is zero (invalid/unset)
func IsIDZero(id uint) bool {
	return id == 0
}
