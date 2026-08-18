# Content Audit And Harry Potter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Audit and remediate all current Guessmoji content, selectively expand strong categories, add a 20-card Harry Potter category, support unseen 10-card rounds, and release the merged result through Arcane.

**Architecture:** Pure audit and round-selection helpers provide deterministic enforcement, while clean-context Luna/max agents provide semantic and blind-review judgment. Read-only audit agents run in parallel over three disjoint category partitions; implementation agents then work sequentially where shared data files overlap. Release proceeds only after full local validation and a clean integrated review.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Vitest, jsdom, Tailwind CSS, localStorage, Docker, GitHub Actions, GHCR, Arcane API.

**Spec:** docs/superpowers/specs/2026-08-18-content-audit-harry-potter-design.md

## Global Constraints

- GPT-5.6 Sol at medium reasoning is the orchestrator.
- Only GPT-5.6 Luna subagents at max reasoning perform audit, content creation, implementation, blind review, task review, and final review.
- Subagents receive clean, bounded context and must not spawn their own subagents.
- CONTENT_GENERATION_RULES.md is authoritative for category and card quality.
- TASKS.md remains authoritative for project scope and status.
- Audit all 59 current source categories and all 600 current cards; Random Mix remains derived.
- Fix confirmed issues rather than producing a report-only audit.
- Selectively expand a category only when ten additional cards can pass all rules as a block.
- Never pad a category to meet a target.
- Add 20 Harry Potter cards from the core seven-book/eight-film saga. Exclude actors and Fantastic Beasts.
- Normal source-category rounds contain 10 unique cards.
- Store per-category seen-card history in local browser storage; Shuffle only reorders the current round.
- Preserve the no-login, no-account, no-database, no-multiplayer MVP architecture.
- Keep content classroom-safe, group-friendly, and free of generic reveal fallback copy.
- Arcane credentials remain in macOS Keychain and are never printed, logged, persisted, or committed.

## File Responsibility Map

- src/lib/content-audit.ts: pure objective catalog invariants and emoji-usage analysis.
- src/lib/content-audit.test.ts: objective unit and shipped-catalog regression tests.
- src/lib/content-audit-packets.ts: deterministic answer-hidden/full-metadata partition builder.
- src/lib/content-audit-packets.test.ts: packet isolation, exact coverage, and ignored packet export.
- src/components/game/round-history.ts: pure unseen-card normalization and round selection.
- src/components/game/round-history.test.ts: deterministic selection, exhaustion, and stale-history tests.
- src/components/game/round-history-storage.ts: safe versioned localStorage adapter.
- src/components/game/round-history-storage.test.ts: malformed/unavailable/quota storage tests.
- src/components/game/GameBoard.tsx and GameBoard.test.tsx: 10-card round integration, restart, and Shuffle behavior.
- src/app/play/[categorySlug]/page.tsx: normal and Random Mix session counts.
- src/lib/puzzles.ts and puzzles.test.ts: normalized-answer Random Mix deduplication and catalog invariants.
- src/data/puzzles.ts: core entertainment remediation.
- src/data/expandedPacks.ts: expanded-pack remediation, selective expansion, and Harry Potter.
- src/data/answerEmojiBanlist.ts and src/lib/clue-audit.test.ts: direct/component bans and regressions.
- README.md, AGENTS.md, TASKS.md, UPDATES.md: durable public and project documentation.
- .superpowers/sdd/2026-08-18-content-audit-harry-potter/: ignored packets, reports, briefs, review packages, and ledger.

---

### Task 1: Objective Audit And Packet Infrastructure

**Files:**
- Create: src/lib/content-audit.ts
- Create: src/lib/content-audit.test.ts
- Create: src/lib/content-audit-packets.ts
- Create: src/lib/content-audit-packets.test.ts
- Modify: .gitignore

**Interfaces:**
- Consumes: Category, Puzzle, normalizeAnswerForAudit(), shipped categories, and shipped puzzles.
- Produces: ContentAuditFinding, ContentAuditPartition, findContentInvariantViolations(), getCategoryEmojiUsage(), and buildContentAuditPartitions().

- [ ] **Step 1: Write failing objective-audit tests**

~~~ts
expect(findContentInvariantViolations([category], nineCards)).toContainEqual(
  expect.objectContaining({ rule: "pool-size-multiple-of-10" }),
);
expect(findContentInvariantViolations([category], duplicateClues)).toContainEqual(
  expect.objectContaining({ rule: "duplicate-clue" }),
);
expect(getCategoryEmojiUsage(twentyCards).get("🌊")).toEqual({
  count: 5,
  ratio: 0.25,
});
~~~

- [ ] **Step 2: Run the focused test and confirm red state**

Run: npm run test -- src/lib/content-audit.test.ts

Expected: FAIL because content-audit.ts does not exist.

- [ ] **Step 3: Implement objective audit helpers**

~~~ts
export type ContentAuditRule =
  | "pool-size-multiple-of-10"
  | "missing-required-field"
  | "duplicate-clue"
  | "duplicate-normalized-answer"
  | "unknown-category";

export type ContentAuditFinding = {
  rule: ContentAuditRule;
  categoryId?: string;
  puzzleIds: string[];
  message: string;
};

export function findContentInvariantViolations(
  categoryList: readonly Category[],
  puzzleList: readonly Puzzle[],
): ContentAuditFinding[];

export function getCategoryEmojiUsage(
  puzzleList: readonly Puzzle[],
): ReadonlyMap<string, { count: number; ratio: number }>;
~~~

Normalize variation selectors before counting. Required shipped fields are answer, emojis, hint, details, explanation, funFact, and nonempty tags.

- [ ] **Step 4: Run the objective test**

Run: npm run test -- src/lib/content-audit.test.ts

Expected: PASS for fixture behavior. Do not assert that the legacy shipped catalog has zero findings yet; Tasks 4-9 close those findings.

- [ ] **Step 5: Write failing packet tests**

~~~ts
const partitions = buildContentAuditPartitions(categories, puzzles, 3);
const blindCards = partitions.flatMap((item) => item.blindCards);
const fullCards = partitions.flatMap((item) => item.fullCards);

expect(partitions).toHaveLength(3);
expect(blindCards).toHaveLength(600);
expect(fullCards).toHaveLength(600);
expect(new Set(fullCards.map((card) => card.opaqueId)).size).toBe(600);
expect(JSON.stringify(blindCards)).not.toContain('"answer"');
expect(partitions.flatMap((item) => item.categoryIds)).not.toContain("random-mix");
~~~

- [ ] **Step 6: Run the packet test and confirm red state**

Run: npm run test -- src/lib/content-audit-packets.test.ts

Expected: FAIL because buildContentAuditPartitions() does not exist.

- [ ] **Step 7: Implement deterministic three-way packets**

~~~ts
export type ContentAuditCard = {
  opaqueId: string;
  categoryId: string;
  categoryName: string;
  gradeBand?: string;
  difficulty: PuzzleDifficulty;
  emojis: string;
};

export type FullContentAuditCard = ContentAuditCard & {
  answer: string;
  hint?: string;
  details?: string;
  explanation?: string;
  funFact?: string;
  tags?: string[];
};

export type ContentAuditPartition = {
  id: "partition-a" | "partition-b" | "partition-c";
  categoryIds: string[];
  blindCards: ContentAuditCard[];
  hintsByOpaqueId: Record<string, string>;
  fullCards: FullContentAuditCard[];
};

export function buildContentAuditPartitions(
  categoryList: readonly Category[],
  puzzleList: readonly Puzzle[],
  partitionCount: 3,
): ContentAuditPartition[];
~~~

Assign whole categories, preserve source order, balance by card count, and use opaque IDs that reveal neither answer nor puzzle ID.

- [ ] **Step 8: Add ignored packet export**

When CONTENT_AUDIT_OUTPUT_DIR is set, the packet test writes blind, hints, and full JSON for each partition with node:fs/promises. Ensure .superpowers/ is ignored.

Run:

~~~bash
CONTENT_AUDIT_OUTPUT_DIR=.superpowers/sdd/2026-08-18-content-audit-harry-potter/audit-packets npm run test -- src/lib/content-audit-packets.test.ts
~~~

Expected: PASS and exactly nine JSON files.

- [ ] **Step 9: Run both focused tests**

Run: npm run test -- src/lib/content-audit.test.ts src/lib/content-audit-packets.test.ts

Expected: PASS.

- [ ] **Step 10: Commit**

~~~bash
git add .gitignore src/lib/content-audit.ts src/lib/content-audit.test.ts src/lib/content-audit-packets.ts src/lib/content-audit-packets.test.ts
git commit -m "test: add content audit infrastructure"
~~~

## Required Parallel Audit Wave After Task 1

The orchestrator dispatches three Luna/max blind reviewers in parallel, one per blind packet. Reviewers may not inspect the repository, hints before stage two, or answers before stage three. Each report records pre-hint guess, alternatives, reasoning, post-hint guess, and final difficulty-calibrated verdict for every opaque ID.

Then dispatch three different Luna/max rules/fact auditors in parallel. Each receives one full packet, matching blind report, CONTENT_GENERATION_RULES.md, and the report schema from the spec. Each auditor covers direct/component leaks, category filler, repetition, interchangeable clues, associations, difficulty, hints, explanation coverage, reveal-field quality, safety, facts with sources, answer concentration, and expansion potential.

Mechanically compare packet IDs with report IDs before Task 2. Missing IDs return to the same auditor. Remediation cannot start until all 600 original cards and all 59 source categories have blind and rules/fact evidence.

### Task 2: Pure Unseen-Round Selection

**Files:**
- Create: src/components/game/round-history.ts
- Create: src/components/game/round-history.test.ts
- Modify: src/lib/puzzles.ts
- Modify: src/lib/puzzles.test.ts

**Interfaces:**
- Consumes: puzzle pools, seen IDs, and injectable randomness.
- Produces: SOURCE_CATEGORY_ROUND_COUNT, normalizeSeenPuzzleIds(), selectCategoryRound(), and normalized-answer Random Mix deduplication.

- [ ] **Step 1: Write failing selection tests**

~~~ts
expect(selectCategoryRound(poolOfTwenty, [], 10, () => 0)).toMatchObject({
  puzzles: poolOfTwenty.slice(0, 10),
  seenIds: poolOfTwenty.slice(0, 10).map((puzzle) => puzzle.id),
  didResetCycle: false,
});
expect(selectCategoryRound(poolOfTwenty, firstTenIds, 10, () => 0).puzzles)
  .toEqual(poolOfTwenty.slice(10));
expect(selectCategoryRound(poolOfTwenty, allTwentyIds, 10, () => 0).didResetCycle)
  .toBe(true);
expect(normalizeSeenPuzzleIds(["valid", "stale", "valid"], pool))
  .toEqual(["valid"]);
~~~

Also test pools smaller than count, no round duplicates, and input immutability.

- [ ] **Step 2: Confirm red state**

Run: npm run test -- src/components/game/round-history.test.ts

Expected: FAIL because the helper does not exist.

- [ ] **Step 3: Implement selection**

~~~ts
export const SOURCE_CATEGORY_ROUND_COUNT = 10;

export type CategoryRoundSelection = {
  puzzles: Puzzle[];
  seenIds: string[];
  didResetCycle: boolean;
};

export function normalizeSeenPuzzleIds(
  storedIds: readonly string[],
  puzzlePool: readonly Puzzle[],
): string[];

export function selectCategoryRound(
  puzzlePool: readonly Puzzle[],
  seenIds: readonly string[],
  count?: number,
  random?: () => number,
): CategoryRoundSelection;
~~~

Reset before selection only when every current pool ID is seen. Fisher-Yates shuffle unseen candidates with injected randomness and never mutate inputs.

- [ ] **Step 4: Deduplicate Random Mix by normalized answer**

Key the pool with normalizeAnswerForAudit(puzzle.answer), preserve the first source occurrence, and add a fixture with two IDs sharing one normalized answer.

- [ ] **Step 5: Run focused tests**

Run: npm run test -- src/components/game/round-history.test.ts src/lib/puzzles.test.ts

Expected: PASS.

- [ ] **Step 6: Commit**

~~~bash
git add src/components/game/round-history.ts src/components/game/round-history.test.ts src/lib/puzzles.ts src/lib/puzzles.test.ts
git commit -m "feat: select unseen category rounds"
~~~

### Task 3: Safe Storage And GameBoard Integration

**Files:**
- Create: src/components/game/round-history-storage.ts
- Create: src/components/game/round-history-storage.test.ts
- Modify: src/components/game/GameBoard.tsx
- Modify: src/components/game/GameBoard.test.tsx
- Modify: src/app/play/[categorySlug]/page.tsx

**Interfaces:**
- Consumes: SOURCE_CATEGORY_ROUND_COUNT, selectCategoryRound(), category ID, pool, and browser storage.
- Produces: ROUND_HISTORY_STORAGE_KEY, readCategoryRoundHistory(), writeCategoryRoundHistory(), and player-visible 10-card behavior.

- [ ] **Step 1: Write failing storage tests**

~~~ts
expect(readCategoryRoundHistory(storage, "animals")).toEqual([]);
storage.setItem(ROUND_HISTORY_STORAGE_KEY, "not-json");
expect(readCategoryRoundHistory(storage, "animals")).toEqual([]);
writeCategoryRoundHistory(storage, "animals", ["cat", "dog"]);
expect(readCategoryRoundHistory(storage, "animals")).toEqual(["cat", "dog"]);
expect(() => writeCategoryRoundHistory(throwingStorage, "animals", ["cat"]))
  .not.toThrow();
~~~

- [ ] **Step 2: Confirm red state**

Run: npm run test -- src/components/game/round-history-storage.test.ts

Expected: FAIL because the adapter does not exist.

- [ ] **Step 3: Implement versioned safe storage**

~~~ts
export const ROUND_HISTORY_STORAGE_KEY = "guessmoji:round-history:v1";

type RoundHistoryDocument = {
  version: 1;
  categories: Record<string, string[]>;
};

export function readCategoryRoundHistory(
  storage: Pick<Storage, "getItem"> | undefined,
  categoryId: string,
): string[];

export function writeCategoryRoundHistory(
  storage: Pick<Storage, "getItem" | "setItem"> | undefined,
  categoryId: string,
  seenIds: readonly string[],
): void;
~~~

Catch read, parse, and write errors. Reject wrong versions and non-array category values.

- [ ] **Step 4: Write failing GameBoard tests**

Render 20 source cards and prove the UI says 1 / 10. Complete the first round, click Play Again, and prove the next answer-ID set excludes the first set. Trigger Shuffle and prove the current ID set remains identical. Add malformed-storage and Random Mix count cases.

- [ ] **Step 5: Confirm red state**

Run: npm run test -- src/components/game/GameBoard.test.tsx

Expected: FAIL because source categories still play the full pool and do not persist history.

- [ ] **Step 6: Integrate selection and persistence**

Pass SOURCE_CATEGORY_ROUND_COUNT for non-Random-Mix categories. In GameBoard, new source rounds read history, select unseen cards, persist returned IDs, and display only that selection. shufflePuzzles() continues to reorder currentPuzzles only. Storage access stays client-side.

- [ ] **Step 7: Run focused tests**

Run: npm run test -- src/components/game/round-history-storage.test.ts src/components/game/GameBoard.test.tsx src/lib/puzzles.test.ts

Expected: PASS.

- [ ] **Step 8: Commit**

~~~bash
git add src/components/game/round-history-storage.ts src/components/game/round-history-storage.test.ts src/components/game/GameBoard.tsx src/components/game/GameBoard.test.tsx src/app/play/'[categorySlug]'/page.tsx
git commit -m "feat: remember unseen category cards"
~~~

### Task 4: Core Entertainment Remediation

**Files:**
- Modify: src/data/puzzles.ts
- Modify: src/data/answerEmojiBanlist.ts
- Modify: src/lib/clue-audit.test.ts
- Modify: src/lib/content-audit.test.ts

**Interfaces:**
- Consumes: complete core audit/blind reports and Task 1 helpers.
- Produces: remediated nine non-Random-Mix core categories and updated bans/regressions.

- [ ] **Step 1: Add failing regressions**

For every confirmed objective core finding, add the normalized answer/emoji ban or shipped-catalog assertion named by the report.

- [ ] **Step 2: Confirm red state**

Run: npm run test -- src/lib/clue-audit.test.ts src/lib/content-audit.test.ts

Expected: FAIL with the audited card IDs.

- [ ] **Step 3: Remediate all confirmed core findings**

Rewrite affected clues and fields. Explanations decode every changed emoji. Facts use stable sourced replacements from the audit report. Preserve IDs unless answers change.

- [ ] **Step 4: Run objective checks**

Run: npm run test -- src/lib/clue-audit.test.ts src/lib/content-audit.test.ts src/lib/puzzles.test.ts

Expected: PASS.

- [ ] **Step 5: Blind re-review every changed core card**

Export changed cards without answers. A fresh Luna/max reviewer applies the spec's staged difficulty criteria. Revise and repeat until no unresolved changed-card failure remains.

- [ ] **Step 6: Commit**

~~~bash
git add src/data/puzzles.ts src/data/answerEmojiBanlist.ts src/lib/clue-audit.test.ts src/lib/content-audit.test.ts
git commit -m "content: remediate core puzzle clues"
~~~

### Task 5: Expanded Partition A Remediation And Expansion

**Files:**
- Modify: src/data/expandedPacks.ts
- Modify: src/data/answerEmojiBanlist.ts
- Modify: src/lib/clue-audit.test.ts
- Modify: src/lib/content-audit.test.ts

**Interfaces:**
- Consumes: partition A reports and integrated data.
- Produces: remediated partition A categories and accepted ten-card blocks.

- [ ] **Step 1: Add failing objective regressions from the report**
- [ ] **Step 2: Run npm run test -- src/lib/clue-audit.test.ts src/lib/content-audit.test.ts and confirm audited failures**
- [ ] **Step 3: Remediate every confirmed emoji, hint, explanation, detail, fact, difficulty, tag, safety, repetition, and distinctiveness finding**

Extend CardSeed with an optional seventh explanation value and carry it into expandedPuzzles without synthesizing fallback text:

~~~ts
type CardSeed = [
  answer: string,
  emojis: string,
  hint: string,
  details: string,
  funFact: string,
  difficulty?: PuzzleDifficulty,
  explanation?: string,
];
~~~

Add a specific explanation that decodes every emoji to every existing and new partition A card. Add a partition-scoped test proving all partition A puzzles now have explanations.
- [ ] **Step 4: For each expansion-ready category, draft exactly ten cards; accept the whole block only after objective checks, fact verification, and blind review**
- [ ] **Step 5: Run npm run test -- src/lib/clue-audit.test.ts src/lib/content-audit.test.ts src/lib/puzzles.test.ts and blind-review every changed/new card**
- [ ] **Step 6: Commit**

~~~bash
git add src/data/expandedPacks.ts src/data/answerEmojiBanlist.ts src/lib/clue-audit.test.ts src/lib/content-audit.test.ts
git commit -m "content: remediate expanded packs partition a"
~~~

### Task 6: Expanded Partition B Remediation And Expansion

**Files:**
- Modify: src/data/expandedPacks.ts
- Modify: src/data/answerEmojiBanlist.ts
- Modify: src/lib/clue-audit.test.ts
- Modify: src/lib/content-audit.test.ts

**Interfaces:** Consumes partition B reports; produces remediated partition B categories and accepted ten-card blocks.

- [ ] **Step 1: Add failing objective regressions from the partition B report**
- [ ] **Step 2: Confirm the focused audit tests fail on reported cards**
- [ ] **Step 3: Remediate every confirmed partition B finding without changing unrelated partitions**

Add a specific explanation that decodes every emoji to every existing and new partition B card. Add a partition-scoped test proving all partition B puzzles now have explanations.
- [ ] **Step 4: Apply the all-or-nothing ten-card expansion gate**
- [ ] **Step 5: Run focused tests and blind-review every changed/new partition B card**
- [ ] **Step 6: Commit**

~~~bash
git add src/data/expandedPacks.ts src/data/answerEmojiBanlist.ts src/lib/clue-audit.test.ts src/lib/content-audit.test.ts
git commit -m "content: remediate expanded packs partition b"
~~~

### Task 7: Expanded Partition C Remediation And Expansion

**Files:**
- Modify: src/data/expandedPacks.ts
- Modify: src/data/answerEmojiBanlist.ts
- Modify: src/lib/clue-audit.test.ts
- Modify: src/lib/content-audit.test.ts

**Interfaces:** Consumes partition C reports; produces remediated partition C categories and accepted ten-card blocks.

- [ ] **Step 1: Add failing objective regressions from the partition C report**
- [ ] **Step 2: Confirm the focused audit tests fail on reported cards**
- [ ] **Step 3: Remediate every confirmed partition C finding without changing unrelated partitions**

Add a specific explanation that decodes every emoji to every existing and new partition C card. Add a partition-scoped test proving all partition C puzzles now have explanations.
- [ ] **Step 4: Apply the all-or-nothing ten-card expansion gate**
- [ ] **Step 5: Run focused tests and blind-review every changed/new partition C card**
- [ ] **Step 6: Commit**

~~~bash
git add src/data/expandedPacks.ts src/data/answerEmojiBanlist.ts src/lib/clue-audit.test.ts src/lib/content-audit.test.ts
git commit -m "content: remediate expanded packs partition c"
~~~

### Task 8: Add Harry Potter

**Files:**
- Modify: src/data/expandedPacks.ts
- Modify: src/data/answerEmojiBanlist.ts
- Modify: src/lib/content-audit.test.ts
- Modify: src/lib/puzzles.test.ts

**Interfaces:**
- Consumes: PackSeed, content rules, category mapping, and audit helpers.
- Produces: category ID/slug harry-potter with 20 core-saga cards across at least four subthemes.

- [ ] **Step 1: Write failing acceptance tests**

~~~ts
const category = categories.find((item) => item.id === "harry-potter");
const cards = getPuzzlesByCategoryId("harry-potter");
expect(category).toMatchObject({
  id: "harry-potter",
  slug: "harry-potter",
  name: "Harry Potter",
});
expect(cards).toHaveLength(20);
expect(cards.every((card) =>
  card.hint && card.details && card.explanation && card.funFact
)).toBe(true);
~~~

Also assert unique IDs and absence of Fantastic Beasts and actor-name tags.

- [ ] **Step 2: Confirm red state**

Run: npm run test -- src/lib/content-audit.test.ts src/lib/puzzles.test.ts

Expected: FAIL because the category is absent.

- [ ] **Step 3: Create the balanced pack**

Use at least four subthemes among characters, places, objects, creatures, groups, and concepts. All 20 cards include explicit clue, hint, explanation, details, verified fact, difficulty, and tags. Extend CardSeed to carry explanation; do not generate fallback explanation text.

- [ ] **Step 4: Update bans and run objective checks**

Run: npm run test -- src/lib/clue-audit.test.ts src/lib/content-audit.test.ts src/lib/puzzles.test.ts

Expected: PASS.

- [ ] **Step 5: Blind-review all 20 cards**

A fresh Luna/max reviewer sees clue, then hint, then answers. Revise until every card passes and no unresolved ambiguity remains.

- [ ] **Step 6: Commit**

~~~bash
git add src/data/expandedPacks.ts src/data/answerEmojiBanlist.ts src/lib/content-audit.test.ts src/lib/puzzles.test.ts
git commit -m "content: add Harry Potter category"
~~~

### Task 9: Dynamic Invariants, Documentation, And Verification

**Files:**
- Modify: src/lib/clue-audit.test.ts
- Modify: src/lib/puzzles.test.ts
- Modify: README.md
- Modify: AGENTS.md
- Modify: TASKS.md
- Modify: UPDATES.md
- Modify only for a durable ambiguity ruling: CONTENT_GENERATION_RULES.md

**Interfaces:** Consumes integrated catalog and reports; produces invariant tests and accurate documentation.

- [ ] **Step 1: Replace fixed counts**

~~~ts
const sourceCategories = categories.filter((category) => category.id !== "random-mix");
for (const category of sourceCategories) {
  const count = getPuzzlesByCategoryId(category.id).length;
  expect(count).toBeGreaterThanOrEqual(10);
  expect(count % 10).toBe(0);
}
expect(findContentInvariantViolations(categories, puzzles)).toEqual([]);
~~~

- [ ] **Step 2: Run npm run test and confirm all tests pass**
- [ ] **Step 3: Document actual category/card counts, expanded categories, completed audit, Harry Potter, round history, and helper paths**
- [ ] **Step 4: Run npm run lint, npm run typecheck, npm run build, and docker build -t ghcr.io/hallveticapro/guessmoji:content-audit .**
- [ ] **Step 5: Mechanically prove zero missing original audit IDs and zero missing changed/new blind-review IDs in the ledger**
- [ ] **Step 6: Commit**

~~~bash
git add src/lib/clue-audit.test.ts src/lib/puzzles.test.ts README.md AGENTS.md TASKS.md UPDATES.md CONTENT_GENERATION_RULES.md
git commit -m "docs: record completed content audit"
~~~

### Task 10: Final Review, PR, Merge, And Arcane

**Files:** No planned source files; one Luna/max fix wave is allowed if final review or CI finds issues.

**Interfaces:** Consumes clean branch, ledger, GitHub Actions, GHCR, and Arcane; produces merged PR and verified production.

- [ ] **Step 1: Dispatch final Luna/max whole-branch review with spec, plan, ledger, and diff package**
- [ ] **Step 2: Resolve critical/important findings with one Luna/max fix agent and one scoped re-review**
- [ ] **Step 3: Run npm run lint && npm run typecheck && npm run test && npm run build**
- [ ] **Step 4: Run docker build -t ghcr.io/hallveticapro/guessmoji:content-audit .**
- [ ] **Step 5: Push codex/content-audit-harry-potter and open a PR against main with a reviewed body**
- [ ] **Step 6: Inspect required checks; use one Luna/max diagnosis/fix agent for any failing check**
- [ ] **Step 7: Merge only after required checks pass; capture PR URL and merge SHA**
- [ ] **Step 8: Verify the post-merge GHCR publish run and anonymously pullable canonical manifest**
- [ ] **Step 9: Retrieve the Arcane key at execution time and discover the Local Docker Guessmoji project without logging the key**
- [ ] **Step 10: Trigger the smallest documented Arcane pull/update/redeploy operation and verify service health**
- [ ] **Step 11: Verify the live root and /play/harry-potter with curl and browser-smoke 10-card, Reveal, Play Again unseen, and Shuffle-set behavior**
- [ ] **Step 12: Mark the active goal complete only when merged PR, GHCR publication, Arcane update, and live checks are proven**
