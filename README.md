# CoachCode.ai
Placement preparation and coding practice platform — MERN stack with MySQL (Sequelize) and JWT role-based auth.

## Quick Start

### Prerequisites
- Node.js (v18+)
- MySQL (v8.0+)
- Git

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env: set DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET
npm install
npm run dev
```
Server runs at `http://localhost:5000`. API base: `http://localhost:5000/api`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:3800`. Vite proxies `/api` and `/uploads` to the backend.

### Database
Create a MySQL database (e.g. `coachcode_db`) and set `DB_NAME`, `DB_USER`, `DB_PASSWORD` in `backend/.env`. Tables are created automatically on first run (Sequelize sync).

## Project Structure
- **backend/** — Express API, Sequelize models, JWT auth, role middleware, uploads.
- **frontend/** — React (Vite), AuthContext, protected and role-based routes, dashboard and section pages.
- **ARCHITECTURE.md** — System design, database schema, API routes, middleware, and development roadmap.

## Features

### Implemented
- **Authentication** — JWT-based login/register with role-based access control
- **Dark/Light Theme** — Toggle via ThemeContext, CSS variables
- **Dashboard** — Stats widgets, Bar chart (weekly growth), Pie chart (role distribution)
- **Materials** — Subject-wise notes, file upload (PDF/PPT/DOC), search & filter
- **Practice** — Monaco Editor, Judge0 compiler integration, C++/Python/Java support
- **Online Compiler** — Run & Submit with testcase evaluation, time & memory display
- **Testcases** — Sample & hidden testcases per question
- **Mock Tests** — Timer-based tests, auto-submit on timeout
- **Smart Notes** — React Quill rich text editor, auto-save every 5 seconds, search
- **Bookmarks** — Save/remove questions and materials (available for all roles)
- **Roadmap** — Subject-wise learning roadmap with progress tracking
- **Announcements** — Faculty/Admin can post, all roles can view
- **Contests** — Contest mode with leaderboard (rank by score + time)
- **AI Guide Bot** — Floating chat widget with rule-based knowledge base
- **Admin Panel** — User management (CRUD, role assignment)
- **Security** — Helmet, CORS, rate limiting, express-validator

## Roles
- **Student** — Materials (read), Practice, Mock Tests, Roadmap, Bookmarks, Notes, Announcements, Contests
- **Faculty** — Same as Student + upload materials, add questions, create tests, post announcements, create contests
- **Admin** — Same as Faculty + manage users (CRUD, roles), access all features including Bookmarks

## Seed Test Cases
After setting up the database, run:
```bash
cd backend
node seedTestCases.js
```
This adds sample testcases for Two Sum, Reverse Linked List, and Binary Search questions.

## Make Admin
To promote a user to admin role:
```bash
cd backend
node makeAdmin.js
```

## Environment Variables
Create `backend/.env` with:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=coachcode_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3800
NODE_ENV=development
JUDGE0_BASE=https://ce.judge0.com
```

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| UI | CSS Variables, Dark/Light Theme |
| Editor | Monaco Editor |
| Charts | Recharts |
| Rich Text | React Quill |
| Backend | Node.js, Express |
| Database | MySQL, Sequelize ORM |
| Auth | JWT, bcryptjs |
| Compiler | Judge0 API |
| Security | Helmet, CORS, Rate Limiting |

## Optional Enhancements
1. **PDF Export** — Add `jspdf` + `html2canvas` for notes export
2. **Split-screen** — Notes + Material/Question side-by-side
3. **OpenAI** — Add AI bot with GPT for richer answers
4. **Migrations** — Replace `sync` with Sequelize migrations
5. **Deployment** — Host on Railway/Render (backend) + Vercel (frontend)

See **ARCHITECTURE.md** for full API list, schema, and deployment notes.
