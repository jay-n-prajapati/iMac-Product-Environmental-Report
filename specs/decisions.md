# Decision Log

Append-only. Newest entries go at the bottom. Mark any time the user chose something other than the
recommended option as **OVERRIDE**, and when a decision replaces an earlier one, say which.

Format: `D-NN | date | area | decision | why | status`

| ID | Date | Area | Decision | Why / notes | Status |
|----|------|------|----------|-------------|--------|
| D-01 | 2026-10-15 | Infra | Inherit task-1 infra: Docker Compose with pgvector Postgres (`pgvector/pgvector:pg17`, db 384m) + Next.js standalone app (256m, read-only FS), localhost-bound DB port, host ports configurable via `DB_PORT` / `APP_PORT` | Same optimized, resource-friendly setup | Active (ports changed by D-04) |
| D-02 | 2026-10-15 | Stack | Inherit task-1 stack: Next.js 16.4 + shadcn (`base-maia`, hugeicons), Drizzle ORM + `postgres` driver + drizzle-kit migrations, `@google/genai` (one `GEMINI_API_KEY` for chat + embeddings), zod env validation, `unpdf`, `tsx` | Proven in task-1 (see its D-03, D-07..D-11, D-14, D-22, D-30) | Active |
| D-03 | 2026-10-15 | Scaffold | Created with CLIs: `create-next-app@16.4.0`, `shadcn@4.21.4 init --preset maia --base base`, npm for deps, local `git init` (no remote) | Reproducible, matches task-1 | Active |
| D-04 | 2026-10-15 | Ports | Default host ports like task-1 (db 5432, app 3000); task-1 was brought down so they are free. Supersedes the 5433/3001 ports first scaffolded. Run only one of the two stacks at a time, or override `DB_PORT` / `APP_PORT` | User asked to keep default ports | Active |
| D-05 | 2026-10-15 | Ingestion | Use Gemini vision only on pages with charts/tables; other pages use plain text extraction (`unpdf`). **OVERRIDE** (recommended: vision on all 12 pages) | User wants fewer API calls. Cost: need a way to pick which pages are visual (see open questions). Vision output is cached on disk | Active |
| D-06 | 2026-10-15 | Ingestion | Pick vision pages automatically with a heuristic (embedded images / low text-per-image), not a manual list. **OVERRIDE** (recommended: manual list) | User wants it reusable on other PDFs. Risk: wrong guesses, so the heuristic's choices get checked against the test set | Active |
| D-07 | 2026-10-15 | Chunking | One chunk per element (table, chart description, call-out, paragraph), each carrying page number and its linked footnote text | A table is never split, so numbers stay with their headings | Active |
| D-08 | 2026-10-15 | Footnotes | Append the footnote text to each chunk that cites it, and also keep each footnote as its own chunk | Caveat is retrieved together with the claim; notes still searchable alone | Active |
| D-09 | 2026-10-15 | Retrieval | Vector search (pgvector) first; add Postgres keyword search + merge as a measured experiment. No reranker (it hurt table chunks in the reference guide) | See the gain with numbers; keep the baseline simple | Active |
| D-10 | 2026-10-15 | Evaluation | ~12-question test set (3 exam questions + ~9 on charts/tables/footnotes/call-outs) with expected values; script checks retrieval without the LLM, answers checked on demand (chat quota ~20/day). Includes plain-text-vs-vision comparison | Measurable pass/fail, protects free-tier quota | Active |
| D-11 | 2026-10-15 | UI | Chat + cited sources panel (page, element type, text); refuse when the document has no answer | Lets the learner verify the number came from the chart/table | Active |
| D-12 | 2026-10-15 | Ingestion | Send visual pages to Gemini as single-page PDFs (native PDF input), no PNG rendering; host-side `tsx` ingestion script | No extra system tools or heavy deps | Active |
| D-13 | 2026-10-15 | Models | `gemini-embedding-001` at 768 dims for embeddings; one Flash model for page vision and chat answers. Model names in env/config so they can be swapped | Small, fast vectors are plenty for ~80 chunks; Flash is cheap and has the larger free quota | Active |
| D-14 | 2026-10-15 | Scope | Project purpose: Q&A over `data/iMac_PER_Oct2024.pdf` (12 pages). Pass bar: answers pull the right number from a chart/table/call-out/footnote (energy vs ENERGY STAR; total footprint and use vs manufacturing split; stand material and recycled %) | From the use-case description | Active |
| D-15 | 2026-10-15 | UI | Match the sibling task-1 UI: same layout and components (workspace, composer, answer, evidence panel, history rail), NDJSON `POST /api/ask` protocol, refusal and quota states, same look. Adds an element-kind chip (chart/table/callout/footnote/paragraph) on evidence cards. Refines D-11 | User asked to match the sibling repo; kind chip shows whether a number came from a chart or a sentence | Active |
| D-16 | 2026-10-15 | Baseline | Phase 2 plain-text baseline: pure character sliding window per page (900 chars, 135 overlap), every chunk `kind='paragraph'`, embedded as "<document name>, page N\n<text>", `pipeline: 'plain-text-v1'` stored in config, `embed.ts` copied from task-1. Intentionally naive so later changes are measured against it. Baseline result: 37 chunks; energy and stand questions retrieved; footprint split only a weak hit (worked because the p10 table fit one window) | Made by the build agent, matches D-09/D-10 | Active |

## Open questions
- Heuristic details: which signals flag a page as visual (to settle in plan.md).
- Exact Flash model name and the vector index type (small data, likely exact search with no index).
- Whether to create a GitHub remote.
