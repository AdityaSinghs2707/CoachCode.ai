# CoachCode.ai — Implementation Plan & Status

## Completed

### 1. UI/UX
- [x] Sidebar + Topbar layout
- [x] Dark/Light theme toggle (ThemeContext)
- [x] Toast notifications (react-hot-toast)
- [x] Loading skeletons (Skeleton, CardSkeleton)
- [x] Pagination hook (usePagination)
- [x] Stats widgets on dashboard
- [x] Charts (Recharts): Bar chart (weekly growth), Pie chart (role distribution)
- [x] responsive layout

### 2. Online Compiler
- [x] Judge0 API integration (`/api/compiler/execute`)
- [x] Monaco Editor in Practice section
- [x] Language dropdown (C++, C, Python, Java, JavaScript)
- [x] Run button
- [x] Output, stderr, time, memory display
- [x] Save attempts to database (when questionId provided)
- [x] Rate limiting (30/min)

### 3. Smart Notes
- [x] React Quill rich text editor
- [x] Auto-save every 5 seconds
- [x] Search notes
- [x] NoteFolder model for categories
- [ ] Split-screen mode (material + notes) — optional enhancement
- [ ] Export PDF — add jspdf or similar
- [ ] Markdown support — Quill supports basic formatting

### 4. Sample Notes
- [x] Seed script: `node backend/scripts/seedSampleNotes.js`
- [x] DSA, OS, DBMS, CN notes in Materials table
- [x] Structured subject-wise content

### 5. Role System
- [x] Student: read, practice, tests, bookmark, notes, analytics
- [x] Faculty: + upload materials, add questions, create tests, announcements
- [x] Admin: + manage users, platform controls

### 6. Mock Test System
- [x] Timer-based test
- [x] Auto-submit on timeout
- [x] Start attempt flow
- [x] TestAttempt page with countdown

### 7. Contest Mode
- [x] Leaderboard API (`/api/contests/:id/leaderboard`)
- [x] Rank by score + submission time
- [x] Contest frontend with leaderboard view

### 8. AI Guide Bot
- [x] Floating chat widget
- [x] Rule-based knowledge base
- [x] Context-aware replies (compiler, notes, roadmap, contests, mock tests)
- [ ] OpenAI integration — optional (add OPENAI_API_KEY and extend)

### 9. Security & Production
- [x] Helmet
- [x] CORS (configurable via CORS_ORIGIN)
- [x] Rate limiting (general, auth, compiler)
- [x] express-validator (auth)
- [x] Central error middleware
- [ ] Sequelize migrations — use `sync` for now; add migrations later
- [ ] Transactions for test submission — optional

### 10. Performance
- [x] Pagination hook
- [x] Lazy loading in lists
- [ ] DB indexes — add on userId, email, createdAt where needed

### 11. Clean Architecture
- [x] Backend: controllers, services, routes, models, middleware, validators, utils
- [x] Frontend: components, pages, hooks, context, api, layouts

---

## Setup & Run

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env: DB_*, JWT_SECRET, CORS_ORIGIN
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Seed Sample Notes

```bash
cd backend
# Ensure at least one user exists (register via frontend)
node scripts/seedSampleNotes.js
```

## Judge0

- Use public `https://ce.judge0.com` (no key for free tier)
- For production: set `JUDGE0_BASE` and `JUDGE0_API_KEY` in .env

## Optional Enhancements

1. **PDF export** — Add `jspdf` + `html2canvas` for notes export
2. **Split-screen** — Notes + Material/Question side-by-side
3. **OpenAI** — Add AI bot with GPT for richer answers
4. **Migrations** — Replace `sync` with Sequelize migrations
5. **Feature flags** — Add admin UI to toggle FeatureFlag records
