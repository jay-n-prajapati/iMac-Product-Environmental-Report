# Progress

## 2026-10-15
- Scaffolded with the CLIs (create-next-app, shadcn init) and the task-1 infra (Docker, Drizzle, Gemini deps, env, CLAUDE.md, decision log).
- Not started: purpose/requirements, schema, ingestion, UI.

## 2026-10-15 (grill session)
- Interviewed on approach; decisions D-05..D-14 logged (vision on visual pages with auto heuristic, per-element chunks, footnote linking, vector-first retrieval, 12-question eval, sources panel, 768-dim embeddings).
- Specs written: `specs/imac-qa/spec.md` and `plan.md` (D-15 matches task-1 UI). Next: Phase 1 page inventory.

## 2026-10-15 (Phase 1)
- `npm run dump:pdf` added; `specs/imac-qa/page-inventory.md` written (12 pages, 12 candidate golden questions, 3 acceptance answers).
- Visual pages are exactly 2, 10, 12 (vector chart/tables, 0 raster images). Image count is the wrong heuristic signal (decorative photos on 1, 4, 6, 8). Heuristic for D-06 must use vector drawing count / numeric-token density; to be tested in Phase 4.
- PDF inconsistency: p2 footnote 10 says 346 kg is for 512GB, p10 and p2 text say 256GB (512GB four ports is 391 kg). Golden set follows the p10 table.
- Gemini not called (chat quota exhausted).
