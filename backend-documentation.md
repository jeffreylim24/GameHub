# Backend Documentation Standards

This guide defines documentation standards for the GameHub backend codebase, based on official Go and conventions.

## Go Documentation

### What MUST be documented

Every **exported (capitalized)** name should have a doc comment:
- Packages
- Types (structs, interfaces)
- Functions and methods
- Constants and variables

### How to write doc comments

#### 1. Start with the name being documented

```go
// Package pagination provides utilities for paginating database queries.
package pagination

// Params holds parsed pagination parameters from a request.
type Params struct { ... }

// ParseParams extracts page and page_size from the request query string.
func ParseParams(r *http.Request) Params { ... }
```

#### 2. Use complete sentences

- First sentence is the summary (appears in package listings)
- Use the declared name as the subject

#### 3. Function comments - explain what it returns or does

```go
// Good: Explains what is returned
// Quote returns a double-quoted Go string literal representing s.
func Quote(s string) string

// Good: Explains the side effect
// Exit causes the current program to exit with the given status code.
func Exit(code int)
```

#### 4. Boolean functions - use "reports whether"

```go
// HasPrefix reports whether the string s begins with prefix.
func HasPrefix(s, prefix string) bool
```

#### 5. HTTP handlers - document query params and behavior

```go
// GetPosts returns paginated posts with optional filters.
// Query params: page, page_size, topic_id, category, platform, author_id
func (h *PostHandler) GetPosts(w http.ResponseWriter, r *http.Request)
```

### What NOT to put in doc comments

| Don't document | Where it belongs |
|----------------|------------------|
| Internal implementation details | Comments inside the function body |
| Algorithm explanations | Comments inside the function body |
| Step-by-step breakdowns | Comments inside the function body |
| Unexported names | Optional, only if helpful for maintainers |

### Examples

**Package comment:**
```go
// Package pagination provides utilities for paginating database queries.
// It handles parsing query parameters, calculating offsets, and
// structuring paginated API responses.
package pagination
```

**Type comment:**
```go
// Params holds parsed pagination parameters from a request.
type Params struct {
    Page     int // Current page number (1-indexed)
    PageSize int // Items per page
    Offset   int // Calculated SQL offset
}
```

**Function comment:**
```go
// ParseParams extracts page and page_size from the request query string.
// Missing or invalid values use defaults (page=1, page_size=20).
// Page size is capped at MaxPageSize.
func ParseParams(r *http.Request) Params
```

**Internal comments (inside function body):**
```go
func ParseParams(r *http.Request) Params {
    // Get query parameters
    pageStr := r.URL.Query().Get("page")

    // Parse page number, defaulting to 1 if invalid
    page, err := strconv.Atoi(pageStr)
    if err != nil || page < 1 {
        page = DefaultPage
    }

    // Cap page size to prevent excessive queries
    if pageSize > MaxPageSize {
        pageSize = MaxPageSize
    }

    // Calculate offset: Page 1 = Offset 0, Page 2 = Offset 20, etc.
    offset := (page - 1) * pageSize

    return Params{...}
}
```
---

## References

- [Go Doc Comments](https://go.dev/doc/comment) - Official Go documentation guide
- [Effective Go](https://go.dev/doc/effective_go) - Go style guide
