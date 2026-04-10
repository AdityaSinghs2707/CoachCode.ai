# CoachCode.ai — System Architecture & Development Guide
 
## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (React SPA)                             │
│  Auth Context │ Protected Routes │ Role-based UI │ Theme (Dark/Light)    │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │ HTTPS / REST API
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    API LAYER (Express.js)                                 │
│  CORS │ Body Parser │ JWT Auth Middleware │ Role Middleware (RBAC)        │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────────────────┐
│  Auth Routes     │   │  Resource       │   │  File Upload (Multer)        │
│  /api/auth/*     │   │  Routes         │   │  /uploads, materials         │
└────────┬────────┘   └────────┬────────┘   └──────────────┬────────────────┘
         │                     │                           │
         └─────────────────────┼───────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    SERVICE / CONTROLLER LAYER                            │
│  Auth │ Users │ Materials │ Questions │ Tests │ Roadmap │ Announcements  │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    ORM LAYER (Sequelize)                                 │
│  Models │ Migrations │ Associations │ Validations                        │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    MySQL DATABASE                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema Design

### 2.1 Entity-Relationship Summary

| Table              | Purpose                                      | Key Relations                    |
|--------------------|----------------------------------------------|----------------------------------|
| users              | All users (student, faculty, admin)          | —                                |
| materials          | Study materials (PDF, PPT, notes)            | users (uploadedBy)               |
| subjects           | Subject/category for materials & questions  | —                                |
| questions          | Coding & theory questions                    | subjects, users (createdBy)      |
| question_attempts  | Student attempts on questions               | users, questions                 |
| tests              | Mock tests                                   | users (createdBy)                |
| test_questions     | Many-to-many: tests ↔ questions             | tests, questions                 |
| test_attempts      | Student test attempts                        | users, tests                     |
| roadmaps           | Topic-wise roadmap items                     | subjects (optional)              |
| roadmap_progress   | User progress on roadmap topics             | users, roadmaps                  |
| bookmarks          | User bookmarks (questions/materials)        | users, questions/materials      |
| announcements      | Faculty announcements                        | users (createdBy)               |
| contests           | Coding contests                              | users (createdBy)                |
| contest_submissions| Contest submissions                          | users, contests, questions       |
| notes              | Personal smart notes                         | users                            |

### 2.2 Table Definitions (Sequelize-ready)

**users**  
- id (PK), name, email (unique), password (hashed), role (student|faculty|admin), createdAt, updatedAt

**subjects**  
- id (PK), name, slug, description, createdAt, updatedAt

**materials**  
- id (PK), subjectId (FK), title, description, fileUrl, fileType (pdf|ppt|doc), uploadedById (FK users), createdAt, updatedAt

**questions**  
- id (PK), subjectId (FK), title, description, type (coding|theory), difficulty (easy|medium|hard), companyTag, starterCode, solutionCode, createdById (FK users), createdAt, updatedAt

**question_attempts**  
- id (PK), userId (FK), questionId (FK), code, language, status (accepted|wrong|pending), score, submittedAt

**tests**  
- id (PK), title, description, durationMinutes, createdById (FK users), createdAt, updatedAt

**test_questions**  
- id (PK), testId (FK), questionId (FK), orderIndex, marks

**test_attempts**  
- id (PK), userId (FK), testId (FK), startedAt, submittedAt, score, totalMarks, answers (JSON)

**roadmaps**  
- id (PK), subjectId (FK nullable), title, description, orderIndex, createdAt, updatedAt

**roadmap_progress**  
- id (PK), userId (FK), roadmapId (FK), status (not_started|in_progress|completed), completedAt

**bookmarks**  
- id (PK), userId (FK), itemType (question|material), itemId (generic ref), createdAt

**announcements**  
- id (PK), title, body, createdById (FK users), createdAt, updatedAt

**contests**  
- id (PK), title, description, startTime, endTime, createdById (FK users), createdAt, updatedAt

**contest_submissions**  
- id (PK), contestId (FK), userId (FK), questionId (FK), code, language, status, score, submittedAt

**notes**  
- id (PK), userId (FK), title, content (TEXT/JSON for rich text), createdAt, updatedAt

---

## 3. Backend Folder Structure

```
backend/
├── config/
│   └── db.js                 # Sequelize instance & connectDB
├── middleware/
│   └── auth.js               # JWT verify + role-based (requireRole)
├── models/
│   └── index.js              # Load all models & set associations
│   └── User.js
│   └── Subject.js
│   └── Material.js
│   └── Question.js
│   └── QuestionAttempt.js
│   └── Test.js
│   └── TestQuestion.js
│   └── TestAttempt.js
│   └── Roadmap.js
│   └── RoadmapProgress.js
│   └── Bookmark.js
│   └── Announcement.js
│   └── Contest.js
│   └── ContestSubmission.js
│   └── Note.js
├── controllers/
│   └── authController.js
│   └── userController.js
│   └── materialController.js
│   └── questionController.js
│   └── testController.js
│   └── roadmapController.js
│   └── bookmarkController.js
│   └── announcementController.js
│   └── contestController.js
│   └── noteController.js
├── routes/
│   └── authRoutes.js
│   └── userRoutes.js
│   └── materialRoutes.js
│   └── questionRoutes.js
│   └── testRoutes.js
│   └── roadmapRoutes.js
│   └── bookmarkRoutes.js
│   └── announcementRoutes.js
│   └── contestRoutes.js
│   └── noteRoutes.js
│   └── index.js              # Aggregate routes
├── uploads/                  # Multer destination (gitignore)
├── .env
├── server.js
└── package.json
```

---

## 4. Frontend Folder Structure

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js          # Axios instance + interceptors (JWT)
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── components/
│   │   ├── common/           # Button, Input, Card, Layout, ThemeToggle
│   │   ├── layout/           # Sidebar, Header, MainLayout
│   │   └── ...
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── dashboard/
│   │   ├── materials/
│   │   ├── practice/
│   │   ├── notes/
│   │   ├── tests/
│   │   ├── roadmap/
│   │   ├── bookmarks/
│   │   ├── analytics/
│   │   └── admin/
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   │   └── RoleRoute.jsx     # Restrict by role
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

---

## 5. API Route Planning

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| **Auth** |
| POST | /api/auth/register | Public | Register (default role: student) |
| POST | /api/auth/login | Public | Login → JWT |
| GET  | /api/auth/me | All roles | Current user profile |
| **Users (Admin)** |
| GET  | /api/users | Admin | List users, filter by role |
| GET  | /api/users/:id | Admin | Get user |
| PUT  | /api/users/:id | Admin | Update user/role |
| DELETE | /api/users/:id | Admin | Remove user |
| **Materials** |
| GET  | /api/materials | Student, Faculty, Admin | List (filter: subject, search) |
| GET  | /api/materials/:id | All | Get one |
| POST | /api/materials | Faculty, Admin | Upload material |
| PUT  | /api/materials/:id | Faculty, Admin | Update |
| DELETE | /api/materials/:id | Faculty, Admin | Delete |
| **Questions** |
| GET  | /api/questions | All | List (filter: subject, difficulty, company) |
| GET  | /api/questions/:id | All | Get one |
| POST | /api/questions | Faculty, Admin | Create |
| PUT  | /api/questions/:id | Faculty, Admin | Update |
| DELETE | /api/questions/:id | Faculty, Admin | Delete |
| **Question Attempts** |
| POST | /api/questions/:id/attempt | Student | Submit attempt (code → Judge0 later) |
| GET  | /api/attempts/me | Student | My attempt history |
| **Tests** |
| GET  | /api/tests | All | List tests |
| GET  | /api/tests/:id | All | Get test + questions |
| POST | /api/tests | Faculty, Admin | Create test |
| PUT  | /api/tests/:id | Faculty, Admin | Update |
| POST | /api/tests/:id/attempt | Student | Start/submit test attempt |
| **Roadmap** |
| GET  | /api/roadmap | All | List roadmap items |
| GET  | /api/roadmap/progress | Student | My progress |
| PUT  | /api/roadmap/progress/:id | Student | Update progress |
| POST | /api/roadmap | Faculty, Admin | Create/update roadmap |
| **Bookmarks** |
| GET  | /api/bookmarks | Student | My bookmarks |
| POST | /api/bookmarks | Student | Add bookmark |
| DELETE | /api/bookmarks/:id | Student | Remove |
| **Announcements** |
| GET  | /api/announcements | All | List (latest first) |
| POST | /api/announcements | Faculty, Admin | Create |
| **Contests** |
| GET  | /api/contests | All | List (active/past) |
| GET  | /api/contests/:id | All | Get contest + questions |
| POST | /api/contests | Faculty, Admin | Create |
| POST | /api/contests/:id/submit | Student | Submit solution |
| **Notes** |
| GET  | /api/notes | Student | My notes |
| GET  | /api/notes/:id | Student | Get one |
| POST | /api/notes | Student | Create |
| PUT  | /api/notes/:id | Student | Update (auto-save) |
| DELETE | /api/notes/:id | Student | Delete |
| **Subjects** |
| GET  | /api/subjects | All | List subjects |

---

## 6. Role-Based Middleware Design

- **authenticate**: Verify JWT, attach `req.user` (id, email, role). Use on all protected routes.
- **requireRole(['admin', 'faculty'])**: After authenticate, check `req.user.role` is in allowed list; else 403.

Usage example:

```js
router.get('/admin-only', authenticate, requireRole(['admin']), controller.action);
router.post('/materials', authenticate, requireRole(['faculty', 'admin']), controller.upload);
router.get('/materials', authenticate, controller.list);  // any logged-in user
```

---

## 7. Authentication Flow

1. **Register**: POST /api/auth/register → validate → hash password (bcrypt) → create User → return JWT + user (no password).
2. **Login**: POST /api/auth/login → find user by email → compare password → sign JWT (payload: { id, email, role }) → return token + user.
3. **Client**: Store token (e.g. localStorage or httpOnly cookie); send `Authorization: Bearer <token>` on every request.
4. **Protected routes**: authenticate middleware verifies JWT, attaches user; requireRole restricts by role.

---

## 8. Development Roadmap (Phases)

| Phase | Focus | Deliverables |
|-------|--------|--------------|
| 1 | Foundation | DB schema, models, associations, auth (register/login), middleware, server wiring |
| 2 | Core APIs | Materials, Questions, Subjects CRUD; file upload |
| 3 | Practice & Tests | Question attempts, Tests, Test attempts (structure only; Judge0 in next phase) |
| 4 | Roadmap & Bookmarks | Roadmap + progress, Bookmarks |
| 5 | Announcements & Contests | Announcements CRUD, Contests + submissions |
| 6 | Notes & Analytics | Smart notes CRUD, analytics endpoints (aggregations) |
| 7 | Frontend | React app, auth, protected routes, role-based dashboards, Material/Practice/Notes UI |
| 8 | Integrations | Judge0 (or similar) for code execution, charts (e.g. Recharts) |
| 9 | Polish & Deploy | Theme toggle, validation, error handling, deployment (e.g. Node + React on same host or separate) |

---

## 9. Best Practices

- **Environment**: Use `.env` for PORT, JWT_SECRET, DB_*, upload path; never commit secrets.
- **Passwords**: Always hash with bcrypt (e.g. 10 rounds); never store plain text.
- **JWT**: Use reasonable expiry (e.g. 7d); optional refresh token for production.
- **Validation**: Validate input (e.g. express-validator) on register, login, and all POST/PUT.
- **Files**: Store uploads outside repo; validate file type and size; serve via static or signed URLs.
- **Errors**: Central error middleware; return consistent JSON (e.g. { success, message, data }).
- **CORS**: Restrict origin in production to your frontend domain.
- **SQL**: Use Sequelize parameterized queries only (no raw user input in SQL).

---

## 10. Deployment (High Level)

- **Backend**: Node process (e.g. PM2); reverse proxy (Nginx) to Node; HTTPS.
- **Frontend**: Build (`npm run build`); serve as static from Nginx or same server.
- **DB**: MySQL on same server or managed (e.g. RDS); run migrations before starting app.
- **Uploads**: Persistent volume for `uploads/`; consider S3 for production scale.

---

*This document is the single source of truth for architecture; implement step-by-step following the roadmap.*
