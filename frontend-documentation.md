# Frontend Documentation Guidelines

This guide establishes documentation standards for the GameHub React TypeScript frontend. Follow these practices to maintain clean, maintainable, and well-documented code.

## Core Principles

1. **Write clean, self-documenting code first** - Comments supplement good code, not compensate for bad code
2. **Comment the "why," not the "what"** - Don't explain what code obviously does
3. **Keep documentation up-to-date** - Outdated comments are worse than no comments
4. **Assume future developers will misunderstand** - Write for clarity

---

## Code Comments

### Three Types of Comments

| Type | Purpose | When to Use |
|------|---------|-------------|
| **Maintenance** | Track technical debt, future work | TODOs, warnings, shame markers |
| **Praxis** | Usage instructions | Public APIs, exported functions, complex utilities |
| **Expository** | Explain reasoning | Non-obvious decisions, workarounds, complex logic |

### Comment Do's and Don'ts

| Do | Don't |
|---|---|
| Comment on the "why," not the obvious "what" | Comment what code obviously does |
| Write comments for complex/non-obvious logic | Leave commented-out code in codebase |
| Use comments to warn about consequences | Write outdated or incorrect comments |
| Use `@TODO` and `@FIXME` with ticket numbers | Use comments for version history or attribution |
| Write formal docs for public APIs | Write "closing brace" comments (`// end if`) |
| Keep comments up-to-date with code | Try to make up for bad code with comments |

### Good vs Bad Examples

**Bad - States the obvious:**
```typescript
// Get the user
const user = getUser();

// Check if user exists
if (user) { ... }
```

**Good - Explains the why:**
```typescript
// Fetch user before auth check - session may have expired during page load
const user = await getUser();

// Guest users can view but not interact - redirect to login for actions
if (!user && requiresAuth) { ... }
```

---

## JSDoc/TSDoc Standards

### Function Documentation

Document all exported functions with JSDoc:

```typescript
/**
 * Fetches paginated posts for a specific topic with optional filters.
 *
 * @param topicId - The topic ID to fetch posts for
 * @param options - Pagination and filter options
 * @param options.page - Page number (1-indexed)
 * @param options.limit - Number of posts per page
 * @param options.category - Optional category filter
 * @returns Promise resolving to paginated post response
 * @throws {ApiError} When the topic doesn't exist or network fails
 *
 * @example
 * const posts = await getTopicPosts(1, { page: 1, limit: 10 });
 */
export async function getTopicPosts(
  topicId: number,
  options: PostQueryOptions
): Promise<PaginatedResponse<Post>> { ... }
```

### Interface/Type Documentation

```typescript
/**
 * Represents a discussion post within a game topic.
 * Posts belong to a single topic and can have multiple comments.
 */
export interface Post {
  /** Unique identifier for the post */
  post_id: number;

  /** The topic/game this post belongs to */
  topic_id: number;

  /** Post title - must be 5-300 characters */
  title: string;

  /**
   * Post content in plain text.
   * @minLength 10
   * @maxLength 5000
   */
  content: string;

  /** Category for filtering - Discussion, Question, Review, or Highlight */
  category?: PostCategory;

  /** Whether the post contains story spoilers */
  has_spoilers: boolean;
}
```

### Component Documentation

```typescript
/**
 * Displays a paginated list of posts with filtering controls.
 *
 * @remarks
 * This component handles its own data fetching and pagination state.
 * Use the `onPostSelect` callback to handle post navigation.
 *
 * @example
 * ```tsx
 * <PostList
 *   topicId={1}
 *   initialPage={1}
 *   onPostSelect={(post) => navigate(`/posts/${post.post_id}`)}
 * />
 * ```
 */
export function PostList({ topicId, initialPage, onPostSelect }: PostListProps) { ... }
```

---

## Maintenance Comments

### TODO Comments

Always include a ticket reference when possible:

```typescript
// @TODO: Add rate limiting to prevent spam - GAMEHUB-123
// @TODO: Implement optimistic updates for better UX
```

### FIXME Comments

For known issues that need attention:

```typescript
// @FIXME: Race condition when rapid pagination - needs debounce
// @FIXME: Memory leak in useEffect cleanup - investigate
```

### SHAME Comments

For acknowledged technical debt with context:

```typescript
// @SHAME: Using any type here because backend returns inconsistent shape.
// Should be fixed when API v2 launches with proper typing.
type ApiResponse = any;
```

### Problem/Solution Comments

For workarounds due to limitations:

```typescript
/*
 * @PROBLEM: React 19 Suspense doesn't support error boundaries for async components.
 * Using try-catch wrapper until official support is added.
 * @SOLUTION: When React adds native support, remove this wrapper and use ErrorBoundary directly.
 */
```

---

## Component Documentation with Storybook

### Story Structure

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

/**
 * Primary UI button component for user interactions.
 * Supports multiple variants, sizes, and states.
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Visual style variant',
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      description: 'Button size',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/** Default primary button state */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

/** Disabled state - prevents interaction */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled',
    disabled: true,
  },
};
```

---

## File-Level Documentation

### Module Headers

Add a header comment to complex modules:

```typescript
/**
 * @fileoverview API client for post-related operations.
 *
 * Handles CRUD operations for posts including:
 * - Fetching posts with pagination and filters
 * - Creating and updating posts
 * - Managing post spoiler states
 *
 * @module api/posts
 * @see {@link Post} for the post data structure
 */
```

### Constants and Configuration

```typescript
/**
 * API configuration constants.
 * @see backend/.env.example for corresponding server config
 */
export const API_CONFIG = {
  /** Base URL for all API requests */
  BASE_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',

  /** Request timeout in milliseconds */
  TIMEOUT: 10000,

  /** Default pagination limit */
  DEFAULT_PAGE_SIZE: 10,
} as const;
```

---

## Commit Messages

Follow Conventional Commits format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change without feat/fix |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `chore` | Build, config, dependencies |

### Examples

```
feat(posts): add pagination controls to post list

- Add PaginationControls component
- Integrate with posts API pagination
- Update PostList to use new controls

Closes GAMEHUB-45
```

```
fix(auth): handle session expiry during page navigation

Users were getting stuck on loading state when session expired.
Now properly redirects to login with return URL.
```

---

## Project Documentation

### README.md Structure

1. **Project Title** - Name and one-line description
2. **Description** - What it does, what problem it solves
3. **Key Features** - Bulleted list of main functionality
4. **Prerequisites** - Required software and versions
5. **Installation** - Copy-pasteable setup commands
6. **Running Locally** - Dev server commands
7. **Running Tests** - Test execution commands
8. **Technology Stack** - Major technologies used
9. **Contributing** - Link to CONTRIBUTING.md

### CHANGELOG.md Format

Follow [Keep a Changelog](https://keepachangelog.com) format:

```markdown
# Changelog

## [Unreleased]

### Added
- Pagination controls for post lists

### Changed
- Updated post card design for better readability

### Fixed
- Session expiry redirect loop

## [1.0.0] - 2025-01-15

### Added
- Initial release with core forum functionality
```

---

## What NOT to Document

- Self-evident code (`const name = user.name; // get user name`)
- Closing braces (`} // end if`)
- Developer names or attribution (use git history)
- Version history in comments (use CHANGELOG.md)
- Commented-out code (delete it, git has history)

---

## Quick Reference

### Minimum Documentation Requirements

| Element | Required Documentation |
|---------|----------------------|
| Exported function | JSDoc with `@param`, `@returns` |
| Exported interface/type | JSDoc description, property comments for non-obvious fields |
| React component | JSDoc with usage example |
| Complex logic | Inline comment explaining "why" |
| Workaround/hack | `@SHAME` or `@PROBLEM` comment with context |
| Future work | `@TODO` with ticket number |
| API module | File header with module overview |

### Documentation Checklist

- [ ] All exported functions have JSDoc
- [ ] Complex logic has "why" comments
- [ ] No commented-out code
- [ ] No obvious/redundant comments
- [ ] TODOs have ticket references
- [ ] Workarounds are documented with context
- [ ] README is up-to-date
- [ ] CHANGELOG reflects recent changes
