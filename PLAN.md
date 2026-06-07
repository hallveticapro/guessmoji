# Guessmoji Remediation Plan

Generated: 2026-06-07

## Purpose

This plan turns every action item in `CODE_REVIEW.md` into concrete implementation work. The goal is to close the review backlog while preserving the MVP rules: no login, no database, no multiplayer, static local puzzle data, projector-friendly UI, neutral public README, and safe classroom-friendly content.

## Operating Rules

- Work in small commits, one phase or tightly related cluster at a time.
- Keep `TASKS.md`, `AGENTS.md`, and `UPDATES.md` current when behavior, commands, structure, or conventions change.
- Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` before major behavior commits.
- Do not use `npm audit fix --force` if it downgrades Next.js or crosses incompatible major versions.
- Keep README examples generic and free of owner-specific personal deployment values.
- For puzzle data, prefer failing validation over displaying fallback or low-quality clue content.

## Priority Order

1. Fix host-facing P1 issues that can meaningfully degrade a live game or deployment confidence.
2. Fix puzzle-data quality issues, including the new direct-answer emoji clue audit.
3. Remove duplicate logic and stale fallbacks before larger refactors.
4. Refactor the game surface only after behavior is covered by tests or a written manual verification checklist.
5. Batch low-risk polish and dead-code cleanup once the product behavior is stable.

## Phase 0 - Baseline And Safety Harness

### 0.1 Capture Current Baseline

**Covers:** setup for all review items.

**Files**

- `CODE_REVIEW.md`
- `PLAN.md`
- `src/lib/puzzles.test.ts`
- future test files as needed

**Steps**

1. Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`.
2. Run `npm audit --audit-level=moderate` and save the current result in `UPDATES.md` if it changes from the review.
3. Add a short manual smoke checklist for gameplay until component or browser tests exist.
4. Use that checklist for every gameplay-affecting phase.

**Acceptance Criteria**

- Baseline commands are known before functional changes begin.
- Any existing audit failures are documented, not hidden.
- The smoke checklist includes category start, hint, reveal, hide, next, previous, shuffle, restart, settings, fullscreen, timer, and mobile emoji fit.

## Phase 1 - Host UX And Deployment Confidence

### 1.1 Align Keyboard Shortcuts With Documented Host Controls

**Source review item:** P1.1.

**Files**

- `src/components/game/GameBoard.tsx`
- `README.md`
- test file to be added if practical

**Steps**

1. Update `handleKeyDown` so Space toggles answer visibility for the current puzzle.
2. Make ArrowRight move to the next puzzle when possible.
3. Make ArrowLeft move to the previous puzzle when possible.
4. Keep H as hint, S as shuffle, R as restart, F as fullscreen, and Escape as overlay close before hide behavior.
5. Ensure shortcuts do not fire while typing in settings inputs.
6. Update README only if final behavior intentionally differs from the current documented table.

**Acceptance Criteria**

- Keyboard behavior matches README.
- Hosts can move next without accidentally revealing hidden answers.
- Space does not skip cards.
- Input fields do not trigger game shortcuts while focused.

**Verification**

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- Manual keyboard smoke on `/play/[categorySlug]`.

### 1.2 Make The Settings Dialog A Real Modal

**Source review item:** P1.2.

**Files**

- `src/components/game/GameControls.tsx`
- `src/components/layout/InfoModal.tsx`
- optional shared modal hook/helper

**Steps**

1. Reuse or extract the focus trap/body lock behavior from `InfoModal`.
2. Move focus into settings when opened.
3. Trap Tab and Shift+Tab inside settings.
4. Close on Escape and backdrop click.
5. Restore focus to the gear button on close.
6. Confirm background controls are not tabbable while settings is open.

**Acceptance Criteria**

- After opening settings, focus lands inside the dialog.
- Tab stays inside the dialog.
- Escape closes the dialog.
- Closing restores focus to the settings trigger.
- Timer input, Shuffle, Restart, and Fullscreen remain keyboard accessible.

**Verification**

- `npm run lint`
- `npm run typecheck`
- Browser or Playwright smoke for focus behavior.

### 1.3 Add Full Quality Gates To The GHCR Workflow

**Source review item:** P1.4.

**Files**

- `.github/workflows/docker-publish.yml`
- `README.md`

**Steps**

1. Add workflow steps for `npm ci`, `npm run lint`, `npm run typecheck`, and `npm run test` before Docker build/publish.
2. Keep canonical publishing gated to `hallveticapro/guessmoji`.
3. Keep fork/non-canonical behavior build-only or no-publish as currently intended.
4. Update README workflow wording so it matches the real CI sequence.

**Acceptance Criteria**

- A failing lint, typecheck, or test step blocks image publishing.
- README no longer overstates or understates the workflow.
- No secrets or owner-specific live URLs are added to public README content.

**Verification**

- Inspect GitHub Actions YAML syntax.
- Push to trigger workflow at the next useful milestone.

### 1.4 Harden Public URL Metadata

**Source review item:** P1.5.

**Files**

- `src/app/layout.tsx`
- `.env`
- `.env.example`
- `README.md`
- possible `src/lib/url.ts`

**Steps**

1. Add a small typed helper for `NEXT_PUBLIC_APP_URL`.
2. Trim the env var and accept only valid absolute `http` or `https` URLs.
3. Fall back to a generic local URL for missing or invalid values.
4. Remove hard-coded live-domain fallback behavior from source defaults.
5. Document that production values must include `https://`.

**Acceptance Criteria**

- Malformed `NEXT_PUBLIC_APP_URL` cannot crash metadata generation.
- Self-hosted installs do not silently emit metadata for the wrong public host.
- README remains neutral and generic.

**Verification**

- `npm run typecheck`
- `npm run build`
- Build with missing, valid, and malformed `NEXT_PUBLIC_APP_URL` values.

### 1.5 Remove Dynamic Rendering From Static Play Pages

**Source review item:** P1.3.

**Files**

- `src/app/play/[categorySlug]/page.tsx`
- `src/components/game/GameBoard.tsx`
- `src/lib/puzzles.ts`

**Steps**

1. Remove `dynamic = "force-dynamic"` from the play route.
2. Pass stable static puzzle data to the client.
3. Shuffle on the client in a hydration-safe way when a category starts.
4. Preserve fresh shuffled order for repeated visits, refreshes, restart, and the Shuffle button.
5. Keep answers hidden on first render.

**Acceptance Criteria**

- Play routes can be statically rendered/cached again.
- Category starts still produce fresh order.
- No hydration warnings appear.
- Random Mix still contains the expected count and no duplicate puzzle ids.

**Verification**

- `npm run build`
- Browser smoke on several direct `/play/[categorySlug]` URLs.
- Confirm route output no longer shows the play route as force-dynamic unless another valid reason exists.

## Phase 2 - Puzzle Data Quality And Clue Fairness

### 2.1 Remove Generic Reveal Fallback Copy

**Source review item:** P2.1.

**Files**

- `src/data/puzzles.ts`
- `src/lib/puzzles.test.ts`

**Steps**

1. Delete generic `details` and `funFact` fallback strings from the final puzzle mapping.
2. Make missing metadata fail loudly for core puzzles.
3. Prefer direct metadata on puzzle rows or exact coverage validation over id-keyed fallback behavior.
4. Update tests to prove every core puzzle has explicit reveal copy.

**Acceptance Criteria**

- No default puzzle can ship generic reveal details or fun facts.
- Missing core metadata fails a test or build-time validation.
- Existing specific reveal metadata remains intact.

**Verification**

- `npm run test`
- `npm run build`

### 2.2 Expand Puzzle And Category Integrity Tests

**Source review item:** P2.5.

**Files**

- `src/data/categories.ts`
- `src/data/puzzles.ts`
- `src/data/expandedPacks.ts`
- `src/lib/puzzles.test.ts`

**Steps**

1. Assert category ids are unique.
2. Assert category slugs are unique.
3. Assert all non-random puzzles reference a real category.
4. Assert all puzzle ids are unique.
5. Assert all puzzles have non-empty answer and emoji clues.
6. Assert Random Mix contains no duplicate puzzle ids.
7. Add a duplicate-answer policy: disallow by default or maintain a documented allowlist for intentional repeats.
8. Review known duplicated answers from the review: `Penguin`, `Fossil`, `S'mores`, `Astronaut`, `Grand Canyon`, and `Yellowstone`.

**Acceptance Criteria**

- Data integrity failures are caught automatically.
- Intentional duplicate answers are documented in one place.
- Unintentional duplicate answers are renamed, removed, or replaced.

**Verification**

- `npm run test`
- Manual scan of duplicate-answer test output.

### 2.3 New Action Item - Audit Cards For Direct-Answer Emoji Clues

**User-requested item:** Added after `CODE_REVIEW.md`.

**Files**

- `src/data/puzzles.ts`
- `src/data/expandedPacks.ts`
- `src/lib/puzzles.test.ts`
- optional `src/data/directAnswerEmojiPolicy.ts`

**Problem**

Some literal noun cards may give away the answer by including the exact answer emoji in the clue. For example, if the answer is `Fox`, the clue should not include the fox emoji. The same rule should apply to literal animals, ocean animals, birds, insects, dinosaurs, fruit, vegetables, plants, tools, vehicles, and other categories where an exact emoji exists.

**Policy**

- For literal vocabulary answers, do not include the exact answer glyph in the emoji clue.
- Examples: `Fox` should not include `🦊`, `Elephant` should not include `🐘`, `Giraffe` should not include `🦒`, `Apple` should not include `🍎` or `🍏`, `Carrot` should not include `🥕`, and ocean animal answers should not include their exact animal glyph.
- Use indirect clues instead: habitat, traits, actions, context, shape, color, sound, environment, or category-adjacent symbols.
- For named media/title puzzles, review case by case. Do not blindly ban every symbolic emoji if the answer is a phrase, but avoid clues that fully spell out the answer.
- The clue should be solvable, not automatic.

**Steps**

1. Build a direct-answer emoji watchlist for categories most likely to have exact glyphs: Animals, Ocean Animals, Dinosaurs, Birds, Insects and Bugs, Fruit, Vegetables, Plants, Vehicles, Construction Machines, Kitchen Tools, Art Supplies, School Supplies, Camping, Beach Day, Around the House, and similar concrete-object packs.
2. Scan all 600 puzzles for answer-to-emoji leakage using the watchlist.
3. Manually audit all flagged rows.
4. Rewrite over-obvious clues to use indirect clues.
5. Add tests that fail when known forbidden answer emoji pairs appear in clue strings.
6. Add a short data convention to `AGENTS.md` so future packs avoid exact-answer emoji giveaways.

**Acceptance Criteria**

- Literal noun cards no longer include their exact answer emoji when a clear exact emoji exists.
- Fruit and vegetable cards do not use the exact fruit/vegetable glyph as the clue.
- Animal, ocean animal, bird, insect, and dinosaur cards avoid exact species glyphs when available.
- Tests cover the highest-risk direct-answer emoji pairs.
- Clues remain fair and playable after the audit.

**Verification**

- `npm run test`
- Manual review of all changed puzzle rows.
- Browser smoke through at least five audited categories.

### 2.4 Remove Stale Last-Category Fallback Links

**Source review item:** P2.4.

**Files**

- `src/components/categories/LastCategoryLink.tsx`

**Steps**

1. Only render the saved category link when the stored slug matches an existing category.
2. Delete the synthetic fallback category object.
3. Optionally clear stale local storage when an invalid slug is detected.

**Acceptance Criteria**

- Removed or renamed categories cannot produce dead saved-category links.
- Valid saved categories still render normally.

**Verification**

- Manual localStorage test with valid and invalid category slugs.
- `npm run lint`
- `npm run typecheck`

### 2.5 Decide And Apply Category Metadata Policy

**Source review item:** P2.8.

**Files**

- `src/types/puzzle.ts`
- `src/data/categories.ts`
- `src/app/categories/page.tsx`
- `src/app/page.tsx`

**Steps**

1. Decide whether `colorTheme` and `recommendedGradeBand` are product fields.
2. If useful, surface grade band and/or theme consistently in category cards.
3. If not useful, remove fields from the type and seed data.
4. Keep category cards uncluttered and projector-friendly.

**Acceptance Criteria**

- Category metadata is either visible/useful or deleted.
- No required seed field exists only as dead maintenance data.

**Verification**

- `npm run typecheck`
- `npm run build`
- Visual scan of home and category pages if UI changes.

## Phase 3 - Runtime, Assets, And Browser Robustness

### 3.1 Canonicalize Favicons

**Source review item:** P2.3.

**Files**

- `src/app/favicon.ico`
- `src/app/layout.tsx`
- `public/favicon.ico`
- `public/favicon.svg`
- `public/favicon-96x96.png`
- `public/apple-touch-icon.png`
- `public/site.webmanifest`

**Steps**

1. Treat public favicon files as canonical.
2. Remove `src/app/favicon.ico` unless a strong reason to keep it is documented.
3. Rebuild and inspect generated head links.
4. Confirm browser tabs and pinned icons use the rounded public assets.

**Acceptance Criteria**

- Browsers receive one coherent favicon set.
- No duplicate App Router favicon competes with rounded public icons.

**Verification**

- `npm run build`
- Browser head inspection.

### 3.2 Harden EmojiClue For Missing ResizeObserver

**Source review item:** P2.7.

**Files**

- `src/components/game/EmojiClue.tsx`

**Steps**

1. Feature-check `ResizeObserver`.
2. Provide a conservative CSS-only no-wrap fallback.
3. Prefer React-managed style state over direct DOM mutation where practical.
4. Keep the current shrink-to-fit behavior in modern browsers.

**Acceptance Criteria**

- `EmojiClue` does not throw when `ResizeObserver` is unavailable.
- Long emoji clues still stay on one line.
- Small-screen behavior remains better than wrapping.

**Verification**

- Component/browser smoke with `window.ResizeObserver` removed or mocked.
- Mobile-width screenshot check if browser tooling is available.

### 3.3 Optimize Runtime Image Assets

**Source review item:** P3.5.

**Files**

- `public/assets/guessmoji-logo.png`
- `public/assets/guessmoji-embed.png`
- `public/assets/guessmoji-favicon-master.png`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/InfoModal.tsx`
- `src/app/page.tsx`

**Steps**

1. Create smaller runtime logo variants for shell/small placements.
2. Preserve the larger embed image for social previews if needed.
3. Use `next/image` sizing where appropriate.
4. Keep visual branding unchanged.

**Acceptance Criteria**

- Smaller UI placements do not load unnecessarily heavy image assets.
- Social preview image remains high quality.
- Home, shell, and About modal still look correct.

**Verification**

- `npm run build`
- Browser visual scan.
- Static asset size comparison.

## Phase 4 - DRY And Maintainability Refactors

### 4.1 Centralize Shuffle And Random Mix Counts

**Source review items:** P2.2, Quick Wins, Redundancy Removal Log.

**Files**

- `src/lib/puzzles.ts`
- `src/components/game/GameBoard.tsx`
- `src/app/categories/page.tsx`
- `src/app/page.tsx`
- `src/app/play/[categorySlug]/page.tsx`

**Steps**

1. Export one Random Mix session count from the puzzle utility layer.
2. Use `getRandomizedPuzzles` everywhere instead of local shuffle helpers.
3. Remove `getShuffledPuzzles` from `GameBoard`.
4. Keep Random Mix at 20 cards unless product requirements change.

**Acceptance Criteria**

- One shuffle implementation exists.
- One Random Mix count source exists.
- Category count display and play behavior agree.

**Verification**

- `npm run test`
- Manual Random Mix smoke.

### 4.2 Refactor GameBoard Into Smaller Logic Units

**Source review item:** P2.6.

**Files**

- `src/components/game/GameBoard.tsx`
- possible `src/components/game/useGameProgress.ts`
- possible `src/components/game/useGameTimer.ts`
- possible `src/components/game/useKeyboardShortcuts.ts`
- possible `src/components/game/useFullscreen.ts`

**Steps**

1. Complete Phase 1 keyboard/modal work first.
2. Extract game progression and shuffle state.
3. Extract timer state and local persistence.
4. Extract keyboard shortcut registration.
5. Extract fullscreen state.
6. Keep rendering and layout in `GameBoard`.
7. Add tests for pure helpers where practical.

**Acceptance Criteria**

- `GameBoard` is smaller and mostly presentational.
- Behavior is unchanged from the post-P1 verified flow.
- Timer stop-on-reveal and restart/shuffle behavior are preserved.

**Verification**

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- Full manual gameplay smoke.

### 4.3 Introduce Minimal Shared UI Styling Primitives

**Source review item:** P3.7.

**Files**

- `src/components/game/GameBoard.tsx`
- `src/components/game/GameControls.tsx`
- `src/components/game/AnswerReveal.tsx`
- `src/components/layout/AppShell.tsx`
- `src/app/page.tsx`
- `src/app/categories/page.tsx`
- possible shared UI component files

**Steps**

1. Identify repeated primary button, secondary button, icon button, and card class strings.
2. Extract only patterns already repeated in several places.
3. Keep the current visual style.
4. Avoid broad design-system work.

**Acceptance Criteria**

- Repeated class strings are reduced.
- Visual output remains the same or slightly more consistent.
- No nested-card or heavy abstraction pattern is introduced.

**Verification**

- `npm run lint`
- `npm run build`
- Browser visual scan.

## Phase 5 - Polish, Cleanup, And Redundancy Removal

### 5.1 Timer Control Polish

**Source review items:** P3.1, P3.3.

**Files**

- `src/components/game/GameControls.tsx`
- `src/components/game/GameBoard.tsx`

**Steps**

1. Make the custom timer input controlled while settings is open.
2. Let Enter apply timer changes.
3. Preserve the current `0-999` second bounds unless product requirements change.
4. Read `guessmoji:timerSeconds` directly in the client effect.
5. Remove unnecessary `requestAnimationFrame`.

**Acceptance Criteria**

- Timer UI stays synced with state.
- Enter applies the input.
- Missing, invalid, zero, and valid timer values behave correctly.

**Verification**

- Manual timer smoke.
- `npm run lint`
- `npm run typecheck`

### 5.2 Simplify Last-Category Subscription

**Source review item:** P3.2.

**Files**

- `src/components/categories/LastCategoryLink.tsx`
- optional small custom event helper

**Steps**

1. Decide whether same-tab live updates are needed.
2. If not needed, replace `useSyncExternalStore` with a simpler mount-time client effect.
3. If needed, dispatch a same-tab custom event when writing the last category.
4. Keep invalid saved categories hidden.

**Acceptance Criteria**

- The implementation matches the actual product need.
- It no longer implies same-tab behavior it does not provide.

**Verification**

- Manual categories/play navigation smoke.
- `npm run typecheck`

### 5.3 Polish About Modal Close Control

**Source review item:** P3.4.

**Files**

- `src/components/layout/InfoModal.tsx`

**Steps**

1. Replace literal `x` with an intentional close glyph/control.
2. Keep the accessible label.
3. Preserve current button size, contrast, and focus behavior.

**Acceptance Criteria**

- Close control looks intentional.
- Screen-reader label remains clear.

**Verification**

- Visual and keyboard smoke.

### 5.4 Tighten TypeScript Config

**Source review item:** P3.6.

**Files**

- `tsconfig.json`
- `AGENTS.md` only if `allowJs` must remain

**Steps**

1. Check whether any source JavaScript is intentionally compiled.
2. Disable `allowJs` if not needed.
3. Document the reason if it must stay enabled.

**Acceptance Criteria**

- TypeScript config reflects the actual codebase.
- Accidental `.js` source files are not silently accepted unless intentional.

**Verification**

- `npm run typecheck`
- `npm run build`

### 5.5 Delete Unused Starter And Placeholder Files

**Source review items:** Quick Wins, Redundancy Removal Log.

**Files**

- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`
- `src/styles/.gitkeep`

**Steps**

1. Confirm no production references remain.
2. Delete unused starter SVGs.
3. Delete `src/styles/.gitkeep` if no shared styles file is created.
4. Update `AGENTS.md` folder tree if the `styles` directory is removed.

**Acceptance Criteria**

- Unused starter files are gone.
- Repo tree matches actual structure.

**Verification**

- `rg "file.svg|globe.svg|next.svg|vercel.svg|window.svg"`
- `npm run build`

### 5.6 Remove Or Justify `getPuzzleById`

**Source review item:** Redundancy Removal Log.

**Files**

- `src/lib/puzzles.ts`
- `src/lib/puzzles.test.ts`

**Steps**

1. Confirm there are no production callers.
2. Delete `getPuzzleById` and its test if it is not a planned public utility.
3. If keeping it, document why it exists and where future use is expected.

**Acceptance Criteria**

- No unused utility remains without a reason.
- Tests do not exist only to justify unused production code.

**Verification**

- `rg "getPuzzleById"`
- `npm run test`

## Phase 6 - Dependency Security

### 6.1 Resolve Or Track Moderate Audit Findings

**Source review item:** P2.9.

**Files**

- `package.json`
- `package-lock.json`
- `UPDATES.md`

**Steps**

1. Run `npm audit --audit-level=moderate`.
2. Check whether compatible patched versions exist.
3. Upgrade only within compatible modern versions.
4. Do not force a downgrade.
5. Document remaining upstream-only findings if no safe fix exists.

**Acceptance Criteria**

- Audit findings are either fixed or explicitly tracked.
- Dependency upgrades do not break the app stack.

**Verification**

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm audit --audit-level=moderate`

## Phase 7 - Final Review Closure

### 7.1 Close The Review Backlog

**Files**

- `CODE_REVIEW.md`
- `PLAN.md`
- `TASKS.md`
- `AGENTS.md`
- `UPDATES.md`

**Steps**

1. Add completion notes to `PLAN.md` as phases are finished.
2. Mark related project tasks complete or adjusted in `TASKS.md`.
3. Keep `AGENTS.md` updated with new commands, structure, conventions, and data policies.
4. Update `CODE_REVIEW.md` or add a follow-up review note when all items are closed.
5. Run the full verification suite.

**Acceptance Criteria**

- Every P1, P2, P3, Quick Win, and Redundancy Removal Log item from `CODE_REVIEW.md` is fixed, deleted, intentionally deferred with a reason, or superseded by a documented decision.
- The new direct-answer emoji clue audit is complete and covered by tests or policy.
- The app remains MVP-scoped with no accounts, database, or multiplayer.

**Final Verification**

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm audit --audit-level=moderate`
- Browser smoke on home, categories, several play pages, settings modal, keyboard controls, mobile emoji fit, and audited puzzle categories.

## Coverage Map

| Review item | Plan section |
| --- | --- |
| P1.1 Keyboard shortcuts | 1.1 |
| P1.2 Settings modal focus | 1.2 |
| P1.3 Dynamic play route | 1.5 |
| P1.4 GHCR quality gate | 1.3 |
| P1.5 Public URL metadata | 1.4 |
| P2.1 Generic reveal fallback | 2.1 |
| P2.2 Shuffle and Random Mix duplication | 4.1 |
| P2.3 Duplicate favicon sources | 3.1 |
| P2.4 Last-category stale fallback | 2.4 |
| P2.5 Data validation and duplicate answers | 2.2 |
| New direct-answer emoji clue audit | 2.3 |
| P2.6 GameBoard refactor | 4.2 |
| P2.7 EmojiClue ResizeObserver fallback | 3.2 |
| P2.8 Category metadata policy | 2.5 |
| P2.9 Dependency audit findings | 6.1 |
| P3.1 Timer input | 5.1 |
| P3.2 Last-category subscription | 5.2 |
| P3.3 Timer requestAnimationFrame | 5.1 |
| P3.4 About close button | 5.3 |
| P3.5 Image optimization | 3.3 |
| P3.6 TypeScript `allowJs` | 5.4 |
| P3.7 Shared styling primitives | 4.3 |
| Quick wins | 4.1, 5.3, 5.5 |
| Redundancy removal log | 3.1, 4.1, 5.5, 5.6 |
