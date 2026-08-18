# Content Audit, Selective Expansion, and Harry Potter Design

## Status

Approved from the user's standing execution directive and clarified scope choices on 2026-08-18.

## Objective

Audit every existing Guessmoji category and card against `CONTENT_GENERATION_RULES.md`, remediate confirmed violations, selectively expand categories that can support a complete block of ten strong cards, add a Harry Potter category, implement 10-card unseen-history rounds for larger pools, and carry the result through pull request, merge, GHCR publication, Arcane deployment, and live verification.

The work is complete only after the pull request is merged and the Arcane-managed Guessmoji deployment is updated and verified.

## Binding Constraints

- GPT-5.6 Sol at medium reasoning is the orchestrator.
- Only GPT-5.6 Luna subagents at max reasoning perform audit, content creation, implementation, blind review, task review, and final review.
- Subagents receive clean, bounded context and must not spawn their own subagents.
- `CONTENT_GENERATION_RULES.md` is authoritative for category and card quality.
- `TASKS.md` remains authoritative for project scope and status.
- Audit all 59 current source categories and all 600 current cards; Random Mix remains derived.
- Fix confirmed issues rather than producing a report-only audit.
- Selectively expand a category only when ten additional cards can pass all rules as a block.
- Never pad a category to meet a target.
- Add 20 Harry Potter cards based on the core seven-book/eight-film saga. Exclude actors and *Fantastic Beasts*.
- Normal category rounds contain 10 unique cards.
- Store per-category seen-card history in local browser storage; Shuffle only reorders the current round.
- Preserve the no-login, no-account, no-database, no-multiplayer MVP architecture.
- Keep content classroom-safe, group-friendly, and free of generic reveal fallback copy.

## Orchestration Architecture

The audit uses separate evidence, analysis, remediation, and review stages.

### Stage 1: Audit Packet Generation

A Luna/max implementation agent creates deterministic, git-ignored audit packets from the current category and puzzle data. Packets partition categories into three disjoint ranges and separate:

- Category, grade band, difficulty, and emoji clues without answers.
- Hints keyed by opaque card identifiers.
- Answer keys and full card metadata for later rule analysis.

The packet format must prevent a blind reviewer from seeing answers during the first two review stages. Packet generation must prove that every current source category and every current card appears exactly once.

### Stage 2: Parallel Blind Review

Three clean-context Luna/max reviewers run in parallel. Each reviewer receives only one answer-hidden packet and instructions not to inspect the repository or answer key.

For every card, the reviewer records:

1. First/strongest pre-hint guess, plausible alternatives, and reasoning.
2. Revised guess after the matching hint.
3. Difficulty-calibrated pass/fail after the orchestrator exposes the answer key in a follow-up turn.
4. Ambiguity, unfair leaps, answer leaks, or misleading emoji findings.

Reviewers complete the pre-hint stage for the full packet before reading hints and complete the hint stage before seeing answers.

### Stage 3: Parallel Rules And Fact Audit

Three separate clean-context Luna/max auditors receive disjoint category ranges, the full metadata packet, blind-review results, `CONTENT_GENERATION_RULES.md`, and the relevant audit utilities.

They inspect every assigned category and card for:

- Direct-answer and revealing-component emoji leaks.
- Category-context filler.
- Emoji repetition above the 20 percent review threshold.
- Substantially interchangeable clues.
- Fewer than two independent answer-specific associations.
- Answer familiarity and difficulty calibration.
- Hint leakage or inadequate help.
- Explanation coverage of every emoji.
- Distinct and complete hint, explanation, details, and fun-fact fields.
- Safety and tone.
- Factual accuracy using reliable sources.
- Duplicate or overly concentrated answers.
- Whether the category can support one or two additional blocks of ten strong cards.

Each finding must name the category, card ID when applicable, rule, evidence, severity, and recommended remediation. Factual findings include source URLs in the audit report only, never player-facing data.

### Stage 4: Sequential Remediation

Luna/max implementation agents apply reviewed audit findings in bounded tasks. Editing is sequential whenever tasks overlap `src/data/puzzles.ts`, `src/data/expandedPacks.ts`, shared banlists, or shared tests.

The remediation sequence is:

1. Objective audit helpers and tests.
2. 10-card unseen-history selection and persistence.
3. Core entertainment card remediation.
4. Expanded-pack remediation and selective expansion by audit partition.
5. Harry Potter category and 20-card pool.
6. Counts, documentation, and derived Random Mix alignment.

An expansion block is accepted only when all ten new cards pass automated checks, rules audit, fact verification, and clean-context blind review. A category may remain at 10 cards without being considered deficient.

### Stage 5: Review Gates

Every implementation task receives a separate Luna/max review for both spec compliance and quality. Critical or important findings return to the original implementer for a bounded fix/re-review loop.

Every changed or new clue receives clean-context blind re-review. The final integrated diff receives a Luna/max whole-branch review before release.

## Harry Potter Category

The category represents the core Harry Potter saga rather than the wider Wizarding World franchise.

### Scope

- 20 cards.
- Core seven books and eight films.
- Recognizable characters, places, objects, creatures, groups, and concepts.
- No actors, production trivia as answers, or *Fantastic Beasts* material.
- General fan audience with an age-appropriate grade band.
- A coverage plan spanning at least four subthemes so characters do not dominate.

### Clue Policy

Harry Potter is a semantic fandom category. Answer components may appear only when they contribute to a larger associative or rebus clue and fit the intended difficulty. Franchise-default filler such as repeated `⚡`, `🪄`, or `🏰` triggers category-level review and may be banned when it merely restates the theme.

All 20 cards require explicit hint, explanation, details, fun fact, difficulty, and tags. Facts must be verified against reliable references during audit.

## Round Selection And Local History

### Behavior

- Normal source categories use a session size of 10, regardless of pool size.
- Random Mix preserves its separately configured session count unless the implementation plan explicitly aligns it with the 10-card product rule and updates the specification first.
- A new category start or Play Again draws unseen cards for that category.
- A round never contains a duplicate card.
- Shuffle reorders only the current round and does not mutate seen history.
- After the final unseen block is dealt, the following round begins a fresh cycle.
- Category pools are multiples of 10, so partial-cycle rounds are unnecessary.

### Storage

Persist only card IDs keyed by category ID under a versioned Guessmoji local-storage key. Storage helpers must:

- Tolerate unavailable storage, malformed JSON, non-array values, and quota/write failures.
- Remove stale card IDs that no longer exist in the current pool.
- Reset safely when the storage schema version changes.
- Avoid server-side access to `window` or `localStorage`.

If storage is unavailable, the game falls back to a unique random 10-card round without cross-round memory.

### Determinism And Testability

Keep pure selection and history-normalization logic separate from React effects. Accept or inject randomness in tests so unseen selection, exhaustion reset, and no-duplicate guarantees are deterministic.

## Automated Validation

Hard failures cover objective rules:

- Unique category IDs/slugs and card IDs.
- Every card references a real source category.
- Every source category has a multiple of 10 cards and at least 10 cards.
- All shipped cards have explicit required reveal fields.
- Direct-answer and revealing-component emoji leaks represented by the banlist.
- Exact duplicate clues within a category.
- Random Mix deduplication by normalized answer, not only by ID.
- Audit packet coverage: every current card exactly once, no Random Mix source rows.
- Round selection: 10 unique cards, unseen preference, cycle reset, stale-history cleanup, malformed-storage fallback, and Shuffle isolation.
- Static route generation and category rendering include Harry Potter.

Judgment-based output remains a review report:

- Repetition threshold warnings.
- Semantic similarity and interchangeable clues.
- Independent-association quality.
- Difficulty, recognizability, and hint calibration.
- Coverage balance and factual confidence.

Existing count assertions must become invariant-based rather than remain hard-coded to 60 categories or 600 puzzles.

## Error Handling

- Audit scripts stop with a nonzero exit when coverage is incomplete or duplicate.
- A subagent report that omits assigned categories/cards is rejected and rerun before remediation.
- Unsupported or uncertain factual claims are rewritten or removed, not guessed.
- Failed blind-review cards are revised and re-reviewed before acceptance.
- Failed local storage never prevents a round from starting.
- Release stops before merge on failing required checks.
- Deployment stops if the GHCR image for the merged commit is not published or pullable.
- Arcane update failures retain the current running deployment and are reported with the exact failed operation.

## Documentation

Update:

- `TASKS.md` with actual completed scope, resulting counts, and round-history behavior.
- `UPDATES.md` with concise meaningful changes.
- `AGENTS.md` only when durable paths, helpers, commands, or conventions change.
- `README.md` category/count descriptions when current public documentation would otherwise be inaccurate.
- `CONTENT_GENERATION_RULES.md` only if implementation reveals an ambiguity that requires a durable ruling.

Temporary audit packets, reports, and subagent ledgers remain git-ignored. Durable evidence is represented by tests, committed content, and concise task/update records.

## Verification

Before opening the pull request:

1. Run the content/audit tests.
2. Run the round-selection and GameBoard tests.
3. Run the full Vitest suite.
4. Run ESLint.
5. Run TypeScript type checking.
6. Run the production Next.js build.
7. Build the Docker image.
8. Review the final category/card counts and invariant checks.
9. Confirm every audit partition and blind-review partition has complete coverage.
10. Obtain a clean Luna/max whole-branch review or explicitly adjudicate any residual non-blocking finding.

## Release And Deployment

1. Work on `codex/content-audit-harry-potter` in an isolated worktree.
2. Commit focused, reviewed milestones.
3. Push the branch and open a pull request against `main`.
4. Wait for required GitHub checks and address failures through Luna/max subagents.
5. Merge the pull request after checks pass.
6. Verify the canonical GitHub Actions run publishes `ghcr.io/hallveticapro/guessmoji` for the merged commit.
7. Resolve the existing Guessmoji project in Arcane's Local Docker environment using read-only API discovery.
8. Trigger the smallest Arcane project update/redeploy operation that pulls the new canonical image.
9. Verify Arcane reports the Guessmoji service running from the updated image.
10. Verify `https://guessmoji.mrhallsclass.com/` and the Harry Potter route respond successfully and expose the merged content.

Do not print, log, persist, or commit the Arcane API key. Retrieve it from macOS Keychain only at execution time and send it solely in the `X-Api-Key` header.
