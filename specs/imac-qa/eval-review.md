# Golden set review (DRAFT, awaiting user review)

File: `evals/golden.json` (12 items: 3 acceptance, 7 on chart/table/callout/footnote, 2 out-of-scope).
Page numbers are PDF pages 1-12. Every expected value was checked against `pdftotext -layout` and, for p2, p10 and
p12, against a rendered page image (`pdftoppm -r 70`). Tuning does NOT start until you approve this set.

Metrics (`npm run eval`):
- **page hit**: any expected page is in the top-5.
- **value hit** (stricter): at least one retrieved chunk contains ALL the item's value strings (`valueStrings`, default
  = expected strings). It catches "right page, but the number was cut off or detached". Limit: it checks strings, not
  that a number is tied to its column header (see g06, g07).
- **vrank**: 1-based rank of the first chunk that satisfies the value hit.
- correctness (all expected strings in the answer) and refusal (exact `Not in the document.`) need the chat model and
  were NOT run (free-tier quota).

| id | question | expected | page | kind | how verified | page hit | value hit (vrank) |
|----|----------|----------|------|------|--------------|----------|-------------------|
| g01-energy-star | How much less energy does iMac use compared to the ENERGY STAR requirement? | 58 (percent) | 7 | paragraph | text, p7 lead + ENERGY STAR paragraph | ok | ok (1) |
| g02-footprint-split | Total carbon footprint, and use vs manufacturing split? | 346 kg; Production 50%; Product use 45% | 10 | table | text + image of p10 | ok | ok (2) |
| g03-stand-material | Stand material and % recycled? | aluminum; 100 percent | 1, 2, 4 | callout | text (p1 banner, p4 callout, p2) | ok | ok (1) |
| g04-chart-baseline | Chart: baseline emissions, reductions, resulting iMac emissions? | 445; 99; 346 kg | 2 | chart | image of p2 (vector chart) + text | ok | ok (2) |
| g05-four-ports | Carbon footprint of the four-port 512GB iMac? | 391 kg | 10 | table | image of p10 | ok | ok (1) |
| g06-idle-115v | Idle (display on) power at 115V? | 20.6W | 12 | table | image of p12 | ok | ok (1) |
| g07-adapter-230v | Power adapter efficiency at 230V? | 91.9% | 12 | table | image of p12 | ok | ok (1) |
| g08-packaging-recycled | How much of the packaging is recycled content? | 76 percent | 6 | callout | text | ok | ok (1) |
| g09-copper-footnote | Does recycled thermal-module copper apply to every model? | No, four ports only | 4, 11 | footnote | text (callout + fn 14) | ok | ok (2) |
| g10-346-config-conflict | Which configuration does the 346 kg apply to? | two ports, 256GB (follow p10) | 10, 2 | footnote (conflict) | text + p10/p2 images | ok | ok (1) |
| g11-oos-battery-life | Hours of battery life? | refusal | - | none | full-text search, no battery life figure | n/a | n/a |
| g12-oos-weight | How much does the iMac weigh? | refusal | - | none | full-text search, no product weight | n/a | n/a |

## Baseline (plain-text-v1, retrieval only, top-5)
- page hit **10/10**, value hit **10/10** (by kind: paragraph 1/1, table 4/4, callout 2/2, chart 1/1, footnote 2/2).
- Raw output: `data/extracted/eval-baseline-plain-text-v1-retrieval.json` (git-ignored).
- The baseline retrieves well. This is not evidence that plain text is enough: the value-hit test is string
  containment, and the hard failures are expected at the ANSWER stage (not measured today):
  - g06, g07: the p12 chunk holds 20.5W/20.6W/20.9W but the 100V/115V/230V headers are separated, so a wrong voltage
    can pass the value hit. Needs the full eval (correctness) to expose it.
  - g02, g05, g10: p10 text order is scrambled (four-port 391 kg block printed first, headers after rows); the chunk
    exists but the model may mix columns.
  - g04: p2 `445 kg` sits far from `346 kg` in reading order; they happen to share a chunk. Which number is the
    baseline vs the result is not in the text.
  - g11, g12: refusal behaviour untested until the chat quota resets. Top similarity for them is 0.68-0.69, so there
    is no cheap similarity cutoff separating them from real hits (lowest real hit g07 = 0.673).
- Run the full eval (`npm run eval`) when chat quota allows; use `--ids` to limit calls.

## Judgment calls and uncertainty to review
- **g10 (document contradiction)**: p2 footnote 10 (on p11) says 346 kg is "iMac (two ports) with 512GB"; p10 and the
  p2 paragraph say 256GB. I followed the p10 table. The automatic check only requires "two ports" and "256". An answer
  that also flags the conflict is fine but not scored.
- **g09**: the string check `four ports` cannot detect a wrong "yes" that mentions four ports; judge failures by hand.
- **g02**: bare `50` / `45` in the correctness check are weak; the value hit uses the stricter `Production 50%`.
- **g03**: p1 writes "100%" while p4/p2 write "100 percent"; the value string uses the "percent" form, so the p1 chunk
  alone does not count (p4 or p2 must be retrieved).
- **g11/g12**: confirmed absent by full-text search of all 12 pages; the only nearby text is battery-drain modelling
  (p9), cobalt in batteries (p4), and packaging "by weight" (p1/p11). Risk that the model answers with those.
- Candidates from the inventory that were left out to stay at 12: use phase years (four, p9), rare earth recycled (100%
  of magnets, 99% of rare earths, p4), "more than 15 percent recycled content" scope (fn 1).
