# AGENTS.md

## App Overview

Guessmoji is a classroom emoji Pictionary game. Teachers select a themed category, display large emoji clues, let students guess, and reveal answers on a projector or smartboard.

`TASKS.md` is the authoritative project plan. Keep it current as work is completed or adjusted.

## Current Stack

Current phase: Next.js app scaffold initialized.

Current MVP stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint

Planned additions:

- Static local seed data
- Vitest for utility tests
- Docker
- GitHub Actions
- GHCR image publishing

The MVP must not require login, accounts, multiplayer, Redis, Postgres, or any database.

## Repository

- Public repo created in this session: `https://github.com/hallveticapro/guessmoji`
- Required image target from `TASKS.md`: `ghcr.io/adh1310/guessmoji`
- Important note: `gh repo create adh1310/guessmoji` failed because GitHub returned 404 for owner `adh1310`. Confirm the intended owner before final GHCR verification.

## Folder Structure

Current:

```txt
.
├── AGENTS.md
├── README.md
├── TASKS.md
├── UPDATES.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── lib/
│   ├── styles/
│   └── types/
└── tsconfig.json
```

Expected source layout:

```txt
src/
  app/
  components/
  data/
  lib/
  styles/
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

Available after Docker tasks are complete:

```bash
docker compose up -d --build
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
- `Puzzle`: answer, emoji clue, category, difficulty, optional hint, explanation, fun fact, and tags
- `Category`: id, name, slug, description, icon, theme, and grade band

Random Mix should pull from multiple classroom-safe categories and avoid duplicates.

The current seed set includes 100 puzzles. Keep new default puzzles elementary-classroom safe, broadly recognizable, and free of mature or horror content unless a future opt-in pack is explicitly added.

## Design Language

Guessmoji should feel like a classroom game show plus a clean teacher tool:

- Big emoji clues
- High contrast
- Large readable controls
- Projector-friendly spacing
- Simple navigation
- Friendly, bright, and not visually chaotic
- Responsive across desktop, Chromebook, tablet, phone, and smartboard

Game mode conventions:

- Keep answers hidden until teacher action.
- Hide Random Mix puzzle category metadata until answer reveal.
- Keep projector controls large, high-contrast, and keyboard accessible.

## Important Conventions

- Keep the app display name as `Guessmoji`.
- Keep the repository name lowercase: `guessmoji`.
- Do not commit real secrets.
- Use safe starter environment defaults only.
- Prioritize the MVP game flow before advanced features.
- Keep all default puzzles elementary-classroom appropriate.
- Do not add login, accounts, a database, or multiplayer until the core app is stable.
- Prefer established project patterns over new abstractions.

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

- The app scaffold is not created yet.
- No puzzle data exists yet.
- Docker and GHCR publishing are not implemented yet.
- The required `adh1310` GitHub/GHCR owner was not resolvable from this environment.
