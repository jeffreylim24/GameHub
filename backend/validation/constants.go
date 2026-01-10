package validation

import "fmt"

// User validation constants
const (
	UsernameMinLength = 3
	UsernameMaxLength = 50
)

// User validation error messages
var (
	ErrUsernameRequired  = "Username is required"
	ErrUsernameMinLength = fmt.Sprintf("Username must be at least %d characters long", UsernameMinLength)
	ErrUsernameMaxLength = fmt.Sprintf("Username must not exceed %d characters", UsernameMaxLength)
)

// Topic validation constants
const (
	TopicTitleMinLength       = 2
	TopicTitleMaxLength       = 200
	TopicDescriptionMaxLength = 500
)

// Topic validation error messages
var (
	ErrTopicTitleRequired        = "Title is required"
	ErrTopicTitleMinLength       = fmt.Sprintf("Title must be at least %d characters long", TopicTitleMinLength)
	ErrTopicTitleMaxLength       = fmt.Sprintf("Title must not exceed %d characters", TopicTitleMaxLength)
	ErrTopicDescriptionMaxLength = fmt.Sprintf("Description must not exceed %d characters", TopicDescriptionMaxLength)
)

// Post validation constants
const (
	PostTitleMinLength   = 5
	PostTitleMaxLength   = 300
	PostContentMinLength = 10
	PostContentMaxLength = 5000
)

// Post validation error messages
var (
	ErrPostTitleRequired    = "Post title cannot be empty."
	ErrPostTitleMinLength   = fmt.Sprintf("Post title must be at least %d characters long.", PostTitleMinLength)
	ErrPostTitleMaxLength   = fmt.Sprintf("Post title cannot exceed %d characters.", PostTitleMaxLength)
	ErrPostContentRequired  = "Post content cannot be empty."
	ErrPostContentMinLength = fmt.Sprintf("Post content must be at least %d characters long.", PostContentMinLength)
	ErrPostContentMaxLength = fmt.Sprintf("Post content cannot exceed %d characters.", PostContentMaxLength)
	ErrPostCategoryInvalid  = "Invalid post category. Allowed categories are: Discussion, Question, Review, Highlight, Tips."
	ErrPostPlatformInvalid  = "Invalid post platform. Allowed platforms are: PC, PlayStation, Xbox, Nintendo Switch."
)

// Allowed post categories
var AllowedPostCategories = []string{"", "Discussion", "Question", "Review", "Highlight", "Tips"}

// Allowed post platforms
var AllowedPostPlatforms = []string{"", "PC", "PlayStation", "Xbox", "Nintendo Switch"}

// Comment validation constants
const (
	CommentContentMaxLength = 1000
)

// Comment validation error messages
var (
	ErrCommentContentRequired  = "Comment content cannot be empty."
	ErrCommentContentMaxLength = fmt.Sprintf("Comment content cannot exceed %d characters.", CommentContentMaxLength)
)

// ID validation error messages
var (
	ErrUserIDRequired    = "User ID is required"
	ErrTopicIDRequired   = "Topic ID is required"
	ErrPostIDRequired    = "Post ID is required"
	ErrCommentIDRequired = "Comment ID is required"
)
