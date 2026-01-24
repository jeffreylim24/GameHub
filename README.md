# GameHub
Welcome to GameHub — a web forum for discussing your favorite games.

By: Jeffrey Lim @ Htet Min Shein, A0300154Y

## Overview
GameHub organizes content in a simple hierarchy:
- Topic (a game, e.g., Elden Ring)
  - Post (a discussion, review, question, highlight, or tips)
    - Comment (a reply to a post)

## Setup Instructions

### Prerequisites
- Go 1.25+
- Node.js 18+ (with npm) or Bun
- PostgreSQL

### Database Setup
```bash
# Create database and user (from psql)
CREATE DATABASE gamehub
CREATE USER gamehub_user WITH PASSWORD 'your_password_here'
GRANT ALL PRIVILEGES ON DATABASE gamehub TO gamehub_user
```

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env and set DB_PASSWORD, JWT_SECRET, CORS_ALLOWED_ORIGINS
# Instructions are written as comments above each variable
go mod download
go run .
```
The server runs on `http://localhost:8080` by default (configurable via `PORT` in `.env`).

### Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL
# Instructions are written as comments above each variable

# Using npm
npm install
npm run dev

# Or using Bun
bun install
bun run dev
```
The dev server URL will be shown in the terminal output.

## User Manual

### Getting started
1. Create an account from the Sign Up page.
2. Log in to unlock posting and editing features.
3. Use the navigation bar to move between Home, Topics, and your Profile.

### Pages and what you can do
1. Home
   - View all posts across all topics (newest first).
   - Click a post to open its full discussion.
   - Search for a post! (Searches for posts **containing** your keyword in the title)
2. Topics
   - Browse all game topics.
   - Create a new topic (requires login).
   - Click a topic to view posts within it.
   - Search for a topic! (Searches for topics **containing** your keyword in the title)
3. Topic page
   - See topic details and all posts under that topic.
   - Create a post directly from this page.
   - Admins can edit or delete the topic.
   - Search for posts here too!
4. Post page
   - Read the full post and its comments.
   - Add a comment (requires login).
   - Authors and admins can edit or delete the post.
5. User profile
   - View a user’s posts and comments in tabs.
   - Click any post or comment to jump to its thread.
   - Delete your own account (posts/comments remain, author becomes “Deleted user”).

### Creating content
- Create topic: Go to Topics → Create Topic, enter a title and optional description.
- Create post: From a topic page or the “Create Post” flow.
  - Optional fields: category (Discussion/Question/Review/Highlight/Tips) and platform.
  - Spoiler checkbox if the post contains spoilers.
- Create comment: On a post page, write a reply and mark spoilers if needed.

### Editing and deleting
- Topics: Admins only.
- Posts: The author or an admin.
- Comments: The author or an admin.
- Deleting a topic removes all posts and comments under it.
- Deleting a post removes its comments.

### Spoiler handling
Posts and comments can be marked as containing spoilers. Spoiler labels appear on cards to warn other users.

### FAQ
Q: How do I create or promote an admin account?
A: An admin is a regular user whose role is set to `admin` in the database. You will not be able to do so on GameHub via regular means, but feel free to make one for yourself in development.

Q: How do I create my own admin user in development?
A: Create a normal account first (on your development site), then promote it in PostgreSQL:
```
psql -U gamehub_user -d gamehub
UPDATE users SET role = 'admin' WHERE username = 'your_username';
SELECT user_id, username, role FROM users WHERE username = 'your_username'; -- verify the promotion
```

Q: Why can’t I post or edit content?
A: You must be logged in to create, edit, or delete content.


## AI Usage Declaration
1. I used AI to help me weigh my options and help me pick my tech stack.
2. I used AI to help me generate a detailed implementation plan with explanation to guide me through this project.
3. I used AI to explain to me unfamiliar syntax to better learn a new tech stack.
4. I used AI to generate a seed script to populate my database with sample data for ease of development of my frontend.
5. I used AI to help me scour through areas where I might have missed out documentation like GoDoc and JSDoc comments.
6. I used AI to review my PRs to help me identify gaps that I have missed out.
7. I used AI to help me research and summarise documentation conventions for Go and Javascript/Typescript so that I could reference it when writing documentation.
