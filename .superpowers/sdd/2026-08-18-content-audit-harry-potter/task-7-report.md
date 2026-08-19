# Task 7 Partition C implementation report

Status: fix round 5/5 complete for objective content gates; fresh two-card plus metadata blind review is pending. This report is not a blind-review acceptance record.

Implementation was based on `dfa5701` (`content: finalize galaxy hint`). Before changing Partition C, the SDD ledger recorded Task 6 complete using the `a072e4d..dfa5701` evidence and final targeted blind JSON `task-6-round5-space-pair-blind.json` (2/2 pass). No Task 6 changes were reverted.

## Scope and source evidence

The implementation follows `CONTENT_GENERATION_RULES.md`, the Task 7 section of `docs/superpowers/plans/2026-08-18-content-audit-harry-potter.md`, and these source-review artifacts:

- `.superpowers/sdd/2026-08-18-content-audit-harry-potter/task-7-manifest.json`
- `.superpowers/sdd/2026-08-18-content-audit-harry-potter/task-7-preflight.md`
- `.superpowers/sdd/2026-08-18-content-audit-harry-potter/audit-packets/partition-c-full.json`
- `.superpowers/sdd/2026-08-18-content-audit-harry-potter/audit-packets/partition-c-blind.json`
- `.superpowers/sdd/2026-08-18-content-audit-harry-potter/audit-packets/partition-c-hints.json`
- `.superpowers/sdd/2026-08-18-content-audit-harry-potter/rules-c-final.json` (200 card assessments, 20 category assessments, 96 source URLs)
- `.superpowers/sdd/2026-08-18-content-audit-harry-potter/blind-c-final.json` (pre-change blind evidence)
- `.superpowers/sdd/2026-08-18-content-audit-harry-potter/progress.md`

Owned source/test files changed:

- `src/data/expandedPacks.ts`
- `src/data/answerEmojiBanlist.ts`
- `src/lib/clue-audit.test.ts`
- `src/lib/content-audit.test.ts`

Every current and new C tuple now has a seventh, explicit answer-specific explanation. `expandedPuzzles` continues to carry that tuple value directly; no fallback explanation was introduced.

## Current-card coverage and exact IDs

All 200 current cards were mapped by category and normalized answer. The table gives the opaque audit range and the exact shipped source IDs for each current ten-card set. The first ten IDs in each row are the existing cards; any additional IDs listed in the next section are new cards.

| Category | Opaque IDs | Existing source IDs (10) |
| --- | --- | --- |
| Jobs | `audit-card-0401`–`0410` | `jobs-doctor`, `jobs-firefighter`, `jobs-chef`, `jobs-pilot`, `jobs-engineer`, `jobs-artist`, `jobs-musician`, `jobs-teacher`, `jobs-veterinarian`, `jobs-astronaut` |
| Musical Instruments | `audit-card-0411`–`0420` | `music-instruments-guitar`, `music-instruments-piano`, `music-instruments-drums`, `music-instruments-violin`, `music-instruments-trumpet`, `music-instruments-flute`, `music-instruments-saxophone`, `music-instruments-harp`, `music-instruments-tambourine`, `music-instruments-accordion` |
| Music Genres | `audit-card-0421`–`0430` | `music-genres-rock`, `music-genres-jazz`, `music-genres-hip-hop`, `music-genres-country`, `music-genres-classical`, `music-genres-pop`, `music-genres-reggae`, `music-genres-electronic`, `music-genres-blues`, `music-genres-disco` |
| Art Supplies | `audit-card-0431`–`0440` | `art-supplies-paintbrush`, `art-supplies-crayons`, `art-supplies-markers`, `art-supplies-colored-pencils`, `art-supplies-canvas`, `art-supplies-clay`, `art-supplies-scissors`, `art-supplies-glue`, `art-supplies-palette`, `art-supplies-sketchbook` |
| School Supplies | `audit-card-0441`–`0450` | `school-supplies-pencil`, `school-supplies-backpack`, `school-supplies-notebook`, `school-supplies-eraser`, `school-supplies-ruler`, `school-supplies-glue-stick`, `school-supplies-calculator`, `school-supplies-highlighter`, `school-supplies-binder`, `school-supplies-lunchbox` |
| Camping | `audit-card-0451`–`0460` | `camping-tent`, `camping-campfire`, `camping-sleeping-bag`, `camping-flashlight`, `camping-compass`, `camping-hiking-boots`, `camping-s-mores`, `camping-canoe`, `camping-trail-map`, `camping-binoculars` |
| National Parks | `audit-card-0461`–`0470` | `national-parks-yellowstone`, `national-parks-yosemite`, `national-parks-grand-canyon`, `national-parks-zion`, `national-parks-acadia`, `national-parks-everglades`, `national-parks-great-smoky-mountains`, `national-parks-arches`, `national-parks-glacier`, `national-parks-joshua-tree` |
| Holidays | `audit-card-0471`–`0480` | `holidays-new-year-s-day`, `holidays-valentine-s-day`, `holidays-earth-day`, `holidays-independence-day`, `holidays-labor-day`, `holidays-thanksgiving`, `holidays-halloween`, `holidays-christmas`, `holidays-hanukkah`, `holidays-diwali` |
| Halloween | `audit-card-0481`–`0490` | `halloween-jack-o-lantern`, `halloween-ghost`, `halloween-witch`, `halloween-vampire`, `halloween-skeleton`, `halloween-mummy`, `halloween-black-cat`, `halloween-candy-corn`, `halloween-haunted-house`, `halloween-trick-or-treat` |
| Winter Holidays | `audit-card-0491`–`0500` | `winter-holidays-christmas-tree`, `winter-holidays-snowman`, `winter-holidays-menorah`, `winter-holidays-dreidel`, `winter-holidays-gingerbread-house`, `winter-holidays-hot-cocoa`, `winter-holidays-gift-wrap`, `winter-holidays-sledding`, `winter-holidays-ice-skating`, `winter-holidays-kwanzaa-kinara` |
| Summer Fun | `audit-card-0501`–`0510` | `summer-fun-swimming-pool`, `summer-fun-lemonade-stand`, `summer-fun-water-balloon`, `summer-fun-picnic`, `summer-fun-fireworks`, `summer-fun-ice-cream-truck`, `summer-fun-sprinkler`, `summer-fun-camping-trip`, `summer-fun-bike-ride`, `summer-fun-road-trip` |
| Beach Day | `audit-card-0511`–`0520` | `beach-day-sandcastle`, `beach-day-surfboard`, `beach-day-beach-umbrella`, `beach-day-seashell`, `beach-day-sunscreen`, `beach-day-beach-ball`, `beach-day-flip-flops`, `beach-day-lifeguard`, `beach-day-tide-pool`, `beach-day-beach-towel` |
| Amusement Park | `audit-card-0521`–`0530` | `amusement-park-roller-coaster`, `amusement-park-ferris-wheel`, `amusement-park-carousel`, `amusement-park-bumper-cars`, `amusement-park-cotton-candy`, `amusement-park-haunted-ride`, `amusement-park-log-flume`, `amusement-park-midway-game`, `amusement-park-drop-tower`, `amusement-park-funhouse` |
| Around the House | `audit-card-0531`–`0540` | `around-the-house-sofa`, `around-the-house-bed`, `around-the-house-lamp`, `around-the-house-washing-machine`, `around-the-house-refrigerator`, `around-the-house-bookshelf`, `around-the-house-vacuum-cleaner`, `around-the-house-mirror`, `around-the-house-doorbell`, `around-the-house-fireplace` |
| Kitchen Tools | `audit-card-0541`–`0550` | `kitchen-tools-spatula`, `kitchen-tools-whisk`, `kitchen-tools-rolling-pin`, `kitchen-tools-measuring-cup`, `kitchen-tools-cutting-board`, `kitchen-tools-blender`, `kitchen-tools-toaster`, `kitchen-tools-colander`, `kitchen-tools-oven-mitt`, `kitchen-tools-can-opener` |
| Literal Phrases | `audit-card-0551`–`0560` | `literal-phrases-bookworm`, `literal-phrases-couch-potato`, `literal-phrases-busy-bee`, `literal-phrases-night-owl`, `literal-phrases-early-bird`, `literal-phrases-brainstorm`, `literal-phrases-starstruck`, `literal-phrases-time-flies`, `literal-phrases-heart-of-gold`, `literal-phrases-light-bulb-moment` |
| Idioms | `audit-card-0561`–`0570` | `idioms-piece-of-cake`, `idioms-break-the-ice`, `idioms-spill-the-beans`, `idioms-hit-the-books`, `idioms-under-the-weather`, `idioms-cost-an-arm-and-a-leg`, `idioms-let-the-cat-out-of-the-bag`, `idioms-on-cloud-nine`, `idioms-when-pigs-fly`, `idioms-hold-your-horses` |
| Emotions | `audit-card-0571`–`0580` | `emotions-happy`, `emotions-sad`, `emotions-angry`, `emotions-scared`, `emotions-surprised`, `emotions-confused`, `emotions-excited`, `emotions-calm`, `emotions-proud`, `emotions-curious` |
| Robots | `audit-card-0581`–`0590` | `robots-robot`, `robots-drone`, `robots-rover`, `robots-robot-arm`, `robots-vacuum-robot`, `robots-android`, `robots-ai-assistant`, `robots-robot-dog`, `robots-cyborg`, `robots-factory-robot` |
| Plants | `audit-card-0591`–`0600` | `plants-sunflower`, `plants-cactus`, `plants-oak-tree`, `plants-bamboo`, `plants-rose`, `plants-mushroom`, `plants-fern`, `plants-palm-tree`, `plants-venus-flytrap`, `plants-pumpkin-vine` |

## Category counts and complete-block decisions

Partition C ships 220 cards: 200 remediated existing cards plus 20 retained additions. Every category total is a multiple of ten.

| Category | Final count | Decision | New source IDs, when retained |
| --- | ---: | --- | --- |
| Jobs | 20 | Retain complete 10-card block | `jobs-nurse`, `jobs-police-officer`, `jobs-baker`, `jobs-plumber`, `jobs-electrician`, `jobs-scientist`, `jobs-librarian`, `jobs-photographer`, `jobs-farmer`, `jobs-judge` |
| Musical Instruments | 10 | Omit proposed block in full (fix round 2) | None; delta blind review rejected the entire addition |
| Music Genres | 10 | Omit proposed block in full (fix round 1) | None; blind review rejected the entire addition |
| Art Supplies | 10 | Omit proposed block in full | None; flagged `Pencil Sharpener` collision required substitution, and no partial block was shipped |
| School Supplies | 10 | Omit proposed block in full | None; flagged `Scissors`/`Compass` collisions required substitution, and no partial block was shipped |
| Camping | 10 | Omit proposed block in full (fix round 1) | None; blind review rejected the entire addition |
| National Parks | 10 | Omit proposed block in full (fix round 1) | None; blind review rejected the entire addition |
| Holidays | 10 | Omit proposed block in full (fix round 2) | None; delta blind review rejected the entire addition |
| Halloween | 10 | Omit proposed block in full | None; proposed `Pumpkin` duplicated `vegetables-pumpkin`, and no partial block was shipped |
| Winter Holidays | 10 | Omit proposed block in full (fix round 2) | None; delta blind review rejected the entire addition |
| Summer Fun | 10 | Omit proposed block in full | None; proposed `Frisbee`, `Kite Flying`, and `Popsicle` duplicated existing source cards |
| Beach Day | 10 | Omit proposed block in full (fix round 1) | None; blind review rejected the entire addition |
| Amusement Park | 10 | Omit proposed block in full | None; proposed `Pretzel` and `Popcorn` duplicated existing snack cards |
| Around the House | 10 | Omit proposed block in full | None; proposed `Toaster` duplicated `kitchen-tools-toaster` |
| Kitchen Tools | 10 | Omit proposed block in full (fix round 1) | None; blind review rejected the entire addition |
| Literal Phrases | 10 | Retain current block; no expansion | No proposal shipped until the metaphorical/compound-phrase boundary with Idioms is explicit |
| Idioms | 20 | Retain complete 10-card block | `idioms-a-blessing-in-disguise`, `idioms-burn-the-midnight-oil`, `idioms-once-in-a-blue-moon`, `idioms-actions-speak-louder-than-words`, `idioms-best-of-both-worlds`, `idioms-go-the-extra-mile`, `idioms-in-hot-water`, `idioms-back-to-square-one`, `idioms-a-dime-a-dozen`, `idioms-through-thick-and-thin` |
| Emotions | 10 | Omit proposed block in full (fix round 2) | None; delta blind review rejected the entire addition |
| Robots | 10 | Omit proposed block in full (fix round 3) | None; delta2 blind review rejected `robots-space-drone`, so the entire block was removed |
| Plants | 10 | Omit proposed block in full (fix round 1) | None; blind review rejected the entire addition |

The six flagged proposal blocks from the initial implementation were omitted in full, not partially padded: Art Supplies, School Supplies, Halloween, Summer Fun, Amusement Park, and Around the House. Fix round 1 removed Music Genres, Camping, National Parks, Beach Day, Kitchen Tools, and Plants. Fix round 2 removed Musical Instruments, Holidays, Winter Holidays, and Emotions. Fix round 3 removed Robots after `robots-space-drone` failed; Literal Phrases remains at ten. The two retained additions (Jobs and Idioms) are exact ten-card blocks.

## Fix round 1 atomic decisions

The fix round removed exactly these six complete ten-card blocks (60 cards): Music Genres (`music-genres-folk`, `music-genres-soul`, `music-genres-funk`, `music-genres-gospel`, `music-genres-metal`, `music-genres-punk`, `music-genres-ska`, `music-genres-opera`, `music-genres-bluegrass`, `music-genres-randb`); Camping (`camping-camp-stove`, `camping-lantern`, `camping-hammock`, `camping-sleeping-pad`, `camping-camp-chair`, `camping-first-aid-kit`, `camping-insect-repellent`, `camping-water-bottle`, `camping-firewood`, `camping-trail-sign`); National Parks (`national-parks-rocky-mountain-national-park`, `national-parks-grand-teton-national-park`, `national-parks-bryce-canyon-national-park`, `national-parks-olympic-national-park`, `national-parks-sequoia-national-park`, `national-parks-saguaro-national-park`, `national-parks-denali-national-park`, `national-parks-death-valley-national-park`, `national-parks-redwood-national-park`, `national-parks-hawai-i-volcanoes-national-park`); Beach Day (`beach-day-snorkeling`, `beach-day-sand-dunes`, `beach-day-beach-chair`, `beach-day-sun-hat`, `beach-day-beach-bag`, `beach-day-paddleboard`, `beach-day-seashell-hunt`, `beach-day-beach-cleanup`, `beach-day-ocean-wave`, `beach-day-boardwalk`); Kitchen Tools (`kitchen-tools-chef-s-knife`, `kitchen-tools-frying-pan`, `kitchen-tools-saucepan`, `kitchen-tools-grater`, `kitchen-tools-peeler`, `kitchen-tools-tongs`, `kitchen-tools-kitchen-timer`, `kitchen-tools-mixing-bowl`, `kitchen-tools-potato-masher`, `kitchen-tools-mortar-and-pestle`); and Plants (`plants-daisy`, `plants-tulip`, `plants-dandelion`, `plants-lavender`, `plants-maple-tree`, `plants-pine-tree`, `plants-aloe-vera`, `plants-tomato-plant`, `plants-mint`, `plants-basil`).

The retained complete blocks are exactly 20 cards: Jobs (`jobs-nurse` through `jobs-judge`) and Idioms (`idioms-a-blessing-in-disguise` through `idioms-through-thick-and-thin`).

Fix round 3 removed the complete Robots addition block (10 cards): `robots-surgical-robot`, `robots-warehouse-robot`, `robots-delivery-robot`, `robots-robotic-lawn-mower`, `robots-self-driving-car`, `robots-search-and-rescue-robot`, `robots-space-drone`, `robots-robot-painter`, `robots-educational-robot`, and `robots-robotic-exoskeleton`. The atomic removal was triggered by the delta2 blind failure of `robots-space-drone` against Rover/satellite/probe alternatives.

Fix round 2 removed exactly these four complete ten-card blocks (40 cards): Musical Instruments (`music-instruments-cello`, `music-instruments-clarinet`, `music-instruments-oboe`, `music-instruments-trombone`, `music-instruments-tuba`, `music-instruments-banjo`, `music-instruments-ukulele`, `music-instruments-recorder`, `music-instruments-maracas`, `music-instruments-xylophone`); Holidays (`holidays-martin-luther-king-jr-day`, `holidays-presidents-day`, `holidays-memorial-day`, `holidays-juneteenth`, `holidays-st-patrick-s-day`, `holidays-cinco-de-mayo`, `holidays-mother-s-day`, `holidays-father-s-day`, `holidays-rosh-hashanah`, `holidays-lunar-new-year`); Winter Holidays (`winter-holidays-stocking`, `winter-holidays-santa-claus`, `winter-holidays-reindeer`, `winter-holidays-holiday-lights`, `winter-holidays-wreath`, `winter-holidays-latke`, `winter-holidays-new-year-s-eve`, `winter-holidays-kwanzaa`, `winter-holidays-christmas-carol`, `winter-holidays-ugly-sweater`); and Emotions (`emotions-love`, `emotions-jealous`, `emotions-worried`, `emotions-embarrassed`, `emotions-grateful`, `emotions-hopeful`, `emotions-lonely`, `emotions-frustrated`, `emotions-bored`, `emotions-relieved`). Only Jobs, Idioms, and Robots additions remain.

## Remediation coverage

- All 200 current cards received explicit answer-specific emoji explanations.
- The 31 preflight direct/component findings were repaired, including `audit-card-0401` Doctor, `0402` Firefighter, `0403` Chef, `0404` Pilot, `0434` Colored Pencils, `0437` Scissors, `0452` Campfire, `0456` Hiking Boots, `0457` S'mores, `0459` Trail Map, `0485` Skeleton, `0488` Candy Corn, `0503` Water Balloon, `0506` Ice Cream Truck, `0508` Camping Trip, `0509` Bike Ride, `0510` Road Trip, `0511` Sandcastle, `0513` Beach Umbrella, `0517` Flip-Flops, `0521` Roller Coaster, `0523` Carousel, `0524` Bumper Cars, `0538` Mirror, `0540` Fireplace, `0584` Robot Arm, `0585` Vacuum Robot, `0586` Android, `0590` Factory Robot, `0593` Oak Tree, and `0594` Bamboo. Required normalized banlist keys/forms were added or corrected in `answerEmojiBanlist.ts`.
- The 74 category-context findings were removed from the affected card sets: instruments (`0411`, `0413`, `0415`–`0420`), art supplies (`0431`, `0435`), school supplies (`0441`, `0444`, `0446`, `0449`), camping (`0451`, `0452`, `0454`–`0456`, `0458`–`0460`), national parks (`0461`–`0465`, `0467`–`0470`), holidays (`0471`, `0474`, `0475`, `0480`), Halloween (`0481`–`0484`, `0487`), winter holidays (`0492`, `0496`, `0498`, `0499`), Summer Fun (`0501`, `0502`, `0506`, `0507`), Beach Day (`0511`–`0520`), Amusement Park (`0521`, `0522`, `0528`), Around the House (`0531`, `0536`, `0537`, `0539`), Robots (`0585`, `0586`, `0590`), and Plants (`0591`, `0594`, `0595`, `0597`, `0599`, `0600`).
- Blind-failure targets were reworked for clue specificity, hint calibration, and difficulty: `0411` Guitar, `0413` Drums, `0481` Jack-o'-Lantern, `0482` Ghost, `0487` Black Cat, `0491` Christmas Tree, `0505` Fireworks, `0516` Beach Ball, `0520` Beach Towel, `0522` Ferris Wheel, `0531` Sofa, and `0600` Pumpkin Vine. The instrument, holiday, beach, amusement, furniture, and plant pairs called out in the preflight received distinct mechanics, morphology, or use cues.
- The 12 factual-risk cards were simplified or corrected: `0467` Great Smoky Mountains now uses a stable temperate-forest fact; `0472` Valentine's Day uses the named-Valentine fact; `0482` Ghost uses a translucent/floating convention; `0489` Haunted House uses an eerie-rooms/sounds/surprises fact; `0493` Menorah explicitly distinguishes a nine-branched hanukkiah; `0497` Gift Wrap uses a stable wrapping observation; `0502` Lemonade Stand uses a cultural/learning observation; `0504` Picnic uses a definition; `0557` Starstruck and `0558` Time Flies avoid unsupported etymology; `0581` Robot distinguishes a physical machine from software; and `0595` Rose uses morphology rather than an unsourced cultivation timeline.
- Content-invariant checks cover missing fields, duplicate normalized answers, duplicate normalized clues, unknown categories, and ten-card block sizes. The whole C set has no invariant findings after remediation. A small cross-partition leak exposed by the new normalized `smores` ban was also repaired in the existing Desserts S'mores clue.

## Source register

No URLs were added to player-facing data. The authoritative per-card source registry remains the 96-entry `sources` array in `rules-c-final.json`. Key source families used for the changed material are:

- Jobs: Bureau of Labor Statistics occupation pages for physicians, firefighters, chefs, pilots, engineers, artists, musicians, teachers, and veterinarians, plus NASA astronaut context (`https://www.bls.gov/ooh/`, `https://www.nasa.gov/humans-in-space/astronauts/`).
- Instruments and genres: Encyclopaedia Britannica instrument and genre references (`https://www.britannica.com/art/guitar`, `https://www.britannica.com/art/drum-musical-instrument`, `https://www.britannica.com/art/trumpet-musical-instrument`, `https://www.britannica.com/art/flute-musical-instrument`, `https://www.britannica.com/art/rock-music`, `https://www.britannica.com/art/blues`).
- Camping and parks: National Park Service camping/safety guidance and park pages (`https://www.nps.gov/subjects/camping/index.htm`, `https://www.nps.gov/articles/leave-no-trace-seven-principles.htm`, `https://www.nps.gov/yell/index.htm`, `https://www.nps.gov/yose/index.htm`, `https://www.nps.gov/grca/index.htm`, `https://www.nps.gov/grsm/index.htm`, `https://www.nps.gov/glac/index.htm`).
- Holidays and seasonal topics: Britannica, Smithsonian, National Archives, Department of Labor, EarthDay.org, and NMAAHC references (`https://www.britannica.com/topic/Valentines-Day`, `https://www.britannica.com/topic/Halloween`, `https://www.britannica.com/topic/Christmas-tree`, `https://www.britannica.com/topic/menorah`, `https://www.si.edu/spotlight/thanksgiving`, `https://www.archives.gov/founding-docs/declaration`, `https://nmaahc.si.edu/explore/stories/kwanzaa`).
- Beach, amusement, household, and kitchen topics: NOAA tides, EPA sun safety, IAAPA safety, Department of Energy household guidance, and USDA food safety (`https://oceanservice.noaa.gov/education/tutorial_tides/tides01.html`, `https://www.epa.gov/sunsafety`, `https://www.iaapa.org/safety`, `https://www.energy.gov/energysaver`, `https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics`).
- Phrases, idioms, emotions, robots, and plants: Merriam-Webster, APA, Britannica, and NASA (`https://www.merriam-webster.com/dictionary/phrase`, `https://www.merriam-webster.com/dictionary/idiom`, `https://www.apa.org/topics/emotions`, `https://www.britannica.com/technology/robot-technology`, `https://www.nasa.gov/robotics/`, `https://www.britannica.com/plant/rose`).

### Retained-addition source mapping

Each retained addition has a repeatable card-level source and assessment. Jobs: `jobs-nurse` → [BLS registered nurses](https://www.bls.gov/ooh/healthcare/registered-nurses.htm), `jobs-police-officer` → [BLS police and detectives](https://www.bls.gov/ooh/protective-service/police-and-detectives.htm), `jobs-baker` → [BLS bakers](https://www.bls.gov/ooh/production/bakers.htm), `jobs-plumber` → [BLS plumbers](https://www.bls.gov/ooh/construction-and-extraction/plumbers-pipefitters-and-steamfitters.htm), `jobs-electrician` → [BLS electricians](https://www.bls.gov/ooh/construction-and-extraction/electricians.htm), `jobs-scientist` → [BLS life, physical, and social science occupations](https://www.bls.gov/ooh/life-physical-and-social-science/home.htm), `jobs-librarian` → [BLS librarians](https://www.bls.gov/ooh/education-training-and-library/librarians.htm), `jobs-photographer` → [BLS photographers](https://www.bls.gov/ooh/media-and-communication/photographers.htm), `jobs-farmer` → [BLS farmers and agricultural managers](https://www.bls.gov/ooh/management/farmers-ranchers-and-other-agricultural-managers.htm), and `jobs-judge` → [BLS judges and hearing officers](https://www.bls.gov/ooh/legal/judges-and-hearing-officers.htm). Assessment for every Jobs card: complete explanation, safe K+ recognition, no direct/component leak; block retained only as a complete ten.

Idioms have term-specific records and literal-rebus assessments: `idioms-a-blessing-in-disguise` → [blessing in disguise](https://www.merriam-webster.com/dictionary/blessing%20in%20disguise), `idioms-burn-the-midnight-oil` → [burn the midnight oil](https://www.merriam-webster.com/dictionary/burn%20the%20midnight%20oil), `idioms-once-in-a-blue-moon` → [once in a blue moon](https://www.merriam-webster.com/dictionary/once%20in%20a%20blue%20moon), `idioms-actions-speak-louder-than-words` → [actions speak louder than words](https://www.merriam-webster.com/dictionary/actions%20speak%20louder%20than%20words), `idioms-best-of-both-worlds` → [best of both worlds](https://www.merriam-webster.com/dictionary/best%20of%20both%20worlds), `idioms-go-the-extra-mile` → [go the extra mile](https://www.merriam-webster.com/dictionary/go%20the%20extra%20mile), `idioms-in-hot-water` → [in hot water](https://www.merriam-webster.com/dictionary/in%20hot%20water), `idioms-back-to-square-one` → [back to square one](https://www.merriam-webster.com/dictionary/back%20to%20square%20one), `idioms-a-dime-a-dozen` → [a dime a dozen](https://www.merriam-webster.com/dictionary/a%20dime%20a%20dozen), and `idioms-through-thick-and-thin` → [through thick and thin](https://www.merriam-webster.com/dictionary/through%20thick%20and%20thin). Each source supports the phrase meaning; emoji show the words while the hint supplies a distinct figurative meaning; no direct answer glyphs; complete ten retained.


Source-register corrections: `national-parks-great-smoky-mountains` maps to the [NPS Nature page](https://www.nps.gov/grsm/learn/nature/index.htm) for its old-growth wording; `summer-fun-lemonade-stand` maps to the live [PBS NewsHour lemonade-stand financial-literacy article](https://www.pbs.org/newshour/economy/want-your-kids-to-learn-the-power-of-money-start-a-lemonade-stand); `literal-phrases-starstruck` maps to [Merriam-Webster starstruck](https://www.merriam-webster.com/dictionary/starstruck); and `literal-phrases-time-flies` maps to [Merriam-Webster time flies](https://www.merriam-webster.com/dictionary/time%20flies). Omitted blocks have no remaining source obligations.

The Literal Phrases/Idioms boundary is deliberate: lexicalized metaphors and standalone compound expressions (`Couch Potato`, `Heart of Gold`, `Time Flies`) remain in Literal Phrases when their everyday reading is a noun/quality/time expression, while conventional advice or action idioms belong in Idioms. Literal Phrases remains at ten with no expansion.

Fix round 4 repaired exactly three blockers without changing accepted additions: the player-visible Literal Phrases description now states a concise child-friendly word-picture versus Idioms boundary and names no answer; `camping-s-mores` uses `🙋➕1️⃣😋` with the hint “Its name sounds like asking for another helping.”; and `national-parks-zion` uses `🟥🧗🪢🌊`, a hard hint about its fixed-chain summit route and narrow river canyon, and an NPS-stable Angels Landing/The Narrows fact. Final fix round 5 corrected “cable-assisted” to “fixed chain” and removed the remaining metadata jargon.

## Validation evidence

- RED focused run before data edits: the new C assertions failed as expected (4 failures).
- `npm run test -- src/lib/clue-audit.test.ts src/lib/content-audit.test.ts`: 2 files, 49 tests passed.
- `npm run test -- src/lib/puzzles.test.ts`: 1 file, 18 tests passed.
- `npm run test`: 14 files, 120 tests passed. The prior Task 9 packet-balance spread failure is no longer reproduced after the atomic reduction to 220 C cards.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed. Next.js emitted only the existing multiple-lockfile workspace-root warning.
- `git diff --check`: passed.

## Blind-review status and uncertainties

The prior staged evidence covers the accepted Jobs/Idioms additions and prior semantic changes. Final review requires a fresh two-card check for `camping-s-mores` and `national-parks-zion`, plus metadata review confirming that the visible Literal Phrases description is child-friendly and contains no shipped answer string. Those fresh checks remain pending. If any retained block fails, remove or replace the entire ten-card block; never ship a partial expansion.
