# Task 8 Harry Potter implementation report

Date: 2026-08-19  
Worktree: `/Users/andrew/code/github/hallveticapro/guessmoji/.worktrees/content-audit-harry-potter`  
Scope: the core seven-book/eight-film Harry Potter saga only.  
Status: **complete; staged blind and source/rules review approved**.
Implementation commit: `455f6e3` (`content: add Harry Potter category`); fix round 1/5 commit: `5d5a28c` (`content: remediate Harry Potter fix round one`).

## Fix round 1/5

The source-aware review identified one factual overclaim and a Golden Snitch /
Quidditch clue collision. Albus Dumbledore's fun fact is now exactly
`Dumbledore was known for his alchemy work with Nicolas Flamel.`; the `hp-04`
source mapping below therefore covers alchemy work with Flamel and no claim
that Dumbledore helped develop the Philosopher's Stone.

The final pair is intentionally distinct:

- Golden Snitch: `✨🪽🔎🤏`; the explanation identifies the tiny winged Seeker
  target, says that its capture is worth 150 points and usually ends the
  match, and explicitly notes that a team can still win without catching it.
- Quidditch: `🧹7️⃣🥅📣`; the explanation focuses on broomstick sport, seven
  players, hoops/goals, and team competition, with no Seeker/search/trophy
  language.

The normalized `golden snitch` banlist now contains only `🟡`: `🪽` is an
intentional semantic component in the revised multi-association clue. The
category-context audit likewise allows `✨` only on this Snitch card, where
the explanation explicitly qualifies it as the sparkling-golden association;
all other Harry Potter clues remain free of the category-context glyph set.

## Implementation summary

- Added the `harry-potter` category with the preflight description, ⚡ icon,
  indigo theme, and `3-8` grade band.
- Added exactly 20 cards in four balanced five-card subthemes:
  characters, locations/travel, objects/creature companions, and
  sport/houses/story concepts.
- Kept the canonical answer `Platform Nine and Three-Quarters` and the
  three-object legend role for `The Deathly Hallows`; the latter is not a
  book/film-title card.
- Added explicit hint, details, explanation, fun fact, difficulty, and tags
  for every card. No generic fallback reveal copy is used.
- Added normalized direct/component bans for the omitted literal glyphs. The
  shared `harry potter` ban key required updating the existing Books and
  Stories title clue so the title occurrence remains character/story-focused
  without ⚡ or 🪄 leaks.
- All Harry Potter clues avoid `⚡ 🪄 🏰 🧙 🧙‍♂️ 🧙‍♀️`; `✨` is a documented,
  single-card exception on Golden Snitch for its sparkling association.

## Exact card set

| Subtheme | Cards | Difficulty |
| --- | --- | --- |
| Characters | Harry Potter; Hermione Granger; Ron Weasley; Albus Dumbledore; Rubeus Hagrid | 5 easy |
| Locations and travel | Hogwarts; Diagon Alley; Hogsmeade; Platform Nine and Three-Quarters; The Hogwarts Express | 4 easy, 1 medium |
| Objects and creature companions | The Sorting Hat; Golden Snitch; The Invisibility Cloak; Dobby; Hedwig | 2 easy, 3 medium |
| Sport, houses, and story concepts | Quidditch; Gryffindor; Patronus; Triwizard Tournament; The Deathly Hallows | 2 easy, 3 medium |
| **Total** | **20** | **13 easy, 7 medium, 0 hard** |

Stable generated IDs are:

```text
harry-potter-harry-potter
harry-potter-hermione-granger
harry-potter-ron-weasley
harry-potter-albus-dumbledore
harry-potter-rubeus-hagrid
harry-potter-hogwarts
harry-potter-diagon-alley
harry-potter-hogsmeade
harry-potter-platform-nine-and-three-quarters
harry-potter-the-hogwarts-express
harry-potter-the-sorting-hat
harry-potter-golden-snitch
harry-potter-the-invisibility-cloak
harry-potter-dobby
harry-potter-hedwig
harry-potter-quidditch
harry-potter-gryffindor
harry-potter-patronus
harry-potter-triwizard-tournament
harry-potter-the-deathly-hallows
```

## Duplicate adjudication and Random Mix behavior

`Harry Potter` intentionally appears in two categories:

- `books-harry-potter`: the existing Books and Stories book/series-title
  occurrence.
- `harry-potter-harry-potter`: this category's central-character occurrence.

Both answers normalize to `harry potter`, but the Harry Potter category has no
duplicate normalized answer internally. `getRandomMixPuzzlePool()` preserves
the first source occurrence, so the integrated catalog keeps
`books-harry-potter` and excludes `harry-potter-harry-potter` from Random Mix.
The focused puzzle test also proves the inverse fixture order keeps its first
source, documenting that this is deterministic behavior rather than an
answer-category preference.

## Banlist and category-specific audit

Added normalized keys and omitted direct/component glyphs:

```text
harry potter           ⚡ 🪄
hogwarts               🏰
golden snitch          🟡
the sorting hat        🎩
the invisibility cloak 🧥
dobby                  🧝
hedwig                 🦉
gryffindor             🦁
patronus               ✨ 🪄
the deathly hallows    🧥 🪄 🪨
```

The retained semantic components `🧦` (Dobby), `🧹` (Golden Snitch/Quidditch),
and `🚂` (Hogwarts Express) are intentionally not globally banned because the
final clues use them as one association among several and the clean reviewer
must adjudicate them. The objective checks verify that no retained component
is accidentally treated as a direct-ban leak.

The category tests verify:

- exact answer order, unique IDs, unique normalized answers, required fields,
  difficulty counts, and four 5-card subthemes;
- no Fantastic Beasts, Cursed Child, actor, author, studio, or production
  terms in card metadata;
- no category-context glyphs except the documented Golden Snitch `✨`
  sparkle association;
- no direct/component leaks against the normalized banlist;
- unique one-line clues and normalized emoji repetition at or below 4/20,
  with the intentional 🛡️ review-boundary count asserted at exactly 4/20.

## Source register

The following official Harry Potter Encyclopedia / Wizarding World pages were
used to verify the factual details and fun facts. URLs are audit evidence only
and are not present in player-facing card data.

| Card IDs | Claim/source mapping |
| --- | --- |
| `hp-01` Harry Potter | [Harry Potter fact file](https://www.harrypotter.com/fact-file/characters-and-pets/harry-potter) for Gryffindor, Patronus (stag), and Quidditch Seeker; [What is a Patronus?](https://www.harrypotter.com/features/what-is-a-patronus) for Patronus context. |
| `hp-02` Hermione Granger | [Hermione Granger fact file](https://www.harrypotter.com/fact-file/characters-and-pets/hermione-granger) for bookish/courage/problem-solving/trio role and Time-Turner; [What is a Patronus?](https://www.harrypotter.com/features/what-is-a-patronus) for the otter association. |
| `hp-03` Ron Weasley | [Ron Weasley fact file](https://www.harrypotter.com/fact-file/characters-and-pets/ron-weasley) for the seven-child family, chess, Keeper position, and trio role. |
| `hp-04` Albus Dumbledore | [Albus Dumbledore fact file](https://www.harrypotter.com/fact-file/characters-and-pets/albus-dumbledore) for headmaster, beard, sweets, Order, and alchemy work with Nicolas Flamel. |
| `hp-05` Rubeus Hagrid | [Rubeus Hagrid fact file](https://www.harrypotter.com/fact-file/characters-and-pets/rubeus-hagrid) for gamekeeper, Keeper of the Keys, creatures, umbrella, and hobbies. |
| `hp-06` Hogwarts | [Hogwarts fact file](https://www.harrypotter.com/fact-file/locations/hogwarts) for Scottish Highlands setting, school life, and 142 staircases. |
| `hp-07` Diagon Alley | [Diagon Alley fact file](https://www.harrypotter.com/fact-file/locations/diagon-alley) for the hidden brick-wall access and school shopping street. |
| `hp-08` Hogsmeade | [Hogsmeade fact file](https://www.harrypotter.com/fact-file/locations/hogsmeade) for the nearby village, student visits, and all-non-Muggle settlement claim. |
| `hp-09` Platform Nine and Three-Quarters | [Platform Nine and Three-Quarters fact file](https://www.harrypotter.com/fact-file/locations/platform-nine-and-three-quarters) for the King's Cross barrier and platforms 9/10. |
| `hp-10` The Hogwarts Express | [Hogwarts Express fact file](https://www.harrypotter.com/fact-file/magical-miscellany/hogwarts-express) for the scarlet train, 1 September route, and Ottaline Gambol claim. |
| `hp-11` The Sorting Hat | [Sorting Hat fact file](https://www.harrypotter.com/fact-file/objects/the-sorting-hat) for speech, four-house sorting, and founder ownership. |
| `hp-12` Golden Snitch | [Golden Snitch fact file](https://www.harrypotter.com/fact-file/objects/golden-snitch) for the 150-point Seeker target and first-touch enchantment. |
| `hp-13` The Invisibility Cloak | [Invisibility Cloak fact file](https://www.harrypotter.com/fact-file/objects/the-invisibility-cloak) for family inheritance and everlasting invisibility. |
| `hp-14` Dobby | [Dobby fact file](https://www.harrypotter.com/fact-file/characters-and-pets/dobby) for house-elf role, sock/freedom association, protection, and Hogwarts Apparition. |
| `hp-15` Hedwig | [Hedwig fact file](https://www.harrypotter.com/fact-file/characters-and-pets/hedwig) for snowy owl species, birthday gift, letters, and flight behavior. |
| `hp-16` Quidditch | [Quidditch fact file](https://www.harrypotter.com/fact-file/magical-miscellany/quidditch) for broomsticks, seven players, positions, goals, and scoring. |
| `hp-17` Gryffindor | [Gryffindor fact file](https://www.harrypotter.com/fact-file/magical-miscellany/gryffindor) for scarlet/gold, courage, house, and alumni claims. |
| `hp-18` Patronus | [What is a Patronus?](https://www.harrypotter.com/features/what-is-a-patronus) for guardian/shield, silver mist, message, changing form, and Hermione's otter. |
| `hp-19` Triwizard Tournament | [Triwizard Tournament fact file](https://www.harrypotter.com/fact-file/magical-miscellany/triwizard-tournament) for three schools, champions/tasks, 700-year history, and Goblet selection. |
| `hp-20` The Deathly Hallows | [Deathly Hallows fact file](https://www.harrypotter.com/fact-file/objects/the-deathly-hallows) for the three-object legend and Peverell provenance. |

## Validation evidence

Implementation-time red/green evidence:

- Before the category existed, the new acceptance tests failed for the
  missing category/cards and the duplicate behavior; the new banlist
  assertions then failed until the normalized keys were added.
- `jq empty .superpowers/sdd/2026-08-18-content-audit-harry-potter/task-8-manifest.json`: passed.
- `npm run test -- src/lib/clue-audit.test.ts src/lib/content-audit.test.ts src/lib/puzzles.test.ts`: 3 files, 72 tests passed after the red/green regression additions.
- `npm run test`: 14 files, 125 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; Next.js emitted only the existing multiple-lockfile workspace-root warning.
- `git diff --check`: passed.
- `npm run test`: 14 files, 124 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; Next.js emitted only the existing multiple-lockfile
  workspace-root warning.
- `git diff --check`: passed.

The integrated source catalog after this implementation is 60 non-Random-Mix
categories, 61 total categories, and 730 source puzzles. The fresh staged delta
review plus carried-forward results cover all 20 cards, and the independent
source/rules review approves the complete block.

## Acceptance closeout

- Answer-hidden, hint, and full packet views cover all 20 cards with matching opaque IDs.
- The independent staged delta review passes 3/3 changed cards; carried-forward evidence
  passes the remaining 17 cards for 20/20 total coverage.
- The independent source/rules review approves the revised facts, clue pair distinction,
  category scope, and retained semantic components.
- Focused tests, full tests, typecheck, lint, build, and `git diff --check` passed at
  `5d5a28c`.
