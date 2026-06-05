# Guessmoji

Guessmoji is a classroom-friendly emoji Pictionary game for teachers. A teacher chooses a themed category, projects a large emoji clue, lets students guess, then reveals the answer.

Suggested classroom flow:

1. Pick a category.
2. Show the emoji clue on a projector or smartboard.
3. Let students guess out loud, on paper, or in teams.
4. Reveal the answer and move to the next puzzle.

## Current Status

This repository is at the MVP verification checkpoint. Guessmoji is a Dockerized Next.js, React, TypeScript, and Tailwind CSS app with static seed puzzle data, no database, and a projector-friendly classroom game flow.

Local MVP verification has passed with lint, typecheck, Vitest utility tests, production build, Docker image build, Docker Compose startup, `curl`, and an in-browser smoke test against the Docker container.

Public repository created for this workspace:

- [hallveticapro/guessmoji](https://github.com/hallveticapro/guessmoji)

Project target from `TASKS.md`:

- App display name: `Guessmoji`
- GHCR image target: `ghcr.io/adh1310/guessmoji`

Note: during repository creation on 2026-06-04, GitHub returned a 404 for the `adh1310` owner. The repo was created under the authenticated account, `hallveticapro`, while the GHCR workflow still targets the required `ghcr.io/adh1310/guessmoji` image. Confirm the intended owner before live GHCR publishing can be verified.

## Current Categories

The category catalog includes:

- Disney Movies
- Disney Princesses
- Pixar
- Marvel
- Star Wars
- DreamWorks
- Video Game Movies
- Kid TV Shows
- Animated Classics
- Random Mix

Additional classroom-safe packs are planned for holidays, animals, books, science, and math after the core game is stable.

## Current Puzzle Data

The MVP seed data currently includes 100 classroom-appropriate puzzles across the playable themed categories. Random Mix will derive a shuffled set from these puzzles rather than storing duplicate Random Mix entries.

## Local Development

Run the local development server:

```bash
npm install
npm run dev
```

Then open:

```txt
http://localhost:3000
```

## Quality Checks

Use:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Tests currently cover puzzle/category utilities.

## Docker

Run the compose stack with the published image:

```bash
docker compose up -d
```

Build locally instead of pulling GHCR:

```bash
docker build -t ghcr.io/adh1310/guessmoji:latest .
docker compose up -d
```

The production image target is:

```txt
ghcr.io/adh1310/guessmoji:latest
```

To update the container after a new image is published:

```bash
docker compose pull
docker compose up -d
```

## Environment Variables

The committed starter environment files contain safe local defaults only:

```env
APP_PORT=3000
NEXT_PUBLIC_APP_NAME="Guessmoji"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

No secrets are required for the MVP.

## Unraid Deployment

Guessmoji can run on Unraid as a single Docker Compose stack. No database, Redis, login service, or external storage is required for the MVP.

### Docker Compose Stack

Use this stack in Unraid, Arcane, or another compose manager:

```yaml
services:
  guessmoji:
    image: ghcr.io/adh1310/guessmoji:latest
    container_name: guessmoji
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_APP_NAME: "Guessmoji"
      NEXT_PUBLIC_APP_URL: "http://localhost:3000"
```

### Configuration

- Container port: `3000`
- Host port: choose any open Unraid port, commonly `3000`
- `NEXT_PUBLIC_APP_URL`: set this to the URL teachers will use, such as `https://guessmoji.example.com`
- Reverse proxy: NGINX Proxy Manager, SWAG, Traefik, or another Unraid-friendly proxy can forward to container port `3000`
- Arcane: can run the compose stack directly

### Updating

```bash
docker compose pull
docker compose up -d
```

If the GHCR package is not visible yet, confirm that the GitHub Actions workflow has published successfully and that the package visibility is public.

## Known Limitations

- The home page, category selection page, core presentation game mode, keyboard shortcuts, fullscreen control, optional timer, and basic local preferences are implemented.
- Docker, Docker Compose, and Unraid documentation are implemented and locally verified.
- The canonical owner mismatch between `adh1310` and the authenticated GitHub account must be resolved before live GHCR publishing and public package visibility can be verified.
- `npm` currently reports two moderate dependency audit findings from the scaffolded dependency tree; no runtime secrets are required or committed for the MVP.
