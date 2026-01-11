package handlers

// Common error messages
const (
	ErrInvalidRequestPayload = "Invalid request payload"
	ErrInternalServer        = "Internal server error"
	ErrNoChangesDetected     = "No changes detected"
)

// User-related error messages
const (
	ErrUserNotFound    = "User not found"
	ErrUsernameExists  = "Username already exists"
	ErrCreatorNotExist = "Creator user does not exist"
)

// Auth-related error messages
const (
	ErrInvalidCredentials = "Invalid username or password"
)

// Topic-related error messages
const (
	ErrTopicNotFound    = "Topic not found"
	ErrTopicTitleExists = "A topic with this title already exists"
)

// Post-related error messages
const (
	ErrPostNotFound = "Post not found"
)

// Comment-related error messages
const (
	ErrCommentNotFound = "Comment not found"
)
