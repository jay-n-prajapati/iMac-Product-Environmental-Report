# Decision Log

Append-only. Newest entries go at the bottom. Mark any time the user chose something other than the
recommended option as **OVERRIDE**, and when a decision replaces an earlier one, say which.

Format: `D-NN | date | area | decision | why | status`

| ID | Date | Area | Decision | Why / notes | Status |
|----|------|------|----------|-------------|--------|
| D-01 | 2026-10-15 | Infra | Inherit task-1 infra: Docker Compose with pgvector Postgres (`pgvector/pgvector:pg17`, db 384m) + Next.js standalone app (256m, read-only FS), localhost-bound DB port, host ports configurable (`DB_PORT` 5433, `APP_PORT` 3001) so it runs beside task-1 | Same optimized, resource-friendly setup; no port clash | Active |
| D-02 | 2026-10-15 | Stack | Inherit task-1 stack: Next.js 16.4 + shadcn (`base-maia`, hugeicons), Drizzle ORM + `postgres` driver + drizzle-kit migrations, `@google/genai` (one `GEMINI_API_KEY` for chat + embeddings), zod env validation, `unpdf`, `tsx` | Proven in task-1 (see its D-03, D-07..D-11, D-14, D-22, D-30) | Active |
| D-03 | 2026-10-15 | Scaffold | Created with CLIs: `create-next-app@16.4.0`, `shadcn@4.21.4 init --preset maia --base base`, npm for deps, local `git init` (no remote) | Reproducible, matches task-1 | Active |

## Open questions
- Project purpose, document(s) and acceptance questions for task-3.
- Whether to create a GitHub remote.
