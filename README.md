# task-3

RAG project scaffold with the same infrastructure as task-1: Next.js 16 + shadcn, Postgres/pgvector, Drizzle, Gemini.
The application itself is not built yet; see `specs/` and `CLAUDE.md`.

## Setup
1. `cp .env.example .env.local` and set `GEMINI_API_KEY` (and change the Postgres password; keep `DATABASE_URL` in sync).
2. `docker compose --env-file .env.local up -d db` (Postgres + pgvector on `localhost:5433`).
3. `npm install`
4. Define tables in `src/lib/db/schema.ts`, then `npm run db:generate` and `npm run db:migrate`.
5. `npm run dev`

## Full stack in Docker
`docker compose --env-file .env.local up -d --build` serves the app on `localhost:3001`
(ports come from `APP_PORT` / `DB_PORT`, so it can run beside task-1 on 3000 / 5432).

## Scripts
`dev`, `build`, `start`, `lint`, `db:generate`, `db:migrate`.
