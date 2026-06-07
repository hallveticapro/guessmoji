# Guessmoji Code Review Remediation Plan

Generated: 2026-06-07

Source of truth: `CODE_REVIEW.md`

## Purpose

This plan converts every action item in `CODE_REVIEW.md` into implementation work with measurable acceptance. If an item is too broad to measure in one pass, it is split into smaller plan items with their own evidence.

The remediation must preserve the MVP scope:

- No login or accounts.
- No database or server-side persistence.
- No multiplayer.
- Static local puzzle data.
- Projector-friendly host UI.
- Neutral public README with generic examples.
- Classroom-safe default content.

## Measurement Rules

Every implementation checkpoint must leave objective evidence in at least one of these places:

- Passing command output captured in the terminal during the checkpoint.
- A test assertion committed to the repository.
- A specific file change that can be inspected with `rg`, `git diff`, or generated build output.
- A manual browser checklist recorded in `UPDATES.md` when automation would be disproportionate.
- A documented deferral in `UPDATES.md` that names the blocker, the fallback, and the remaining verification.

Use this standard gate after every non-documentation phase:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Use these extra checks when relevant:

```bash
npm audit --audit-level=moderate
docker build -t ghcr.io/hallveticapro/guessmoji:review .
```

## Phase 0 - Baseline And Verification Harness

### 0.1 Capture Baseline Commands

**Source review item:** setup for all review remediation.

**Files**

- `UPDATES.md`

**Steps**

1. Run the standard gate on the current branch.
2. Run `npm audit --audit-level=moderate`.
3. Record command names and pass/fail status in `UPDATES.md`.
4. If a command fails from an external or upstream-only condition, record the exact limitation and continue with the safest fallback.

**Measurable Acceptance**

- `UPDATES.md` contains a dated baseline entry listing all five commands: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and `npm audit --audit-level=moderate`.
- Each listed command has one of these statuses: `passed`, `failed and fixed`, or `blocked by <specific cause>`.
- No implementation phase starts until this entry exists.

### 0.2 Create Manual Browser Smoke Checklist

**Source review item:** supports P1.1, P1.2, P1.3, P2.7, P3.1, P3.2, P3.3, and P3.5.

**Files**

- `UPDATES.md`
- Optional future test file if browser automation is added.

**Steps**

1. Create a reusable checklist for home, categories, Random Mix, one non-random category, settings, keyboard controls, timer, fullscreen, and mobile emoji fit.
2. Record the checklist in `UPDATES.md` or replace it with committed automated tests.

**Measurable Acceptance**

- The checklist has at least these named checks: home loads, categories load, Random Mix starts, non-random category starts, Hint toggles, answer reveals, answer hides, Next advances, Previous moves back, Shuffle changes order, Restart resets progress, settings opens, settings traps focus, timer applies, fullscreen toggles or reports unsupported, emoji clue stays one line at mobile width.
- Every future manual smoke entry in `UPDATES.md` references this checklist by name or includes the same named checks.

## Phase 1 - Host UX And Deployment Confidence

### 1.1 Keyboard Shortcut Contract

**Source review item:** P1.1.

**Files**

- `src/components/game/GameBoard.tsx`
- `README.md`
- Optional keyboard test file.
- `UPDATES.md` for manual checklist evidence if tests are not added.

**Steps**

1. Align `handleKeyDown` with the documented host controls.
2. Prevent game shortcuts from firing while a text, number, select, textarea, or contenteditable element is focused.
3. Update README only if the final shortcut contract intentionally differs from the current controls table.

**Measurable Acceptance**

- Space reveals a hidden answer without changing the puzzle index.
- Space hides a visible answer without changing the puzzle index.
- ArrowRight changes the puzzle index by exactly `+1` when a next puzzle exists.
- ArrowRight does not reveal a hidden answer.
- ArrowLeft changes the puzzle index by exactly `-1` when a previous puzzle exists.
- H toggles the hint only when the answer is hidden.
- Escape first closes an open settings/about overlay; if no overlay is open, it hides visible hint or answer without changing the puzzle index.
- S shuffles, R restarts, and F requests fullscreen only when focus is not inside an editable control.
- Evidence exists as either committed tests covering the above bullets or a dated `UPDATES.md` manual checklist with the same bullets marked pass/fail.
- `README.md` controls text exactly matches the final implemented shortcut contract.

**Verification**

- Standard gate.
- Keyboard checklist or tests.

### 1.2 Settings Dialog Modal Behavior

**Source review item:** P1.2.

**Files**

- `src/components/game/GameControls.tsx`
- `src/components/layout/InfoModal.tsx`
- Optional shared modal helper.
- `UPDATES.md` for manual focus evidence if tests are not added.

**Steps**

1. Reuse or extract the focus trap and body-lock pattern from `InfoModal`.
2. Move focus into settings on open.
3. Trap Tab and Shift+Tab inside settings.
4. Close on Escape and backdrop click.
5. Restore focus to the gear button on close.

**Measurable Acceptance**

- Opening settings makes `document.activeElement` a focusable element inside the settings dialog.
- Pressing Tab from the last focusable settings control wraps to the first focusable settings control.
- Pressing Shift+Tab from the first focusable settings control wraps to the last focusable settings control.
- Pressing Escape closes settings and returns focus to the gear button.
- Clicking the backdrop closes settings and returns focus to the gear button.
- While settings is open, at least one body scroll-lock style or class is active and is removed after close.
- Background `Hint`, `Reveal`, `Next`, and `Previous` controls are not reachable by Tab while settings is open.
- Evidence exists as automated focus tests or a dated `UPDATES.md` manual focus checklist with each bullet marked pass/fail.

**Verification**

- Standard gate.
- Settings focus checklist or tests.

### 1.3 GHCR Workflow Quality Gate

**Source review item:** P1.4.

**Files**

- `.github/workflows/docker-publish.yml`
- `README.md`
- `UPDATES.md`

**Steps**

1. Add `npm ci`, `npm run lint`, `npm run typecheck`, and `npm run test` before Docker build/publish.
2. Preserve canonical publish gating and fork/non-canonical build-only behavior.
3. Update README CI wording to match the workflow.

**Measurable Acceptance**

- `rg "npm ci|npm run lint|npm run typecheck|npm run test" .github/workflows/docker-publish.yml` finds all four commands.
- In the workflow file, all four commands appear before the Docker build/push step.
- The workflow still has a condition that prevents publishing from non-canonical owners.
- README states exactly that the publish workflow runs install, lint, typecheck, tests, then Docker build/publish.
- README does not include the live site URL, personal usernames, or owner-specific deployment values in public examples.
- The next pushed workflow run completes successfully or a failure is documented in `UPDATES.md`.

**Verification**

- YAML inspection.
- GitHub Actions run result.

### 1.4 Public URL Metadata Safety

**Source review item:** P1.5.

**Files**

- `src/app/layout.tsx`
- Optional `src/lib/public-url.ts`
- `.env`
- `.env.example`
- `README.md`
- `UPDATES.md`

**Steps**

1. Add a typed helper that trims `NEXT_PUBLIC_APP_URL`.
2. Accept only absolute `http://` or `https://` URLs.
3. Fall back to a generic local URL when missing or invalid.
4. Remove hard-coded live-domain fallback behavior.
5. Document production URL format in README.

**Measurable Acceptance**

- A committed helper or layout code path handles these four cases without throwing during `npm run build`: missing value, whitespace value, malformed value without scheme, and valid `https://guessmoji.example.com`.
- `rg "guessmoji.mrhallsclass.com|mrhallsclass|hallveticapro" src/app/layout.tsx .env .env.example README.md` returns no hard-coded public fallback or personal deployment example.
- README states that production `NEXT_PUBLIC_APP_URL` must include `https://`.
- Metadata uses the valid configured URL when provided and the generic local fallback when invalid or missing.
- `UPDATES.md` records the env values used for the malformed and valid build checks without recording secrets.

**Verification**

- Standard gate.
- Build with missing, malformed, and valid public URL values.

### 1.5 Static Play Routes With Client Shuffle

**Source review item:** P1.3.

**Files**

- `src/app/play/[categorySlug]/page.tsx`
- `src/components/game/GameBoard.tsx`
- `src/lib/puzzles.ts`
- `UPDATES.md`

**Steps**

1. Remove `dynamic = "force-dynamic"` from the play route.
2. Pass stable static puzzle data to the client.
3. Shuffle on the client in a hydration-safe way.
4. Preserve fresh orders for first visit, refresh, Restart, and Shuffle.
5. Keep answers hidden before the first reveal.

**Measurable Acceptance**

- `rg "force-dynamic" src/app/play/[categorySlug]/page.tsx` returns no matches.
- `npm run build` output does not classify `/play/[categorySlug]` as force dynamic unless another documented reason exists.
- Browser smoke records that direct navigation to `/play/random-mix` and one non-random category shows no hydration warning in the console.
- Browser smoke records that first visible card has answer hidden.
- Browser smoke records at least three order-changing events: fresh page load, Restart, and Shuffle.
- Random Mix still produces exactly 20 cards and no duplicate puzzle ids, proven by test or manual evidence.

**Verification**

- Standard gate.
- Browser smoke with console inspection.

## Phase 2 - Puzzle Data Integrity

### 2.1 Explicit Reveal Metadata

**Source review item:** P2.1.

**Files**

- `src/data/puzzles.ts`
- `src/lib/puzzles.test.ts`

**Steps**

1. Delete generic `details` and `funFact` fallback strings from final puzzle mapping.
2. Make missing metadata fail loudly for core/default puzzles.
3. Prefer direct metadata on puzzle rows or exact coverage validation over id-keyed fallback behavior.
4. Update tests.

**Measurable Acceptance**

- `rg "emoji clues are quick to recognize|pack labels|fun fact fallback|generic" src/data/puzzles.ts src/lib/puzzles.test.ts` returns no shipped generic fallback string, except comments that explicitly document banned values.
- Tests fail if any core/default puzzle is missing a non-empty `details` value.
- Tests fail if any core/default puzzle is missing a non-empty `funFact` value.
- Tests fail if a metadata map contains an id that does not correspond to a core/default puzzle, if that map remains.
- Tests fail if a core/default puzzle lacks metadata coverage, if an external metadata map remains.

**Verification**

- `npm run test`
- `npm run build`

### 2.2 Category And Puzzle Integrity Tests

**Source review item:** P2.5.

**Files**

- `src/data/categories.ts`
- `src/data/puzzles.ts`
- `src/data/expandedPacks.ts`
- `src/lib/puzzles.test.ts`

**Steps**

1. Add data-driven tests for categories and puzzles.
2. Add an explicit duplicate-answer policy.
3. Review duplicated answers named in `CODE_REVIEW.md`.

**Measurable Acceptance**

- Tests fail when two category ids are the same.
- Tests fail when two category slugs are the same.
- Tests fail when a non-random puzzle references a missing category id.
- Tests fail when two puzzle ids are the same.
- Tests fail when any puzzle has an empty `answer`.
- Tests fail when any puzzle has an empty `emojis` string.
- Tests fail when Random Mix returns duplicate puzzle ids.
- Duplicate answer policy is represented in code as either a test that rejects duplicates or an explicit allowlist.
- If an allowlist is used, it includes a comment or test case for each known duplicate from the review: `Penguin`, `Fossil`, `S'mores`, `Astronaut`, `Grand Canyon`, and `Yellowstone`.

**Verification**

- `npm run test`
- Inspect the duplicate-answer test or allowlist.

### 2.3 Stale Last-Category Link Removal

**Source review item:** P2.4.

**Files**

- `src/components/categories/LastCategoryLink.tsx`
- `UPDATES.md`

**Steps**

1. Render the saved category link only when the stored slug matches an existing category.
2. Delete synthetic fallback category behavior.
3. Optionally clear stale localStorage.

**Measurable Acceptance**

- `rg "lastCategory.*fallback|synthetic|storedName|guessmoji:lastCategoryName" src/components/categories/LastCategoryLink.tsx` finds no stale-link fallback path.
- With localStorage set to a valid category slug, browser smoke records that the last-category link appears and points to the correct `/play/<slug>` route.
- With localStorage set to an invalid slug, browser smoke records that no last-category link appears.
- If stale data is cleared, browser smoke records the localStorage key is removed after invalid slug detection.

**Verification**

- Standard gate.
- Manual localStorage smoke recorded in `UPDATES.md`.

### 2.4 Category Metadata Policy

**Source review item:** P2.8.

**Files**

- `src/types/puzzle.ts`
- `src/data/categories.ts`
- `src/app/categories/page.tsx`
- `src/app/page.tsx`
- `UPDATES.md`

**Steps**

1. Split the metadata decision into `recommendedGradeBand` and `colorTheme`.
2. For each field, either use it in UI/logic or remove it from type and data.
3. Keep category cards uncluttered.

**Measurable Acceptance**

- `recommendedGradeBand` is either rendered on category/home cards or removed from `src/types/puzzle.ts` and every category seed row.
- `colorTheme` is either used to drive a visible style/filtering behavior or removed from `src/types/puzzle.ts` and every category seed row.
- `UPDATES.md` records which choice was made for each field.
- If a field is kept, browser smoke records where it appears or what behavior it drives.
- If a field is removed, `rg "recommendedGradeBand|colorTheme" src` returns only expected references such as tests or documentation explaining removal.

**Verification**

- Standard gate.
- Browser visual scan if a field is surfaced.

## Phase 3 - Runtime, Assets, And Browser Robustness

### 3.1 Canonical Favicon Set

**Source review item:** P2.3.

**Files**

- `src/app/favicon.ico`
- `src/app/layout.tsx`
- `public/favicon.ico`
- `public/favicon.svg`
- `public/favicon-96x96.png`
- `public/apple-touch-icon.png`
- `public/site.webmanifest`
- `UPDATES.md`

**Steps**

1. Treat public favicon files as canonical.
2. Remove `src/app/favicon.ico` unless a strong reason to keep it is documented.
3. Rebuild and inspect generated head links.

**Measurable Acceptance**

- `test ! -e src/app/favicon.ico` succeeds, or `UPDATES.md` documents the specific reason it remains.
- `src/app/layout.tsx` references public favicon, SVG favicon, 96x96 favicon, Apple touch icon, and manifest paths.
- Browser or build head inspection records no competing App Router favicon link for `src/app/favicon.ico`.
- `npm run build` passes after the favicon change.

**Verification**

- `npm run build`
- Head-link inspection recorded in `UPDATES.md`.

### 3.2 ResizeObserver Fallback

**Source review item:** P2.7.

**Files**

- `src/components/game/EmojiClue.tsx`
- Optional test file.
- `UPDATES.md`

**Steps**

1. Feature-check `ResizeObserver`.
2. Provide a CSS-only no-wrap fallback when unavailable.
3. Keep shrink-to-fit behavior when `ResizeObserver` exists.

**Measurable Acceptance**

- `EmojiClue` code checks for `ResizeObserver` before constructing it.
- A test or manual browser snippet sets `window.ResizeObserver = undefined` before rendering and records no thrown error.
- The fallback element keeps `white-space: nowrap` or equivalent no-wrap behavior.
- Browser smoke at a mobile width records that a long emoji clue remains on one line.
- Modern-browser smoke records that shrink-to-fit still reduces font size for an over-wide clue.

**Verification**

- Standard gate.
- ResizeObserver fallback test or manual evidence.

### 3.3 Runtime Image Asset Size

**Source review item:** P3.5.

**Files**

- `public/assets/guessmoji-logo.png`
- `public/assets/guessmoji-embed.png`
- `public/assets/guessmoji-favicon-master.png`
- Optional smaller runtime image assets.
- `src/components/layout/AppShell.tsx`
- `src/components/layout/InfoModal.tsx`
- `src/app/page.tsx`
- `UPDATES.md`

**Steps**

1. Measure current image sizes.
2. Create smaller runtime variants for small logo placements when useful.
3. Preserve social preview image quality.
4. Use explicit image dimensions or Next Image where appropriate.

**Measurable Acceptance**

- `UPDATES.md` records before/after byte sizes for every runtime image changed.
- Any image rendered smaller than 200 CSS pixels wide uses an asset no wider than 512 physical pixels, or `UPDATES.md` documents why the larger asset is retained.
- Open Graph/Twitter metadata still references an image at least 1200 by 630 pixels or documents the final preview dimensions.
- Browser visual smoke records no layout shift or broken image on home, shell, and About modal.
- `npm run build` passes.

**Verification**

- File size comparison.
- Standard gate.
- Browser visual smoke.

## Phase 4 - DRY And Maintainability Refactors

### 4.1 Shuffle And Random Mix Single Sources

**Source review items:** P2.2, Quick Wins, Redundancy Removal Log.

**Files**

- `src/lib/puzzles.ts`
- `src/components/game/GameBoard.tsx`
- `src/app/categories/page.tsx`
- `src/app/page.tsx`
- `src/app/play/[categorySlug]/page.tsx`

**Steps**

1. Export one Random Mix session count from the puzzle utility layer.
2. Use `getRandomizedPuzzles` everywhere shuffle behavior is needed.
3. Remove local shuffle helpers.
4. Preserve 20-card Random Mix sessions.

**Measurable Acceptance**

- `rg "function getShuffledPuzzles|const getShuffledPuzzles|getShuffledPuzzles" src/components/game/GameBoard.tsx` returns no matches.
- `rg "RANDOM_MIX_SESSION_COUNT|DEFAULT_RANDOM_MIX_COUNT" src` shows exactly one exported count definition and only imports/usages elsewhere.
- Tests prove Random Mix returns exactly 20 puzzles.
- Tests prove Random Mix contains no duplicate puzzle ids.
- Browser smoke records Restart and Shuffle both create a new order.

**Verification**

- Standard gate.
- `rg` checks.
- Browser Random Mix smoke.

### 4.2 GameBoard Responsibility Split

**Source review item:** P2.6.

**Files**

- `src/components/game/GameBoard.tsx`
- New hooks/helpers under `src/components/game` or `src/lib`.
- Optional tests.
- `UPDATES.md`

**Steps**

1. Extract game progression and shuffle state.
2. Extract timer state and local persistence.
3. Extract keyboard shortcut registration.
4. Extract fullscreen state.
5. Keep rendering and layout in `GameBoard`.
6. Add tests for pure helpers where practical.

**Measurable Acceptance**

- `GameBoard.tsx` no longer directly contains all five responsibilities named in the review: progression/shuffle, timer, keyboard registration, fullscreen, and last-category persistence.
- At least three extracted hooks/helpers exist with names that reflect their responsibilities, or `UPDATES.md` documents why a smaller extraction was safer.
- `GameBoard.tsx` line count is reduced from the pre-refactor baseline recorded in `UPDATES.md`, or `UPDATES.md` documents why behavior-preserving extraction increased line count.
- Browser smoke passes for Reveal, Hide, Hint, Next, Previous, Restart, Shuffle, timer stop-on-reveal, fullscreen, and completion.
- Any extracted pure helper has unit coverage when its behavior can run without the DOM.

**Verification**

- Standard gate.
- Pre/post line count recorded in `UPDATES.md`.
- Full gameplay smoke.

### 4.3 Shared UI Styling Primitives

**Source review item:** P3.7.

**Files**

- `src/components/game/GameBoard.tsx`
- `src/components/game/GameControls.tsx`
- `src/components/game/AnswerReveal.tsx`
- `src/components/layout/AppShell.tsx`
- `src/app/page.tsx`
- `src/app/categories/page.tsx`
- Optional shared UI component files.
- `UPDATES.md`

**Steps**

1. Identify repeated primary button, secondary button, icon button, and card classes.
2. Extract only repeated patterns.
3. Keep current visual style.
4. Avoid broad design-system work.

**Measurable Acceptance**

- At least one repeated button or card treatment used in three or more places is replaced by a shared helper/component, or `UPDATES.md` documents that no pattern met the three-use threshold.
- Shared helper/component names are specific, such as primary action, secondary action, icon button, or game card.
- Browser visual smoke records that home, categories, play, and About modal still render without overlapping text or nested-card regressions.
- `npm run lint` and `npm run build` pass.

**Verification**

- Standard gate.
- Browser visual smoke.

## Phase 5 - Polish, Cleanup, And Redundancy Removal

### 5.1 Controlled Timer Input

**Source review item:** P3.1.

**Files**

- `src/components/game/GameControls.tsx`
- Optional tests.
- `UPDATES.md`

**Steps**

1. Make the custom timer input controlled while settings is open.
2. Let Enter apply timer changes.
3. Preserve `0-999` second bounds.
4. Preserve Off behavior.

**Measurable Acceptance**

- The timer input uses a React `value` state instead of only `defaultValue`.
- Enter applies the visible timer input value without clicking Apply.
- Values below 0 are clamped or rejected according to the existing bounds.
- Values above 999 are clamped or rejected according to the existing bounds.
- Off sets timer duration to 0 and leaves the UI in the documented disabled/off state.
- Evidence exists as tests or a manual settings checklist in `UPDATES.md`.

**Verification**

- Standard gate.
- Timer checklist or tests.

### 5.2 Timer Preference Load Simplification

**Source review item:** P3.3.

**Files**

- `src/components/game/GameBoard.tsx` or extracted timer hook.
- Optional tests.
- `UPDATES.md`

**Steps**

1. Read `guessmoji:timerSeconds` directly inside a client-only effect.
2. Validate with the same `0-999` bounds used by timer changes.
3. Remove unnecessary `requestAnimationFrame`.

**Measurable Acceptance**

- `rg "requestAnimationFrame" src/components/game/GameBoard.tsx src/components/game src/lib` returns no timer preference loading usage.
- Missing timer storage keeps the default timer state.
- Invalid timer storage keeps the default timer state or clears the invalid value.
- Stored `0` loads as Off.
- Stored valid value in range loads as that timer duration.
- Evidence exists as tests or a manual localStorage checklist in `UPDATES.md`.

**Verification**

- Standard gate.
- Timer storage checklist or tests.

### 5.3 Last-Category Subscription Honesty

**Source review item:** P3.2.

**Files**

- `src/components/categories/LastCategoryLink.tsx`
- Optional custom event helper.
- `UPDATES.md`

**Steps**

1. Decide whether same-tab live updates are needed.
2. If not needed, replace `useSyncExternalStore` with a mount-time client effect.
3. If needed, dispatch and listen for a same-tab custom event when writing the last category.
4. Keep invalid saved categories hidden.

**Measurable Acceptance**

- `UPDATES.md` records the selected behavior: mount-only or live same-tab.
- If mount-only is selected, `rg "useSyncExternalStore" src/components/categories/LastCategoryLink.tsx` returns no matches.
- If live same-tab is selected, code dispatches and listens for a named custom event when last-category storage changes.
- Valid saved category appears on the categories page.
- Invalid saved category does not appear.
- Same-tab behavior matches the documented choice in `UPDATES.md`.

**Verification**

- Standard gate.
- Last-category checklist in `UPDATES.md`.

### 5.4 About Modal Close Control

**Source review item:** P3.4.

**Files**

- `src/components/layout/InfoModal.tsx`
- `UPDATES.md`

**Steps**

1. Replace literal `x` with an intentional close glyph/control.
2. Keep accessible label.
3. Preserve focus visibility and contrast.

**Measurable Acceptance**

- `rg ">x<|aria-label=\"Close about dialog\"[\\s\\S]*>x<" src/components/layout/InfoModal.tsx` finds no literal text-only `x` close control.
- The close button still has `aria-label="Close about dialog"`.
- Browser smoke records the close control is focusable, has a visible focus state, and closes the modal with click and Enter.

**Verification**

- Standard gate.
- About modal checklist.

### 5.5 TypeScript `allowJs` Policy

**Source review item:** P3.6.

**Files**

- `tsconfig.json`
- `AGENTS.md` only if `allowJs` remains enabled.

**Steps**

1. Check whether source JavaScript is intentionally compiled.
2. Disable `allowJs` if no compiled JavaScript source is required.
3. Document a reason if `allowJs` remains enabled.

**Measurable Acceptance**

- If no intentional compiled JavaScript source exists, `tsconfig.json` has `"allowJs": false` or omits `allowJs`.
- If `allowJs` remains true, `AGENTS.md` names the exact JavaScript files or tool constraint that requires it.
- `find src -name "*.js" -o -name "*.jsx"` returns no compiled source files unless they are documented.
- `npm run typecheck` passes.

**Verification**

- Standard gate.
- `find` check.

### 5.6 Delete Starter Assets And Placeholder Styles

**Source review items:** Quick Wins, Redundancy Removal Log.

**Files**

- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`
- `src/styles/.gitkeep`
- `AGENTS.md`

**Steps**

1. Confirm no production references remain.
2. Delete unused starter SVGs.
3. Delete `src/styles/.gitkeep` if no shared styles file is created.
4. Update the folder tree if the styles directory is removed.

**Measurable Acceptance**

- `test ! -e public/file.svg` succeeds.
- `test ! -e public/globe.svg` succeeds.
- `test ! -e public/next.svg` succeeds.
- `test ! -e public/vercel.svg` succeeds.
- `test ! -e public/window.svg` succeeds.
- `src/styles/.gitkeep` is deleted, or `UPDATES.md` documents the new shared style file that replaced it.
- `rg "file.svg|globe.svg|next.svg|vercel.svg|window.svg" .` returns no production references.
- `AGENTS.md` folder tree matches the final `src` structure.

**Verification**

- Standard gate.
- `test` and `rg` checks.

### 5.7 `getPuzzleById` Decision

**Source review item:** Redundancy Removal Log.

**Files**

- `src/lib/puzzles.ts`
- `src/lib/puzzles.test.ts`
- `UPDATES.md`

**Steps**

1. Confirm whether there are production callers.
2. Delete `getPuzzleById` and its tests if unused.
3. If keeping it, document the public utility reason.

**Measurable Acceptance**

- If deleted, `rg "getPuzzleById" src` returns no matches.
- If retained, `UPDATES.md` states the production or planned public utility reason, and tests cover that stated behavior.
- No test remains solely to exercise unused production code without a documented reason.

**Verification**

- Standard gate.
- `rg "getPuzzleById" src`

## Phase 6 - Dependency Security

### 6.1 Moderate Audit Findings

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
5. Document remaining upstream-only findings.

**Measurable Acceptance**

- `UPDATES.md` records the exact count of moderate-or-higher findings before remediation.
- If compatible patches exist, `package.json` and `package-lock.json` move only to compatible modern versions and the standard gate passes.
- If findings remain, `UPDATES.md` records each remaining package/advisory, why no safe compatible fix was applied, and the next review trigger.
- `npm audit --audit-level=moderate` exits 0, or exits nonzero with every remaining finding documented as upstream-only/no-safe-compatible-fix.
- No commit uses `npm audit fix --force`.

**Verification**

- Standard gate.
- `npm audit --audit-level=moderate`

## Phase 7 - Final Review Closure

### 7.1 Review Backlog Closure Evidence

**Source review item:** all of `CODE_REVIEW.md`.

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
4. Add a closure note to `CODE_REVIEW.md` or create a follow-up review note.
5. Run final verification.

**Measurable Acceptance**

- The coverage map below has no missing `CODE_REVIEW.md` action items.
- Every coverage map row has one of these statuses recorded in `PLAN.md` or `UPDATES.md`: `fixed`, `deleted`, `verified`, `deferred with reason`, or `superseded by documented decision`.
- Final verification records status for `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm audit --audit-level=moderate`, and Docker build.
- Browser smoke records pass/fail for home, categories, Random Mix, one non-random category, settings modal, keyboard controls, timer controls, and mobile emoji fit.
- README still contains no live site URL, personal username, or owner-specific deployment value in public examples.
- The app remains account-free, database-free, and multiplayer-free, verified by source search or documented architecture review.

**Verification**

- Standard gate.
- `npm audit --audit-level=moderate`
- Docker build.
- Browser smoke.

## Coverage Map

| Review item | Plan item | Measurable evidence |
| --- | --- | --- |
| Baseline verification harness | 0.1, 0.2 | Baseline command status and reusable smoke checklist |
| P1.1 Keyboard shortcuts | 1.1 | Shortcut tests or manual checklist plus README match |
| P1.2 Settings modal focus | 1.2 | Focus-trap tests or manual focus checklist |
| P1.3 Dynamic play route | 1.5 | No `force-dynamic`, build route evidence, no hydration warnings |
| P1.4 GHCR quality gate | 1.3 | Workflow command order and successful Actions run |
| P1.5 Public URL metadata | 1.4 | URL helper build matrix and generic README/env values |
| P2.1 Generic reveal fallback | 2.1 | Tests for explicit metadata and no fallback strings |
| P2.2 Shuffle and Random Mix duplication | 4.1 | Single helper/count `rg` checks and Random Mix tests |
| P2.3 Duplicate favicon sources | 3.1 | No `src/app/favicon.ico` or documented exception plus head inspection |
| P2.4 Last-category stale fallback | 2.3 | Valid/invalid localStorage smoke |
| P2.5 Data validation and duplicate answers | 2.2 | Data-driven integrity tests and duplicate-answer policy |
| P2.6 GameBoard refactor | 4.2 | Extracted hooks/helpers, line-count note, gameplay smoke |
| P2.7 EmojiClue ResizeObserver fallback | 3.2 | Undefined `ResizeObserver` render evidence and mobile one-line smoke |
| P2.8 Category metadata policy | 2.4 | Field used in UI/logic or removed, with `rg` evidence |
| P2.9 Dependency audit findings | 6.1 | Audit output and compatible-fix or documented-deferral evidence |
| P3.1 Timer input | 5.1 | Controlled value, Enter apply, timer checklist/tests |
| P3.2 Last-category subscription | 5.3 | Mount-only or custom-event evidence matching documented choice |
| P3.3 Timer requestAnimationFrame | 5.2 | No timer-loading `requestAnimationFrame`, storage checklist/tests |
| P3.4 About close button | 5.4 | No literal text-only `x`, accessible label, modal smoke |
| P3.5 Image optimization | 3.3 | Before/after byte sizes and visual smoke |
| P3.6 TypeScript `allowJs` | 5.5 | `allowJs` disabled or documented, source `.js` check |
| P3.7 Shared styling primitives | 4.3 | Shared helper/component or documented no-threshold result |
| Quick wins | 4.1, 5.4, 5.6 | Deleted starter assets, close control polish, shared shuffle/count |
| Redundancy removal log | 3.1, 4.1, 5.6, 5.7 | Deleted or justified redundant files/helpers |
| Final closure | 7.1 | Status for every row plus final command, Docker, and browser evidence |
