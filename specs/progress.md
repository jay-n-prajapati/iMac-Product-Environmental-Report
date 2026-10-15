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

## 2026-10-15 (Phase 2, plain-text baseline)
- Schema (`documents`, `chunks` with `kind`, vector(768), HNSW cosine + document_id index) + migration `drizzle/0000_*` applied.
- `scripts/ingest.mts` (`npm run ingest`): unpdf per page -> 900/135 fixed char chunks -> embeddings -> transactional replace, hash+config skip. 12 pages -> 37 chunks.
- `scripts/ask.mts` (`npm run ask -- "<q>" [--answer]`): retrieval only by default (chat quota exhausted, chat not called).
- Baseline results in `specs/imac-qa/baseline-plain-text.md`: (a) hit, (c) hit, (b) weak hit (p10 table chunks at rank 2-3, scrambled order with the 391 kg block, p9 glossary ranks first). Expect real failures on chart/table golden questions in Phase 3.

## 2026-10-15 (Phase 3, golden set + eval harness)
- `evals/golden.json` (12 items: 3 acceptance, 7 chart/table/callout/footnote incl. the 346 kg conflict and copper footnote traps, 2 refusals), values re-verified against the PDF (text + page images of p2/p10/p12). Draft awaiting user review: `specs/imac-qa/eval-review.md`.
- `scripts/eval.mts` ported from task-1 (`npm run eval`; flags `--ids`, `--json`, `--retrieval-only`); adds element kind per item, page hit vs stricter value hit (one chunk holds all expected strings) and value rank.
- Baseline plain-text-v1, retrieval only (chat not called): page hit 10/10, value hit 10/10. Retrieval is not the weak point; the risks are column/header mixups at answer time (p10, p12) and refusal behaviour, to be measured with the full eval when chat quota returns.
