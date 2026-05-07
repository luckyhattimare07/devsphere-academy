-- ============================================================
-- DevSphere Academy — PostgreSQL Schema
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for full-text search

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE difficulty_level AS ENUM ('Easy', 'Medium', 'Hard');
CREATE TYPE submission_status AS ENUM ('Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compile Error', 'Pending');
CREATE TYPE language_code AS ENUM ('c', 'cpp', 'java', 'python', 'javascript', 'typescript', 'go', 'rust');

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username      VARCHAR(30) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(100),
  avatar_url    TEXT,
  bio           TEXT,
  github_url    TEXT,
  linkedin_url  TEXT,
  website_url   TEXT,
  role          user_role NOT NULL DEFAULT 'user',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  is_verified   BOOLEAN NOT NULL DEFAULT false,
  streak_count  INTEGER NOT NULL DEFAULT 0,
  last_active   TIMESTAMP WITH TIME ZONE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Refresh tokens
CREATE TABLE refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used       BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- LANGUAGES & TUTORIALS
-- ============================================================
CREATE TABLE programming_languages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        VARCHAR(20) UNIQUE NOT NULL,
  name        VARCHAR(50) NOT NULL,
  description TEXT,
  icon_url    TEXT,
  color       VARCHAR(7),
  is_active   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tutorial_chapters (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language_id UUID NOT NULL REFERENCES programming_languages(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  slug        VARCHAR(200) NOT NULL,
  description TEXT,
  sort_order  INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(language_id, slug)
);

CREATE TABLE tutorial_topics (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id  UUID NOT NULL REFERENCES tutorial_chapters(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  slug        VARCHAR(200) NOT NULL,
  content     TEXT NOT NULL,    -- MDX/Markdown content
  code_examples JSONB DEFAULT '[]',
  key_points  JSONB DEFAULT '[]',
  sort_order  INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  meta_title  VARCHAR(200),
  meta_description TEXT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chapter_id, slug)
);

-- User tutorial progress
CREATE TABLE user_tutorial_progress (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id   UUID NOT NULL REFERENCES tutorial_topics(id) ON DELETE CASCADE,
  completed  BOOLEAN DEFAULT false,
  time_spent INTEGER DEFAULT 0, -- seconds
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- ============================================================
-- DSA TOPICS
-- ============================================================
CREATE TABLE dsa_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon        VARCHAR(10),
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT true
);

CREATE TABLE dsa_topics (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id  UUID NOT NULL REFERENCES dsa_categories(id) ON DELETE CASCADE,
  title        VARCHAR(200) NOT NULL,
  slug         VARCHAR(200) UNIQUE NOT NULL,
  theory       TEXT,                    -- Main theory content
  visualization_data JSONB DEFAULT '{}',-- For frontend visualizations
  implementations JSONB DEFAULT '[]',   -- Array of {lang, code, explanation}
  time_complexity  JSONB DEFAULT '{}',  -- {best, average, worst, space}
  sort_order   INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- PROBLEMS (LeetCode-style)
-- ============================================================
CREATE TABLE problem_tags (
  id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#4f8ef7'
);

CREATE TABLE problems (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number          SERIAL UNIQUE,
  title           VARCHAR(200) NOT NULL,
  slug            VARCHAR(200) UNIQUE NOT NULL,
  description     TEXT NOT NULL,          -- Full problem statement (Markdown)
  input_format    TEXT,
  output_format   TEXT,
  constraints     TEXT,
  difficulty      difficulty_level NOT NULL,
  category        VARCHAR(100),
  dsa_topic_id    UUID REFERENCES dsa_topics(id),
  solution_approach TEXT,
  editorial       TEXT,
  hints           JSONB DEFAULT '[]',
  examples        JSONB DEFAULT '[]',     -- [{input, output, explanation}]
  starter_codes   JSONB DEFAULT '{}',     -- {python: "...", cpp: "...", ...}
  solution_codes  JSONB DEFAULT '{}',     -- Hidden solutions
  test_cases      JSONB DEFAULT '[]',     -- [{input, expected_output, is_hidden}]
  time_limit      INTEGER DEFAULT 2000,   -- ms
  memory_limit    INTEGER DEFAULT 262144, -- KB (256MB)
  acceptance_rate DECIMAL(5,2) DEFAULT 0,
  total_submissions INTEGER DEFAULT 0,
  accepted_submissions INTEGER DEFAULT 0,
  is_published    BOOLEAN DEFAULT false,
  is_premium      BOOLEAN DEFAULT false,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_slug ON problems(slug);
CREATE INDEX idx_problems_published ON problems(is_published);
CREATE INDEX idx_problems_title_trgm ON problems USING gin(title gin_trgm_ops);

-- Problem <-> Tags (many-to-many)
CREATE TABLE problem_tag_map (
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  tag_id     UUID NOT NULL REFERENCES problem_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (problem_id, tag_id)
);

-- ============================================================
-- SUBMISSIONS
-- ============================================================
CREATE TABLE submissions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id    UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  language      language_code NOT NULL,
  code          TEXT NOT NULL,
  status        submission_status NOT NULL DEFAULT 'Pending',
  runtime_ms    INTEGER,
  memory_kb     INTEGER,
  test_results  JSONB DEFAULT '[]',  -- [{test_case_id, passed, actual, expected, time}]
  judge0_token  VARCHAR(100),
  error_message TEXT,
  submitted_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_problem ON submissions(problem_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_user_problem ON submissions(user_id, problem_id);

-- ============================================================
-- CODE EXECUTION (Compiler page)
-- ============================================================
CREATE TABLE code_executions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  language    language_code NOT NULL,
  source_code TEXT NOT NULL,
  stdin       TEXT,
  stdout      TEXT,
  stderr      TEXT,
  exit_code   INTEGER,
  runtime_ms  INTEGER,
  memory_kb   INTEGER,
  judge0_token VARCHAR(100),
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- BOOKMARKS
-- ============================================================
CREATE TABLE bookmarks (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  note       TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- ============================================================
-- DISCUSSIONS
-- ============================================================
CREATE TABLE discussions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES discussions(id) ON DELETE CASCADE,
  title      VARCHAR(300),
  content    TEXT NOT NULL,
  upvotes    INTEGER DEFAULT 0,
  downvotes  INTEGER DEFAULT 0,
  is_pinned  BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_discussions_problem ON discussions(problem_id);

CREATE TABLE discussion_votes (
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  vote          SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
  PRIMARY KEY (user_id, discussion_id)
);

-- ============================================================
-- BLOG / ARTICLES
-- ============================================================
CREATE TABLE article_categories (
  id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#4f8ef7'
);

CREATE TABLE articles (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        VARCHAR(300) NOT NULL,
  slug         VARCHAR(300) UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT NOT NULL,      -- Markdown/MDX
  cover_image  TEXT,
  category_id  UUID REFERENCES article_categories(id),
  author_id    UUID NOT NULL REFERENCES users(id),
  tags         TEXT[] DEFAULT '{}',
  read_time    INTEGER DEFAULT 5,  -- minutes
  views        INTEGER DEFAULT 0,
  likes        INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  is_featured  BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(is_published);
CREATE INDEX idx_articles_author ON articles(author_id);

-- ============================================================
-- LEADERBOARD / STATS
-- ============================================================
CREATE TABLE user_stats (
  user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  problems_solved   INTEGER DEFAULT 0,
  easy_solved       INTEGER DEFAULT 0,
  medium_solved     INTEGER DEFAULT 0,
  hard_solved       INTEGER DEFAULT 0,
  total_submissions INTEGER DEFAULT 0,
  acceptance_rate   DECIMAL(5,2) DEFAULT 0,
  ranking           INTEGER,
  score             INTEGER DEFAULT 0,
  streak_current    INTEGER DEFAULT 0,
  streak_max        INTEGER DEFAULT 0,
  last_solved_at    TIMESTAMP WITH TIME ZONE,
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE daily_activity (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  count      INTEGER DEFAULT 1,
  UNIQUE (user_id, date)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(50) NOT NULL,
  title      VARCHAR(200) NOT NULL,
  message    TEXT,
  link       TEXT,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- ============================================================
-- ROADMAPS
-- ============================================================
CREATE TABLE roadmaps (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       VARCHAR(200) NOT NULL,
  slug        VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  data        JSONB NOT NULL DEFAULT '{}',  -- nodes and edges for visualization
  is_published BOOLEAN DEFAULT false,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_problems_updated_at
  BEFORE UPDATE ON problems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_dsa_topics_updated_at
  BEFORE UPDATE ON dsa_topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update problem acceptance rate after each submission
CREATE OR REPLACE FUNCTION update_problem_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE problems
  SET
    total_submissions = total_submissions + 1,
    accepted_submissions = accepted_submissions + CASE WHEN NEW.status = 'Accepted' THEN 1 ELSE 0 END,
    acceptance_rate = ROUND(
      (accepted_submissions + CASE WHEN NEW.status = 'Accepted' THEN 1 ELSE 0 END)::DECIMAL /
      NULLIF(total_submissions + 1, 0) * 100, 2
    )
  WHERE id = NEW.problem_id;

  -- Update user stats if accepted
  IF NEW.status = 'Accepted' THEN
    INSERT INTO user_stats (user_id, problems_solved, easy_solved, medium_solved, hard_solved, total_submissions, score, last_solved_at)
    SELECT
      NEW.user_id, 1,
      CASE WHEN p.difficulty = 'Easy'   THEN 1 ELSE 0 END,
      CASE WHEN p.difficulty = 'Medium' THEN 1 ELSE 0 END,
      CASE WHEN p.difficulty = 'Hard'   THEN 1 ELSE 0 END,
      1,
      CASE WHEN p.difficulty = 'Easy' THEN 10 WHEN p.difficulty = 'Medium' THEN 25 ELSE 50 END,
      NOW()
    FROM problems p WHERE p.id = NEW.problem_id
    ON CONFLICT (user_id) DO UPDATE SET
      problems_solved   = user_stats.problems_solved + 1,
      easy_solved       = user_stats.easy_solved + EXCLUDED.easy_solved,
      medium_solved     = user_stats.medium_solved + EXCLUDED.medium_solved,
      hard_solved       = user_stats.hard_solved + EXCLUDED.hard_solved,
      total_submissions = user_stats.total_submissions + 1,
      score             = user_stats.score + EXCLUDED.score,
      last_solved_at    = NOW(),
      updated_at        = NOW();

    -- Daily activity tracking
    INSERT INTO daily_activity (user_id, date, count)
    VALUES (NEW.user_id, CURRENT_DATE, 1)
    ON CONFLICT (user_id, date) DO UPDATE
      SET count = daily_activity.count + 1;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_submission_stats
  AFTER INSERT ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_problem_stats();
