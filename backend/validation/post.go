package validation

import "strings"

// Checks if the post title is valid
// Returns an error message if invalid, empty string if valid
func ValidatePostTitle(title string) string {
	title = strings.TrimSpace(title)
	if len(title) == 0 {
		return ErrPostTitleRequired
	}
	if len(title) < PostTitleMinLength {
		return ErrPostTitleMinLength
	}
	if len(title) > PostTitleMaxLength {
		return ErrPostTitleMaxLength
	}
	return ""
}

// Checks if the post content is valid
// Returns an error message if invalid, empty string if valid
func ValidatePostContent(content string) string {
	content = strings.TrimSpace(content)
	if len(content) == 0 {
		return ErrPostContentRequired
	}
	if len(content) < PostContentMinLength {
		return ErrPostContentMinLength
	}
	if len(content) > PostContentMaxLength {
		return ErrPostContentMaxLength
	}
	return ""
}

// Validates the post category against allowed categories
// Returns an error message if invalid, empty string if valid
func ValidatePostCategory(category string) string {
	for _, c := range AllowedPostCategories {
		if strings.EqualFold(c, category) {
			return ""
		}
	}
	return ErrPostCategoryInvalid
}

// Validates the post platform against allowed platforms
// Returns an error message if invalid, empty string if valid
func ValidatePostPlatform(platform string) string {
	for _, p := range AllowedPostPlatforms {
		if strings.EqualFold(p, platform) {
			return ""
		}
	}
	return ErrPostPlatformInvalid
}
