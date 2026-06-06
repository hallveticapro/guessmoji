# UPDATES.md

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
