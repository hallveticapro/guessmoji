# Guessmoji

Guessmoji is a fast emoji Pictionary game. Pick a themed category, show a large emoji clue, let players guess, then reveal the answer, hint, details, and fun fact.

---

## Table of Contents

- [Overview](#overview)
- [Current Status](#current-status)
- [Category Catalog](#category-catalog)
- [Puzzle Data](#puzzle-data)
- [Local Development](#local-development)
- [Quality Checks](#quality-checks)
- [Docker](#docker)
- [Environment Variables](#environment-variables)
- [Unraid Deployment](#unraid-deployment)
- [Updating](#updating)
- [Known Limitations](#known-limitations)

---

## Overview

Guessmoji is built for quick group play on a shared screen. The app uses static puzzle data, so the MVP runs without login, accounts, multiplayer, Redis, Postgres, or any database.

Basic flow:

1. Pick a category.
2. Show the emoji clue.
3. Use the Hint button if players need a nudge.
4. Reveal the answer.
5. Move to the next card until the category is complete.

---

## Current Status

The MVP is implemented as a Dockerized Next.js, React, TypeScript, and Tailwind CSS app.

Implemented:

- Home page and category browser
- Play screen with large emoji clues
- Hint, reveal, next, previous, shuffle, restart, fullscreen, and timer controls
- Completion screen with play-again and return-to-categories actions
- Static seed data with themed categories
- Random Mix mode
- Local browser preferences for last category, shuffle preference, and timer seconds
- Utility tests for puzzle/category behavior
- Dockerfile and Docker Compose setup
- GitHub Actions workflow for GHCR image publishing
- Unraid-friendly deployment notes

---

## Category Catalog

Current categories:

- Disney Movies
- Disney Princesses
- Pixar
- Marvel
- Star Wars
- DreamWorks
- Video Game Movies
- Kid TV Shows
- Animated Classics
- Animals
- Ocean Animals
- Dinosaurs
- Birds
- Insects and Bugs
- Fruit
- Vegetables
- Desserts
- Snacks
- Breakfast
- Sports
- Outdoor Games
- Board Games
- Card and Party Games
- Video Games
- Arcade Classics
- Pokemon
- Minecraft
- Science
- Space
- Weather
- Math
- Books and Stories
- Fairy Tales
- Myths and Legends
- World Landmarks
- U.S. Landmarks
- World Geography
- Vehicles
- Construction Machines
- Jobs
- Musical Instruments
- Music Genres
- Art Supplies
- School Supplies
- Camping
- National Parks
- Holidays
- Halloween
- Winter Holidays
- Summer Fun
- Beach Day
- Amusement Park
- Around the House
- Kitchen Tools
- Literal Phrases
- Idioms
- Emotions
- Robots
- Plants
- Random Mix

---

## Puzzle Data

The seed data currently includes 600 playable puzzles. Each non-random category includes at least 10 cards. Random Mix derives a shuffled set from the wider puzzle pool instead of storing duplicate entries.

Each puzzle can include:

- Answer
- Emoji clue
- Category
- Difficulty
- Hint
- Details
- Explanation
- Fun fact
- Tags

---

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open:

```txt
http://localhost:3000
```

---

## Quality Checks

Run the standard checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

---

## Docker

Run the compose stack with a published GHCR image:

```bash
docker compose up -d
```

Build locally instead of pulling GHCR:

```bash
docker build -t ghcr.io/<owner>/guessmoji:latest .
docker compose up -d
```

Published image format:

```txt
ghcr.io/<owner>/guessmoji:latest
```

---

## Environment Variables

The starter environment files use safe public defaults:

```env
APP_PORT=3000
NEXT_PUBLIC_APP_NAME="Guessmoji"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

No secrets are required for the MVP.

---

## Unraid Deployment

Guessmoji can run on Unraid as a single Docker Compose stack. No database, cache, login service, or external storage is required.

Example stack:

```yaml
services:
  guessmoji:
    image: ghcr.io/<owner>/guessmoji:latest
    container_name: guessmoji
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_APP_NAME: "Guessmoji"
      NEXT_PUBLIC_APP_URL: "https://guessmoji.example.com"
```

Configuration notes:

- Container port: `3000`
- Host port: choose any open Unraid port
- `NEXT_PUBLIC_APP_URL`: set this to the public URL for your deployment
- Reverse proxy: NGINX Proxy Manager, SWAG, Traefik, or another proxy can forward to container port `3000`
- Compose managers such as Arcane can run the stack directly

---

## Updating

Pull the latest image and restart:

```bash
docker compose pull
docker compose up -d
```

If a GHCR package is unavailable, confirm that the publishing workflow succeeded and that package visibility is public.

---

## Known Limitations

- Puzzle packs are static seed data in the MVP.
- Custom pack creation, import/export, saved games, accounts, and multiplayer are not implemented.
- Random Mix is generated at runtime from existing puzzle data.
- `npm audit` currently reports two moderate dependency findings from the scaffolded dependency tree.
