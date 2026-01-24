package validation

import "strings"

// ValidateCommentContent returns an error message if the comment content is invalid.
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
