package validation

import "strings"

// Checks if the comment content is valid
// Returns an error message string if invalid, or an empty string if valid
func ValidateCommentContent(content string) string {
	content = strings.TrimSpace(content)
	if len(content) == 0 {
		return ErrCommentContentRequired
	}
	if len(content) > CommentContentMaxLength {
		return ErrCommentContentMaxLength
	}
	return ""
}
