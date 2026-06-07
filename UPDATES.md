# UPDATES.md

## 2026-06-07 19:37 - Restore Browser Favicon Priority

### Changed

- Updated root metadata so browsers receive `/favicon.ico` and `/favicon-96x96.png` as the favicon candidates.
- Stopped advertising the large embedded SVG favicon as a primary browser tab icon.

### Why

- Some browsers can prefer the last `rel="icon"` candidate and fail to display the large SVG favicon reliably. The ICO and PNG assets are smaller, concrete image formats and are already present in `public/`.

### Files Touched

- `src/app/layout.tsx`
- `UPDATES.md`

### Commit

- `pending`

## 2026-06-07 19:30 - Record Remote Clue Audit Verification

### Changed

- Added remote verification evidence for the pushed clue audit checkpoint.

### Why

- `PLAN.md` requires the audit work to be pushed and accepted by GitHub Actions, with the final pushed checkpoint documented.

### Evidence

- Local worktree was clean after commit `64adc9c`.
- `git push origin main` succeeded for `64adc9c`.
- GitHub Actions run `27108035513` completed successfully for head SHA `64adc9cd85cfa37f4b2d6fefc13542412a86dae9`.
- The run included install dependencies, lint, typecheck, test, Docker Buildx setup, GHCR login, metadata extraction, and Docker build/maybe-push.
- GitHub emitted the known Node.js 20 third-party action deprecation annotation for `actions/checkout@v4`, `docker/build-push-action@v6`, `docker/login-action@v3`, `docker/metadata-action@v5`, and `docker/setup-buildx-action@v3`.

### Files Touched

- `UPDATES.md`

### Commit

- `793e563`

## 2026-06-07 19:25 - Complete Card Clue Audit Evidence

### Changed

- Added `CLUE_AUDIT.md` with baseline inventory, a 60-row category review matrix, 189 direct-emoji candidate rows, 189 changed puzzle ids, changed clue details, allowed-exception policy, and final source consistency snapshot.
- Added `src/data/answerEmojiBanlist.ts` and `src/lib/clue-audit.ts` so direct-answer emoji clues are detected with deterministic answer normalization.
- Added `src/lib/clue-audit.test.ts` covering normalization, required regression bans, synthetic leak detection, full shipped-puzzle leak detection, known animal/food fixes, and audit-log/source consistency.
- Removed direct-answer emoji from 189 shipped puzzle clues while keeping category context, hints, reveal details, and fun facts intact.
- Updated `TASKS.md` and `AGENTS.md` so future card additions must update the banlist and run clue-audit tests.

### Why

- Guessmoji cards should not give away answers by showing the answer's own emoji, especially for animals, ocean animals, fruits, vegetables, tools, vehicles, and other one-to-one pictorial answers. The audit evidence makes the cleanup reviewable and hard to regress.

### Evidence

- Baseline before clue edits: `npm run lint` passed, `npm run typecheck` passed, `npm run test` passed with 8 test files and 43 tests, and `npm run build` passed.
- Baseline source counts: 60 categories, 59 non-random categories, 600 shipped puzzles, and Random Mix session count 20.
- Initial direct-answer leak suite found 195 forbidden emoji hits across 189 puzzle cards; after cleanup, `npm run test -- --reporter verbose src/lib/clue-audit.test.ts` passed with 12 tests and zero shipped-puzzle leaks.
- Final local gate: `npm run lint` passed, `npm run typecheck` passed, `npm run test` passed with 9 test files and 55 tests, and `npm run build` passed.
- `npm audit --audit-level=moderate` still reports 2 moderate findings through Next's bundled `postcss <8.5.10`; the available fix would force `next@9.3.3`, so no forced fix was applied.
- Source consistency check reported 60 audit rows, 0 missing category ids, 600 reviewed non-random cards, 0 unreviewed rows, and 0 direct-answer emoji leaks.
- README neutrality check `rg "hallveticapro|mrhallsclass|guessmoji\.mrhallsclass|ghcr.io/hallveticapro" README.md` returned no matches.
- Browser smoke on `http://localhost:3013` using temporary Playwright: categories page loaded; changed Ocean Animals clue `🌊💨🎶` for `Whale` was visible with the answer hidden before reveal; reveal showed `Whale`; changed Fruit clue `🌳🥧` for `Apple` was visible at 390px width, stayed one-line, answer was hidden before reveal, reveal showed `Apple`, and console errors were empty.
- No allowed exceptions were added.

### Changed Puzzle IDs

- `spider-man`
- `ant-man`
- `one-hundred-one-dalmatians`
- `animals-cat`
- `animals-dog`
- `animals-elephant`
- `animals-giraffe`
- `animals-penguin`
- `animals-kangaroo`
- `animals-tiger`
- `animals-panda`
- `animals-fox`
- `animals-sloth`
- `ocean-animals-shark`
- `ocean-animals-dolphin`
- `ocean-animals-octopus`
- `ocean-animals-sea-turtle`
- `ocean-animals-jellyfish`
- `ocean-animals-whale`
- `ocean-animals-seahorse`
- `ocean-animals-crab`
- `ocean-animals-starfish`
- `ocean-animals-clownfish`
- `birds-owl`
- `birds-eagle`
- `birds-parrot`
- `birds-flamingo`
- `birds-peacock`
- `birds-hummingbird`
- `birds-penguin`
- `birds-swan`
- `birds-robin`
- `bugs-butterfly`
- `bugs-bee`
- `bugs-ladybug`
- `bugs-ant`
- `bugs-dragonfly`
- `bugs-grasshopper`
- `bugs-firefly`
- `bugs-mosquito`
- `bugs-caterpillar`
- `bugs-spider`
- `fruit-apple`
- `fruit-banana`
- `fruit-strawberry`
- `fruit-watermelon`
- `fruit-pineapple`
- `fruit-grapes`
- `fruit-orange`
- `fruit-mango`
- `fruit-kiwi`
- `fruit-cherry`
- `vegetables-carrot`
- `vegetables-broccoli`
- `vegetables-corn`
- `vegetables-potato`
- `vegetables-tomato`
- `vegetables-cucumber`
- `vegetables-pumpkin`
- `vegetables-onion`
- `vegetables-lettuce`
- `desserts-ice-cream`
- `desserts-cupcake`
- `desserts-chocolate-chip-cookie`
- `desserts-donut`
- `desserts-cheesecake`
- `desserts-apple-pie`
- `desserts-popsicle`
- `desserts-milkshake`
- `snacks-popcorn`
- `snacks-pretzel`
- `breakfast-pancakes`
- `breakfast-waffles`
- `breakfast-toast`
- `breakfast-bagel`
- `breakfast-omelet`
- `sports-basketball`
- `sports-baseball`
- `sports-football`
- `sports-tennis`
- `sports-swimming`
- `sports-hockey`
- `sports-volleyball`
- `sports-golf`
- `arcade-classics-frogger`
- `minecraft-bee-nest`
- `science-microscope`
- `science-magnet`
- `space-moon`
- `space-comet`
- `space-astronaut`
- `space-rocket`
- `space-black-hole`
- `space-telescope`
- `weather-rain`
- `weather-snow`
- `weather-rainbow`
- `weather-tornado`
- `weather-fog`
- `weather-wind`
- `weather-cloud`
- `books-dog-man`
- `myths-dragon`
- `myths-unicorn`
- `vehicles-car`
- `vehicles-bus`
- `vehicles-train`
- `vehicles-airplane`
- `vehicles-boat`
- `vehicles-bicycle`
- `vehicles-motorcycle`
- `vehicles-helicopter`
- `vehicles-submarine`
- `vehicles-scooter`
- `construction-crane`
- `construction-bulldozer`
- `construction-hard-hat`
- `jobs-firefighter`
- `jobs-astronaut`
- `music-instruments-guitar`
- `music-instruments-piano`
- `music-instruments-drums`
- `music-instruments-violin`
- `music-instruments-trumpet`
- `music-instruments-flute`
- `music-instruments-saxophone`
- `music-instruments-harp`
- `music-instruments-tambourine`
- `music-instruments-accordion`
- `art-supplies-paintbrush`
- `art-supplies-crayons`
- `art-supplies-markers`
- `art-supplies-glue`
- `art-supplies-palette`
- `art-supplies-sketchbook`
- `school-supplies-pencil`
- `school-supplies-backpack`
- `school-supplies-notebook`
- `school-supplies-eraser`
- `school-supplies-ruler`
- `school-supplies-glue-stick`
- `school-supplies-calculator`
- `school-supplies-binder`
- `school-supplies-lunchbox`
- `camping-tent`
- `camping-campfire`
- `camping-flashlight`
- `camping-compass`
- `camping-canoe`
- `camping-binoculars`
- `national-parks-glacier`
- `holidays-halloween`
- `holidays-christmas`
- `holidays-hanukkah`
- `halloween-jack-o-lantern`
- `halloween-ghost`
- `halloween-witch`
- `halloween-vampire`
- `halloween-black-cat`
- `winter-holidays-christmas-tree`
- `winter-holidays-snowman`
- `winter-holidays-menorah`
- `winter-holidays-ice-skating`
- `summer-fun-fireworks`
- `beach-day-seashell`
- `amusement-park-ferris-wheel`
- `around-the-house-sofa`
- `around-the-house-bed`
- `around-the-house-lamp`
- `around-the-house-washing-machine`
- `around-the-house-refrigerator`
- `around-the-house-doorbell`
- `kitchen-tools-measuring-cup`
- `kitchen-tools-blender`
- `kitchen-tools-colander`
- `kitchen-tools-can-opener`
- `emotions-angry`
- `emotions-surprised`
- `robots-robot`
- `robots-drone`
- `robots-rover`
- `robots-ai-assistant`
- `robots-robot-dog`
- `plants-sunflower`
- `plants-cactus`
- `plants-rose`
- `plants-mushroom`
- `plants-palm-tree`
- `plants-pumpkin-vine`

### Files Touched

- `AGENTS.md`
- `CLUE_AUDIT.md`
- `TASKS.md`
- `UPDATES.md`
- `src/data/answerEmojiBanlist.ts`
- `src/data/expandedPacks.ts`
- `src/data/puzzles.ts`
- `src/lib/clue-audit.test.ts`
- `src/lib/clue-audit.ts`

### Commit

- `22c231a`

## 2026-06-07 14:50 - Add Measurable Clue Audit Acceptance

### Changed

- Split the full-card clue audit plan into 19 concrete action items.
- Added measurable acceptance criteria to every plan item, including exact evidence requirements for baseline counts, category coverage, banlist behavior, leak tests, browser smoke, final source consistency, and GitHub Actions verification.
- Updated `TASKS.md` and `AGENTS.md` to note that clue-audit items must keep concrete acceptance evidence before they are marked complete.

### Why

- The clue audit needs to be executable and objectively verifiable across hundreds of cards. Broad items were split so each step has a clear completion signal before puzzle data changes begin.

### Evidence

- `python3` plan scan found `total=19 missing=0` for `###` plan items containing `**Measurable Acceptance**`.
- `rg` source inspection confirmed each action item has a measurable acceptance block.
- Documentation-only change; no app source or runtime behavior changed.

### Files Touched

- `AGENTS.md`
- `PLAN.md`
- `TASKS.md`
- `UPDATES.md`

### Commit

- `bd44693`

## 2026-06-07 14:39 - Add Card Clue Audit Plan

### Changed

- Replaced the completed code-review remediation `PLAN.md` with a new full-card clue audit plan.
- Added requirements to review every shipped card, build an answer emoji banlist, add direct-answer leak tests, create `CLUE_AUDIT.md`, and verify all categories.
- Updated `TASKS.md` and `AGENTS.md` with the new no-direct-answer-emoji card convention.

### Why

- Some puzzle clues give away the answer by including the answer's own emoji, such as `Whale` using `🐋`. The project needs a concrete all-category audit plan before editing hundreds of cards.

### Evidence

- Inspected current data sources: core cards in `src/data/puzzles.ts` and expanded pack cards in `src/data/expandedPacks.ts`.
- Confirmed the new plan explicitly covers known risky examples: `Whale`, `Fox`, `Elephant`, `Giraffe`, fruit answers, vegetable answers, and all categories in the shipped catalog.

### Files Touched

- `AGENTS.md`
- `PLAN.md`
- `TASKS.md`
- `UPDATES.md`

### Commit

- `f7a163a`

## 2026-06-07 14:13 - Add Literal Component Evidence

### Changed

- Added `jsdom` for lightweight component tests.
- Added a `LastCategoryLink` component test that sets valid and stale localStorage slugs, renders the component, and verifies stale slugs are cleared without rendering a dead link.
- Added an `EmojiClue` component test that removes `window.ResizeObserver`, renders the component, and verifies it stays no-wrap at the conservative fallback font size without throwing.
- Updated `PLAN.md` and `AGENTS.md` so the closure evidence names the new component tests.

### Why

- The verifier accepted the prior evidence in practice but noted two literal PLAN sub-bullets still wanted invalid localStorage render evidence and a missing-`ResizeObserver` render/snippet.

### Evidence

- `npm install -D jsdom` succeeded; npm still reports only the documented 2 moderate Next/PostCSS audit findings.
- `npm run test`: passed with 8 test files and 43 tests passing.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed and still reports `/play/[categorySlug]` as SSG with generated category paths.
- `docker build -t ghcr.io/hallveticapro/guessmoji:review .` passed.
- `npm audit --audit-level=moderate` remains nonzero with the documented 2 moderate Next/PostCSS findings; the offered fix would force a breaking downgrade to `next@9.3.3`.

### Files Touched

- `AGENTS.md`
- `PLAN.md`
- `UPDATES.md`
- `package.json`
- `package-lock.json`
- `src/components/categories/LastCategoryLink.test.tsx`
- `src/components/game/EmojiClue.test.tsx`

### Commit

- `fa39d21`

## 2026-06-07 14:10 - Harden Plan Closure Evidence

### Changed

- Added a tested last-category resolution helper for valid, invalid, and empty saved slugs.
- Added a shared timer coercion helper and used it for both settings input and saved timer preferences.
- Added a tested EmojiClue fitting helper for `ResizeObserver` support detection and font-size thresholds.
- Updated `PLAN.md` closure evidence for stale last-category handling, favicon head inspection, ResizeObserver fallback, and timer bounds behavior.
- Updated `AGENTS.md` with the new helper conventions and current Vitest coverage.

### Why

- The independent verifier found the remediation closure was mostly complete but weakly evidenced for invalid saved categories, favicon head inspection, ResizeObserver fallback, and timer edge cases.

### Evidence

- `npm run test`: passed with 6 test files and 40 tests passing.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- Final rerun of `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` passed after documentation updates; tests passed with 6 files and 40 tests.
- `npm run build` still reports `/play/[categorySlug]` as SSG with generated category paths.
- `npm run start -- --port 3002`: failed because port `3002` was already in use.
- `npm run start -- --port 3012`: started successfully for rendered head inspection, then was stopped with Ctrl-C.
- Rendered head inspection from `http://127.0.0.1:3012/` found five icon/manifest links: `/site.webmanifest`, `/favicon.ico`, `/favicon-96x96.png`, `/favicon.svg`, and `/apple-touch-icon.png`.
- The same head inspection reported `hasAppFaviconRoute: false`.
- `docker build -t ghcr.io/hallveticapro/guessmoji:review .` passed after the evidence-hardening changes.
- Production asset checks confirmed `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`, and `src/app/favicon.ico` are absent.
- Source checks still find no `force-dynamic`, `getPuzzleById`, `getShuffledPuzzles`, `DEFAULT_RANDOM_MIX_COUNT`, `requestAnimationFrame`, `useSyncExternalStore`, or compiled source `.js/.jsx` files.
- `npm audit --audit-level=moderate` remains nonzero with the documented 2 moderate Next/PostCSS findings; the offered fix would force a breaking downgrade to `next@9.3.3`.

### Files Touched

- `AGENTS.md`
- `PLAN.md`
- `UPDATES.md`
- `src/components/categories/LastCategoryLink.tsx`
- `src/components/categories/last-category.ts`
- `src/components/categories/last-category.test.ts`
- `src/components/game/EmojiClue.tsx`
- `src/components/game/emoji-fit.ts`
- `src/components/game/emoji-fit.test.ts`
- `src/components/game/GameControls.tsx`
- `src/components/game/timer.ts`
- `src/components/game/timer.test.ts`
- `src/components/game/useGameTimer.ts`

### Commit

- `3ad3afb`

## 2026-06-07 10:13 - Close Code Review Remediation Plan

### Changed

- Added final status evidence to `PLAN.md` for every `CODE_REVIEW.md` remediation row.
- Added a remediation status note to `CODE_REVIEW.md`.
- Updated project task and agent notes with the final remediation state and remaining audit deferral.

### Why

- The review remediation effort needs a durable closure record that names what was fixed, what was verified, and what remains deferred for a specific external reason.

### Evidence

- Local final gate from the remediation checkpoints: `npm run lint` passed, `npm run typecheck` passed on clean rerun, `npm run test` passed with 3 files and 27 tests, `npm run build` passed, and `docker build -t ghcr.io/hallveticapro/guessmoji:review .` passed.
- `npm audit --audit-level=moderate` remains nonzero with 2 moderate findings through Next's bundled `postcss <8.5.10`; no forced downgrade was applied.
- GitHub Actions run `27094924796`: passed in 1m20s after push to `main`, including Checkout, Install dependencies, Lint, Typecheck, Test, Set up Docker Buildx, Log in to GHCR, Extract metadata, and Build and maybe push.
- Browser smoke evidence is recorded in the 10:07 and 10:10 entries.
- Source architecture remains MVP-scoped: no login, accounts, database, Postgres, Redis, or multiplayer added.

### Files Touched

- `AGENTS.md`
- `CODE_REVIEW.md`
- `PLAN.md`
- `TASKS.md`
- `UPDATES.md`

### Commit

- `170707a098fd804e6f589e6a957ee098c4acd0d0`

## 2026-06-07 10:10 - Extract Shared Game UI Styles

### Changed

- Added small shared class helpers for repeated game cards and action buttons.
- Replaced repeated play-surface primary, secondary, quiet, and card class strings with the shared helpers.
- Updated agent notes with the new `src/components/ui` folder and convention.

### Why

- `PLAN.md` item 4.3 calls for extracting repeated UI styling primitives when a treatment appears in three or more places, while avoiding broad design-system work.

### Evidence

- `npm run lint`: passed.
- `npm run typecheck`: initially collided with a concurrent `next build` rewriting `.next/types`, then passed on clean rerun.
- `npm run test`: passed, 3 test files passed and 27 tests passed.
- `npm run build`: passed.
- Browser smoke on `http://localhost:3001`: home, categories, Random Mix play, and settings dialog rendered; Reveal/settings controls appeared; settings contained Apply, Off, Previous, Shuffle, Restart, Fullscreen, and Back to Categories; browser console had no warnings/errors.

### Files Touched

- `AGENTS.md`
- `UPDATES.md`
- `src/components/game/GameBoard.tsx`
- `src/components/game/GameControls.tsx`
- `src/components/ui/styles.ts`

### Commit

- `e7563c47222578e493fb864ed2150d51a6315b6b`

## 2026-06-07 10:07 - Apply Review Remediation Batch One

### Changed

- Aligned keyboard shortcuts with the README contract and added unit tests for shortcut action mapping.
- Made `/play/[categorySlug]` statically generated with client-side shuffle on category start, restart, and shuffle.
- Added a public URL helper with tests and removed the hard-coded live URL metadata fallback.
- Added CI install, lint, typecheck, and test steps before Docker build/publish.
- Removed generic reveal fallback copy and added broader puzzle/category integrity tests.
- Simplified stale last-category behavior to render only valid saved categories.
- Surfaced category grade bands and color themes on home/category cards.
- Removed duplicate App Router favicon and unused starter SVG/style placeholder files.
- Added a 512px runtime logo and used it for small shell/home logo placements.
- Extracted game timer, fullscreen, last-category persistence, and keyboard action logic out of `GameBoard`.
- Made the settings timer input controlled, added Enter-to-apply behavior, and added settings dialog focus trapping/body scroll lock.
- Hardened `EmojiClue` for browsers without `ResizeObserver`.
- Replaced the About modal close `x` with an intentional close glyph while preserving the accessible label.
- Disabled TypeScript `allowJs`.

### Why

- These changes resolve the first large batch of `CODE_REVIEW.md` findings while preserving the static, database-free MVP game flow.

### Evidence

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run test`: passed, 3 test files passed and 27 tests passed.
- `npm run build`: passed; `/play/[categorySlug]` is now `● (SSG)` with generated category paths.
- `NEXT_PUBLIC_APP_URL='   ' npm run build`: passed.
- `NEXT_PUBLIC_APP_URL='guessmoji.example.com' npm run build`: passed.
- `NEXT_PUBLIC_APP_URL='https://guessmoji.example.com' npm run build`: passed.
- `docker build -t ghcr.io/hallveticapro/guessmoji:review .`: passed.
- `npm audit --audit-level=moderate`: still exits nonzero with 2 moderate findings through Next's bundled `postcss <8.5.10`; no safe compatible fix was applied because `npm audit fix --force` would install `next@9.3.3`.
- `rg "force-dynamic|getPuzzleById|getShuffledPuzzles|DEFAULT_RANDOM_MIX_COUNT|requestAnimationFrame|useSyncExternalStore" src`: no matches.
- `find src -name '*.js' -o -name '*.jsx'`: no compiled source JavaScript files found.
- Browser smoke on `http://localhost:3001`: home, categories, Pixar, and Random Mix loaded; Reveal showed the answer; Space hid the answer; ArrowRight advanced; ArrowLeft returned; H toggled hint; Escape hid the hint; settings opened with focus inside the dialog; Tab and Shift+Tab stayed inside the dialog; timer Enter applied `15s`; Escape closed settings and restored focus to the gear button; Shuffle and Restart changed card order; mobile 360px emoji clue stayed `nowrap` on one line with `52px` font size; browser console had no warnings/errors.
- Browser smoke confirmed the valid last-category link appears after playing Pixar and points to `/play/pixar`.
- Browser smoke confirmed category cards show grade bands and themed icon styles.
- Browser smoke confirmed home logo and About modal embed image loaded; About close button has `aria-label="Close about dialog"` and click closes the modal.
- Image measurements: `guessmoji-logo.png` is 1254x1254 / 852K, `guessmoji-logo-512.png` is 512x512 / 260K, `guessmoji-embed.png` is 1733x907 / 656K, favicon PNG/ICO assets remain smaller public browser assets.
- `GameBoard.tsx` reduced from 431 lines to 354 lines after extracting hooks/helpers.

### Remaining

- The next pushed GitHub Actions workflow run still needs remote confirmation.
- The invalid stale last-category localStorage case is source-verified but not browser-mutated in this session because the in-app browser evaluate scope is read-only.
- `PLAN.md` item 4.3 still needs either a shared styling primitive extraction or a documented no-extraction decision.
- `PLAN.md` final closure still needs an explicit final status pass across the coverage map.

### Files Touched

- `.github/workflows/docker-publish.yml`
- `AGENTS.md`
- `README.md`
- `TASKS.md`
- `UPDATES.md`
- `public/assets/guessmoji-logo-512.png`
- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`
- `src/app/categories/page.tsx`
- `src/app/favicon.ico`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/play/[categorySlug]/page.tsx`
- `src/components/categories/LastCategoryLink.tsx`
- `src/components/game/EmojiClue.tsx`
- `src/components/game/GameBoard.tsx`
- `src/components/game/GameControls.tsx`
- `src/components/game/keyboard.ts`
- `src/components/game/keyboard.test.ts`
- `src/components/game/useFullscreenMode.ts`
- `src/components/game/useGameTimer.ts`
- `src/components/game/useLastCategoryPersistence.ts`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/InfoModal.tsx`
- `src/data/puzzles.ts`
- `src/lib/category-theme.ts`
- `src/lib/public-url.ts`
- `src/lib/public-url.test.ts`
- `src/lib/puzzles.ts`
- `src/lib/puzzles.test.ts`
- `src/styles/.gitkeep`
- `tsconfig.json`

### Commit

- `ec34ad82516f3b67ff4b65a6e9a709d6fb0f591b`

## 2026-06-07 09:47 - Capture Phase 0 Baseline Evidence

### Changed

- Recorded the Phase 0 baseline command gate required by `PLAN.md`.
- Added the reusable manual browser smoke checklist for future gameplay and UI verification.

### Why

- `PLAN.md` requires objective evidence before implementation phases begin, and future manual smoke checks need a named checklist to reference.

### Evidence

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run test`: passed, 1 test file passed and 11 tests passed.
- `npm run build`: passed; Next.js built successfully.
- `npm audit --audit-level=moderate`: blocked by known upstream Next/PostCSS audit finding, 2 moderate vulnerabilities via `postcss <8.5.10`; the offered `npm audit fix --force` would install `next@9.3.3`, a breaking downgrade, so no forced fix was applied.

### Manual Browser Smoke Checklist

- Home loads.
- Categories load.
- Random Mix starts.
- One non-random category starts.
- Hint toggles.
- Answer reveals.
- Answer hides.
- Next advances.
- Previous moves back.
- Shuffle changes order.
- Restart resets progress.
- Settings opens.
- Settings traps focus.
- Timer applies.
- Fullscreen toggles or reports unsupported.
- Emoji clue stays one line at mobile width.

### Files Touched

- `UPDATES.md`

### Commit

- `626c4c7035a8184fdcf58cf6a04469c20b04ee43`

## 2026-06-07 09:46 - Remove Out-Of-Scope Clue Audit Note

### Changed

- Removed an AGENTS note for the old direct-answer clue audit that is not part of the current CODE_REVIEW remediation plan.

### Why

- Persistent agent notes should match the measurable PLAN scope and avoid adding unrequested review work.

### Files Touched

- `AGENTS.md`
- `UPDATES.md`

### Commit

- `96250c82ebeebbaf7cdbd633dfb5869bb48e33b0`

## 2026-06-07 09:33 - Add Measurable Plan Acceptance

### Changed

- Added measurable acceptance evidence for every PLAN item.
- Split broad plan items where needed so each item can be verified by tests, commands, source inspection, browser smoke notes, or documented deferral evidence.
- Updated persistent project notes to point future remediation work at the measurable PLAN criteria.

### Why

- The remediation plan should be actionable and auditable, with each item closable by concrete evidence instead of subjective completion.

### Files Touched

- `AGENTS.md`
- `PLAN.md`
- `TASKS.md`
- `UPDATES.md`

### Commit

- `d8848d335fc578b6b1eb1ddd5b9a8ff90741c440`

## 2026-06-07 09:31 - Scope Review Plan To Code Review Items

### Changed

- Removed a non-review direct-answer emoji audit item from `PLAN.md`.
- Updated TASKS, AGENTS, and the prior update entry so the remediation plan clearly maps to `CODE_REVIEW.md`.

### Why

- The requested plan should resolve the action items in `CODE_REVIEW.md` without adding unrelated scope.

### Files Touched

- `AGENTS.md`
- `PLAN.md`
- `TASKS.md`
- `UPDATES.md`

### Commit

- `14a65f1e3ec4a9a9aa073a327cdfc28aff55f359`

## 2026-06-07 09:21 - Add Review Remediation Plan

### Changed

- Added a concrete remediation plan for all CODE_REVIEW action items.
- Documented the new plan artifact in persistent project notes.

### Why

- The review backlog needs an implementation roadmap with clear ordering, acceptance criteria, validation steps, and documentation checkpoints.

### Files Touched

- `AGENTS.md`
- `PLAN.md`
- `TASKS.md`
- `UPDATES.md`

### Commit

- `521bc590ab25eb9c7cff574899269b31d04a24f3`

## 2026-06-06 22:21 - Refine Code Review Report

### Changed

- Tightened the code review report with browser-smoke evidence for the settings dialog focus bug.
- Clarified public URL metadata risks, timer preference naming, generic reveal fallback wording, and duplicate answer data findings.
- Added `getPuzzleById` to the redundancy review notes because it has no production callers.

### Why

- The review report should be precise enough to use as a backlog without rediscovering the same evidence.

### Files Touched

- `CODE_REVIEW.md`
- `UPDATES.md`

### Commit

- `1c7be96`

## 2026-06-06 22:15 - Add Comprehensive Code Review Report

### Changed

- Added a prioritized code review report covering correctness, UX, redundancy, refactoring, performance, security, and maintainability findings.
- Recorded the review backlog location in TASKS and the top-level project map in AGENTS.

### Why

- The project needed a durable, actionable review artifact that future cleanup work can follow without redoing the full codebase audit.

### Files Touched

- `AGENTS.md`
- `CODE_REVIEW.md`
- `TASKS.md`
- `UPDATES.md`

### Commit

- `440d77540ca7b35229608fbe490d7654427b5af7`

## 2026-06-06 12:39 - Fit Emoji Clues On Small Screens

### Changed

- Added a fitted emoji clue component that keeps puzzle emoji strings on one line.
- Replaced the static responsive emoji text in the game board with the fitted clue component.
- Documented that emoji clues should shrink to fit instead of wrapping on smaller screens.

### Why

- Long emoji clues should remain readable as a single clue on phones and narrow displays rather than wrapping into multiple rows.

### Files Touched

- `AGENTS.md`
- `TASKS.md`
- `UPDATES.md`
- `src/components/game/EmojiClue.tsx`
- `src/components/game/GameBoard.tsx`

### Commit

- `0a35baeb198bb347692e8c100658fd9a5a738fc6`

## 2026-06-06 11:45 - Round Favicons And Shuffle Category Starts

### Changed

- Regenerated browser favicon PNGs, web app icons, Apple touch icon, ICO, and SVG favicon with rounded corners.
- Updated category play so non-random categories receive a fresh shuffled puzzle order each time the play route starts.
- Updated restart behavior to start a new shuffled order instead of restoring the original seed order.
- Removed references to a stored shuffle preference from current README, TASKS, and AGENTS notes.

### Why

- Browser-facing icons should match the rounded visual style, and category play should feel fresh every time instead of always starting from the same first card.

### Files Touched

- `README.md`
- `TASKS.md`
- `AGENTS.md`
- `UPDATES.md`
- `public/apple-touch-icon.png`
- `public/favicon-96x96.png`
- `public/favicon.ico`
- `public/favicon.svg`
- `public/web-app-manifest-192x192.png`
- `public/web-app-manifest-512x512.png`
- `src/app/play/[categorySlug]/page.tsx`
- `src/components/game/GameBoard.tsx`

### Commit

- `ab2df9dd6b1c3012d4fed6cf51e54562edf6660b`

## 2026-06-06 11:24 - Refresh Branding, Board Style, And README

### Changed

- Optimized and moved the Guessmoji logo, favicon master, embed image, favicon bundle, and web manifest into public asset locations.
- Wired favicon, Apple touch icon, manifest, Open Graph, and Twitter metadata to the new assets.
- Restyled the app shell, home logo, gameboard, answer reveal, progress indicator, and host controls with a warm shared-screen card style.
- Rebuilt the About modal with the embed banner, game description, support callout, social icon buttons, and requested copyright copy.
- Added explicit details and fun facts for the original 100 entertainment puzzles and added a test that blocks generic fallback reveal facts.
- Replaced the README with a neutral/generic deployment guide that uses placeholder repository, image, and public URL values.
- Updated TASKS and AGENTS notes for current assets, design direction, puzzle metadata expectations, and README rules.

### Why

- The app needed polished public branding, a warmer gameboard style, more specific reveal metadata, and a README that is useful for public readers without including personal deployment details.

### Files Touched

- `README.md`
- `TASKS.md`
- `AGENTS.md`
- `UPDATES.md`
- `public/assets/guessmoji-logo.png`
- `public/assets/guessmoji-favicon-master.png`
- `public/assets/guessmoji-embed.png`
- `public/apple-touch-icon.png`
- `public/favicon-96x96.png`
- `public/favicon.ico`
- `public/favicon.svg`
- `public/site.webmanifest`
- `public/web-app-manifest-192x192.png`
- `public/web-app-manifest-512x512.png`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/game/AnswerReveal.tsx`
- `src/components/game/GameBoard.tsx`
- `src/components/game/GameControls.tsx`
- `src/components/game/ProgressIndicator.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/InfoModal.tsx`
- `src/data/puzzles.ts`
- `src/lib/puzzles.test.ts`

### Commit

- `0822763ae12b3a34a286382c512198e3214b5f41`

## 2026-06-05 10:20 - Expand Catalog And Simplify Play Flow

### Changed

- Added 50 new themed categories and 500 generated puzzle cards.
- Added puzzle reveal details and ensured every puzzle has hint, details, and fun fact content.
- Reworked the play screen around one large emoji card, pre-reveal Hint/Reveal buttons, post-reveal Next/Finish, and category completion actions.
- Moved timer and secondary game controls into a settings dialog behind a gear button.
- Added a site information modal with live site, repository, social, and support links.
- Removed classroom-only wording from visible app copy.
- Reorganized README with a Table of Contents, section dividers, expanded status, category list, and neutral deployment placeholders.
- Updated TASKS and AGENTS notes for the expanded catalog, general-purpose site framing, and current game-flow conventions.

### Why

- The app needed a broader content catalog, clearer group-play framing, a better hint/reveal flow, and more organized public documentation.

### Files Touched

- `README.md`
- `TASKS.md`
- `AGENTS.md`
- `UPDATES.md`
- `src/app/categories/page.tsx`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/play/[categorySlug]/page.tsx`
- `src/components/categories/LastCategoryLink.tsx`
- `src/components/game/AnswerReveal.tsx`
- `src/components/game/GameBoard.tsx`
- `src/components/game/GameControls.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/InfoModal.tsx`
- `src/data/categories.ts`
- `src/data/expandedPacks.ts`
- `src/data/puzzles.ts`
- `src/lib/puzzles.test.ts`
- `src/types/puzzle.ts`

### Commit

- `22a69b4a3c0e386477a9874fb98e9c894ea83837`

## 2026-06-04 21:20 - Scaffold Next.js App

### Changed

- Generated a Next.js app with TypeScript, Tailwind CSS, ESLint, App Router, and a `src` directory.
- Preserved the existing project documentation while copying generated app files from a temporary scaffold directory.
- Renamed the package to `guessmoji`.
- Added placeholder source folders required by the project plan.
- Updated README and AGENTS notes for the scaffolded stack.

### Why

- Task 2 requires a modern TypeScript web stack before puzzle data and game UI can be built.

### Files Touched

- `package.json`
- `package-lock.json`
- `eslint.config.mjs`
- `next.config.ts`
- `postcss.config.mjs`
- `tsconfig.json`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/components/.gitkeep`
- `src/data/.gitkeep`
- `src/lib/.gitkeep`
- `src/styles/.gitkeep`
- `src/types/.gitkeep`
- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`
- `.gitignore`
- `README.md`
- `AGENTS.md`
- `TASKS.md`

### Commit

- `a6ebef983b41e89b3eff57d8533e57d7aeba8073`

## 2026-06-04 21:22 - Add Puzzle Types

### Changed

- Added shared TypeScript types for puzzle difficulty, puzzle entries, and categories.
- Updated agent data model notes to point future work at `src/types/puzzle.ts`.
- Marked the puzzle type task complete in `TASKS.md`.

### Why

- Categories, seed data, utilities, tests, and game UI need a stable model before implementation continues.

### Files Touched

- `src/types/puzzle.ts`
- `src/types/.gitkeep`
- `AGENTS.md`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `63d775405f924c8baa842ac2acb26f1d151e429e`

## 2026-06-04 21:23 - Add Seed Categories

### Changed

- Added the initial typed category catalog with the ten required MVP category slugs.
- Removed the data directory placeholder.
- Updated README and AGENTS data notes to reflect the seeded categories.
- Marked the seed category task complete in `TASKS.md`.

### Why

- The category selection page, puzzle data, and Random Mix mode need a shared category source.

### Files Touched

- `src/data/categories.ts`
- `src/data/.gitkeep`
- `README.md`
- `AGENTS.md`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `2e2e2fa69d8c27da75dc9e811fc7159680ddcdab`

## 2026-06-04 21:25 - Add Initial Puzzle Seed Data

### Changed

- Added 100 typed classroom-safe emoji puzzles across the initial playable categories.
- Kept Random Mix as a derived mode instead of duplicating puzzle entries under `random-mix`.
- Updated README and AGENTS notes with current puzzle data status.
- Marked the seed puzzle task complete in `TASKS.md`.

### Why

- The MVP requires at least 100 classroom-appropriate puzzles before the game flow can be meaningfully built and tested.

### Files Touched

- `src/data/puzzles.ts`
- `README.md`
- `AGENTS.md`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `6c42e767aeafa75d8601a2f0e9948f1a1ddd7f21`

## 2026-06-04 21:32 - Add Puzzle Utility Functions

### Changed

- Added category lookup, puzzle lookup, category filtering, shuffle, and Random Mix utility functions.
- Ensured Random Mix deduplicates by puzzle id and excludes the `random-mix` category id.
- Removed the lib directory placeholder.
- Updated AGENTS and TASKS notes for the utility layer.

### Why

- The UI needs safe, reusable data access before category and game pages are built.

### Files Touched

- `src/lib/puzzles.ts`
- `src/lib/.gitkeep`
- `AGENTS.md`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `e75bc6799483b8541b63c8dcaec8a3c3f143dc05`

## 2026-06-04 21:34 - Add App Shell And Navigation

### Changed

- Added a reusable app shell with header, footer, title link, and category navigation.
- Updated site metadata for Guessmoji.
- Replaced the generated Next.js starter page with a simple Guessmoji entry screen.
- Removed the components directory placeholder.
- Marked the app shell task complete in `TASKS.md`.

### Why

- The app needs stable navigation and layout before home, category, and play screens are expanded.

### Files Touched

- `src/components/layout/AppShell.tsx`
- `src/components/.gitkeep`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `9711f34baa0139f1ab2c0fcd170cdf833b0dfb3d`

## 2026-06-04 21:38 - Build Home Page

### Changed

- Expanded the home page with a brand-first Guessmoji hero, primary start action, and all-categories action.
- Added a simple three-step teacher flow.
- Added featured category preview cards with puzzle counts and play links.
- Marked the home page task complete in `TASKS.md`.

### Why

- Teachers need a clear, classroom-friendly entry point before choosing categories or starting presentation mode.

### Files Touched

- `src/app/page.tsx`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `e9c4222dcb690d2fd6df1b7913742dbb8acdb9db`

## 2026-06-04 21:41 - Build Category Selection Page

### Changed

- Added the `/categories` route with responsive category cards.
- Displayed category name, description, icon, puzzle count, grade band, difficulty label, and start link.
- Included Random Mix as a 20-puzzle session drawn from the wider puzzle pool.
- Marked the category selection task complete in `TASKS.md`.

### Why

- Teachers need a clear category picker before starting classroom presentation mode.

### Files Touched

- `src/app/categories/page.tsx`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `4f16350fea850eb3db184c93a06665fddf280e7e`

## 2026-06-04 21:44 - Build Classroom Game Mode

### Changed

- Added `/play/[categorySlug]` with graceful missing and empty category states.
- Added client-side game board state for reveal, hide, next, previous, shuffle, and restart.
- Added answer reveal, teacher controls, and progress indicator components.
- Kept Random Mix category metadata hidden until the answer reveal.
- Marked the classroom game mode task complete in `TASKS.md`.

### Why

- The MVP depends on a projector-friendly play screen where teachers can run the core emoji guessing flow.

### Files Touched

- `src/app/play/[categorySlug]/page.tsx`
- `src/components/game/GameBoard.tsx`
- `src/components/game/GameControls.tsx`
- `src/components/game/AnswerReveal.tsx`
- `src/components/game/ProgressIndicator.tsx`
- `README.md`
- `AGENTS.md`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `746959a90dc03d7e36a8edb295388b7cb04f54c9`

## 2026-06-04 21:48 - Add Classroom Keyboard Shortcuts

### Changed

- Added keyboard controls for reveal/hide, next, previous, shuffle, restart, fullscreen toggle, and Escape-to-hide.
- Ignored shortcuts while focus is inside editable fields.
- Marked the keyboard shortcut task complete in `TASKS.md`.

### Why

- Keyboard shortcuts make projector and smartboard play faster for teachers.

### Files Touched

- `src/components/game/GameBoard.tsx`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `8affab774cd8665ac1d80d88da0ba1eeaa26ab26`

## 2026-06-04 21:51 - Add Fullscreen Presentation Support

### Changed

- Added a fullscreen control to the game controls.
- Synced fullscreen state with the browser Fullscreen API.
- Reused the same graceful fullscreen toggle for the F key and the button.
- Marked the fullscreen support task complete in `TASKS.md`.

### Why

- Teachers need a quick presentation-friendly fullscreen option for projectors and smartboards.

### Files Touched

- `src/components/game/GameBoard.tsx`
- `src/components/game/GameControls.tsx`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `a4d6c337c38284b158f37c341b53a90747934438`

## 2026-06-04 21:53 - Persist Teacher Preferences Locally

### Changed

- Stored the last played category in localStorage when a game starts.
- Stored a safe shuffle preference flag when teachers shuffle or restart.
- Added a client-side continue-last-category prompt on the category page.
- Updated README, AGENTS, and TASKS notes for local preference behavior.

### Why

- Teachers should be able to return to the last category and keep lightweight preferences without login or a database.

### Files Touched

- `src/components/game/GameBoard.tsx`
- `src/components/categories/LastCategoryLink.tsx`
- `src/app/categories/page.tsx`
- `README.md`
- `AGENTS.md`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `df86892ed11a71abb4a63a10e0b0a921eb268d47`

## 2026-06-04 21:57 - Add Optional Classroom Timer

### Changed

- Added timer controls for no timer, 30 seconds, 60 seconds, and 90 seconds.
- Displayed remaining seconds in presentation mode when a timer is active.
- Reset the timer on puzzle changes, shuffle, restart, and timer changes.
- Stopped the timer when the teacher reveals the answer.
- Persisted the selected timer duration as a safe local preference.
- Updated README, AGENTS, and TASKS notes for timer behavior.

### Why

- Teachers may want a simple countdown for team guessing rounds without requiring accounts or server state.

### Files Touched

- `src/components/game/GameBoard.tsx`
- `src/components/game/GameControls.tsx`
- `README.md`
- `AGENTS.md`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `b2ded48b7c059e3553d66898dc37ec0df9994598`

## 2026-06-04 22:02 - Polish Classroom Presentation UI

### Changed

- Added reduced-motion handling for transitions and animations.
- Added print styles that hide controls, header, and footer for cleaner answer views.
- Marked game controls as print-hidden.
- Added selection styling and print-friendly game board color treatment.
- Marked the classroom UI polish task complete in `TASKS.md`.

### Why

- Presentation mode should be comfortable on projectors and useful for screenshots or printed answer views.

### Files Touched

- `src/app/globals.css`
- `src/components/game/GameBoard.tsx`
- `src/components/game/GameControls.tsx`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `93c9b41e03938a27531e602d692b56d0c2d5a455`

## 2026-06-04 22:03 - Add Production Dockerfile

### Changed

- Added a multi-stage Dockerfile using Node 22 Alpine and a non-root runtime user.
- Enabled Next.js standalone output for smaller production images.
- Added a `.dockerignore` to keep local dependencies, build artifacts, and env files out of the build context.
- Marked the Dockerfile task complete in `TASKS.md`.

### Why

- Guessmoji needs a production container image suitable for Unraid and GHCR publishing.

### Files Touched

- `Dockerfile`
- `.dockerignore`
- `next.config.ts`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `9a7266cb25ce9b7fc2cec4c0f84fe177612effe9`

## 2026-06-04 22:05 - Add Docker Compose Stack

### Changed

- Added a web-only `docker-compose.yml` for running Guessmoji from GHCR.
- Included safe environment defaults and port mapping through `APP_PORT`.
- Added commented local-build instructions.
- Marked the Docker Compose task complete in `TASKS.md`.

### Why

- Unraid and local Docker deployments need a simple compose stack for the MVP.

### Files Touched

- `docker-compose.yml`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `45a21d536c6e3dbd112aed8afca6d8902e79e3b3`

## 2026-06-04 22:07 - Add Environment Templates

### Changed

- Added `.env.example` with safe public defaults.
- Added a starter `.env` with the same safe local defaults.
- Updated README and AGENTS notes about environment files and secret handling.
- Marked the environment file task complete in `TASKS.md`.

### Why

- Docker Compose and Unraid deployments need predictable defaults without committing real secrets.

### Files Touched

- `.env.example`
- `.env`
- `README.md`
- `AGENTS.md`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `f946b0ce3a6ca86e6a258ea02c57b039b9a580b1`

## 2026-06-04 22:08 - Add GHCR Publishing Workflow

### Changed

- Added a GitHub Actions workflow to build and publish Docker images to GHCR.
- Configured latest, SHA, and semantic version tag metadata.
- Kept the image target set to the required `ghcr.io/adh1310/guessmoji` value.
- Updated README, AGENTS, and TASKS notes about the GHCR owner verification risk.

### Why

- The project needs automated container publishing for Unraid deployment and public image distribution.

### Files Touched

- `.github/workflows/docker-publish.yml`
- `README.md`
- `AGENTS.md`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `ad02c77264312399c78d18de1de59768a9a33ad7`

## 2026-06-04 22:10 - Add Unraid Deployment Instructions

### Changed

- Replaced placeholder Docker/Unraid README text with concrete compose deployment instructions.
- Documented container port, host port, reverse proxy, Arcane, and update commands.
- Added a note to verify GHCR package visibility after workflow publishing.
- Marked the Unraid deployment docs task complete in `TASKS.md`.

### Why

- Teachers and self-hosters need clear instructions for running Guessmoji on Unraid.

### Files Touched

- `README.md`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `d57525c81a4ae4a62d71bac53cb8efbc6f25af02`

## 2026-06-04 22:12 - Add Quality Check Scripts

### Changed

- Added `npm run typecheck` as a first-class package script.
- Updated README and AGENTS command notes for current quality scripts.
- Marked the quality scripts task complete in `TASKS.md`.

### Why

- The project workflow expects consistent lint, typecheck, and build commands before major commits.

### Files Touched

- `package.json`
- `README.md`
- `AGENTS.md`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `627e576e4c0d6c8174a95d11cd07188631c94cb1`

## 2026-06-04 22:14 - Add Puzzle Utility Tests

### Changed

- Installed Vitest.
- Added Vitest configuration for the `@/*` import alias.
- Added utility tests for category lookup, invalid slug handling, category puzzle filtering, puzzle lookup, Random Mix, and shuffling.
- Added `npm run test` and updated README/AGENTS command notes.
- Marked the test task complete in `TASKS.md`.

### Why

- The shared puzzle utilities drive core app behavior and need fast regression coverage.

### Files Touched

- `package.json`
- `package-lock.json`
- `vitest.config.ts`
- `src/lib/puzzles.test.ts`
- `README.md`
- `AGENTS.md`
- `UPDATES.md`
- `TASKS.md`

### Commit

- `25c36c413f928ea5a2f376cb28739d435d23e09f`

## 2026-06-04 22:22 - Verify MVP Build

### Changed

- Verified the Dockerized MVP with lint, typecheck, Vitest tests, production build, Docker image build, Docker Compose startup, `curl`, and browser smoke checks.
- Confirmed the browser flow for home, category selection, every category route, answer reveal/hide, next/previous, shuffle, restart, Random Mix, and fullscreen graceful handling.
- Updated README, AGENTS, and TASKS to reflect the implemented and locally verified MVP state.
- Recorded that live GHCR publish verification remains blocked until the `adh1310` owner mismatch is resolved.

### Why

- Task 24 requires a final MVP verification pass before pushing the completed checkpoint.

### Files Touched

- `README.md`
- `AGENTS.md`
- `TASKS.md`
- `UPDATES.md`

### Commit

- `f13fcdeaf3d9bcfe06775251cd9d84b98068243e`

## 2026-06-04 22:31 - Guard GHCR Publish Owner

### Changed

- Updated the GHCR workflow to build on this repository but only publish when the repository owner is `adh1310`.
- Added a workflow summary note when publishing is skipped on a non-canonical owner.
- Documented the failed GHCR push result: `denied: not_found: owner not found`.
- Updated README, AGENTS, and TASKS with the guarded publish behavior.

### Why

- The first pushed workflow run proved that `ghcr.io/adh1310/guessmoji` cannot be published from the current `hallveticapro` repository until the canonical owner is available.

### Files Touched

- `.github/workflows/docker-publish.yml`
- `README.md`
- `AGENTS.md`
- `TASKS.md`
- `UPDATES.md`

### Commit

- `5638e78e5d3e55d8dcbce1604ce5d2288f7e59df`

## 2026-06-05 00:00 - Align Canonical Repository Owner

### Changed

- Updated current repository and GHCR references to use `hallveticapro/guessmoji` and `ghcr.io/hallveticapro/guessmoji`.
- Updated the GitHub Actions workflow and Docker Compose image target for the clarified owner.
- Made the public README neutral and generic by removing owner-specific repository URLs, usernames, and deployment values.
- Updated AGENTS and TASKS with the clarified owner and README neutrality convention.

### Why

- The user clarified that the repository should be `hallveticapro/guessmoji` and that the README should not expose personal owner details.

### Files Touched

- `.github/workflows/docker-publish.yml`
- `docker-compose.yml`
- `README.md`
- `AGENTS.md`
- `TASKS.md`
- `UPDATES.md`

### Commit

- `053269f304e0a4aa26308861da9d1e93ffc0f731`

## 2026-06-05 09:42 - Verify GHCR Publish

### Changed

- Marked GHCR publishing and final MVP verification complete in TASKS.
- Updated AGENTS to note that the configured GHCR image is published and anonymously pullable.
- Recorded that the owner-aligned GitHub Actions workflow completed successfully.
- Verified anonymous GHCR manifest access for the `latest` image tag with HTTP 200.

### Why

- The MVP requires a public GHCR image, and the user clarified the canonical repository owner before final verification.

### Files Touched

- `AGENTS.md`
- `TASKS.md`
- `UPDATES.md`

### Commit

- `09a11fb86fe88e9fe653519e02912be9f105e89a`

## 2026-06-04 21:17 - Initialize Project Documentation

### Changed

- Created the initial public GitHub repository under the authenticated account.
- Added baseline README, agent instructions, update log, and git ignore rules.
- Recorded the `adh1310` owner mismatch discovered during repository creation.
- Marked the initial repository setup task complete in `TASKS.md`.

### Why

- The project requires persistent documentation files and a public repository before app scaffolding begins.

### Files Touched

- `README.md`
- `AGENTS.md`
- `UPDATES.md`
- `TASKS.md`
- `.gitignore`

### Commit

- `4c868730bfbb786e4e88e41ee97ef2f5841c29e9`
