# Guessmoji Code Review Report

Generated: 2026-06-06 22:15 EDT

## Executive Summary

Guessmoji is in healthy MVP shape: the main classroom game flow exists, the app is database-free, Dockerized, and the current local checks pass for lint, typecheck, tests, and production build. The largest practical risks are UX regressions in the host controls, especially keyboard behavior and the settings dialog, plus deployment confidence gaps because the publish workflow does not run the full quality gate before building the GHCR image. The dominant good pattern is simple static TypeScript data with a small utility layer; the dominant debt pattern is duplicated gameplay/data logic split across pages, components, and seed files. A browser smoke test confirmed the game flow works at a basic level, but it also confirmed that settings-dialog focus can escape to background controls. No P0 issues were found, but several P1/P2 issues will compound as more categories, host controls, or display modes are added.

## Remediation Status

Updated: 2026-06-07

The action items in this report have been remediated through `PLAN.md`, except the upstream dependency audit item, which is documented as deferred because the available npm fix requires a breaking downgrade to `next@9.3.3`. Final evidence is recorded in `UPDATES.md` entries `2026-06-07 10:07`, `2026-06-07 10:10`, and `2026-06-07 10:13`. The pushed GitHub Actions workflow run `27094924796` completed successfully with install, lint, typecheck, tests, and Docker build/push.

## 2. Prioritised Action Items

### P0

No P0 findings were identified. I did not find an issue that is likely to cause data loss, a security breach, or a production crash under normal configuration.

### P1

#### 1. Keyboard shortcuts contradict the documented controls and likely host expectations

**Affected files / functions**

- `src/components/game/GameBoard.tsx`, `handleKeyDown`
- `README.md`, "Controls" table

**Problem**

The README says Space reveals or hides the answer and Right Arrow moves to the next puzzle. The implementation currently advances to the next puzzle when Space is pressed after an answer is visible, and Right Arrow reveals the answer when it is hidden. On a projector or smartboard, keyboard controls need to be predictable because hosts may use them without looking at the laptop screen.

**Fix prompt**

```txt
In Guessmoji, align the keyboard shortcuts with the documented host controls. Update `src/components/game/GameBoard.tsx` so Space toggles answer visibility for the current puzzle, ArrowRight always moves to the next puzzle when possible, ArrowLeft moves to the previous puzzle when possible, H toggles the hint before reveal, and Escape closes overlays before hiding hint/answer. Then update `README.md` only if any final shortcut behavior intentionally differs. Add focused tests for the keyboard behavior if a component test setup exists, or document a manual verification checklist if it does not.
```

#### 2. Settings dialog is visually modal but not behaviorally modal

**Affected files / functions**

- `src/components/game/GameControls.tsx`, settings dialog markup and backdrop
- `src/components/layout/InfoModal.tsx`, existing focus trap/body lock pattern to reuse

**Problem**

The settings panel uses `role="dialog"` and `aria-modal="true"`, but focus is not moved into the dialog, focus is not trapped, and background controls remain tabbable. A local Playwright smoke confirmed that after opening settings, focus stayed on the gear button and Tab moved to the underlying `Hint` button. The About modal already implements a stronger modal pattern with focus capture, Escape handling, and body scroll lock. This inconsistency can degrade keyboard and screen-reader use during a live classroom session.

**Fix prompt**

```txt
In Guessmoji, make the settings dialog in `src/components/game/GameControls.tsx` behave like a real modal. Reuse or extract the focus-management pattern from `src/components/layout/InfoModal.tsx`: move focus into the dialog when it opens, trap Tab/Shift+Tab inside it, close on Escape, restore focus to the gear button when closed, and lock body scrolling while open. Keep the existing visual design and button labels. Verify keyboard navigation with the timer input, Shuffle, Restart, and Full screen controls.
```

#### 3. Play pages are forced dynamic only to shuffle static local data

**Affected files / functions**

- `src/app/play/[categorySlug]/page.tsx`, `dynamic = "force-dynamic"` and `getRandomizedPuzzles`
- `src/components/game/GameBoard.tsx`, initial puzzle state and restart/shuffle flow

**Problem**

The play route opts into dynamic rendering so every category start gets a shuffled order from the server. The app has no database or per-user server state, so this gives up static rendering and cacheability for a behavior that can safely happen on the client. Under public traffic, this makes the most-used route more expensive than necessary and weakens the "fast projector-friendly app" goal.

**Fix prompt**

```txt
In Guessmoji, remove the need for `dynamic = "force-dynamic"` in `src/app/play/[categorySlug]/page.tsx`. Keep category starts shuffled every time a host opens or restarts a category, but move the initial shuffle to a hydration-safe client flow in `src/components/game/GameBoard.tsx` or a small client hook. Preserve direct links to `/play/[categorySlug]`, keep answers hidden on first render, and verify that repeated visits, refreshes, restart, and the Shuffle button all produce fresh orders without hydration warnings.
```

#### 4. The GHCR publish workflow does not run the full quality gate before publishing

**Affected files / functions**

- `.github/workflows/docker-publish.yml`
- `README.md`, claim that the publish workflow runs checks before publishing

**Problem**

The workflow builds and pushes a Docker image, but it does not run `npm run lint`, `npm run typecheck`, or `npm run test` before the image build. `next build` catches many issues, but it does not replace lint or Vitest coverage. This means a regression can publish if it builds, and the README currently overstates the CI gate.

**Fix prompt**

```txt
In Guessmoji, update `.github/workflows/docker-publish.yml` so the canonical repository publish job runs `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test`, and then the Docker build/publish steps. Keep the existing behavior where forks and non-canonical owners build but do not publish to `ghcr.io/hallveticapro/guessmoji`. Update `README.md` so its CI description exactly matches the workflow. Do not add secrets or owner-specific deployment URLs to the README.
```

#### 5. Public URL metadata can be wrong or crash if `NEXT_PUBLIC_APP_URL` is missing/malformed

**Affected files / functions**

- `src/app/layout.tsx`, `appUrl`, `metadataBase`, Open Graph metadata
- `.env`
- `.env.example`

**Problem**

`new URL(appUrl)` is evaluated during metadata setup. If a self-hosted deployment sets `NEXT_PUBLIC_APP_URL` to a value without a scheme, with whitespace, or with another malformed value, metadata creation can throw during build or runtime. If the variable is missing, `src/app/layout.tsx` falls back to a specific live domain even though `.env.example`, Docker Compose, and the public README use generic/local defaults. That can generate social preview metadata for the wrong host in forks or self-hosted installs.

**Fix prompt**

```txt
In Guessmoji, harden public app URL handling in `src/app/layout.tsx`. Add a small typed helper that trims `NEXT_PUBLIC_APP_URL`, accepts only valid absolute HTTP/HTTPS URLs, and falls back to a safe generic local URL in development if invalid or missing. Avoid a hard-coded canonical live domain in public defaults. Keep `.env` and `.env.example` safe and generic, and add a short README note that `NEXT_PUBLIC_APP_URL` must include `https://` when set for production. Ensure metadata generation cannot crash because of a malformed environment value.
```

### P2

#### 1. Generic reveal fallback copy still exists in the default puzzle data path

**Affected files / functions**

- `src/data/puzzles.ts`, final `puzzles` metadata mapping
- `src/lib/puzzles.test.ts`, fallback reveal copy assertions

**Problem**

The project rules say default puzzles should not ship generic reveal copy. Tests currently assert that no exposed default puzzle contains the generic strings, but the fallback strings still exist in the final `puzzles` mapping. That creates a future footgun: adding or renaming a core puzzle id can silently ship vague detail and fun-fact copy instead of failing fast.

**Fix prompt**

```txt
In Guessmoji, remove generic detail and fun-fact fallback copy from `src/data/puzzles.ts`. Make the final `puzzles` export fail loudly during development or build if a core puzzle is missing explicit metadata, or merge metadata directly into the core puzzle objects so the data cannot drift by id. Update `src/lib/puzzles.test.ts` to assert that every core puzzle has explicit `details` and `funFact` values and that the generic fallback strings no longer exist in the data module.
```

#### 2. Shuffle and Random Mix constants are duplicated across app layers

**Affected files / functions**

- `src/lib/puzzles.ts`, `getRandomizedPuzzles`, `DEFAULT_RANDOM_MIX_COUNT`
- `src/components/game/GameBoard.tsx`, local `getShuffledPuzzles`
- `src/app/categories/page.tsx`, `RANDOM_MIX_SESSION_COUNT`
- `src/app/page.tsx`, featured category puzzle count display

**Problem**

There is already a shared shuffle utility, but `GameBoard` carries a second shuffle implementation. Random Mix also has separate count constants in the data utility and category page. These are small duplications now, but they make category counts, restart behavior, and shuffle behavior easier to drift apart.

**Fix prompt**

```txt
In Guessmoji, centralize shuffle and Random Mix count behavior. Use `getRandomizedPuzzles` from `src/lib/puzzles.ts` inside `src/components/game/GameBoard.tsx` instead of keeping a local `getShuffledPuzzles`. Export one Random Mix session count from the puzzle utility layer and use it in `src/app/categories/page.tsx`, `src/app/page.tsx`, and `/play/[categorySlug]` count logic. Preserve the current user-facing count of 20 Random Mix cards.
```

#### 3. Duplicate favicon sources can make browsers select the wrong icon

**Affected files / functions**

- `src/app/favicon.ico`
- `src/app/layout.tsx`, metadata `icons`
- `public/favicon.ico`
- `public/favicon.svg`
- `public/favicon-96x96.png`

**Problem**

The app has both the App Router special file `src/app/favicon.ico` and explicit public favicon metadata. Next.js can emit a generated favicon link for the app-file icon in addition to the metadata links. Since favicon rounding was recently requested, duplicate sources make it harder to know which file a browser or pinned tab will use.

**Fix prompt**

```txt
In Guessmoji, make the public favicon set canonical. Remove `src/app/favicon.ico` unless there is a documented reason to keep an App Router special favicon file. Keep `src/app/layout.tsx` metadata pointed at the rounded files in `public/`: `favicon.ico`, `favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`, and `site.webmanifest`. Rebuild and inspect the generated head links to confirm there is one coherent favicon set and browsers no longer receive a competing app-file favicon.
```

#### 4. Last-category fallback can create a dead link instead of hiding stale data

**Affected files / functions**

- `src/components/categories/LastCategoryLink.tsx`, `lastCategory` fallback object

**Problem**

If local storage contains a category slug that no longer exists, the component creates a synthetic category object from the stored slug/name and links to it. That violates the "data is either correct or it is not displayed" principle and can send a host to a missing category page after categories are renamed or removed.

**Fix prompt**

```txt
In Guessmoji, simplify `src/components/categories/LastCategoryLink.tsx` so it only renders when the stored `guessmoji:lastCategorySlug` matches an existing category from `getAllCategories()`. Delete the synthetic fallback category object and stale-link behavior. If the stored slug is missing or no longer valid, render nothing and optionally clear the stale localStorage value from the client.
```

#### 5. Data validation coverage is too narrow for a 600-puzzle seed set

**Affected files / functions**

- `src/data/categories.ts`
- `src/data/puzzles.ts`
- `src/data/expandedPacks.ts`
- `src/lib/puzzles.test.ts`

**Problem**

Current tests cover basic counts, Random Mix size, and absence of fallback reveal copy, but they do not assert full data integrity. With 600 puzzles across 60 categories, duplicate ids, invalid category ids, duplicate slugs, missing required reveal fields, or empty emoji clues could slip into the seed set and create broken pages or weak reveals. A direct data search found duplicated expanded-pack answers such as `Penguin`, `Fossil`, `S'mores`, `Astronaut`, `Grand Canyon`, and `Yellowstone`; some repeats may be acceptable, but the policy should be explicit.

**Fix prompt**

```txt
In Guessmoji, expand `src/lib/puzzles.test.ts` with data integrity tests for all shipped categories and puzzles. Assert that category ids and slugs are unique, every non-random puzzle references a real category, every puzzle id is unique, every puzzle has non-empty answer and emoji fields, every default puzzle has classroom-safe reveal metadata where required, and Random Mix contains no duplicate puzzle ids. Add a duplicate-answer policy: either disallow duplicates across generic educational packs or keep a small documented allowlist for intentional cross-pack repeats. Keep the tests data-driven so future category additions are checked automatically.
```

#### 6. `GameBoard` mixes game state, persistence, timer, fullscreen, keyboard, and rendering

**Affected files / functions**

- `src/components/game/GameBoard.tsx`

**Problem**

`GameBoard` is the main host surface and currently holds a lot of unrelated responsibilities in one component. This makes subtle UX changes risky because keyboard behavior, timer stopping, persistence, restart, shuffle, hint state, and completion rendering all share the same state surface. The component is still understandable, but it will get brittle if timers, scoring, or more host tools are added.

**Fix prompt**

```txt
In Guessmoji, refactor `src/components/game/GameBoard.tsx` without changing behavior. Extract small hooks or helpers for game progression/shuffle state, timer state, keyboard shortcuts, fullscreen state, and last-category persistence. Keep presentational JSX in `GameBoard`, move reusable logic into `src/lib` or `src/components/game` hooks, and add/adjust tests for the extracted pure helpers where practical. Verify Reveal, Hide, Hint, Next, Previous, Restart, Shuffle, timer stop-on-reveal, and completion behavior after the refactor.
```

#### 7. Emoji fitting depends on `ResizeObserver` without a fallback

**Affected files / functions**

- `src/components/game/EmojiClue.tsx`

**Problem**

The emoji clue component now uses JavaScript measurement to keep clues on one line and shrink them to fit. That works in modern browsers, but it calls `new ResizeObserver(...)` directly. Older or restricted classroom browsers that lack `ResizeObserver` can throw instead of showing a readable fallback.

**Fix prompt**

```txt
In Guessmoji, harden `src/components/game/EmojiClue.tsx` for browsers without `ResizeObserver`. Add a feature check that falls back to a conservative CSS-only one-line font size when `ResizeObserver` is unavailable, and keep the current shrink-to-fit behavior when it exists. Avoid direct DOM style mutation where a React state/style update can express the same result. Verify a long emoji clue stays on one line on small widths and that the component does not throw if `window.ResizeObserver` is undefined.
```

#### 8. Important category metadata is maintained but not used

**Affected files / functions**

- `src/types/puzzle.ts`, `Category`
- `src/data/categories.ts`
- `src/app/categories/page.tsx`
- `src/app/page.tsx`

**Problem**

`Category` includes `colorTheme` and `recommendedGradeBand`, and every category maintains those values, but the UI does not use them. Unused required metadata increases seed maintenance cost and makes it unclear whether those fields are product requirements, future placeholders, or dead data.

**Fix prompt**

```txt
In Guessmoji, decide whether `Category.colorTheme` and `Category.recommendedGradeBand` are product fields or dead metadata. If they are product fields, surface them consistently on category cards or use them to drive styling/filtering. If they are not needed for the MVP, remove them from `src/types/puzzle.ts` and `src/data/categories.ts`, and update any tests or docs that mention them. Keep the public UI simple and projector-friendly either way.
```

#### 9. Moderate dependency audit findings remain unresolved

**Affected files / functions**

- `package.json`
- `package-lock.json`
- Next.js/PostCSS dependency tree

**Problem**

`npm audit --audit-level=moderate` reports two moderate findings through the scaffolded Next/PostCSS dependency tree. The suggested forced fix downgrades Next to an old incompatible major version, so it should not be applied blindly. This is not an immediate app-specific vulnerability finding, but it should be tracked because security debt in framework dependencies can become urgent quickly.

**Fix prompt**

```txt
In Guessmoji, review the current `npm audit --audit-level=moderate` output and update framework dependencies only along compatible modern versions. Do not run `npm audit fix --force` if it downgrades Next.js. Prefer upgrading Next.js, React, or PostCSS-related packages when a patched compatible release exists, then run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and `npm audit --audit-level=moderate` again. Document any remaining upstream-only finding in `UPDATES.md`.
```

### P3

#### 1. Timer input is uncontrolled and does not support Enter-to-apply

**Affected files / functions**

- `src/components/game/GameControls.tsx`, timer input and Apply button

**Problem**

The custom timer input uses `defaultValue`, so it can drift from `timerDuration` while the settings dialog is open. It also requires clicking Apply rather than supporting Enter. This is minor, but timer controls are part of live hosting and should feel crisp.

**Fix prompt**

```txt
In Guessmoji, make the custom timer input in `src/components/game/GameControls.tsx` controlled while the settings dialog is open. Keep it synced with `timerDuration`, preserve the current 0-999 second bounds unless product requirements choose a narrower range, and let Enter apply the value. Preserve the existing Off behavior.
```

#### 2. Last-category subscription only reacts to cross-tab storage events

**Affected files / functions**

- `src/components/categories/LastCategoryLink.tsx`

**Problem**

`useSyncExternalStore` subscribes to the `storage` event, which does not fire in the same document that updates local storage. The current navigation flow remounts the categories page, so this usually works, but the abstraction implies live same-tab updates that it does not provide.

**Fix prompt**

```txt
In Guessmoji, simplify or complete `src/components/categories/LastCategoryLink.tsx`. If the link only needs to update on page mount, replace the `useSyncExternalStore` setup with a straightforward client effect. If it should update live in the same tab, dispatch and listen for a small custom event whenever `GameBoard` writes the last-category preference. Keep the component hidden when no valid saved category exists.
```

#### 3. Local-storage timer loading uses unnecessary `requestAnimationFrame`

**Affected files / functions**

- `src/components/game/GameBoard.tsx`, initial `useEffect` that reads `guessmoji:timerSeconds`

**Problem**

The timer preference is read inside `requestAnimationFrame` from a client-only effect. The frame delay does not add much safety because effects already run after hydration, and it makes the initial timer setup harder to reason about.

**Fix prompt**

```txt
In Guessmoji, simplify the timer preference load in `src/components/game/GameBoard.tsx`. Read `guessmoji:timerSeconds` directly inside the existing client-only `useEffect`, validate it with the same 0-999 second bounds used by `changeTimer`, and set timer state after the read. Preserve behavior for missing, invalid, and disabled timer values.
```

#### 4. About modal close button uses text instead of the app's icon-button convention

**Affected files / functions**

- `src/components/layout/InfoModal.tsx`, close button

**Problem**

Most controls use clear button text or icon-like controls, but the About modal close button is the literal text `x`. This is a small polish issue that can look less intentional than the rest of the UI.

**Fix prompt**

```txt
In Guessmoji, update the close button in `src/components/layout/InfoModal.tsx` to use an accessible icon-style control. Keep the `aria-label="Close about dialog"` text, preserve the current size and high-contrast styling, and use either a typographic multiplication sign or an icon component if the project adds an icon library later.
```

#### 5. Large public image assets may be heavier than needed for their display sizes

**Affected files / functions**

- `public/assets/guessmoji-logo.png`
- `public/assets/guessmoji-embed.png`
- `public/assets/guessmoji-favicon-master.png`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/InfoModal.tsx`
- `src/app/page.tsx`

**Problem**

The main logo is roughly 896 KB and the embed image is roughly 656 KB. They are cached static assets, but the logo is displayed at small sizes in the shell and hero. Oversized static imagery can slow first visits on school networks.

**Fix prompt**

```txt
In Guessmoji, optimize runtime image assets without changing the visible brand. Keep `public/assets/guessmoji-favicon-master.png` only as a source asset if needed, but create smaller runtime variants for the shell logo and any small logo use. Use Next Image sizing where appropriate, preserve the current Open Graph image quality, and verify the home page, app shell, About modal, and social previews still use the intended files.
```

#### 6. TypeScript config allows JavaScript in a TypeScript-only app

**Affected files / functions**

- `tsconfig.json`

**Problem**

`allowJs` is enabled even though the app source is TypeScript. That can hide accidental `.js` source files from review expectations and weakens the "modern TypeScript stack" convention a little.

**Fix prompt**

```txt
In Guessmoji, review `tsconfig.json` and disable `allowJs` if no source JavaScript files are intentionally compiled. Run `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` after the change. If `allowJs` must stay enabled for a specific tool-generated file, document that reason in `AGENTS.md`.
```

#### 7. Color and control styling is repeated across components

**Affected files / functions**

- `src/components/game/GameBoard.tsx`
- `src/components/game/GameControls.tsx`
- `src/components/game/AnswerReveal.tsx`
- `src/components/layout/AppShell.tsx`
- `src/app/page.tsx`
- `src/app/categories/page.tsx`

**Problem**

The current visual system is friendly and coherent, but Tailwind class strings for yellow primary actions, teal secondary controls, white cards, borders, and shadows are repeated across many files. This is manageable now, but it makes later visual tuning more error-prone.

**Fix prompt**

```txt
In Guessmoji, introduce a minimal shared UI styling pattern for repeated button/card treatments. Keep the app's current warm cream, mint, yellow, teal, and white classroom-friendly design. Prefer small shared components or class helpers for primary action buttons, secondary buttons, icon buttons, and game cards. Do not add a broad design system or heavy abstraction; only extract repetitions that are already used in several places.
```

## 3. Quick Wins

These are small, safe fixes that can be batched after the P1 items are scheduled.

- Delete unused starter SVG assets from `public/`: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, and `window.svg`.
- Delete `src/styles/.gitkeep` if no shared styles are planned, or replace it with a real stylesheet when shared CSS exists.
- Remove the local `getShuffledPuzzles` helper from `GameBoard` after switching to the shared `getRandomizedPuzzles`.
- Replace the local Random Mix count constant in `categories/page.tsx` with the exported shared count.
- Remove `src/app/favicon.ico` after confirming the public favicon files are the canonical rounded browser icons.
- Change the About modal close button from literal `x` text to a more intentional accessible close glyph/control.
- Add data integrity assertions for unique puzzle ids, unique category slugs, and valid category references.
- Review or allowlist duplicated expanded-pack answers such as `Penguin`, `Fossil`, `S'mores`, `Astronaut`, `Grand Canyon`, and `Yellowstone`.
- Update README/control text after the final keyboard behavior is fixed so docs and UI cannot drift.

Batch prompt:

```txt
In Guessmoji, make a small cleanup pass without changing product behavior. Delete unused starter public SVGs, remove the placeholder `src/styles/.gitkeep` if the directory is otherwise unused, switch `GameBoard` to the shared shuffle helper, centralize the Random Mix count, remove duplicate favicon source `src/app/favicon.ico` if public favicon metadata remains correct, and polish the About modal close control. Run lint, typecheck, tests, and build afterward, then update `UPDATES.md`.
```

## 4. Redundancy Removal Log

- `public/file.svg` - unused Next.js starter asset; not referenced by the app.
- `public/globe.svg` - unused Next.js starter asset; not referenced by the app.
- `public/next.svg` - unused Next.js starter asset; not referenced by the app.
- `public/vercel.svg` - unused Next.js starter asset; not referenced by the app.
- `public/window.svg` - unused Next.js starter asset; not referenced by the app.
- `src/styles/.gitkeep` - placeholder file only; delete once no empty directory needs to be preserved.
- `src/app/favicon.ico` - duplicate favicon source competing with the explicit public favicon metadata; remove after confirming the rounded public icons are canonical.
- `getShuffledPuzzles` in `src/components/game/GameBoard.tsx` - duplicate of `getRandomizedPuzzles` in `src/lib/puzzles.ts`.
- `RANDOM_MIX_SESSION_COUNT` in `src/app/categories/page.tsx` - duplicate Random Mix count once a shared exported count is used.
- Generic fallback strings in `src/data/puzzles.ts` final `puzzles` mapping - default reveal content should be explicit or fail validation rather than silently falling back.
- `getPuzzleById` in `src/lib/puzzles.ts` - no production code uses it; delete if it is not intended as a public utility, and remove or replace the test that only exercises this unused helper.
