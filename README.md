# GameHub
GameHub -- a discussion forum for gamers

By: Jeffrey Lim @ Htet Min Shein, A0300154Y

## Setup Instructions

### Prerequisites
- Go 1.25+
- Node.js 18+ (with npm) or Bun
- PostgreSQL

### Database Setup
```bash
# Create database and user (from psql)
CREATE DATABASE gamehub;
CREATE USER gamehub_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE gamehub TO gamehub_user;
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

## AI Usage Declaration
1. I used AI to help me weigh my options and help me pick my tech stack.
2. I used AI to help me generate a detailed implementation plan with explanation to guide me through this project.
3. I used AI to explain to me unfamiliar syntax to better learn a new tech stack.
4. I used AI to generate a seed script to populate my database with sample data for ease of development of my frontend.
5. I used AI to help me scour through areas where I might have missed out documentation like GoDoc and JSDoc comments.
6. I used AI to review my PRs to help me identify gaps that I have missed out.