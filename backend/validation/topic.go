package validation

import "strings"

// Checks if a title is valid
// Returns an error message if invalid, empty string if valid
func ValidateTopicTitle(title string) string {
	title = strings.TrimSpace(title)
	if len(title) == 0 {
		return ErrTopicTitleRequired
	}
	if len(title) < TopicTitleMinLength {
		return ErrTopicTitleMinLength
	}
	if len(title) > TopicTitleMaxLength {
		return ErrTopicTitleMaxLength
	}

	return ""
}

// Checks if a description is valid
// Returns an error message if invalid, empty string if valid
func ValidateTopicDescription(description string) string {
	description = strings.TrimSpace(description)
	if len(description) > TopicDescriptionMaxLength {
		return ErrTopicDescriptionMaxLength
	}

	return ""
}
