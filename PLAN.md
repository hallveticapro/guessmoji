# Guessmoji Card Clue Audit Plan

Generated: 2026-06-07

Source of truth: `TASKS.md`

## Purpose

Review every shipped Guessmoji puzzle card so emoji clues are fair, classroom-friendly, and do not give away the answer by using the answer's own emoji or an overly literal direct substitute.

This plan replaces the completed code-review remediation plan. The prior code-review closure remains documented in `CODE_REVIEW.md` and `UPDATES.md`.

## Problem Statement

Some categories use emoji clues that include the answer directly. For example:

- Ocean Animals: `Whale` currently uses `🐋🌊💨🎶`.
- Animals: answers such as `Fox`, `Elephant`, and `Giraffe` should not use `🦊`, `🐘`, or `🦒`.
- Fruits and vegetables should avoid direct produce emoji such as `🍎` for `Apple`, `🥕` for `Carrot`, and similar one-to-one clues.

Guessmoji clues should hint through traits, setting, actions, colors, context, story beats, or associated objects without showing the exact answer.

## Scope

Audit every default puzzle that ships in the MVP:

- Core entertainment cards in `src/data/puzzles.ts`.
- Expanded category cards in `src/data/expandedPacks.ts`.
- Random Mix, indirectly, because it pulls from the same puzzle pool.

The current target is all 600 playable puzzles across 60 non-random categories plus Random Mix behavior. If the card count changes before this work starts, use the current source data count from tests and record the new count in `UPDATES.md`.

## Non-Goals

- Do not add login, accounts, multiplayer, a database, or server persistence.
- Do not reduce the puzzle catalog size to avoid the audit.
- Do not make clues so vague that the game becomes frustrating.
- Do not remove classroom-safe details, fun facts, or hints unless they also give away the answer.
- Do not change public README examples away from neutral placeholders.

## Review Standard

Every clue should satisfy all of these rules:

1. No exact answer emoji:
   - If the answer has a direct emoji representation, that emoji must not appear in the clue.
   - Examples: `Whale` cannot use `🐋`; `Fox` cannot use `🦊`; `Apple` cannot use `🍎`; `Carrot` cannot use `🥕`.
2. No near-identical direct substitute:
   - Avoid same-object variants that effectively reveal the answer.
   - Examples: `Apple` should avoid both `🍎` and `🍏`; `Clownfish` should avoid `🐠` if it is the only fish-specific answer signal.
3. Avoid category-icon giveaways when the answer is the category object:
   - If a category card answer is the exact object shown by a common emoji, avoid that object emoji even if the category itself uses a related icon.
4. Hints may define, not duplicate:
   - Text hints can describe traits, habitat, story role, or use, but should not simply restate the answer with a synonym that makes the emoji audit pointless.
5. Clues may use context:
   - Use habitat, color, behavior, tools, foods, sounds, locations, weather, story objects, or adjacent concepts.
   - Example alternatives for `Whale`: `🌊💨🎶📏` or `🌊💙💨🎵` instead of `🐋🌊💨🎶`.
6. Preserve solvability:
   - A revised clue should still be guessable by the intended audience.
   - When removing a direct emoji makes a clue too hard, improve the hint or surrounding context instead of reverting to the direct answer emoji.

## Required Artifacts

Create or update these artifacts during implementation:

- `src/data/answerEmojiBanlist.ts`
  - A structured map of answer names to forbidden direct emoji.
  - Include all answer-specific emoji discovered during audit, not only animal/food categories.
- `src/lib/clue-audit.ts`
  - Pure helpers that normalize puzzle answers and scan emoji clues for forbidden direct emoji.
- `src/lib/clue-audit.test.ts`
  - Data-driven tests proving every shipped puzzle avoids its answer-specific forbidden emoji.
  - Include regression tests for known examples such as `Whale`, `Fox`, `Elephant`, `Giraffe`, `Apple`, and `Carrot`.
- `CLUE_AUDIT.md`
  - A review log listing every category, number of cards reviewed, changes made, and any explicit allowed exceptions.
- `UPDATES.md`
  - Evidence entries after each meaningful audit batch.
- `TASKS.md`
  - Current scope note for the clue audit.
- `AGENTS.md`
  - Persistent convention for future card additions.

## Phase 0 - Baseline Inventory

### 0.1 Count And Snapshot The Current Catalog

**Files**

- `UPDATES.md`
- `CLUE_AUDIT.md`

**Steps**

1. Run the current standard gate:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
2. Record current category count, puzzle count, and test count.
3. Record the source files that define card data.

**Measurable Acceptance**

- `UPDATES.md` records command status for lint, typecheck, test, and build before clue edits begin.
- `CLUE_AUDIT.md` records the current number of categories and puzzles.
- `CLUE_AUDIT.md` identifies `src/data/puzzles.ts` and `src/data/expandedPacks.ts` as the audited data sources.

## Phase 1 - Build The Direct-Emoji Detection Harness

### 1.1 Create Answer Emoji Banlist

**Files**

- `src/data/answerEmojiBanlist.ts`
- `src/lib/clue-audit.ts`
- `src/lib/clue-audit.test.ts`

**Steps**

1. Create a banlist keyed by normalized answer text.
2. Add forbidden direct emoji for obvious one-to-one answers across all categories.
3. Include at least:
   - Animals and ocean animals: cat, dog, elephant, giraffe, penguin, kangaroo, tiger, panda, fox, sloth, shark, dolphin, octopus, sea turtle, jellyfish, whale, seahorse, crab, starfish, clownfish.
   - Birds, bugs, dinosaurs, plants, fruits, vegetables, desserts, snacks, breakfast, weather, vehicles, jobs, school supplies, art supplies, holidays, emotions, sports, and other categories where an answer has a direct emoji.
4. Keep banlist comments concise and only where a decision is non-obvious.

**Measurable Acceptance**

- `src/data/answerEmojiBanlist.ts` exists and exports a typed banlist.
- Tests can import the banlist.
- Known examples are covered by tests: `Whale` forbids `🐋`, `Fox` forbids `🦊`, `Elephant` forbids `🐘`, `Giraffe` forbids `🦒`, `Apple` forbids `🍎` and `🍏`, and `Carrot` forbids `🥕`.

### 1.2 Add Automated Clue Leak Tests

**Files**

- `src/lib/clue-audit.ts`
- `src/lib/clue-audit.test.ts`
- Existing puzzle data files as needed.

**Steps**

1. Add pure helper `findDirectAnswerEmojiLeaks(puzzles, banlist)`.
2. Test that every shipped puzzle has zero direct-answer emoji leaks.
3. Test that the helper catches a synthetic leak.
4. Test normalization for punctuation, casing, ampersands, apostrophes, and plural answers.

**Measurable Acceptance**

- `npm run test` fails if any shipped puzzle clue includes a banned direct answer emoji.
- Test failure output lists puzzle id, answer, clue, and forbidden emoji.
- Synthetic test proves the detection catches at least one direct leak.

## Phase 2 - Full Catalog Review And Fixes

### 2.1 Review High-Risk Literal Categories First

**Files**

- `src/data/expandedPacks.ts`
- `CLUE_AUDIT.md`
- `UPDATES.md`

**Categories**

- Animals
- Ocean Animals
- Birds
- Insects and Bugs
- Dinosaurs
- Fruit
- Vegetables
- Desserts
- Snacks
- Breakfast
- Plants
- Weather
- Vehicles
- Jobs
- School Supplies
- Art Supplies
- Sports
- Holidays
- Emotions

**Steps**

1. For each category, inspect every card manually.
2. Replace direct answer emoji with indirect clue emoji.
3. Keep each clue on one line and within the current emoji-fitting design.
4. Preserve classroom-safe tone and recognizable clues.
5. Record category status in `CLUE_AUDIT.md`.

**Measurable Acceptance**

- `CLUE_AUDIT.md` has a row for every high-risk category listed above.
- Each row includes: category name, cards reviewed, cards changed, examples changed, reviewer status, and evidence command/test.
- `npm run test` passes after each committed batch.
- Known examples are fixed:
  - `Whale` no longer includes `🐋`.
  - `Fox` no longer includes `🦊`.
  - `Elephant` no longer includes `🐘`.
  - `Giraffe` no longer includes `🦒`.
  - Direct fruit and vegetable answer emoji are removed from their matching answer clues.

### 2.2 Review Entertainment And Abstract Categories

**Files**

- `src/data/puzzles.ts`
- `src/data/expandedPacks.ts`
- `CLUE_AUDIT.md`
- `UPDATES.md`

**Categories**

- Disney Movies
- Disney Princesses
- Pixar
- Marvel
- Star Wars
- DreamWorks
- Video Game Movies
- Kid TV Shows
- Animated Classics
- Board Games
- Video Games
- Pokemon
- Minecraft
- Science
- Space
- Math
- Books and Stories
- Fairy Tales
- Landmarks
- Geography
- Music
- Literal Phrases
- Idioms
- Robots
- Random Mix source pool
- Any other category present in `src/data/categories.ts`

**Steps**

1. Inspect every remaining card manually.
2. Look for title/object giveaways, character emoji giveaways, and overly literal title clues.
3. Keep intentional franchise/story clue patterns when they are fair but not direct answer emoji.
4. Record every category in `CLUE_AUDIT.md`.

**Measurable Acceptance**

- `CLUE_AUDIT.md` has a row for every category in `src/data/categories.ts`, including categories not named above.
- The sum of reviewed cards in `CLUE_AUDIT.md` equals the current shipped puzzle count.
- Every changed clue remains non-empty and passes existing puzzle integrity tests.
- Random Mix needs no separate clue edits because it draws only from reviewed source puzzles.

## Phase 3 - Exception Policy

### 3.1 Document Any Allowed Direct-Looking Emoji

**Files**

- `src/data/answerEmojiBanlist.ts`
- `CLUE_AUDIT.md`
- `src/lib/clue-audit.test.ts`

**Steps**

1. Prefer fixing clues over adding exceptions.
2. Allow an exception only when an emoji is not actually the answer and is necessary for solvability.
3. Document each exception with puzzle id, answer, emoji, and reason.

**Measurable Acceptance**

- `CLUE_AUDIT.md` includes an `Allowed Exceptions` section.
- Every allowed exception has a concrete reason.
- Tests distinguish between banned direct emoji and documented allowed contextual emoji.

## Phase 4 - Final Verification

### 4.1 Run Complete Verification

**Files**

- `UPDATES.md`
- `CLUE_AUDIT.md`
- `PLAN.md`

**Steps**

1. Run:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
2. Run `npm audit --audit-level=moderate` and document the current known Next/PostCSS status.
3. Run source checks:
   - Confirm every category appears in `CLUE_AUDIT.md`.
   - Confirm reviewed card count equals shipped puzzle count.
   - Confirm `findDirectAnswerEmojiLeaks` returns zero leaks.
4. Browser smoke at desktop and mobile width for a changed category.
5. Commit and push.
6. Confirm GitHub Actions passes.

**Measurable Acceptance**

- `UPDATES.md` records final command status.
- `CLUE_AUDIT.md` records every category as reviewed.
- `npm run test` includes the direct-answer emoji leak suite and passes.
- Build passes.
- Browser smoke confirms changed clues still render as single-line emoji clues.
- Latest GitHub Actions run passes after push.

## Phase 5 - Future Guardrails

### 5.1 Make The Audit Hard To Regress

**Files**

- `AGENTS.md`
- `TASKS.md`
- `README.md` only if public contributor guidance is needed.

**Steps**

1. Add an agent convention: new cards must update the answer emoji banlist when the answer has a direct emoji.
2. Add a task note: all future card packs must pass the clue leak test.
3. Keep README neutral and generic.

**Measurable Acceptance**

- `AGENTS.md` documents the no-direct-answer-emoji rule for future cards.
- `TASKS.md` records the active clue audit and future guardrail.
- README remains free of personal deployment values and owner-specific examples.

## Completion Requirements

The clue audit is complete only when all of these are true:

- Every shipped card has been reviewed.
- `CLUE_AUDIT.md` covers every category and all shipped cards.
- Known direct-answer examples are fixed.
- The automated leak test passes over the full puzzle set.
- Final lint, typecheck, tests, and build pass.
- Known audit dependency findings are documented without unsafe forced fixes.
- GitHub Actions passes after the final push.
- `UPDATES.md`, `TASKS.md`, and `AGENTS.md` are current.
