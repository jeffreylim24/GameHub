// Package pagination provides utilities for paginating database queries.
// It handles parsing query parameters, calculating offsets, and
// structuring paginated API responses.
package pagination

import (
	"math"
	"net/http"
	"strconv"
)

// Pagination defaults and limits.
const (
	DefaultPage     = 1
	DefaultPageSize = 20
	MaxPageSize     = 100
)

// Params holds parsed pagination parameters from a request.
type Params struct {
	Page     int // Current page number (1-indexed)
	PageSize int // Items per page
	Offset   int // Calculated SQL offset
}

// Metadata contains pagination information for API responses.
type Metadata struct {
	CurrentPage int   `json:"current_page"`
	PageSize    int   `json:"page_size"`
	TotalItems  int64 `json:"total_items"`
	TotalPages  int   `json:"total_pages"`
	HasNext     bool  `json:"has_next"`
	HasPrevious bool  `json:"has_previous"`
}

// Response wraps paginated data with metadata.
type Response struct {
	Data       interface{} `json:"data"`
	Pagination Metadata    `json:"pagination"`
}

// ParseParams extracts page and page_size from the request query string.
// Missing or invalid values use defaults (page=1, page_size=20).
// Page size is capped at MaxPageSize.
func ParseParams(r *http.Request) Params {
	pageStr := r.URL.Query().Get("page")
	pageSizeStr := r.URL.Query().Get("page_size")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = DefaultPage
	}

	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 {
		pageSize = DefaultPageSize
	}

	if pageSize > MaxPageSize {
		pageSize = MaxPageSize
	}

	offset := (page - 1) * pageSize

	return Params{
		Page:     page,
		PageSize: pageSize,
		Offset:   offset,
	}
}

// NewMetadata creates pagination metadata from params and total item count.
func NewMetadata(params Params, totalItems int64) Metadata {
	totalPages := int(math.Ceil(float64(totalItems) / float64(params.PageSize)))

	// Ensure at least 1 page even when empty to prevent "Page 1 of 0" scenarios
	if totalPages == 0 {
		totalPages = 1
	}

	return Metadata{
		CurrentPage: params.Page,
		PageSize:    params.PageSize,
		TotalItems:  totalItems,
		TotalPages:  totalPages,
		HasNext:     params.Page < totalPages,
		HasPrevious: params.Page > 1,
	}
}

// NewResponse creates a paginated response combining data with metadata.
func NewResponse(data interface{}, params Params, totalItems int64) Response {
	return Response{
		Data:       data,
		Pagination: NewMetadata(params, totalItems),
	}
}
