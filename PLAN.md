# Guessmoji Card Clue Audit Plan

Generated: 2026-06-07

Source of truth: `TASKS.md`

## Purpose

Review every shipped Guessmoji puzzle card so emoji clues are fair, classroom-friendly, and do not give away the answer by using the answer's own emoji or an overly literal direct substitute.

This plan replaces the completed code-review remediation plan. The prior code-review closure remains documented in `CODE_REVIEW.md` and `UPDATES.md`.

## Definitions

- **Direct answer emoji:** an emoji that directly depicts the answer object, animal, food, tool, vehicle, symbol, or character type. Example: `Whale` -> `🐋`.
- **Near-identical substitute:** an emoji variant that effectively reveals the same answer. Example: `Apple` -> `🍎` and `🍏`.
- **Context emoji:** an associated clue that describes habitat, action, color, sound, location, story beat, use, or adjacent object without directly depicting the answer. Example: `Whale` may use `🌊`, `💨`, `🎶`, or `📏`.
- **Reviewed card:** a puzzle row whose answer, emoji clue, hint, and category context have been checked against this plan and recorded in `CLUE_AUDIT.md`.
- **Shipped puzzle set:** the exported `puzzles` array from `src/data/puzzles.ts`, including core cards and expanded packs.

## Non-Goals

- Do not add login, accounts, multiplayer, a database, or server persistence.
- Do not reduce the puzzle catalog size to avoid the audit.
- Do not make clues so vague that the game becomes frustrating.
- Do not remove classroom-safe details, fun facts, or hints unless they also give away the answer.
- Do not change public README examples away from neutral placeholders.

## Measurement Rules

Every plan item below has measurable acceptance. If implementation discovers a plan item is still too broad, split it before editing puzzle data.

Acceptable evidence types:

- A committed test assertion.
- A committed source file or review log with exact counts.
- Command output recorded in `UPDATES.md`.
- A browser smoke note recorded in `UPDATES.md`.
- A documented deferral with a specific blocker, fallback, and follow-up trigger.

## Phase 0 - Baseline Inventory

### 0.1 Capture Baseline Counts And Commands

**Purpose**

Create a before-edit snapshot so the audit can prove it reviewed the whole current catalog.

**Files**

- `CLUE_AUDIT.md`
- `UPDATES.md`

**Steps**

1. Run:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
2. Count current categories and shipped puzzles.
3. Record the current test-file and test-count totals.
4. Record the source data files being audited.

**Measurable Acceptance**

- `CLUE_AUDIT.md` exists.
- `CLUE_AUDIT.md` has a `Baseline Inventory` section.
- `Baseline Inventory` records exact values for:
  - total categories from `src/data/categories.ts`
  - non-random categories
  - shipped puzzle count from exported `puzzles`
  - Random Mix session count
  - test files and test count from `npm run test`
- `Baseline Inventory` identifies both audited source data files:
  - `src/data/puzzles.ts`
  - `src/data/expandedPacks.ts`
- `UPDATES.md` records pass/fail status for lint, typecheck, test, and build before clue edits begin.

### 0.2 Create Category Review Matrix

**Purpose**

Make the review scope enumerable instead of relying on prose lists.

**Files**

- `CLUE_AUDIT.md`

**Steps**

1. Add a table with one row per category from `src/data/categories.ts`.
2. Exclude `Random Mix` from direct card counts and mark it as derived from reviewed source puzzles.
3. Record each category's puzzle count from `getPuzzlesByCategoryId(category.id)`.
4. Add blank status fields to be filled during review.

**Measurable Acceptance**

- `CLUE_AUDIT.md` has a `Category Review Matrix` table.
- The table row count equals the number of categories in `src/data/categories.ts`.
- Every category id and category name from `src/data/categories.ts` appears exactly once in the table.
- Each non-random category row has these columns:
  - category id
  - category name
  - cards in source
  - cards reviewed
  - cards changed
  - status
  - evidence
- The `Random Mix` row has `Derived from reviewed source puzzles` in its evidence column.

## Phase 1 - Build The Direct-Emoji Detection Harness

### 1.1 Create Normalization Helpers

**Purpose**

Ensure answer matching is deterministic and testable before a banlist is created.

**Files**

- `src/lib/clue-audit.ts`
- `src/lib/clue-audit.test.ts`

**Steps**

1. Add `normalizeAnswerForAudit(answer: string)`.
2. Normalize casing, trim whitespace, collapse repeated spaces, normalize ampersands, and remove punctuation that should not distinguish answers.
3. Add unit tests for expected normalization behavior.

**Measurable Acceptance**

- `src/lib/clue-audit.ts` exports `normalizeAnswerForAudit`.
- `src/lib/clue-audit.test.ts` includes table-driven tests for at least:
  - `Fox`
  - `S'mores`
  - `Lilo & Stitch`
  - `Spider-Man`
  - `R2-D2`
  - plural answer casing such as `Grapes`
- `npm run test` passes.

### 1.2 Inventory Direct-Emoji Candidate Answers

**Purpose**

Split discovery from policy so the banlist is based on a visible full-catalog pass.

**Files**

- `CLUE_AUDIT.md`
- Optional helper script or test if useful.

**Steps**

1. Inspect all shipped puzzle answers.
2. Identify answers with direct emoji or near-identical substitutes.
3. Record candidates by category.

**Measurable Acceptance**

- `CLUE_AUDIT.md` has a `Direct Emoji Candidate Inventory` section.
- The section records the number of candidate answers found.
- The section lists candidates for all known example answers:
  - `Whale`
  - `Fox`
  - `Elephant`
  - `Giraffe`
  - `Apple`
  - `Carrot`
- The section records `none found` for reviewed categories where no direct emoji candidates exist.
- Candidate rows include category id, puzzle id, answer, direct emoji candidates, and reviewer note.

### 1.3 Create Answer Emoji Banlist

**Purpose**

Turn candidate answers into testable policy.

**Files**

- `src/data/answerEmojiBanlist.ts`
- `src/lib/clue-audit.test.ts`

**Steps**

1. Add a typed banlist keyed by normalized answer text.
2. Add forbidden emoji arrays for every direct candidate accepted from `CLUE_AUDIT.md`.
3. Keep comments only for non-obvious decisions.

**Measurable Acceptance**

- `src/data/answerEmojiBanlist.ts` exists.
- The file exports a typed readonly banlist.
- Tests can import the banlist.
- The banlist has entries proving:
  - `Whale` forbids `🐋`
  - `Fox` forbids `🦊`
  - `Elephant` forbids `🐘`
  - `Giraffe` forbids `🦒`
  - `Apple` forbids `🍎` and `🍏`
  - `Carrot` forbids `🥕`
- Every answer in the `Direct Emoji Candidate Inventory` is either present in the banlist or documented in `CLUE_AUDIT.md` as intentionally not banned with a reason.

### 1.4 Add Automated Leak Detection

**Purpose**

Make direct-answer emoji regressions fail tests.

**Files**

- `src/lib/clue-audit.ts`
- `src/lib/clue-audit.test.ts`

**Steps**

1. Add `findDirectAnswerEmojiLeaks(puzzles, banlist)`.
2. Return a structured leak object containing puzzle id, answer, clue, and forbidden emoji.
3. Add a full shipped-puzzle test expecting zero leaks.
4. Add a synthetic leak test to prove failures are detectable.

**Measurable Acceptance**

- `src/lib/clue-audit.ts` exports `findDirectAnswerEmojiLeaks`.
- Leak objects include at least:
  - `puzzleId`
  - `answer`
  - `emojis`
  - `forbiddenEmoji`
- `src/lib/clue-audit.test.ts` includes a synthetic puzzle whose clue intentionally leaks a banned emoji and expects exactly one leak.
- `src/lib/clue-audit.test.ts` includes a shipped-puzzle test where `findDirectAnswerEmojiLeaks(puzzles, answerEmojiBanlist)` returns `[]`.
- Test failure output for shipped-puzzle leaks includes the leak object list.

## Phase 2 - High-Risk Literal Category Fixes

### 2.1 Review Animal And Creature Categories

**Purpose**

Fix the most obvious animal/object direct emoji leaks first.

**Files**

- `src/data/expandedPacks.ts`
- `CLUE_AUDIT.md`
- `UPDATES.md`

**Categories**

- `animals`
- `ocean-animals`
- `birds`
- `bugs`
- `dinosaurs`

**Steps**

1. Review every card in the listed categories.
2. Replace direct answer emoji with context emoji.
3. Update `CLUE_AUDIT.md` after the category batch.
4. Run `npm run test`.

**Measurable Acceptance**

- `CLUE_AUDIT.md` marks all five listed category ids as reviewed.
- For each listed category, `cards reviewed` equals the current source puzzle count.
- Known fixes are present in source and tests:
  - `Whale` clue does not contain `🐋`.
  - `Fox` clue does not contain `🦊`.
  - `Elephant` clue does not contain `🐘`.
  - `Giraffe` clue does not contain `🦒`.
- `findDirectAnswerEmojiLeaks` returns no leaks for the five listed categories.
- `npm run test` passes after the batch.
- `UPDATES.md` records changed puzzle ids and command evidence.

### 2.2 Review Food And Plant Categories

**Purpose**

Remove direct food/plant emoji from matching answer clues.

**Files**

- `src/data/expandedPacks.ts`
- `CLUE_AUDIT.md`
- `UPDATES.md`

**Categories**

- `fruit`
- `vegetables`
- `desserts`
- `snacks`
- `breakfast`
- `plants`

**Steps**

1. Review every card in the listed categories.
2. Replace direct answer emoji and near-identical produce variants with context emoji.
3. Update `CLUE_AUDIT.md`.
4. Run `npm run test`.

**Measurable Acceptance**

- `CLUE_AUDIT.md` marks all six listed category ids as reviewed.
- For each listed category, `cards reviewed` equals the current source puzzle count.
- Known fixes are present in source and tests:
  - `Apple` clue contains neither `🍎` nor `🍏`.
  - `Carrot` clue does not contain `🥕`.
  - All fruit answers with direct fruit emoji in the banlist have zero leaks.
  - All vegetable answers with direct vegetable emoji in the banlist have zero leaks.
- `findDirectAnswerEmojiLeaks` returns no leaks for the six listed categories.
- `npm run test` passes after the batch.
- `UPDATES.md` records changed puzzle ids and command evidence.

### 2.3 Review Object, Symbol, And Action Categories

**Purpose**

Catch categories where direct emojis are tools, supplies, vehicles, weather icons, emotions, sports equipment, or holiday symbols.

**Files**

- `src/data/expandedPacks.ts`
- `CLUE_AUDIT.md`
- `UPDATES.md`

**Categories**

- `weather`
- `vehicles`
- `jobs`
- `school-supplies`
- `art-supplies`
- `sports`
- `holidays`
- `emotions`
- every remaining expanded category with direct object/symbol answer candidates from `Direct Emoji Candidate Inventory`

**Steps**

1. Review every card in the listed categories.
2. Replace direct answer emoji with context emoji.
3. Update `CLUE_AUDIT.md`.
4. Run `npm run test`.

**Measurable Acceptance**

- `CLUE_AUDIT.md` marks every listed category id as reviewed.
- `CLUE_AUDIT.md` lists any additional expanded category pulled in by candidate inventory.
- For each reviewed category, `cards reviewed` equals the current source puzzle count.
- `findDirectAnswerEmojiLeaks` returns no leaks for these categories.
- `npm run test` passes after the batch.
- `UPDATES.md` records changed puzzle ids and command evidence.

## Phase 3 - Entertainment, Educational, And Abstract Category Review

### 3.1 Review Core Entertainment Categories

**Purpose**

Check the manually authored core entertainment cards for character/title giveaways.

**Files**

- `src/data/puzzles.ts`
- `CLUE_AUDIT.md`
- `UPDATES.md`

**Categories**

- `disney-movies`
- `disney-princesses`
- `pixar`
- `marvel`
- `star-wars`
- `dreamworks`
- `video-game-movies`
- `kid-tv-shows`
- `animated-classics`

**Steps**

1. Review every core card in the listed categories.
2. Replace direct character/object answer emoji where applicable.
3. Preserve fair franchise/story clue patterns.
4. Update `CLUE_AUDIT.md`.
5. Run `npm run test`.

**Measurable Acceptance**

- `CLUE_AUDIT.md` marks all listed category ids as reviewed.
- For each listed category, `cards reviewed` equals the current source puzzle count.
- `findDirectAnswerEmojiLeaks` returns no leaks for the listed categories.
- Any retained direct-looking clue is documented in `Allowed Exceptions`.
- `npm run test` passes after the batch.
- `UPDATES.md` records changed puzzle ids and command evidence.

### 3.2 Review Game, School, Science, Place, And Wordplay Categories

**Purpose**

Complete manual review for remaining lower-risk categories.

**Files**

- `src/data/expandedPacks.ts`
- `CLUE_AUDIT.md`
- `UPDATES.md`

**Categories**

- `board-games`
- `video-games`
- `pokemon`
- `minecraft`
- `science`
- `space`
- `math`
- `books`
- `fairy-tales`
- `landmarks`
- `geography`
- `music`
- `literal-phrases`
- `idioms`
- `robots`
- every category not already reviewed in Phases 2 or 3.1

**Steps**

1. Review every card in the listed categories.
2. Replace direct answer emoji if found.
3. Update `CLUE_AUDIT.md`.
4. Run `npm run test`.

**Measurable Acceptance**

- `CLUE_AUDIT.md` marks every listed category id as reviewed.
- `CLUE_AUDIT.md` has no category row with status `pending`.
- The sum of `cards reviewed` for non-random categories equals the shipped puzzle count excluding Random Mix placeholder/category behavior.
- `findDirectAnswerEmojiLeaks` returns no leaks for all shipped puzzles.
- `npm run test` passes after the batch.
- `UPDATES.md` records changed puzzle ids and command evidence.

### 3.3 Verify Random Mix Coverage

**Purpose**

Prove Random Mix inherits reviewed clues and does not need a separate card-edit path.

**Files**

- `CLUE_AUDIT.md`
- `src/lib/puzzles.test.ts`
- `src/lib/clue-audit.test.ts`

**Steps**

1. Confirm Random Mix pulls only from reviewed non-random source puzzles.
2. Confirm existing Random Mix uniqueness behavior still passes.
3. Record Random Mix status in `CLUE_AUDIT.md`.

**Measurable Acceptance**

- `CLUE_AUDIT.md` marks `random-mix` as `derived-reviewed`.
- `CLUE_AUDIT.md` records `cards reviewed` for Random Mix as `0 direct / derived from source pool`.
- Tests prove `getRandomMix(RANDOM_MIX_SESSION_COUNT)` returns no duplicate puzzle ids.
- Direct-answer leak tests run against the full shipped puzzle set, including all puzzles eligible for Random Mix.

## Phase 4 - Exception Policy

### 4.1 Define Allowed Exception Schema

**Purpose**

Make any exceptions structured and reviewable.

**Files**

- `CLUE_AUDIT.md`
- `src/lib/clue-audit.test.ts`

**Steps**

1. Add an `Allowed Exceptions` section to `CLUE_AUDIT.md`.
2. Define required fields for exception rows.
3. Add test support only if exceptions are actually needed.

**Measurable Acceptance**

- `CLUE_AUDIT.md` includes `Allowed Exceptions`.
- The section defines required fields:
  - puzzle id
  - answer
  - emoji
  - reason
  - reviewer status
- If there are no exceptions, the section says `None`.
- If exceptions exist, each exception row has all required fields filled.

### 4.2 Prefer Fixes Over Exceptions

**Purpose**

Prevent exceptions from becoming a shortcut around the audit.

**Files**

- `CLUE_AUDIT.md`
- `src/data/answerEmojiBanlist.ts`
- `src/lib/clue-audit.test.ts`

**Steps**

1. Review every leak before adding an exception.
2. Add an exception only when the emoji is not actually the answer and is necessary for solvability.
3. Document why a clue edit was not better.

**Measurable Acceptance**

- Every exception, if any, has a reason longer than 20 characters.
- No exception reason is a generic phrase such as `needed`, `allowed`, or `solvability` by itself.
- Tests distinguish banned emoji from allowed contextual emoji if exceptions exist.
- `UPDATES.md` records every exception added or records `No exceptions added`.

## Phase 5 - Final Verification

### 5.1 Run Final Local Verification

**Purpose**

Close the audit with current command evidence.

**Files**

- `UPDATES.md`

**Steps**

1. Run:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
2. Run `npm audit --audit-level=moderate`.
3. Document any remaining upstream-only dependency findings.

**Measurable Acceptance**

- `UPDATES.md` records pass/fail status for all five commands.
- `npm run test` passes with the clue-audit suite included.
- `npm run build` passes.
- `npm audit --audit-level=moderate` exits `0` or has every remaining moderate-or-higher finding documented with package, advisory, and reason no safe fix was applied.
- No `npm audit fix --force` is used.

### 5.2 Run Final Source Consistency Checks

**Purpose**

Prove the review log and source data agree.

**Files**

- `CLUE_AUDIT.md`
- `UPDATES.md`

**Steps**

1. Check every category from `src/data/categories.ts` appears in `CLUE_AUDIT.md`.
2. Check reviewed card totals equal shipped puzzle totals.
3. Check direct-answer leak helper returns zero leaks.
4. Check README remains neutral.

**Measurable Acceptance**

- `UPDATES.md` records a source consistency check with exact category and puzzle totals.
- The check reports zero missing category ids in `CLUE_AUDIT.md`.
- The check reports zero unreviewed non-random cards.
- The check reports zero direct-answer emoji leaks.
- `rg "hallveticapro|mrhallsclass|guessmoji\\.mrhallsclass|ghcr.io/hallveticapro" README.md` returns no matches.

### 5.3 Run Browser Smoke On Changed Clues

**Purpose**

Verify changed clues still render well for the host.

**Files**

- `UPDATES.md`

**Steps**

1. Start the app locally.
2. Open at least one changed high-risk category on desktop width.
3. Open at least one changed high-risk category on mobile width.
4. Confirm the emoji clue stays on one line and answer remains hidden before reveal.

**Measurable Acceptance**

- `UPDATES.md` records the local URL used.
- Browser smoke includes at least one changed puzzle from:
  - animal/ocean category
  - fruit/vegetable category
- Browser smoke records:
  - category page loads
  - play page loads
  - answer hidden before reveal
  - changed emoji clue visible
  - changed emoji clue is one line at mobile width
  - reveal still works
- Browser console has no errors during smoke, or errors are documented with cause.

### 5.4 Push And Verify GitHub Actions

**Purpose**

Ensure the remote repository accepts the audit.

**Files**

- `UPDATES.md`

**Steps**

1. Commit final audit work.
2. Push to `main`.
3. Watch the GitHub Actions Docker workflow.

**Measurable Acceptance**

- `git status --short` is clean after commit.
- `UPDATES.md` records the final commit hash.
- `git push origin main` succeeds.
- Latest GitHub Actions run for the pushed commit completes successfully.
- The run includes install, lint, typecheck, test, and Docker build/push steps.

## Phase 6 - Future Guardrails

### 6.1 Update Persistent Contributor Guidance

**Purpose**

Make the no-direct-answer-emoji rule durable for future card additions.

**Files**

- `AGENTS.md`
- `TASKS.md`
- `README.md` only if public contributor guidance is needed.

**Steps**

1. Add or update the agent convention for future cards.
2. Add or update the task note for future packs.
3. Keep README neutral and generic.

**Measurable Acceptance**

- `AGENTS.md` documents:
  - no direct answer emoji in clue
  - update the answer emoji banlist when adding a direct-emoji answer
  - run the clue-audit tests before committing new cards
- `TASKS.md` records the same future guardrail.
- README either remains unchanged or uses only generic placeholder examples.
- `rg "hallveticapro|mrhallsclass|guessmoji\\.mrhallsclass|ghcr.io/hallveticapro" README.md` returns no matches.

## Completion Requirements

The clue audit is complete only when all of these are true:

- Every `###` plan item above has evidence satisfying its measurable acceptance.
- Every shipped card has been reviewed.
- `CLUE_AUDIT.md` covers every category and all shipped cards.
- Known direct-answer examples are fixed.
- The automated leak test passes over the full puzzle set.
- Final lint, typecheck, tests, and build pass.
- Known audit dependency findings are documented without unsafe forced fixes.
- GitHub Actions passes after the final push.
- `UPDATES.md`, `TASKS.md`, and `AGENTS.md` are current.
