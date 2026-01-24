package validation

import "strings"

// ValidatePostTitle returns an error message if the post title is invalid.
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

// ValidatePostContent returns an error message if the post content is invalid.
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

// ValidatePostCategory returns an error message if the post category is invalid.
func ValidatePostCategory(category string) string {
	category = strings.TrimSpace(category)
	for _, c := range AllowedPostCategories {
		if strings.EqualFold(c, category) {
			return ""
		}
	}
	return ErrPostCategoryInvalid
}

// ValidatePostPlatform returns an error message if the post platform is invalid.
func ValidatePostPlatform(platform string) string {
	platform = strings.TrimSpace(platform)
	for _, p := range AllowedPostPlatforms {
		if strings.EqualFold(p, platform) {
			return ""
		}
	}
	return ErrPostPlatformInvalid
}
