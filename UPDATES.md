# UPDATES.md

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

- pending

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
