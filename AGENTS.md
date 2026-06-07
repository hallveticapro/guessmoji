# AGENTS.md

## App Overview

Guessmoji is a group-friendly emoji Pictionary game. A host selects a themed category, displays large emoji clues, lets players guess, and reveals answers on a shared screen.

`TASKS.md` is the authoritative project plan. Keep it current as work is completed or adjusted.

## Current Stack

Current phase: MVP implemented and locally verified.

Current live URL: `https://guessmoji.mrhallsclass.com/`

Current MVP stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- Static local seed data
- Vitest for utility tests
- Docker
- GitHub Actions
- GHCR image publishing

The MVP must not require login, accounts, multiplayer, Redis, Postgres, or any database.

## Repository

- Public repo created in this session: `https://github.com/hallveticapro/guessmoji`
- Required image target from `TASKS.md`: `ghcr.io/hallveticapro/guessmoji`
- User clarified on 2026-06-05 that the canonical repository should be `hallveticapro/guessmoji`.
- The public README must stay neutral/generic and should not mention personal usernames, profile URLs, or owner-specific deployment values.
- The GitHub Actions workflow publishes to `ghcr.io/hallveticapro/guessmoji` when running in the canonical repository; forks/non-canonical owners build without publishing.
- The public README intentionally uses placeholder owner/image values and should not include the live URL or social/profile links.
- Public README examples should use placeholders such as `<github-owner>` and `https://guessmoji.example.com`.

## Folder Structure

Current:

```txt
.
├── AGENTS.md
├── CODE_REVIEW.md
├── PLAN.md
├── README.md
├── TASKS.md
├── UPDATES.md
├── docker-compose.yml
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public/
│   ├── assets/
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── favicon-96x96.png
│   └── site.webmanifest
├── src/
│   ├── app/
│   ├── components/
│   │   ├── categories/
│   │   ├── game/
│   │   ├── layout/
│   │   └── ui/
│   ├── data/
│   ├── lib/
│   └── types/
└── tsconfig.json
```

Expected source layout:

```txt
src/
  app/
  components/
    categories/
    game/
    layout/
    ui/
  data/
  lib/
  types/
```

Current routes:

- `/`
- `/categories`
- `/play/[categorySlug]`

## Commands

### Development

```bash
npm install
npm run dev
```

### Lint

```bash
npm run lint
```

### Typecheck

```bash
npm run typecheck
```

### Tests

```bash
npm run test
```

### Build

```bash
npm run build
```

### Docker

```bash
docker build -t ghcr.io/hallveticapro/guessmoji:latest .
docker compose up -d
docker compose ps
```

## Build And Deployment Workflow

1. Make a focused change.
2. Run formatting, lint, typecheck, tests, and build when those commands exist.
3. Update `UPDATES.md`.
4. Update `TASKS.md` if task status changed.
5. Commit with a clear message.
6. Push at useful milestones.

## Data Model Notes

The MVP data layer should be static TypeScript seed data. Expected types:

- `src/types/puzzle.ts`
- `src/data/categories.ts`
- `src/data/puzzles.ts`
- `src/lib/puzzles.ts`
- `PuzzleDifficulty`: `easy`, `medium`, `hard`
- `Puzzle`: answer, emoji clue, category, difficulty, optional hint, details, explanation, fun fact, and tags
- `Category`: id, name, slug, description, icon, theme, and grade band

Random Mix should pull from multiple safe categories and avoid duplicates.

The current seed set includes 600 puzzles across 60 categories, including Random Mix. Keep new default puzzles broadly friendly, recognizable, and free of mature or horror content unless a future opt-in pack is explicitly added.

The original 100 entertainment puzzles have explicit reveal `details` and `funFact` metadata in `src/data/puzzles.ts`. Do not ship generic fallback reveal copy such as pack labels or vague "emoji clues are quick to recognize" facts for default puzzles.

## Brand And Public Assets

Current public assets:

- Main logo: `public/assets/guessmoji-logo.png`
- Small runtime logo: `public/assets/guessmoji-logo-512.png`
- Social/embed image: `public/assets/guessmoji-embed.png`
- Favicon master copy: `public/assets/guessmoji-favicon-master.png`
- Favicons and manifest: `public/favicon-96x96.png`, `public/favicon.svg`, `public/favicon.ico`, `public/apple-touch-icon.png`, `public/site.webmanifest`

Root layout metadata should keep the favicon, Apple touch icon, manifest, Open Graph, and Twitter image entries wired to these files.

## Design Language

Guessmoji should feel like a friendly shared-screen game show plus a clean host tool:

- Big emoji clues
- High contrast
- Large readable controls
- Shared-screen friendly spacing
- Simple navigation
- Friendly, bright, and not visually chaotic
- Responsive across desktop, Chromebook, tablet, phone, projector, and smartboard

Current visual direction:

- Warm cream/mint shared-screen background instead of a black gameboard.
- White game cards with soft teal borders and gentle pressed shadows.
- Yellow primary actions and teal secondary controls.
- The logo should be visible in the app shell and home hero.
- About modal should start with the embed banner, then show About, support, social, and copyright sections.

Game mode conventions:

- Keep answers hidden until host action.
- Hint is a separate pre-reveal action and should be available before the answer is revealed.
- The main play screen should emphasize one large emoji card and centered Hint/Reveal/Next actions.
- Emoji clues should stay on one line on smaller screens and shrink to fit instead of wrapping.
- Secondary controls belong in the settings dialog behind the gear button when practical.
- Hide Random Mix puzzle category metadata until answer reveal.
- Keep shared-screen controls large, high-contrast, and keyboard accessible.
- Store only safe local browser preferences such as last category and timer length. Do not add accounts or server persistence for MVP.
- Shuffle cards automatically each time a category starts, and keep the Shuffle button available for an on-demand reshuffle.
- Timer choices are local-only and should stop when an answer is revealed.

## Important Conventions

- Keep the app display name as `Guessmoji`.
- Keep the repository name lowercase: `guessmoji`.
- Do not commit real secrets.
- Use safe starter environment defaults only.
- `.env` is intentionally committed with safe starter values for local/Unraid use. Future secret-bearing values must not be committed.
- Prioritize the MVP game flow before advanced features.
- Keep all default puzzles broadly friendly and safe.
- Do not add login, accounts, a database, or multiplayer until the core app is stable.
- Prefer established project patterns over new abstractions.
- Shared class helpers live in `src/components/ui/styles.ts`; keep them small and specific to repeated treatments that appear in multiple places.

## Updating UPDATES.md

Update `UPDATES.md` after every meaningful change using this format:

```md
## YYYY-MM-DD HH:mm - Short Change Title

### Changed

- Bullet list of what changed.

### Why

- Why this change was made.

### Files Touched

- `path/to/file`

### Commit

- Commit hash after commit is made, or `pending` before the commit exists.
```

Because a commit cannot include its own final hash in file contents, use `pending` while preparing the commit and update the prior entry when practical.

## Known Limitations

- The GHCR image is published and anonymously pullable at the configured package path as of 2026-06-05.
- If the repository owner changes later, update `.github/workflows/docker-publish.yml`, `docker-compose.yml`, `TASKS.md`, and internal agent notes together. Keep `README.md` generic.
- `npm` currently reports two moderate dependency audit findings from the scaffolded dependency tree.
