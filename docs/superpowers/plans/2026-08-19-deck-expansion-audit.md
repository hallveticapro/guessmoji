# Deck Expansion Audit Implementation Plan

> **For Codex:** Execute this plan with the `superpowers:subagent-driven-development` workflow. The orchestrator owns integration; GPT-5.6 Luna max subagents perform bounded deck audits, card authoring, and independent reviews.

**Goal:** Audit all 60 source decks and expand each to the strongest honest multiple-of-10 ceiling: 30 where the category supports it, 20 where 30 would require weak or obscure cards, and 10 where even 20 would dilute playability.

**Architecture:** Keep the existing static seed-data model and category IDs. Add only complete 10-card blocks, preserve globally unique puzzle IDs, extend the direct-answer emoji banlist when needed, and rely on the existing catalog normalizer, random-round behavior, and audit tests. Treat `CONTENT_GENERATION_RULES.md` as the content specification and require fresh staged blind review for every added block.

**Tech Stack:** Next.js, React, TypeScript, Vitest, static TypeScript seed data, Docker, GitHub Actions, GHCR, Arcane.

---

### Task 1: Establish the complete deck inventory and feasibility ceiling

**Files:**
- Read: `CONTENT_GENERATION_RULES.md`
- Read: `src/data/categories.ts`
- Read: `src/data/puzzles.ts`
- Read: `src/data/expandedPacks.ts`
- Read: `src/data/answerEmojiBanlist.ts`

- [ ] Record the current count and existing answers for every non-random category.
- [ ] Partition all under-target categories across clean-context reviewers.
- [ ] For each deck, select a defensible ceiling of 30, 20, or 10 and provide complete proposed 10-card answer blocks.
- [ ] Reject candidates that are obscure, duplicate another answer in the deck, leak the answer through direct/component emoji, waste category-context emoji, or force repetitive clues.
- [ ] Reconcile cross-partition duplicates and freeze the approved expansion manifest.

### Task 2: Author approved expansion blocks

**Files:**
- Modify: `src/data/puzzles.ts`
- Modify: `src/data/expandedPacks.ts`
- Modify: `src/data/answerEmojiBanlist.ts`

- [ ] Assign non-overlapping category ownership to implementation subagents.
- [ ] Add only approved complete 10-card blocks, with explicit answer, emojis, hint, details, fun fact, difficulty, explanation, and tags.
- [ ] Keep IDs globally unique and facts accurate; preserve existing source ordering and project patterns.
- [ ] Add or update direct-answer emoji bans for every newly introduced answer that has a direct emoji representation.
- [ ] Run focused typecheck and clue-audit checks after each integration batch.

### Task 3: Perform staged blind and rules review

**Files:**
- Review: `src/data/puzzles.ts`
- Review: `src/data/expandedPacks.ts`
- Review: `src/data/answerEmojiBanlist.ts`

- [ ] Give each new block to a fresh clean-context reviewer stage-by-stage as required by `CONTENT_GENERATION_RULES.md`.
- [ ] Record clue-only/category-stage guesses before exposing hints, then review hints, reveal metadata, difficulty, safety, and fun-fact accuracy.
- [ ] Repair or omit every failed card; never preserve a block merely to hit a numeric target.
- [ ] Run a separate whole-catalog review for duplicates, semantic leaks, category-context filler, emoji repetition, and tier integrity.

### Task 4: Lock catalog invariants and documentation

**Files:**
- Modify: `src/lib/content-audit.test.ts`
- Modify: `src/lib/clue-audit.test.ts`
- Modify: `CONTENT_GENERATION_RULES.md` only if the audit reveals a generally applicable missing rule
- Modify: `TASKS.md`
- Modify: `UPDATES.md`

- [ ] Add focused automated assertions for final per-deck counts, multiple-of-10 integrity, ID uniqueness, and any newly discovered regression class.
- [ ] Confirm Random Mix continues to normalize safely and draw without duplicates.
- [ ] Update the authoritative task status and add a concise timestamped update.

### Task 5: Validate the complete application

**Files:**
- Verify: all changed files

- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm test -- --run`.
- [ ] Run `npm run build`.
- [ ] Run the relevant Docker build and smoke checks.
- [ ] Request a final clean-context branch review and resolve all material findings.

### Task 6: Release through protected main and Arcane

**Files:**
- Release: committed branch state only

- [ ] Commit and push the focused branch.
- [ ] Open a pull request and verify the required `build-and-push` check succeeds.
- [ ] Merge the pull request without changing the zero-reviewer branch-protection policy.
- [ ] Verify the merged commit's GHCR image/digest is published.
- [ ] Redeploy the Arcane project with `pullPolicy=always` and forced recreation.
- [ ] Confirm the running container uses the new image digest and smoke-test the live site, including at least one expanded deck and a 10-card round.
