# AGENTS.md

## App Overview

Guessmoji is a group-friendly emoji Pictionary game. A host selects a themed category, shows large emoji clues, lets players guess, then reveals answers on a shared screen.

`TASKS.md` is the authoritative project plan. Keep it current when scope or task status changes.

## Current Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- Vitest
- Static local seed data
- Docker
- GitHub Actions
- GHCR image publishing

The MVP must not require login, accounts, multiplayer, Redis, Postgres, or any database.

## Repository And Deployment

- Canonical repo: `https://github.com/hallveticapro/guessmoji`
- Live URL: `https://guessmoji.mrhallsclass.com/`
- Canonical image: `ghcr.io/hallveticapro/guessmoji`
- GitHub Actions publishes to GHCR only in the canonical repository.
- Keep `README.md` generic: no live URL, personal usernames, profile URLs, or owner-specific deployment values.
- README examples should use placeholders like `<github-owner>` and `https://guessmoji.example.com`.

## Project Structure

Source lives in `src/app`, `src/components`, `src/data`, `src/lib`, and `src/types`. Public assets live in `public/` and `public/assets/`.

Current routes:

- `/`
- `/categories`
- `/play/[categorySlug]`

## Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
docker build -t ghcr.io/hallveticapro/guessmoji:latest .
docker compose up -d
docker compose ps
```

## Workflow

1. Make focused changes.
2. Run lint, typecheck, tests, and build when practical.
3. Update `UPDATES.md` after meaningful changes.
4. Update `TASKS.md` when task status or scope changes.
5. Commit with a clear message.
6. Push useful milestones.

## Data Model

- `src/types/puzzle.ts`
- `src/data/categories.ts`
- `src/data/puzzles.ts`
- `src/data/expandedPacks.ts`
- `src/lib/puzzles.ts`
- `PuzzleDifficulty`: `easy`, `medium`, `hard`
- `Puzzle`: answer, emoji clue, category, difficulty, optional hint, details, explanation, fun fact, tags
- `Category`: id, name, slug, description, icon, theme, grade band

The shipped seed set has 600 puzzles across 60 categories, including Random Mix. Random Mix should pull from multiple safe categories and avoid duplicates.

Keep default puzzles broadly friendly, recognizable, and free of mature or horror content unless a future opt-in pack is explicitly added. Do not ship generic fallback reveal copy for default puzzles.

Future card additions must update `src/data/answerEmojiBanlist.ts` whenever an answer has a direct emoji representation. Run `src/lib/clue-audit.test.ts` before committing new or changed cards.

## Game Conventions

- Keep answers hidden until host action.
- Hint is separate from Reveal and should be available before reveal.
- Main play should emphasize one large emoji card with centered Hint, Reveal, and Next actions.
- Emoji clues should stay one line on small screens and shrink to fit.
- Put secondary controls in the settings dialog when practical.
- Hide Random Mix category metadata until answer reveal.
- Keep controls large, high-contrast, and keyboard accessible.
- Store only safe local browser preferences such as last category and timer length.
- Shuffle cards automatically on each category start and keep the Shuffle button available.
- Timer choices are local only and stop when an answer is revealed.

## Shared Helpers

- Timer bounds live in `src/components/game/timer.ts` and use the shared `0-999` second policy.
- Last-category saved-slug resolution lives in `src/components/categories/last-category.ts`; stale saved slugs should be hidden and cleared.
- Emoji clue fitting lives in `src/components/game/emoji-fit.ts`; browsers without `ResizeObserver` should keep a no-wrap fallback instead of throwing.
- Shared class helpers live in `src/components/ui/styles.ts`; keep them small and specific.

## Brand And Public Assets

Core assets are `public/assets/guessmoji-logo.png`, `public/assets/guessmoji-logo-512.png`, `public/assets/guessmoji-embed.png`, and `public/assets/guessmoji-favicon-master.png`. Root layout metadata should keep favicon, Apple touch icon, manifest, Open Graph, and Twitter image entries wired to public assets.

## Design Language

Guessmoji should feel like a friendly shared-screen game show plus a clean host tool:

- Big emoji clues
- Warm cream/mint background
- White game cards with soft teal borders
- Yellow primary actions and teal secondary controls
- High contrast and projector-friendly spacing
- Responsive across desktop, Chromebook, tablet, phone, projector, and smartboard
- Friendly, bright, and not visually chaotic

## Important Conventions

- Keep the app display name `Guessmoji`.
- Keep the repository name `guessmoji`.
- Do not commit real secrets.
- `.env` is intentionally committed with safe starter values; future secret-bearing values must not be committed.
- Do not add login, accounts, a database, or multiplayer until the core app is stable.
- Prefer established project patterns over new abstractions.

## Updating UPDATES.md

Use one line per meaningful change:

```txt
YYYY-MM-DD HH:mm: Short description of what changed.
```

## Known Limitations

- GHCR image is published and anonymously pullable at the configured package path.
- If the repository owner changes, update `.github/workflows/docker-publish.yml`, `docker-compose.yml`, `TASKS.md`, and this file together. Keep `README.md` generic.
- `npm audit` reports two moderate findings from Next's bundled PostCSS dependency; the forced fix would downgrade Next to `9.3.3`, so this is an upstream-only deferral.
- GitHub Actions currently emits known Node.js 20 deprecation annotations for several third-party actions; watch for upstream Node.js 24-compatible updates.
