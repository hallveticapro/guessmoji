# TASKS.md

# Guessmoji — Project Tasks

## Project Summary

Build a classroom-friendly web app called **Guessmoji**.

Guessmoji is an emoji-based Pictionary / guessing game for classroom use. A teacher selects a category, displays emoji clues one at a time, lets students guess the answer, then reveals the correct answer.

The app should support many themed categories, including:

- Disney Movies
- Disney Princesses
- Pixar
- Marvel
- Star Wars
- DreamWorks
- Animated Classics
- Video Game Movies
- Kid TV Shows
- Holidays
- Animals
- Books
- Science
- Math
- Random Mix
- Future custom teacher-created packs

The first production target is a Dockerized web app that can run on **Unraid** and be deployed through a Docker stack. The app must also publish a public Docker image to **GHCR**.

---

# App Name and Repository

## Required App Name

```txt
Guessmoji
```

## Required GitHub Repository

Create a new **public** GitHub repository named:

```txt
guessmoji
```

Repo naming rules:

- Repository name must be lowercase.
- Spaces must be replaced with hyphens if the name ever changes.
- App display name must remain Title Case: **Guessmoji**.

## Required GHCR Image

The production Docker image should publish to:

```txt
ghcr.io/adh1310/guessmoji
```

---

# Non-Negotiable Workflow Rules

Codex must follow these rules throughout the entire project.

## Required Documentation Files

Create and maintain these files from the beginning:

```txt
README.md
AGENTS.md
UPDATES.md
TASKS.md
```

---

## README.md Requirements

The README must explain:

- What Guessmoji is.
- How to run it locally.
- How to run it with Docker.
- How to deploy it on Unraid.
- Required environment variables.
- How to update / pull the latest GHCR image.
- Basic usage instructions for teachers.
- Current feature status.
- The current puzzle category list.
- Any known limitations.

---

## AGENTS.md Requirements

`AGENTS.md` is the persistent knowledge file for future AI/coding agents.

It must include:

- App purpose.
- Current tech stack.
- Folder structure.
- Development commands.
- Docker commands.
- Testing commands.
- Build/deployment workflow.
- Data model notes.
- Current design language.
- Important conventions.
- Known limitations.
- Rules for updating `UPDATES.md` after every meaningful change.

---

## UPDATES.md Requirements

`UPDATES.md` must be updated after **every meaningful change**.

Each entry must use this format:

```md
## YYYY-MM-DD HH:mm - Short Change Title

### Changed

- Bullet list of what changed.

### Why

- Why this change was made.

### Files Touched

- `path/to/file`

### Commit

- Commit hash after commit is made.
```

If the commit hash is not known yet when writing the entry, add:

```txt
Commit: pending
```

Then update it after committing.

---

## TASKS.md Requirements

This file is the authoritative task plan.

When tasks are completed:

- Mark them complete.
- Add notes if implementation differs from the plan.
- Keep future tasks clear.
- Commit the updated file.

---

# Git and Commit Rules

After every completed task or meaningful checkpoint:

1. Run formatting.
2. Run linting.
3. Run typecheck.
4. Run tests if tests exist.
5. Build the app.
6. Update `UPDATES.md`.
7. Update `TASKS.md` if task status changed.
8. Commit changes.
9. Push when a useful milestone is complete.

Use clear checkpoint commit messages:

```txt
chore: initialize project documentation
feat: scaffold guessmoji app
feat: add puzzle data model and seed categories
feat: add classroom play mode
chore: add docker and ghcr workflow
docs: add unraid deployment instructions
```

Do not make one giant final commit.

---

# Recommended Tech Stack

Use a modern, maintainable stack that works well in Docker and on Unraid.

## Frontend / App

Use:

- Next.js
- React
- TypeScript
- Tailwind CSS
- App Router
- Server components where useful
- Client components for interactive game screens

## Data Layer

Start with local seed data in TypeScript or JSON so the app works immediately without a database.

The MVP should **not** require Postgres, Redis, or login.

Recommended progression:

1. MVP: static local puzzle packs.
2. Later: local browser-created packs.
3. Later: import/export JSON packs.
4. Later: Postgres for custom packs, saved games, teacher accounts, and student submissions.

Do not add a database before the main game is playable.

## UI

Use a clean classroom presentation style:

- Large emojis.
- Big readable text.
- High contrast.
- Simple controls.
- Works well on projector/smartboard.
- Works on desktop, tablet, and mobile.
- Minimal clutter.
- Fun but not visually chaotic.

Recommended styling:

- Tailwind CSS.
- Card-based layout.
- Rounded panels.
- Large emoji display.
- Playful but clean gradients.
- Accessible contrast.

## Testing

Add at minimum:

- ESLint.
- TypeScript checking.
- Basic utility tests for puzzle/category functions.
- Basic smoke test for app rendering if practical.

Recommended:

- Vitest for utility tests.
- Playwright later for end-to-end game flow tests.

---

# Core Product Requirements

## MVP Features

The first version must include the following.

---

## 1. Home Page

Create a polished landing page for **Guessmoji**.

Include:

- App title.
- Short classroom-friendly description.
- “Start Playing” button.
- Category preview cards.
- Link/button to view all categories.
- Clear explanation that the teacher shows emojis, students guess, then the teacher reveals the answer.

Suggested copy:

```txt
Turn movies, characters, shows, and classroom topics into a fast, funny emoji guessing game.
```

---

## 2. Category Selection Page

Teachers can choose a category.

Initial categories:

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

Each category card should show:

- Category name.
- Short description.
- Number of puzzles.
- Difficulty label if available.
- Start button.

---

## 3. Game Presentation Mode

This is the most important screen.

Requirements:

- Show one emoji clue at a time.
- Emojis must be very large.
- Do not show the answer until the teacher clicks reveal.
- Include buttons:
  - Reveal Answer
  - Hide Answer
  - Next
  - Previous
  - Shuffle
  - Restart Category
  - Back to Categories

- Optional but strongly preferred:
  - Hint button
  - Timer button
  - Fullscreen button

Presentation mode must work well on a classroom projector.

---

## 4. Answer Reveal

When revealed, show:

- Correct answer title.
- Optional short clue/explanation.
- Category.
- Difficulty.
- Optional “Fun Fact” field if available.

---

## 5. Random Mix Mode

Random Mix should pull puzzles from multiple categories.

Requirements:

- Randomized order.
- Avoid immediate duplicates.
- Show the category only after answer reveal.
- Include a broad mix of kid-friendly content.

---

## 6. Puzzle Data Model

Create a clean puzzle data model.

Recommended file:

```txt
src/types/puzzle.ts
```

Recommended types:

```ts
export type PuzzleDifficulty = "easy" | "medium" | "hard";

export type Puzzle = {
  id: string;
  answer: string;
  emojis: string;
  categoryId: string;
  difficulty: PuzzleDifficulty;
  hint?: string;
  explanation?: string;
  funFact?: string;
  tags?: string[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  colorTheme?: string;
  recommendedGradeBand?: string;
};
```

---

## 7. Seed Data

Create initial seed puzzle packs.

Minimum launch content:

```txt
Disney Movies: 10+
Disney Princesses / Characters: 10+
Pixar: 10+
Marvel: 10+
Star Wars: 10+
DreamWorks / Animated Classics: 10+
Video Game Movies: 10+
Kid TV Shows: 10+
Mixed / General Kid Favorites: 20+
```

Minimum total MVP target:

```txt
100 puzzles
```

All puzzles must be classroom appropriate.

Avoid overly obscure clues in the default pack.

Example puzzle:

```ts
{
  id: "lion-king",
  answer: "The Lion King",
  emojis: "🦁👑🌅🐗🐦",
  categoryId: "disney-movies",
  difficulty: "easy",
  hint: "A young animal prince learns to take his place.",
  explanation: "Lion + crown points to The Lion King.",
  tags: ["disney", "animals", "classic"]
}
```

---

## 8. Teacher Controls

Add simple teacher-friendly controls:

- Show/hide answer.
- Move forward/backward.
- Shuffle.
- Restart.
- Toggle fullscreen if browser supports it.
- Optional timer.
- Optional keyboard shortcuts.

Recommended keyboard shortcuts:

```txt
Space = reveal / hide answer
ArrowRight = next puzzle
ArrowLeft = previous puzzle
S = shuffle
R = restart
F = fullscreen
Escape = hide answer if open
```

Make sure shortcuts do not interfere with typing if future input fields exist.

---

## 9. Responsive Design

The app must work on:

- Desktop
- Chromebook
- Tablet
- Phone
- Projector/smartboard

Presentation mode should prioritize projector readability.

---

## 10. Accessibility

Implement:

- Semantic HTML.
- Keyboard-accessible buttons.
- Sufficient color contrast.
- Clear focus states.
- Reduced motion support where applicable.
- Buttons with accessible labels.
- No essential information communicated by color alone.

---

# Future Feature Backlog

Do not build all of these in the first pass unless MVP is complete and stable.

---

## Custom Puzzle Builder

Teacher can create custom emoji clues.

Fields:

- Answer
- Emoji clue
- Category
- Difficulty
- Hint
- Explanation
- Tags

Start with local browser storage before adding accounts or a database.

---

## Import / Export

Allow exporting and importing packs as JSON.

Useful for sharing packs between teachers.

---

## Saved Game Sessions

Save progress through a category.

Potential first version:

- localStorage only.

Potential later version:

- database-backed sessions.

---

## Team Scoreboard

Optional classroom scoreboard.

Features:

- Add team names.
- Award points.
- Subtract points.
- Reset scoreboard.
- Save scoreboard locally.

Start with local browser state before adding a database.

---

## QR Student Join Mode

Future idea:

- Teacher displays game.
- Students join from devices.
- Students submit guesses.
- Teacher reveals answers.

This likely requires a database and/or WebSockets.

Do not implement until core app is working.

---

## Admin / Teacher Dashboard

Future dashboard to manage custom categories and packs.

---

## Pack Sharing

Future feature where teachers can share puzzle packs.

Do not build until custom packs exist.

---

# Repository Creation Tasks

## Task 1 — Create Public GitHub Repository

**Status:** Complete, with owner note.

**Implementation note:** On 2026-06-04 at 21:17 EDT, `gh repo create adh1310/guessmoji` failed because GitHub returned `HTTP 404: Not Found` for owner `adh1310`. The public repository was created under the authenticated GitHub account instead: `https://github.com/hallveticapro/guessmoji`. Confirm whether the final GHCR target should remain `ghcr.io/adh1310/guessmoji` or move to the authenticated owner before final publishing verification.

Create the public GitHub repository:

```bash
gh repo create guessmoji --public --description "A classroom emoji Pictionary game with themed guessing categories." --clone
```

If the repo already exists, clone it:

```bash
gh repo clone adh1310/guessmoji
```

Then enter the project directory:

```bash
cd guessmoji
```

Initial files should include:

```txt
README.md
AGENTS.md
UPDATES.md
TASKS.md
.gitignore
```

Initial commit:

```bash
git add .
git commit -m "chore: initialize project documentation"
git push origin main
```

---

# App Scaffolding Tasks

## Task 2 — Scaffold Next.js App

**Status:** Complete.

**Implementation note:** The official `create-next-app@latest` generator was run in `/tmp/guessmoji-scaffold`, then generated app files were copied into this repository while preserving the existing project documentation.

Create a Next.js TypeScript app.

Recommended command:

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

If using a different equivalent command, document the reason in `UPDATES.md`.

Required structure:

```txt
src/
  app/
  components/
  data/
  lib/
  types/
  styles/
```

Add or verify:

```txt
package.json
next.config.*
tsconfig.json
eslint.config.*
postcss.config.*
```

Commit:

```bash
git add .
git commit -m "feat: scaffold nextjs app"
```

---

# Documentation Tasks

## Task 3 — Create AGENTS.md

**Status:** Complete for the initial documentation checkpoint. Keep this file updated as the stack and commands are added.

Create `AGENTS.md` with at least:

````md
# AGENTS.md

## App Overview

Guessmoji is a classroom emoji Pictionary game.

## Current Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Docker
- GHCR
- Static seed data for MVP

## Commands

### Development

\```bash
npm install
npm run dev
\```

### Lint

\```bash
npm run lint
\```

### Typecheck

\```bash
npm run typecheck
\```

### Build

\```bash
npm run build
\```

### Docker

\```bash
docker compose up -d --build
\```

## Project Rules

- Update UPDATES.md after every meaningful change.
- Keep TASKS.md current.
- Commit after every completed task.
- Do not commit secrets.
- Keep UI classroom-friendly.
- Preserve projector readability.
````

Expand this as the project grows.

Commit:

```bash
git add AGENTS.md UPDATES.md TASKS.md
git commit -m "docs: add agent project instructions"
```

---

# Data Model Tasks

## Task 4 — Add Puzzle and Category Types

**Status:** Complete.

Create:

```txt
src/types/puzzle.ts
```

Include:

```ts
export type PuzzleDifficulty = "easy" | "medium" | "hard";

export type Puzzle = {
  id: string;
  answer: string;
  emojis: string;
  categoryId: string;
  difficulty: PuzzleDifficulty;
  hint?: string;
  explanation?: string;
  funFact?: string;
  tags?: string[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  colorTheme?: string;
  recommendedGradeBand?: string;
};
```

Commit:

```bash
git add .
git commit -m "feat: add puzzle and category types"
```

---

## Task 5 — Add Seed Categories

**Status:** Complete.

Create:

```txt
src/data/categories.ts
```

Seed categories:

```txt
disney-movies
disney-princesses
pixar
marvel
star-wars
dreamworks
video-game-movies
kid-tv-shows
animated-classics
random-mix
```

Each category should include:

- id
- name
- slug
- description
- icon
- recommended grade band

Commit:

```bash
git add .
git commit -m "feat: add seed categories"
```

---

## Task 6 — Add Seed Puzzles

**Status:** Complete.

**Implementation note:** Added 100 puzzles across the nine content categories. Random Mix is intentionally derived from the full puzzle pool by utility functions instead of storing duplicate `random-mix` puzzle rows.

Create:

```txt
src/data/puzzles.ts
```

Minimum 100 puzzles.

Start with these category targets:

```txt
Disney Movies: 10+
Disney Princesses / Characters: 10+
Pixar: 10+
Marvel: 10+
Star Wars: 10+
DreamWorks / Animated Classics: 10+
Video Game Movies: 10+
Kid TV Shows: 10+
Mixed / General Kid Favorites: 20+
```

Rules:

- Keep answers kid-friendly.
- Avoid inappropriate horror, violence, or mature content.
- Avoid clues that only adults would understand.
- Do not include copyrighted images or logos.
- Emoji-only clues are fine.
- Titles can be used as answer text.
- Make clues challenging but solvable for upper elementary students.

Commit:

```bash
git add .
git commit -m "feat: add initial puzzle seed data"
```

---

# Utility Function Tasks

## Task 7 — Puzzle Utilities

**Status:** Complete.

Create:

```txt
src/lib/puzzles.ts
```

Functions:

```ts
getAllCategories()
getCategoryBySlug(slug)
getPuzzlesByCategoryId(categoryId)
getPuzzleById(id)
getRandomizedPuzzles(puzzles)
getRandomMix(count?)
```

Requirements:

- Handle missing categories safely.
- Never crash on an invalid slug.
- Random Mix should exclude duplicates.
- Add basic tests if test framework is set up.

Commit:

```bash
git add .
git commit -m "feat: add puzzle utility functions"
```

---

# UI Tasks

## Task 8 — Build App Shell

**Status:** Complete.

Create a polished app shell.

Include:

- Header
- Main content area
- Footer
- App title
- Simple navigation

Suggested routes:

```txt
/
 /categories
 /play/[categorySlug]
```

Commit:

```bash
git add .
git commit -m "feat: add app shell and navigation"
```

---

## Task 9 — Build Home Page

**Status:** Complete.

Home page must include:

- Hero section.
- App name: Guessmoji.
- Short description.
- Start Playing button.
- Category preview.
- Teacher-friendly explanation.

Suggested copy:

```txt
Turn movie titles, characters, shows, and classroom topics into a fast, funny emoji guessing game.
```

Commit:

```bash
git add .
git commit -m "feat: build home page"
```

---

## Task 10 — Build Category Selection Page

**Status:** Complete.

Create:

```txt
src/app/categories/page.tsx
```

Requirements:

- Display all categories as cards.
- Each card links to `/play/[categorySlug]`.
- Show number of puzzles in each category.
- Include Random Mix mode.
- Responsive grid.
- Clear classroom-friendly descriptions.

Commit:

```bash
git add .
git commit -m "feat: build category selection page"
```

---

## Task 11 — Build Game Presentation Page

**Status:** Complete.

Create:

```txt
src/app/play/[categorySlug]/page.tsx
```

Use a client component for game interactivity.

Create:

```txt
src/components/game/GameBoard.tsx
src/components/game/GameControls.tsx
src/components/game/AnswerReveal.tsx
src/components/game/ProgressIndicator.tsx
```

Requirements:

- Display emoji clue very large.
- Hide answer until revealed.
- Reveal answer on button click.
- Hide answer on button click.
- Next and previous controls.
- Restart category.
- Shuffle puzzles.
- Back to categories.
- Track progress: `3 / 10`.
- Gracefully handle invalid category slug.
- Keep all controls large enough for a teacher at a smartboard.

Commit:

```bash
git add .
git commit -m "feat: build classroom game mode"
```

---

## Task 12 — Add Keyboard Shortcuts

**Status:** Complete.

Keyboard shortcuts:

```txt
Space = reveal / hide answer
ArrowRight = next puzzle
ArrowLeft = previous puzzle
S = shuffle
R = restart
F = fullscreen
Escape = hide answer if open
```

Make sure shortcuts do not interfere with typing if future input fields exist.

Commit:

```bash
git add .
git commit -m "feat: add classroom keyboard shortcuts"
```

---

## Task 13 — Add Fullscreen Support

**Status:** Complete.

Add a fullscreen button for presentation mode.

Requirements:

- Use browser Fullscreen API.
- Fail gracefully if unsupported.
- Button text should toggle between:
  - Enter Fullscreen
  - Exit Fullscreen

Commit:

```bash
git add .
git commit -m "feat: add fullscreen presentation support"
```

---

# Local State Tasks

## Task 14 — Persist Basic Preferences Locally

**Status:** Complete.

Use localStorage for:

- Last selected category.
- Shuffle preference if added.
- Timer preference if added later.

Do not require login.

Commit:

```bash
git add .
git commit -m "feat: persist teacher preferences locally"
```

---

# Optional Timer Tasks

## Task 15 — Add Optional Timer

**Status:** Complete.

Add a simple classroom timer.

Requirements:

- Teacher can choose:
  - No timer
  - 30 seconds
  - 60 seconds
  - 90 seconds

- Timer starts when puzzle appears.
- Timer stops on reveal.
- Timer resets on next puzzle.

This can be delayed until after core game mode is stable.

Commit:

```bash
git add .
git commit -m "feat: add optional classroom timer"
```

---

# Styling Tasks

## Task 16 — Polish Classroom UI

**Status:** Complete.

Design goals:

- Big emojis.
- Large buttons.
- Projector-friendly.
- Fun theme.
- Not too visually busy.
- Works in bright classroom lighting.

Add:

- Consistent spacing.
- Clear hover/focus states.
- Responsive typography.
- Print/screenshot-friendly answer reveal.
- Reduced-motion consideration.

Commit:

```bash
git add .
git commit -m "style: polish classroom presentation UI"
```

---

# Docker Tasks

## Task 17 — Add Dockerfile

**Status:** Complete.

Create:

```txt
Dockerfile
```

Use a multi-stage production build.

Requirements:

- Install dependencies.
- Build Next.js app.
- Run production server.
- Expose port `3000`.
- Use non-root user if practical.
- Optimize image size.

Recommended Dockerfile:

```dockerfile
FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
```

Adjust if Next.js standalone output is configured.

Commit:

```bash
git add .
git commit -m "chore: add production dockerfile"
```

---

## Task 18 — Add docker-compose.yml

Create:

```txt
docker-compose.yml
```

Minimum web-only version:

```yaml
services:
  guessmoji:
    image: ghcr.io/adh1310/guessmoji:latest
    container_name: guessmoji
    restart: unless-stopped
    ports:
      - "${APP_PORT:-3000}:3000"
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_APP_NAME: "${NEXT_PUBLIC_APP_NAME:-Guessmoji}"
      NEXT_PUBLIC_APP_URL: "${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
    env_file:
      - .env
```

For local building, include comments or a compose override option:

```yaml
# To build locally instead of using GHCR:
# build:
#   context: .
#   dockerfile: Dockerfile
```

Commit:

```bash
git add .
git commit -m "chore: add docker compose stack"
```

---

## Task 19 — Add Environment Files

Create:

```txt
.env.example
.env
```

`.env.example` should be committed.

`.env` may contain safe local defaults only. Do not include secrets.

Recommended `.env.example`:

```env
APP_PORT=3000
NEXT_PUBLIC_APP_NAME="Guessmoji"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Recommended starter `.env` for local/Unraid use:

```env
APP_PORT=3000
NEXT_PUBLIC_APP_NAME="Guessmoji"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Also update `.gitignore`.

Important:

- Commit `.env.example`.
- Do not commit real secrets.
- If `.env` is committed, it must contain safe starter defaults only.
- If future database credentials are added, move real values to Unraid/Arcane secrets or local-only `.env`.

Commit:

```bash
git add .
git commit -m "chore: add environment templates"
```

---

# GHCR Publishing Tasks

## Task 20 — Add GitHub Actions Workflow for GHCR

Create:

```txt
.github/workflows/docker-publish.yml
```

Requirements:

- Build Docker image on push to `main`.
- Publish to GHCR.
- Image name:

```txt
ghcr.io/adh1310/guessmoji
```

Tags:

- `latest`
- Git SHA
- Semantic version tag if pushed later

Workflow should use GitHub Actions permissions:

```yaml
permissions:
  contents: read
  packages: write
```

Recommended workflow:

```yaml
name: Build and Publish Docker Image

on:
  push:
    branches:
      - main
    tags:
      - "v*.*.*"
  workflow_dispatch:

permissions:
  contents: read
  packages: write

env:
  IMAGE_NAME: ghcr.io/adh1310/guessmoji

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.IMAGE_NAME }}
          tags: |
            type=raw,value=latest,enable={{is_default_branch}}
            type=sha
            type=ref,event=tag

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

After pushing, verify the package visibility is public if needed.

Commit:

```bash
git add .
git commit -m "ci: publish docker image to ghcr"
```

---

# Unraid / Arcane Deployment Tasks

## Task 21 — Add Unraid Deployment Docs

Update `README.md` with a section:

````md
## Unraid Deployment

### Docker Compose Stack

Use this stack:

\```yaml
services:
guessmoji:
image: ghcr.io/adh1310/guessmoji:latest
container_name: guessmoji
restart: unless-stopped
ports: - "3000:3000"
environment:
NODE_ENV: production
NEXT_PUBLIC_APP_NAME: "Guessmoji"
NEXT_PUBLIC_APP_URL: "http://localhost:3000"
\```

### Updating

\```bash
docker compose pull
docker compose up -d
\```
````

Also mention:

- Can be proxied through NGINX Proxy Manager.
- App listens on container port `3000`.
- No database required for MVP.
- Arcane can run the compose stack directly.

Commit:

```bash
git add .
git commit -m "docs: add unraid deployment instructions"
```

---

# Quality Tasks

## Task 22 — Add Lint, Typecheck, Build Scripts

Ensure `package.json` has appropriate scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}
```

If `next lint` is unavailable due to framework version, use the appropriate ESLint command.

Commit:

```bash
git add .
git commit -m "chore: add quality check scripts"
```

---

## Task 23 — Add Tests

Set up Vitest for utilities.

Test:

- Category lookup by slug.
- Puzzles by category.
- Invalid category handling.
- Random mix count.
- Random mix duplicate prevention where practical.
- Shuffle function returns all original puzzles.

Commit:

```bash
git add .
git commit -m "test: add puzzle utility tests"
```

---

## Task 24 — Final MVP Verification

Before considering MVP complete, run:

```bash
npm run lint
npm run typecheck
npm run build
docker compose build
docker compose up -d
```

Verify:

- Home page loads.
- Category page loads.
- Each category starts a game.
- Reveal answer works.
- Hide answer works.
- Next/previous works.
- Shuffle works.
- Restart works.
- Random Mix works.
- Fullscreen works or fails gracefully.
- Docker container serves app on configured port.
- README is accurate.
- AGENTS.md is accurate.
- UPDATES.md includes all meaningful changes.
- TASKS.md reflects completed tasks.

Commit:

```bash
git add .
git commit -m "chore: verify mvp build"
git push origin main
```

---

# Suggested Initial Puzzle Categories

Use these as the first content packs.

---

## Disney Movies

Examples:

- The Lion King
- Frozen
- Moana
- Beauty and the Beast
- Aladdin
- Encanto
- Tangled
- Mulan
- Lilo & Stitch
- The Emperor’s New Groove

---

## Disney Princesses / Characters

Examples:

- Cinderella
- Ariel
- Belle
- Jasmine
- Mulan
- Tiana
- Rapunzel
- Merida
- Moana
- Elsa
- Anna
- Mirabel

---

## Pixar

Examples:

- Toy Story
- Finding Nemo
- Cars
- Coco
- Inside Out
- The Incredibles
- Monsters Inc.
- Ratatouille
- WALL-E
- Up

---

## Marvel

Examples:

- Spider-Man
- Avengers
- Black Panther
- Guardians of the Galaxy
- Thor
- Captain America
- Iron Man
- Hulk
- Doctor Strange
- Ant-Man

---

## Star Wars

Examples:

- Luke Skywalker
- Darth Vader
- Yoda
- Princess Leia
- The Mandalorian
- Grogu
- R2-D2
- C-3PO
- Millennium Falcon
- Death Star

---

## DreamWorks / Animated Classics

Examples:

- Shrek
- Kung Fu Panda
- How to Train Your Dragon
- Madagascar
- Trolls
- The Croods
- Megamind
- Puss in Boots
- The Bad Guys
- Boss Baby

---

## Video Game Movies

Examples:

- The Super Mario Bros. Movie
- Sonic the Hedgehog
- Detective Pikachu
- Wreck-It Ralph
- Angry Birds
- Minecraft Movie, if appropriate/current
- Five Nights at Freddy’s, only if classroom-appropriate toggle is added later

Avoid scary content in the default elementary pack unless marked clearly.

---

## Kid TV Shows

Examples:

- Bluey
- SpongeBob SquarePants
- Pokémon
- Paw Patrol
- Gabby’s Dollhouse
- Peppa Pig
- Phineas and Ferb
- Avatar: The Last Airbender
- The Magic School Bus
- Teen Titans Go!

---

# Content Safety / Classroom Appropriateness Rules

The default app content must be safe for elementary classrooms.

Avoid:

- Adult movies.
- Horror content in default packs.
- Graphic violence.
- Political content.
- Inappropriate jokes.
- Profanity.
- Mature themes.

If questionable categories are added later, they must be opt-in and clearly labeled.

---

# Design Direction

The app should feel like:

```txt
Classroom game show + emoji puzzle board + clean teacher tool
```

Design keywords:

- Bright
- Friendly
- Fast
- Readable
- Projector-friendly
- Playful
- Simple

Avoid:

- Too many animations.
- Tiny text.
- Overcomplicated menus.
- Login requirements for MVP.
- Heavy admin features before the core game works.

---

# Definition of Done for MVP

MVP is complete when:

- Public GitHub repo exists at `adh1310/guessmoji`.
- App name displays as **Guessmoji**.
- App runs locally with `npm run dev`.
- App builds with `npm run build`.
- App runs in Docker.
- Docker Compose stack works.
- GHCR image publishes publicly.
- README includes Unraid deployment instructions.
- AGENTS.md exists and is accurate.
- UPDATES.md has been maintained.
- TASKS.md reflects completed work.
- At least 100 puzzles exist.
- Category selection works.
- Game presentation mode works.
- Answer reveal works.
- Random Mix works.
- UI is usable on a classroom projector.

---

# First Execution Order

Follow this exact order first:

1. Create public GitHub repo `guessmoji`.
2. Clone repo locally.
3. Add `TASKS.md`, `README.md`, `AGENTS.md`, `UPDATES.md`, and `.gitignore`.
4. Commit documentation checkpoint.
5. Scaffold Next.js app.
6. Commit scaffold checkpoint.
7. Add puzzle/category data model.
8. Add seed categories and puzzles.
9. Build category selection UI.
10. Build game presentation UI.
11. Add keyboard shortcuts.
12. Add fullscreen support.
13. Add Dockerfile.
14. Add `docker-compose.yml`.
15. Add `.env.example` and safe starter `.env`.
16. Add GHCR GitHub Actions workflow.
17. Update README with Unraid deployment.
18. Run full verification.
19. Commit final MVP checkpoint.
20. Push all commits to GitHub.
