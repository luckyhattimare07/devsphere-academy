# DevSphere Academy

A production-grade, full-stack programming education platform similar to LeetCode + GeeksforGeeks.

---

## 🚀 Tech Stack

| Layer       | Technology                                          |
|-------------|-----------------------------------------------------|
| Frontend    | Next.js 14, React 18, Tailwind CSS, Shadcn UI, Framer Motion |
| Backend     | Node.js, Express.js, TypeScript                     |
| Database    | PostgreSQL 16                                       |
| Cache       | Redis 7                                             |
| Code Exec   | Judge0 API                                          |
| Auth        | JWT (access + refresh tokens, rotation)             |
| Deploy      | Docker, Docker Compose, Nginx                       |

---

## 📁 Project Structure

```
devsphere/
├── frontend/                    # Next.js 14 App Router
│   └── src/
│       ├── app/                 # Pages (App Router)
│       │   ├── page.tsx         # Landing page
│       │   ├── practice/        # Problem list + solve page
│       │   ├── compiler/        # Online IDE
│       │   ├── dashboard/       # User dashboard
│       │   ├── languages/       # Tutorial pages
│       │   ├── dsa/             # DSA course pages
│       │   ├── blog/            # Articles
│       │   ├── profile/         # User profile
│       │   ├── admin/           # Admin panel
│       │   └── auth/            # Login / Register
│       ├── components/
│       │   ├── layout/          # Navbar, Footer, ThemeProvider
│       │   ├── ui/              # Shadcn base components
│       │   ├── compiler/        # Editor components
│       │   ├── practice/        # Problem components
│       │   └── dashboard/       # Dashboard widgets
│       ├── hooks/               # Custom React hooks
│       ├── lib/                 # API client (Axios + SWR)
│       ├── types/               # TypeScript types
│       └── styles/              # globals.css
│
├── backend/                     # Express.js REST API
│   └── src/
│       ├── index.ts             # App entry point
│       ├── config/              # DB, Redis connections
│       ├── routes/              # Route definitions
│       ├── controllers/         # Business logic
│       ├── middleware/          # Auth, rate limit, errors
│       └── utils/               # Logger, AppError
│
├── database/
│   ├── schema.sql               # Full PostgreSQL schema
│   └── seed.sql                 # 200+ problems seed data
│
├── nginx/
│   └── nginx.conf               # Reverse proxy + SSL
│
├── docker-compose.yml           # Full stack orchestration
├── .env.example                 # Environment variables template
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone and configure
```bash
git clone https://github.com/your-org/devsphere-academy
cd devsphere-academy
cp .env.example .env
# Edit .env with your credentials
```

### 2. Start with Docker (recommended)
```bash
docker-compose up -d
# App: http://localhost:3000
# API: http://localhost:4000
# DB:  localhost:5432
```

### 3. Start manually (development)
```bash
# Install all dependencies
npm install

# Start both frontend and backend
npm run dev

# Or individually:
npm run dev:frontend   # http://localhost:3000
npm run dev:backend    # http://localhost:4000
```

### 4. Database setup
```bash
# Create DB and run schema + seed
npm run db:migrate
npm run db:seed
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env`:

| Variable            | Description                               | Required |
|---------------------|-------------------------------------------|----------|
| `DATABASE_URL`      | PostgreSQL connection string              | ✅       |
| `REDIS_URL`         | Redis connection string                   | ✅       |
| `JWT_SECRET`        | 64-char hex secret for access tokens      | ✅       |
| `JWT_REFRESH_SECRET`| 64-char hex secret for refresh tokens     | ✅       |
| `JUDGE0_API_KEY`    | RapidAPI key for code execution           | ✅       |
| `JUDGE0_API_URL`    | Judge0 API base URL                       | ✅       |
| `NEXT_PUBLIC_API_URL`| Backend API URL (client-side)            | ✅       |

Generate JWT secrets:
```bash
openssl rand -hex 64
```

Get Judge0 API key: https://rapidapi.com/judge0-official/api/judge0-ce

---

## 📡 API Endpoints

### Auth
| Method | Endpoint                      | Description             |
|--------|-------------------------------|-------------------------|
| POST   | `/api/v1/auth/register`       | Create account          |
| POST   | `/api/v1/auth/login`          | Login                   |
| POST   | `/api/v1/auth/refresh`        | Refresh access token    |
| POST   | `/api/v1/auth/logout`         | Logout                  |
| GET    | `/api/v1/auth/me`             | Current user            |
| POST   | `/api/v1/auth/forgot-password`| Request reset email     |
| POST   | `/api/v1/auth/reset-password` | Reset password          |

### Problems
| Method | Endpoint                         | Description               |
|--------|----------------------------------|---------------------------|
| GET    | `/api/v1/problems`               | List (filter/paginate)    |
| GET    | `/api/v1/problems/:slug`         | Single problem            |
| GET    | `/api/v1/problems/tags`          | All tags                  |
| GET    | `/api/v1/problems/random`        | Random problem            |
| POST   | `/api/v1/problems`               | Create (admin)            |
| PUT    | `/api/v1/problems/:id`           | Update (admin)            |
| DELETE | `/api/v1/problems/:id`           | Delete (admin)            |
| POST   | `/api/v1/problems/:id/bookmark`  | Toggle bookmark           |
| GET    | `/api/v1/problems/:id/similar`   | Similar problems          |

### Submissions
| Method | Endpoint                      | Description               |
|--------|-------------------------------|---------------------------|
| POST   | `/api/v1/submissions`         | Submit solution           |
| GET    | `/api/v1/submissions/me`      | My submissions            |
| GET    | `/api/v1/submissions/:id`     | Single submission         |

### Compiler
| Method | Endpoint                         | Description               |
|--------|----------------------------------|---------------------------|
| POST   | `/api/v1/compiler/execute`       | Execute code via Judge0   |
| GET    | `/api/v1/compiler/languages`     | Supported languages       |
| GET    | `/api/v1/compiler/status/:token` | Check execution status    |

### DSA
| Method | Endpoint                             | Description        |
|--------|--------------------------------------|--------------------|
| GET    | `/api/v1/dsa/categories`             | All categories     |
| GET    | `/api/v1/dsa/categories/:slug`       | Category + topics  |
| GET    | `/api/v1/dsa/topics/:slug`           | Single topic       |

### Languages/Tutorials
| Method | Endpoint                                    | Description            |
|--------|---------------------------------------------|------------------------|
| GET    | `/api/v1/languages`                         | All languages          |
| GET    | `/api/v1/languages/:slug`                   | Language + chapters    |
| GET    | `/api/v1/languages/:slug/topics/:topicSlug` | Single tutorial topic  |

### Dashboard
| Method | Endpoint                     | Description              |
|--------|------------------------------|--------------------------|
| GET    | `/api/v1/dashboard`          | Full dashboard data      |
| GET    | `/api/v1/dashboard/heatmap`  | Activity heatmap         |
| GET    | `/api/v1/dashboard/bookmarks`| User bookmarks           |

### Leaderboard
| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| GET    | `/api/v1/leaderboard`  | Global top 100       |

### Admin
| Method | Endpoint                | Description          |
|--------|-------------------------|----------------------|
| GET    | `/api/v1/admin/stats`   | Platform statistics  |
| GET    | `/api/v1/admin/users`   | All users            |
| PATCH  | `/api/v1/admin/users/:id` | Update user        |
| DELETE | `/api/v1/admin/users/:id` | Delete user        |
| GET    | `/api/v1/admin/problems`  | All problems       |
| GET    | `/api/v1/admin/articles`  | All articles       |

---

## 🎨 Features

### Frontend Pages
- **Landing** — Hero, stats, language cards, DSA roadmap, testimonials
- **Practice** — Filterable problem list with difficulty/tag/search
- **Solve** — Monaco editor, test runner, submit, hints, discussions
- **Compiler** — Full IDE with 8 languages, stdin, code templates
- **Dashboard** — Stats, heatmap, progress, leaderboard, recommendations
- **Languages** — Structured tutorials per language with code examples
- **DSA** — Topic-wise theory + visualizer + complexity tables
- **Blog** — Article listing and reading
- **Profile** — Public profile with stats and activity
- **Admin** — Manage users, problems, articles

### Backend
- JWT auth with refresh token rotation
- Redis caching for hot paths
- Full-text search via pg_trgm
- Judge0 integration with test-case validation
- PostgreSQL triggers for auto-stats updates
- Rate limiting per endpoint type
- Comprehensive error handling

### Database
- 15+ tables with proper indices
- Triggers for stats auto-update
- Full-text search indices
- UUID primary keys throughout

---

## 🐳 Docker Services

| Service    | Port | Description            |
|------------|------|------------------------|
| postgres   | 5432 | PostgreSQL database    |
| redis      | 6379 | Redis cache            |
| backend    | 4000 | Express API            |
| frontend   | 3000 | Next.js app            |
| nginx      | 80/443 | Reverse proxy + SSL  |

---

## 📊 Database Schema Summary

- `users` — Accounts with roles
- `refresh_tokens` — Secure token rotation
- `programming_languages` — Language catalog
- `tutorial_chapters` / `tutorial_topics` — Tutorial content
- `dsa_categories` / `dsa_topics` — DSA course
- `problems` — LeetCode-style problems with test cases
- `problem_tags` + `problem_tag_map` — Tag system
- `submissions` — User solutions + results
- `code_executions` — Compiler history
- `bookmarks` — Saved problems
- `discussions` — Problem discussions + replies
- `articles` — Blog posts
- `user_stats` — Aggregated user performance
- `daily_activity` — Heatmap data
- `leaderboard` (computed via view)

---

## 🔐 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT access tokens expire in 15 minutes
- Refresh tokens rotated on each use
- Rate limiting: 500/15min general, 20/15min auth, 10/min compiler
- Helmet.js for security headers
- SQL injection prevention via parameterized queries
- CORS configured per environment

---

## 🚢 Production Deployment

```bash
# 1. Set production env vars
cp .env.example .env && nano .env

# 2. Build and start
docker-compose up -d --build

# 3. Check health
curl http://localhost:4000/health

# 4. View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

For SSL, place certificates in `./nginx/ssl/`:
- `fullchain.pem`
- `privkey.pem`

---

## 📝 Adding New Problems

Use the admin panel at `/admin` or POST to the API:

```json
POST /api/v1/problems
{
  "title": "My Problem",
  "difficulty": "Medium",
  "category": "Array",
  "description": "## Problem\nMarkdown content...",
  "constraints": "1 ≤ n ≤ 10⁵",
  "examples": [{"input": "...", "output": "...", "explanation": "..."}],
  "starter_codes": {
    "python": "def solve(n):\n    pass",
    "cpp": "int solve(int n) {\n}",
    "java": "public int solve(int n) {\n    return 0;\n}",
    "javascript": "var solve = function(n) {\n};"
  },
  "test_cases": [
    {"input": "5", "expected": "25", "is_hidden": false},
    {"input": "100", "expected": "10000", "is_hidden": true}
  ],
  "tags": ["array", "dp"],
  "is_published": true
}
```

---

Built with ❤️ by the DevSphere Academy team.
