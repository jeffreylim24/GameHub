package validation

import "strings"

// ValidateTopicTitle returns an error message if the title is invalid.
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

// ValidateTopicDescription returns an error message if the description is invalid.
func ValidateTopicDescription(description string) string {
	description = strings.TrimSpace(description)
	if len(description) > TopicDescriptionMaxLength {
		return ErrTopicDescriptionMaxLength
	}

	return ""
}
