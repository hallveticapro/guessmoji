# Task 9 final invariants and documentation report

Date: 2026-08-19
Worktree: `/Users/andrew/code/github/hallveticapro/guessmoji/.worktrees/content-audit-harry-potter`
Status: **complete**

## Task 8 closeout carried into Task 9

The SDD ledger now records Task 8 complete at `5d5a28c`. The fresh staged delta
review passes all three changed cards, the carried-forward evidence covers the
remaining 17 cards, and the independent source/rules review approves the complete
20/20 Harry Potter block. The accepted source register and review evidence remain
in `task-8-report.md` and `task-8-delta1-source-review.md`.

## Derived catalog counts

Counts are computed from the integrated source arrays, not copied from an earlier
milestone:

| Measure | Value |
| --- | ---: |
| Source categories (`id !== "random-mix"`) | 60 |
| Category choices including Random Mix | 61 |
| Source puzzles (`categoryId !== "random-mix"`) | 730 |
| Normalized-answer-unique Random Mix pool | 719 |
| Harry Potter cards | 20 |
| Normal source session size | 10 |
| Random Mix session size | 10 |

The derivation was independently checked with the Vite SSR loader against
`src/data/categories.ts`, `src/data/puzzles.ts`, and `src/lib/puzzles.ts`:

```json
{
  "sourceCategories": 60,
  "totalCategories": 61,
  "sourcePuzzles": 730,
  "randomMix": 719
}
```

## Code and test changes

- `src/lib/content-audit-packets.ts` now enumerates valid contiguous category
  boundaries and chooses the deterministic split with the smallest largest packet,
  then smallest residual spread. This keeps category ownership intact while adapting
  to uneven expansion sizes instead of asserting a fixed `<= 10` spread.
- `src/lib/content-audit-packets.test.ts` adds an uneven `[10, 30, 10, 20]`
  category fixture, proves the improved `[10, 30, 30]` split, verifies source-order
  coverage, opaque IDs, blind/full projection parity, and hint-ID parity, and derives
  the integrated imbalance bound from the largest source category.
- `src/lib/content-audit.test.ts` adds the final data-driven catalog gate and replaces
  static expansion-card count tables with multiple-of-ten checks. It retains the
  exact Harry Potter 20-card/subtheme/scope regressions.
- `src/lib/puzzles.test.ts` verifies normalized-answer uniqueness for the complete
  Random Mix pool without a stale pool-size literal.
- `src/lib/puzzles.ts` sets `RANDOM_MIX_SESSION_COUNT` to 10, matching the final
  product rule for every session.
- `src/components/game/GameBoard.tsx` removes the pre-reveal Random Mix source label;
  `AnswerReveal` remains the only place where source-category metadata is rendered.
- `GameBoard.test.tsx`, `round-history.test.ts`, and
  `round-history-storage.test.ts` cover hidden metadata, ten-card Random Mix, three
  exact ten-card blocks with deterministic wrap, category-isolated history, and
  unavailable/quota-limited storage.
- `src/app/play/[categorySlug]/page.test.ts` verifies static route generation includes
  Harry Potter and that its derived UI data exposes all 20 cards.

## Documentation synchronization

Updated `README.md`, `AGENTS.md`, `TASKS.md`, `UPDATES.md`, and
`CONTENT_GENERATION_RULES.md` with the final catalog counts, Harry Potter, ten-card
sessions, normalized Random Mix behavior, per-category history, and hidden source
metadata. The implementation ruling is also reflected in the design spec and plan:
Random Mix uses 10 cards rather than a separate session size. Historical 600/59
planning values remain explicitly labeled as baselines.

## Validation evidence

- `jq empty .superpowers/sdd/2026-08-18-content-audit-harry-potter/task-8-manifest.json`: passed.
- Focused Task9 suite: 7 files, 75 tests passed.
- Full `npm run test`: 15 files, 133 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; Next emitted only the existing multiple-lockfile workspace-root warning.
- `docker build -t ghcr.io/hallveticapro/guessmoji:content-audit .`: passed. Docker reported the
  existing 7 high-severity npm audit findings in the image build; dependency remediation is
  outside this content task and already documented as an upstream limitation.
- `git diff --check`: passed.

Packet export evidence under the ignored
`.superpowers/sdd/2026-08-18-content-audit-harry-potter/audit-packets-final` directory
contains exactly nine JSON views: three each for `partition-a`, `partition-b`, and
`partition-c`. Mechanical comparison reports:

```json
{
  "partitionCards": [250, 240, 240],
  "totalCards": 730,
  "uniqueOpaqueIds": 730,
  "categoryCount": 60,
  "blindFullHintParity": true,
  "answerAndSourceIdHidden": true
}
```

The source category order is contiguous (`disney-movies` through `breakfast`,
`sports` through `construction`, and `jobs` through `harry-potter`), and no
Random Mix row is present in the packets.
