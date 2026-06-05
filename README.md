# Guessmoji

Guessmoji is a classroom-friendly emoji Pictionary game for teachers. A teacher chooses a themed category, projects a large emoji clue, lets students guess, then reveals the answer.

Suggested classroom flow:

1. Pick a category.
2. Show the emoji clue on a projector or smartboard.
3. Let students guess out loud, on paper, or in teams.
4. Reveal the answer and move to the next puzzle.

## Current Status

This repository is in the app scaffold checkpoint. The MVP is a Dockerized Next.js, React, TypeScript, and Tailwind CSS app with static seed puzzle data and no database.

Public repository created for this workspace:

- [hallveticapro/guessmoji](https://github.com/hallveticapro/guessmoji)

Project target from `TASKS.md`:

- App display name: `Guessmoji`
- GHCR image target: `ghcr.io/adh1310/guessmoji`

Note: during repository creation on 2026-06-04, GitHub returned a 404 for the `adh1310` owner. The repo was created under the authenticated account, `hallveticapro`, so the GHCR owner target needs to be confirmed before the publishing workflow can be considered complete.

## Current Categories

The scaffolded category catalog includes:

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

After the Next.js scaffold is added, use:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

The scaffold currently provides `lint` and `build`. Typecheck and test scripts will be added during the quality and test tasks.

## Docker

Docker support is planned for the MVP. The target local command will be:

```bash
docker compose up -d --build
```

The production image target from `TASKS.md` is:

```txt
ghcr.io/adh1310/guessmoji
```

## Environment Variables

The starter environment files are planned in Task 19. Expected safe defaults:

```env
APP_PORT=3000
NEXT_PUBLIC_APP_NAME="Guessmoji"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

No secrets are required for the MVP.

## Unraid Deployment

Unraid deployment instructions will be finalized after the Dockerfile, compose stack, and GHCR workflow are in place.

Planned basics:

- Run the app as a single web container.
- Publish container port `3000`.
- No database is required for the MVP.
- The app can be proxied through NGINX Proxy Manager or a similar reverse proxy.
- Arcane can run the compose stack directly once `docker-compose.yml` exists.

Update command after deployment:

```bash
docker compose pull
docker compose up -d
```

## Known Limitations

- The web app is scaffolded but still shows the default generated home page.
- Puzzle seed data has not been added yet.
- Docker and GHCR publishing are not implemented yet.
- The canonical owner mismatch between `adh1310` and the authenticated GitHub account must be resolved before GHCR publishing can be verified.
