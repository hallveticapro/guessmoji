# Guessmoji Clue Audit

Generated: 2026-06-07

Source of truth: `PLAN.md` and `TASKS.md`

## Baseline Inventory

| Field | Value |
|---|---:|
| Total categories from `src/data/categories.ts` | 60 |
| Non-random categories | 59 |
| Shipped puzzle count from exported `puzzles` | 600 |
| Random Mix session count | 20 |
| Baseline test files from `npm run test` | 8 |
| Baseline test count from `npm run test` | 43 |

Audited source data files:

- `src/data/puzzles.ts`
- `src/data/expandedPacks.ts`

Baseline command evidence before clue edits:

- `npm run lint`: passed
- `npm run typecheck`: passed
- `npm run test`: passed with 8 test files and 43 tests
- `npm run build`: passed

## Category Review Matrix

| category id | category name | cards in source | cards reviewed | cards changed | status | evidence |
|---|---|---:|---:|---:|---|---|
| disney-movies | Disney Movies | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| disney-princesses | Disney Princesses | 12 | 12 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| pixar | Pixar | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| marvel | Marvel | 10 | 10 | 2 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| star-wars | Star Wars | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| dreamworks | DreamWorks | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| video-game-movies | Video Game Movies | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| kid-tv-shows | Kid TV Shows | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| animated-classics | Animated Classics | 18 | 18 | 1 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| animals | Animals | 10 | 10 | 10 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| ocean-animals | Ocean Animals | 10 | 10 | 10 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| dinosaurs | Dinosaurs | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| birds | Birds | 10 | 10 | 9 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| bugs | Insects and Bugs | 10 | 10 | 10 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| fruit | Fruit | 10 | 10 | 10 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| vegetables | Vegetables | 10 | 10 | 9 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| desserts | Desserts | 10 | 10 | 8 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| snacks | Snacks | 10 | 10 | 2 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| breakfast | Breakfast | 10 | 10 | 5 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| sports | Sports | 10 | 10 | 8 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| outdoor-games | Outdoor Games | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| board-games | Board Games | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| party-games | Card and Party Games | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| video-games | Video Games | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| arcade-classics | Arcade Classics | 10 | 10 | 1 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| pokemon | Pokemon | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| minecraft | Minecraft | 10 | 10 | 1 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| science | Science | 10 | 10 | 2 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| space | Space | 10 | 10 | 6 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| weather | Weather | 10 | 10 | 7 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| math | Math | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| books | Books and Stories | 10 | 10 | 1 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| fairy-tales | Fairy Tales | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| myths | Myths and Legends | 10 | 10 | 2 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| world-landmarks | World Landmarks | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| us-landmarks | U.S. Landmarks | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| world-geography | World Geography | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| vehicles | Vehicles | 10 | 10 | 10 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| construction | Construction Machines | 10 | 10 | 3 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| jobs | Jobs | 10 | 10 | 2 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| music-instruments | Musical Instruments | 10 | 10 | 10 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| music-genres | Music Genres | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| art-supplies | Art Supplies | 10 | 10 | 6 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| school-supplies | School Supplies | 10 | 10 | 9 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| camping | Camping | 10 | 10 | 6 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| national-parks | National Parks | 10 | 10 | 1 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| holidays | Holidays | 10 | 10 | 3 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| halloween | Halloween | 10 | 10 | 5 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| winter-holidays | Winter Holidays | 10 | 10 | 4 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| summer-fun | Summer Fun | 10 | 10 | 1 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| beach-day | Beach Day | 10 | 10 | 1 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| amusement-park | Amusement Park | 10 | 10 | 1 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| around-the-house | Around the House | 10 | 10 | 6 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| kitchen-tools | Kitchen Tools | 10 | 10 | 4 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| literal-phrases | Literal Phrases | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| idioms | Idioms | 10 | 10 | 0 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| emotions | Emotions | 10 | 10 | 2 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| robots | Robots | 10 | 10 | 5 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| plants | Plants | 10 | 10 | 6 | reviewed | Full-card review recorded; direct-answer leak test covers this category. |
| random-mix | Random Mix | 0 | 0 direct / derived from source pool | 0 | derived-reviewed | Derived from reviewed source puzzles. |

## Direct Emoji Candidate Inventory

Candidate answer count: 189

| category id | puzzle id | answer | direct emoji candidates | reviewer note |
|---|---|---|---|---|
| marvel | spider-man | Spider-Man | 🕷️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| marvel | ant-man | Ant-Man | 🐜 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| animated-classics | one-hundred-one-dalmatians | 101 Dalmatians | 🐶 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| animals | animals-cat | Cat | 🐱 🐈 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| animals | animals-dog | Dog | 🐶 🐕 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| animals | animals-elephant | Elephant | 🐘 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| animals | animals-giraffe | Giraffe | 🦒 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| animals | animals-penguin | Penguin | 🐧 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| animals | animals-kangaroo | Kangaroo | 🦘 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| animals | animals-tiger | Tiger | 🐅 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| animals | animals-panda | Panda | 🐼 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| animals | animals-fox | Fox | 🦊 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| animals | animals-sloth | Sloth | 🦥 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| ocean-animals | ocean-animals-shark | Shark | 🦈 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| ocean-animals | ocean-animals-dolphin | Dolphin | 🐬 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| ocean-animals | ocean-animals-octopus | Octopus | 🐙 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| ocean-animals | ocean-animals-sea-turtle | Sea Turtle | 🐢 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| ocean-animals | ocean-animals-jellyfish | Jellyfish | 🪼 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| ocean-animals | ocean-animals-whale | Whale | 🐋 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| ocean-animals | ocean-animals-seahorse | Seahorse | 🐴 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| ocean-animals | ocean-animals-crab | Crab | 🦀 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| ocean-animals | ocean-animals-starfish | Starfish | ⭐ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| ocean-animals | ocean-animals-clownfish | Clownfish | 🐠 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| birds | birds-owl | Owl | 🦉 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| birds | birds-eagle | Eagle | 🦅 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| birds | birds-parrot | Parrot | 🦜 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| birds | birds-flamingo | Flamingo | 🦩 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| birds | birds-peacock | Peacock | 🦚 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| birds | birds-hummingbird | Hummingbird | 🐦 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| birds | birds-penguin | Penguin | 🐧 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| birds | birds-swan | Swan | 🦢 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| birds | birds-robin | Robin | 🐦 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| bugs | bugs-butterfly | Butterfly | 🦋 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| bugs | bugs-bee | Bee | 🐝 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| bugs | bugs-ladybug | Ladybug | 🐞 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| bugs | bugs-ant | Ant | 🐜 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| bugs | bugs-dragonfly | Dragonfly | 🪰 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| bugs | bugs-grasshopper | Grasshopper | 🦗 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| bugs | bugs-firefly | Firefly | 🪲 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| bugs | bugs-mosquito | Mosquito | 🦟 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| bugs | bugs-caterpillar | Caterpillar | 🐛 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| bugs | bugs-spider | Spider | 🕷️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| fruit | fruit-apple | Apple | 🍎 🍏 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| fruit | fruit-banana | Banana | 🍌 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| fruit | fruit-strawberry | Strawberry | 🍓 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| fruit | fruit-watermelon | Watermelon | 🍉 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| fruit | fruit-pineapple | Pineapple | 🍍 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| fruit | fruit-grapes | Grapes | 🍇 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| fruit | fruit-orange | Orange | 🍊 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| fruit | fruit-mango | Mango | 🥭 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| fruit | fruit-kiwi | Kiwi | 🥝 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| fruit | fruit-cherry | Cherry | 🍒 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vegetables | vegetables-carrot | Carrot | 🥕 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vegetables | vegetables-broccoli | Broccoli | 🥦 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vegetables | vegetables-corn | Corn | 🌽 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vegetables | vegetables-potato | Potato | 🥔 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vegetables | vegetables-tomato | Tomato | 🍅 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vegetables | vegetables-cucumber | Cucumber | 🥒 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vegetables | vegetables-pumpkin | Pumpkin | 🎃 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vegetables | vegetables-onion | Onion | 🧅 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vegetables | vegetables-lettuce | Lettuce | 🥬 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| desserts | desserts-ice-cream | Ice Cream | 🍦 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| desserts | desserts-cupcake | Cupcake | 🧁 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| desserts | desserts-chocolate-chip-cookie | Chocolate Chip Cookie | 🍪 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| desserts | desserts-donut | Donut | 🍩 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| desserts | desserts-cheesecake | Cheesecake | 🍰 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| desserts | desserts-apple-pie | Apple Pie | 🍎 🍏 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| desserts | desserts-popsicle | Popsicle | 🍭 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| desserts | desserts-milkshake | Milkshake | 🥤 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| snacks | snacks-popcorn | Popcorn | 🍿 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| snacks | snacks-pretzel | Pretzel | 🥨 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| breakfast | breakfast-pancakes | Pancakes | 🥞 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| breakfast | breakfast-waffles | Waffles | 🧇 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| breakfast | breakfast-toast | Toast | 🍞 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| breakfast | breakfast-bagel | Bagel | 🥯 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| breakfast | breakfast-omelet | Omelet | 🍳 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| sports | sports-basketball | Basketball | 🏀 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| sports | sports-baseball | Baseball | ⚾ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| sports | sports-football | Football | 🏈 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| sports | sports-tennis | Tennis | 🎾 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| sports | sports-swimming | Swimming | 🏊‍♂️ 🏊‍♀️ 🏊 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| sports | sports-hockey | Hockey | 🏒 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| sports | sports-volleyball | Volleyball | 🏐 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| sports | sports-golf | Golf | ⛳ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| arcade-classics | arcade-classics-frogger | Frogger | 🐸 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| minecraft | minecraft-bee-nest | Bee Nest | 🐝 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| science | science-microscope | Microscope | 🔬 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| science | science-magnet | Magnet | 🧲 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| space | space-moon | Moon | 🌕 🌙 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| space | space-comet | Comet | ☄️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| space | space-astronaut | Astronaut | 👩‍🚀 👨‍🚀 🧑‍🚀 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| space | space-rocket | Rocket | 🚀 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| space | space-black-hole | Black Hole | 🕳️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| space | space-telescope | Telescope | 🔭 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| weather | weather-rain | Rain | 🌧️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| weather | weather-snow | Snow | ❄️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| weather | weather-rainbow | Rainbow | 🌈 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| weather | weather-tornado | Tornado | 🌪️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| weather | weather-fog | Fog | 🌫️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| weather | weather-wind | Wind | 💨 🌬️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| weather | weather-cloud | Cloud | ☁️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| books | books-dog-man | Dog Man | 🐶 🐕 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| myths | myths-dragon | Dragon | 🐉 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| myths | myths-unicorn | Unicorn | 🦄 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vehicles | vehicles-car | Car | 🚗 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vehicles | vehicles-bus | Bus | 🚌 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vehicles | vehicles-train | Train | 🚂 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vehicles | vehicles-airplane | Airplane | ✈️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vehicles | vehicles-boat | Boat | 🚤 🛥️ ⛵ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vehicles | vehicles-bicycle | Bicycle | 🚲 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vehicles | vehicles-motorcycle | Motorcycle | 🏍️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vehicles | vehicles-helicopter | Helicopter | 🚁 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vehicles | vehicles-submarine | Submarine | 🚢 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| vehicles | vehicles-scooter | Scooter | 🛴 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| construction | construction-crane | Crane | 🏗️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| construction | construction-bulldozer | Bulldozer | 🚜 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| construction | construction-hard-hat | Hard Hat | ⛑️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| jobs | jobs-firefighter | Firefighter | 👩‍🚒 👨‍🚒 🧑‍🚒 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| jobs | jobs-astronaut | Astronaut | 👩‍🚀 👨‍🚀 🧑‍🚀 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| music-instruments | music-instruments-guitar | Guitar | 🎸 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| music-instruments | music-instruments-piano | Piano | 🎹 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| music-instruments | music-instruments-drums | Drums | 🥁 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| music-instruments | music-instruments-violin | Violin | 🎻 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| music-instruments | music-instruments-trumpet | Trumpet | 🎺 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| music-instruments | music-instruments-flute | Flute | 🪈 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| music-instruments | music-instruments-saxophone | Saxophone | 🎷 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| music-instruments | music-instruments-harp | Harp | 🪕 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| music-instruments | music-instruments-tambourine | Tambourine | 🪘 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| music-instruments | music-instruments-accordion | Accordion | 🪗 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| art-supplies | art-supplies-paintbrush | Paintbrush | 🖌️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| art-supplies | art-supplies-crayons | Crayons | 🖍️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| art-supplies | art-supplies-markers | Markers | 🖊️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| art-supplies | art-supplies-glue | Glue | 🧴 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| art-supplies | art-supplies-palette | Palette | 🎨 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| art-supplies | art-supplies-sketchbook | Sketchbook | 📓 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| school-supplies | school-supplies-pencil | Pencil | ✏️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| school-supplies | school-supplies-backpack | Backpack | 🎒 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| school-supplies | school-supplies-notebook | Notebook | 📓 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| school-supplies | school-supplies-eraser | Eraser | 🧽 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| school-supplies | school-supplies-ruler | Ruler | 📏 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| school-supplies | school-supplies-glue-stick | Glue Stick | 🧴 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| school-supplies | school-supplies-calculator | Calculator | 🧮 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| school-supplies | school-supplies-binder | Binder | 📒 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| school-supplies | school-supplies-lunchbox | Lunchbox | 🍱 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| camping | camping-tent | Tent | ⛺ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| camping | camping-campfire | Campfire | 🔥 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| camping | camping-flashlight | Flashlight | 🔦 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| camping | camping-compass | Compass | 🧭 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| camping | camping-canoe | Canoe | 🛶 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| camping | camping-binoculars | Binoculars | 🔭 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| national-parks | national-parks-glacier | Glacier | 🧊 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| holidays | holidays-halloween | Halloween | 🎃 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| holidays | holidays-christmas | Christmas | 🎄 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| holidays | holidays-hanukkah | Hanukkah | 🕎 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| halloween | halloween-jack-o-lantern | Jack-o'-Lantern | 🎃 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| halloween | halloween-ghost | Ghost | 👻 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| halloween | halloween-witch | Witch | 🧙‍♀️ 🧙‍♂️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| halloween | halloween-vampire | Vampire | 🧛‍♂️ 🧛‍♀️ 🧛 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| halloween | halloween-black-cat | Black Cat | 🐈‍⬛ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| winter-holidays | winter-holidays-christmas-tree | Christmas Tree | 🎄 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| winter-holidays | winter-holidays-snowman | Snowman | ☃️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| winter-holidays | winter-holidays-menorah | Menorah | 🕎 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| winter-holidays | winter-holidays-ice-skating | Ice Skating | ⛸️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| summer-fun | summer-fun-fireworks | Fireworks | 🎆 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| beach-day | beach-day-seashell | Seashell | 🐚 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| amusement-park | amusement-park-ferris-wheel | Ferris Wheel | 🎡 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| around-the-house | around-the-house-sofa | Sofa | 🛋️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| around-the-house | around-the-house-bed | Bed | 🛏️ | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| around-the-house | around-the-house-lamp | Lamp | 💡 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| around-the-house | around-the-house-washing-machine | Washing Machine | 🧺 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| around-the-house | around-the-house-refrigerator | Refrigerator | 🧊 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| around-the-house | around-the-house-doorbell | Doorbell | 🔔 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| kitchen-tools | kitchen-tools-measuring-cup | Measuring Cup | 🥛 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| kitchen-tools | kitchen-tools-blender | Blender | 🥤 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| kitchen-tools | kitchen-tools-colander | Colander | 🥣 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| kitchen-tools | kitchen-tools-can-opener | Can Opener | 🥫 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| emotions | emotions-angry | Angry | 😡 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| emotions | emotions-surprised | Surprised | 😲 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| robots | robots-robot | Robot | 🤖 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| robots | robots-drone | Drone | 🚁 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| robots | robots-rover | Rover | 🤖 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| robots | robots-ai-assistant | AI Assistant | 🤖 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| robots | robots-robot-dog | Robot Dog | 🐕 🤖 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| plants | plants-sunflower | Sunflower | 🌻 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| plants | plants-cactus | Cactus | 🌵 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| plants | plants-rose | Rose | 🌹 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| plants | plants-mushroom | Mushroom | 🍄 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| plants | plants-palm-tree | Palm Tree | 🌴 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |
| plants | plants-pumpkin-vine | Pumpkin Vine | 🎃 | Banned direct answer emoji; clue reviewed and cleaned when old clue contained one. |

Categories reviewed with no direct emoji candidates found: disney-movies (Disney Movies); disney-princesses (Disney Princesses); pixar (Pixar); star-wars (Star Wars); dreamworks (DreamWorks); video-game-movies (Video Game Movies); kid-tv-shows (Kid TV Shows); dinosaurs (Dinosaurs); outdoor-games (Outdoor Games); board-games (Board Games); party-games (Card and Party Games); video-games (Video Games); pokemon (Pokemon); math (Math); fairy-tales (Fairy Tales); world-landmarks (World Landmarks); us-landmarks (U.S. Landmarks); world-geography (World Geography); music-genres (Music Genres); literal-phrases (Literal Phrases); idioms (Idioms).

## Changed Puzzle IDs

Changed puzzle count: 189

- `spider-man`
- `ant-man`
- `one-hundred-one-dalmatians`
- `animals-cat`
- `animals-dog`
- `animals-elephant`
- `animals-giraffe`
- `animals-penguin`
- `animals-kangaroo`
- `animals-tiger`
- `animals-panda`
- `animals-fox`
- `animals-sloth`
- `ocean-animals-shark`
- `ocean-animals-dolphin`
- `ocean-animals-octopus`
- `ocean-animals-sea-turtle`
- `ocean-animals-jellyfish`
- `ocean-animals-whale`
- `ocean-animals-seahorse`
- `ocean-animals-crab`
- `ocean-animals-starfish`
- `ocean-animals-clownfish`
- `birds-owl`
- `birds-eagle`
- `birds-parrot`
- `birds-flamingo`
- `birds-peacock`
- `birds-hummingbird`
- `birds-penguin`
- `birds-swan`
- `birds-robin`
- `bugs-butterfly`
- `bugs-bee`
- `bugs-ladybug`
- `bugs-ant`
- `bugs-dragonfly`
- `bugs-grasshopper`
- `bugs-firefly`
- `bugs-mosquito`
- `bugs-caterpillar`
- `bugs-spider`
- `fruit-apple`
- `fruit-banana`
- `fruit-strawberry`
- `fruit-watermelon`
- `fruit-pineapple`
- `fruit-grapes`
- `fruit-orange`
- `fruit-mango`
- `fruit-kiwi`
- `fruit-cherry`
- `vegetables-carrot`
- `vegetables-broccoli`
- `vegetables-corn`
- `vegetables-potato`
- `vegetables-tomato`
- `vegetables-cucumber`
- `vegetables-pumpkin`
- `vegetables-onion`
- `vegetables-lettuce`
- `desserts-ice-cream`
- `desserts-cupcake`
- `desserts-chocolate-chip-cookie`
- `desserts-donut`
- `desserts-cheesecake`
- `desserts-apple-pie`
- `desserts-popsicle`
- `desserts-milkshake`
- `snacks-popcorn`
- `snacks-pretzel`
- `breakfast-pancakes`
- `breakfast-waffles`
- `breakfast-toast`
- `breakfast-bagel`
- `breakfast-omelet`
- `sports-basketball`
- `sports-baseball`
- `sports-football`
- `sports-tennis`
- `sports-swimming`
- `sports-hockey`
- `sports-volleyball`
- `sports-golf`
- `arcade-classics-frogger`
- `minecraft-bee-nest`
- `science-microscope`
- `science-magnet`
- `space-moon`
- `space-comet`
- `space-astronaut`
- `space-rocket`
- `space-black-hole`
- `space-telescope`
- `weather-rain`
- `weather-snow`
- `weather-rainbow`
- `weather-tornado`
- `weather-fog`
- `weather-wind`
- `weather-cloud`
- `books-dog-man`
- `myths-dragon`
- `myths-unicorn`
- `vehicles-car`
- `vehicles-bus`
- `vehicles-train`
- `vehicles-airplane`
- `vehicles-boat`
- `vehicles-bicycle`
- `vehicles-motorcycle`
- `vehicles-helicopter`
- `vehicles-submarine`
- `vehicles-scooter`
- `construction-crane`
- `construction-bulldozer`
- `construction-hard-hat`
- `jobs-firefighter`
- `jobs-astronaut`
- `music-instruments-guitar`
- `music-instruments-piano`
- `music-instruments-drums`
- `music-instruments-violin`
- `music-instruments-trumpet`
- `music-instruments-flute`
- `music-instruments-saxophone`
- `music-instruments-harp`
- `music-instruments-tambourine`
- `music-instruments-accordion`
- `art-supplies-paintbrush`
- `art-supplies-crayons`
- `art-supplies-markers`
- `art-supplies-glue`
- `art-supplies-palette`
- `art-supplies-sketchbook`
- `school-supplies-pencil`
- `school-supplies-backpack`
- `school-supplies-notebook`
- `school-supplies-eraser`
- `school-supplies-ruler`
- `school-supplies-glue-stick`
- `school-supplies-calculator`
- `school-supplies-binder`
- `school-supplies-lunchbox`
- `camping-tent`
- `camping-campfire`
- `camping-flashlight`
- `camping-compass`
- `camping-canoe`
- `camping-binoculars`
- `national-parks-glacier`
- `holidays-halloween`
- `holidays-christmas`
- `holidays-hanukkah`
- `halloween-jack-o-lantern`
- `halloween-ghost`
- `halloween-witch`
- `halloween-vampire`
- `halloween-black-cat`
- `winter-holidays-christmas-tree`
- `winter-holidays-snowman`
- `winter-holidays-menorah`
- `winter-holidays-ice-skating`
- `summer-fun-fireworks`
- `beach-day-seashell`
- `amusement-park-ferris-wheel`
- `around-the-house-sofa`
- `around-the-house-bed`
- `around-the-house-lamp`
- `around-the-house-washing-machine`
- `around-the-house-refrigerator`
- `around-the-house-doorbell`
- `kitchen-tools-measuring-cup`
- `kitchen-tools-blender`
- `kitchen-tools-colander`
- `kitchen-tools-can-opener`
- `emotions-angry`
- `emotions-surprised`
- `robots-robot`
- `robots-drone`
- `robots-rover`
- `robots-ai-assistant`
- `robots-robot-dog`
- `plants-sunflower`
- `plants-cactus`
- `plants-rose`
- `plants-mushroom`
- `plants-palm-tree`
- `plants-pumpkin-vine`

## Changed Puzzle Details

| category id | puzzle id | answer | old clue | new clue |
|---|---|---|---|---|
| marvel | spider-man | Spider-Man | 🕷️🕸️🏙️🦸‍♂️📸 | 🕸️🏙️🦸‍♂️📸 |
| marvel | ant-man | Ant-Man | 🐜🔍🦸‍♂️📏🏙️ | 🔍🦸‍♂️📏🏙️ |
| animated-classics | one-hundred-one-dalmatians | 101 Dalmatians | 🐶⚫⚪1️⃣0️⃣1️⃣ | ⚫⚪1️⃣0️⃣1️⃣ |
| animals | animals-cat | Cat | 🐱🧶🥛🏠 | 🧶🥛🏠 |
| animals | animals-dog | Dog | 🐶🦴🎾🏡 | 🦴🎾🏡 |
| animals | animals-elephant | Elephant | 🐘🌿💧👂 | 🌿💧👂 |
| animals | animals-giraffe | Giraffe | 🦒🌳🍃☀️ | 🌳🍃☀️ |
| animals | animals-penguin | Penguin | 🐧🧊🐟❄️ | 🧊🐟❄️ |
| animals | animals-kangaroo | Kangaroo | 🦘👶🌏🦵 | 👶🌏🦵 |
| animals | animals-tiger | Tiger | 🐅🌿👀🧡 | 🌿👀🧡 |
| animals | animals-panda | Panda | 🐼🎍⚫⚪ | 🎍⚫⚪ |
| animals | animals-fox | Fox | 🦊🌙🌲👂 | 🌙🌲👂 |
| animals | animals-sloth | Sloth | 🦥🌳😴🍃 | 🌳😴🍃 |
| ocean-animals | ocean-animals-shark | Shark | 🦈🌊🦷⚠️ | 🌊🦷⚠️ |
| ocean-animals | ocean-animals-dolphin | Dolphin | 🐬🌊🎵🤝 | 🌊🎵🤝 |
| ocean-animals | ocean-animals-octopus | Octopus | 🐙🪸🫧🎨 | 🪸🫧🎨 |
| ocean-animals | ocean-animals-sea-turtle | Sea Turtle | 🐢🌊🏝️🥚 | 🌊🏝️🥚 |
| ocean-animals | ocean-animals-jellyfish | Jellyfish | 🪼🌊✨🫧 | 🌊✨🫧 |
| ocean-animals | ocean-animals-whale | Whale | 🐋🌊💨🎶 | 🌊💨🎶 |
| ocean-animals | ocean-animals-seahorse | Seahorse | 🌊🐴🪸👶 | 🌊🪸👶 |
| ocean-animals | ocean-animals-crab | Crab | 🦀🏖️🪨🦞 | 🏖️🪨🦞 |
| ocean-animals | ocean-animals-starfish | Starfish | ⭐🌊🪸🖐️ | 🌊🪸🖐️ |
| ocean-animals | ocean-animals-clownfish | Clownfish | 🐠🪸🧡🤍 | 🪸🧡🤍 |
| birds | birds-owl | Owl | 🦉🌙👀🌲 | 🌙👀🌲 |
| birds | birds-eagle | Eagle | 🦅🏔️👁️🇺🇸 | 🏔️👁️🇺🇸 |
| birds | birds-parrot | Parrot | 🦜🌴🗣️🌈 | 🌴🗣️🌈 |
| birds | birds-flamingo | Flamingo | 🦩💗🦐💧 | 💗🦐💧 |
| birds | birds-peacock | Peacock | 🦚🌈👑✨ | 🌈👑✨ |
| birds | birds-hummingbird | Hummingbird | 🐦🌺⚡🪽 | 🌺⚡🪽 |
| birds | birds-penguin | Penguin | 🐧🧊🐟🌊 | 🧊🐟🌊 |
| birds | birds-swan | Swan | 🦢💧🤍👑 | 💧🤍👑 |
| birds | birds-robin | Robin | 🐦🪱🌳🔴 | 🪱🌳🔴 |
| bugs | bugs-butterfly | Butterfly | 🦋🌸☀️🪄 | 🌸☀️🪄 |
| bugs | bugs-bee | Bee | 🐝🌼🍯🏠 | 🌼🍯🏠 |
| bugs | bugs-ladybug | Ladybug | 🐞🍃🔴⚫ | 🍃🔴⚫ |
| bugs | bugs-ant | Ant | 🐜🏠🍞👥 | 🏠🍞👥 |
| bugs | bugs-dragonfly | Dragonfly | 🪰💧⚡🪽 | 💧⚡🪽 |
| bugs | bugs-grasshopper | Grasshopper | 🦗🌾🦵💚 | 🌾🦵💚 |
| bugs | bugs-firefly | Firefly | ✨🪲🌙💡 | ✨🌙💡 |
| bugs | bugs-mosquito | Mosquito | 🦟💧🌙😬 | 💧🌙😬 |
| bugs | bugs-caterpillar | Caterpillar | 🐛🍃🦋⏳ | 🍃🦋⏳ |
| bugs | bugs-spider | Spider | 🕷️🕸️🪰🌙 | 🕸️🪰🌙 |
| fruit | fruit-apple | Apple | 🍎🌳🍏🥧 | 🌳🥧 |
| fruit | fruit-banana | Banana | 🍌🐒🌴💛 | 🐒🌴💛 |
| fruit | fruit-strawberry | Strawberry | 🍓🌱❤️🍰 | 🌱❤️🍰 |
| fruit | fruit-watermelon | Watermelon | 🍉☀️🏖️💧 | ☀️🏖️💧 |
| fruit | fruit-pineapple | Pineapple | 🍍🌴☀️👑 | 🌴☀️👑 |
| fruit | fruit-grapes | Grapes | 🍇🌿🧃🍷 | 🌿🧃🍷 |
| fruit | fruit-orange | Orange | 🍊🌳☀️🧃 | 🌳☀️🧃 |
| fruit | fruit-mango | Mango | 🥭🌴☀️🧡 | 🌴☀️🧡 |
| fruit | fruit-kiwi | Kiwi | 🥝🟢🥄🌱 | 🟢🥄🌱 |
| fruit | fruit-cherry | Cherry | 🍒🌳❤️🥧 | 🌳❤️🥧 |
| vegetables | vegetables-carrot | Carrot | 🥕🐰🌱🧡 | 🐰🌱🧡 |
| vegetables | vegetables-broccoli | Broccoli | 🥦🌳💚🍽️ | 🌳💚🍽️ |
| vegetables | vegetables-corn | Corn | 🌽🚜☀️🧈 | 🚜☀️🧈 |
| vegetables | vegetables-potato | Potato | 🥔🌱🍟🥣 | 🌱🍟🥣 |
| vegetables | vegetables-tomato | Tomato | 🍅🌱🍝🥗 | 🌱🍝🥗 |
| vegetables | vegetables-cucumber | Cucumber | 🥒💧🥗🟢 | 💧🥗🟢 |
| vegetables | vegetables-pumpkin | Pumpkin | 🎃🌱🥧🍂 | 🌱🥧🍂 |
| vegetables | vegetables-onion | Onion | 🧅🔪😭🍲 | 🔪😭🍲 |
| vegetables | vegetables-lettuce | Lettuce | 🥬🥗💚🥪 | 🥗💚🥪 |
| desserts | desserts-ice-cream | Ice Cream | 🍦❄️🥄🍫 | ❄️🥄🍫 |
| desserts | desserts-cupcake | Cupcake | 🧁🎉🕯️🍓 | 🎉🕯️🍓 |
| desserts | desserts-chocolate-chip-cookie | Chocolate Chip Cookie | 🍪🍫🥛🔥 | 🍫🥛🔥 |
| desserts | desserts-donut | Donut | 🍩☕✨🍓 | ☕✨🍓 |
| desserts | desserts-cheesecake | Cheesecake | 🍰🧀🍓🥄 | 🧀🍓🥄 |
| desserts | desserts-apple-pie | Apple Pie | 🍎🥧🍂🥄 | 🥧🍂🥄 |
| desserts | desserts-popsicle | Popsicle | 🧊🍭☀️🌈 | 🧊☀️🌈 |
| desserts | desserts-milkshake | Milkshake | 🥤🍦🍓🌀 | 🍦🍓🌀 |
| snacks | snacks-popcorn | Popcorn | 🍿🎬🧂🔥 | 🎬🧂🔥 |
| snacks | snacks-pretzel | Pretzel | 🥨🧂🥖🌀 | 🧂🥖🌀 |
| breakfast | breakfast-pancakes | Pancakes | 🥞🧈🍁🍓 | 🧈🍁🍓 |
| breakfast | breakfast-waffles | Waffles | 🧇🍓🍯☕ | 🍓🍯☕ |
| breakfast | breakfast-toast | Toast | 🍞🔥🧈🍓 | 🔥🧈🍓 |
| breakfast | breakfast-bagel | Bagel | 🥯🧀☕🌆 | 🧀☕🌆 |
| breakfast | breakfast-omelet | Omelet | 🥚🍳🧀🌿 | 🥚🧀🌿 |
| sports | sports-basketball | Basketball | 🏀⛹️‍♀️🗑️🏟️ | ⛹️‍♀️🗑️🏟️ |
| sports | sports-baseball | Baseball | ⚾🧢🧤🏟️ | 🧢🧤🏟️ |
| sports | sports-football | Football | 🏈🏟️🛡️📣 | 🏟️🛡️📣 |
| sports | sports-tennis | Tennis | 🎾🏸🏃‍♀️☀️ | 🏸🏃‍♀️☀️ |
| sports | sports-swimming | Swimming | 🏊‍♂️💧🏁🥽 | 💧🏁🥽 |
| sports | sports-hockey | Hockey | 🏒🥅🧊⚡ | 🥅🧊⚡ |
| sports | sports-volleyball | Volleyball | 🏐🤾‍♀️🏖️🥅 | 🤾‍♀️🏖️🥅 |
| sports | sports-golf | Golf | ⛳🏌️‍♂️🌳🏁 | 🏌️‍♂️🌳🏁 |
| arcade-classics | arcade-classics-frogger | Frogger | 🐸🚗🌊🏠 | 🚗🌊🏠 |
| minecraft | minecraft-bee-nest | Bee Nest | 🐝🍯🌳🌼 | 🍯🌳🌼 |
| science | science-microscope | Microscope | 🔬👁️🦠🔎 | 👁️🦠🔎 |
| science | science-magnet | Magnet | 🧲📎⚙️🔴 | 📎⚙️🔴 |
| space | space-moon | Moon | 🌕🌙🚀👣 | 🚀👣 |
| space | space-comet | Comet | ☄️🧊🌌💨 | 🧊🌌💨 |
| space | space-astronaut | Astronaut | 👩‍🚀🚀🌌🛰️ | 🚀🌌🛰️ |
| space | space-rocket | Rocket | 🚀🔥🌌⬆️ | 🔥🌌⬆️ |
| space | space-black-hole | Black Hole | 🕳️🌌💫⚫ | 🌌💫⚫ |
| space | space-telescope | Telescope | 🔭👁️⭐🌙 | 👁️⭐🌙 |
| weather | weather-rain | Rain | 🌧️☔💧🌂 | ☔💧🌂 |
| weather | weather-snow | Snow | ❄️☃️🧤🌨️ | ☃️🧤🌨️ |
| weather | weather-rainbow | Rainbow | 🌈🌧️☀️✨ | 🌧️☀️✨ |
| weather | weather-tornado | Tornado | 🌪️🏠⚠️🌫️ | 🏠⚠️🌫️ |
| weather | weather-fog | Fog | 🌫️👀🚗💧 | 👀🚗💧 |
| weather | weather-wind | Wind | 💨🌬️🍃🪁 | 🍃🪁 |
| weather | weather-cloud | Cloud | ☁️🌤️💧✈️ | 🌤️💧✈️ |
| books | books-dog-man | Dog Man | 🐶👮‍♂️📚😂 | 👮‍♂️📚😂 |
| myths | myths-dragon | Dragon | 🐉🔥🏰💎 | 🔥🏰💎 |
| myths | myths-unicorn | Unicorn | 🦄🌈✨🌲 | 🌈✨🌲 |
| vehicles | vehicles-car | Car | 🚗🛣️⛽🔑 | 🛣️⛽🔑 |
| vehicles | vehicles-bus | Bus | 🚌🚏👥🛣️ | 🚏👥🛣️ |
| vehicles | vehicles-train | Train | 🚂🛤️🎫🏙️ | 🛤️🎫🏙️ |
| vehicles | vehicles-airplane | Airplane | ✈️☁️🧳🌍 | ☁️🧳🌍 |
| vehicles | vehicles-boat | Boat | 🚤🌊⚓☀️ | 🌊⚓☀️ |
| vehicles | vehicles-bicycle | Bicycle | 🚲🪖🛣️💨 | 🪖🛣️💨 |
| vehicles | vehicles-motorcycle | Motorcycle | 🏍️🪖💨🛣️ | 🪖💨🛣️ |
| vehicles | vehicles-helicopter | Helicopter | 🚁🌀🏥🏔️ | 🌀🏥🏔️ |
| vehicles | vehicles-submarine | Submarine | 🚢⬇️🌊🐟 | ⬇️🌊🐟 |
| vehicles | vehicles-scooter | Scooter | 🛴👟🏙️⚡ | 👟🏙️⚡ |
| construction | construction-crane | Crane | 🏗️🔩⬆️🏙️ | 🔩⬆️🏙️ |
| construction | construction-bulldozer | Bulldozer | 🚜🟨🪨➡️ | 🟨🪨➡️ |
| construction | construction-hard-hat | Hard Hat | ⛑️🏗️👷🛡️ | 🏗️👷🛡️ |
| jobs | jobs-firefighter | Firefighter | 🚒🔥👩‍🚒💧 | 🚒🔥💧 |
| jobs | jobs-astronaut | Astronaut | 👩‍🚀🚀🌌🔬 | 🚀🌌🔬 |
| music-instruments | music-instruments-guitar | Guitar | 🎸🎵🤘🪕 | 🎵🤘🪕 |
| music-instruments | music-instruments-piano | Piano | 🎹🎼🖐️⚫ | 🎼🖐️⚫ |
| music-instruments | music-instruments-drums | Drums | 🥁🎵⚡🦶 | 🎵⚡🦶 |
| music-instruments | music-instruments-violin | Violin | 🎻🎼🧵✨ | 🎼🧵✨ |
| music-instruments | music-instruments-trumpet | Trumpet | 🎺💨🎵✨ | 💨🎵✨ |
| music-instruments | music-instruments-flute | Flute | 🪈💨🎶🌬️ | 💨🎶🌬️ |
| music-instruments | music-instruments-saxophone | Saxophone | 🎷🎶🕶️🌃 | 🎶🕶️🌃 |
| music-instruments | music-instruments-harp | Harp | 🎶🪕✨👼 | 🎶✨👼 |
| music-instruments | music-instruments-tambourine | Tambourine | 🪘🔔👏🎵 | 🔔👏🎵 |
| music-instruments | music-instruments-accordion | Accordion | 🪗🎶🫁🎪 | 🎶🫁🎪 |
| art-supplies | art-supplies-paintbrush | Paintbrush | 🖌️🎨🖼️💧 | 🎨🖼️💧 |
| art-supplies | art-supplies-crayons | Crayons | 🖍️🌈📄✋ | 🌈📄✋ |
| art-supplies | art-supplies-markers | Markers | 🖊️🌈📓✨ | 🌈📓✨ |
| art-supplies | art-supplies-glue | Glue | 🧴📄✨🧩 | 📄✨🧩 |
| art-supplies | art-supplies-palette | Palette | 🎨🌈🖌️🧑‍🎨 | 🌈🖌️🧑‍ |
| art-supplies | art-supplies-sketchbook | Sketchbook | 📓✏️👀💡 | ✏️👀💡 |
| school-supplies | school-supplies-pencil | Pencil | ✏️📄🧠✍️ | 📄🧠✍️ |
| school-supplies | school-supplies-backpack | Backpack | 🎒📚🥪🚶 | 📚🥪🚶 |
| school-supplies | school-supplies-notebook | Notebook | 📓✍️📚✅ | ✍️📚✅ |
| school-supplies | school-supplies-eraser | Eraser | 🧽✏️❌📄 | ✏️❌📄 |
| school-supplies | school-supplies-ruler | Ruler | 📏📐✏️🔢 | 📐✏️🔢 |
| school-supplies | school-supplies-glue-stick | Glue Stick | 🧴📄✂️✨ | 📄✂️✨ |
| school-supplies | school-supplies-calculator | Calculator | 🧮🔢➕✅ | 🔢➕✅ |
| school-supplies | school-supplies-binder | Binder | 📒🔗📄🗂️ | 🔗📄🗂️ |
| school-supplies | school-supplies-lunchbox | Lunchbox | 🍱🥪🍎🥤 | 🥪🍎🥤 |
| camping | camping-tent | Tent | ⛺🌲🌙🛏️ | 🌲🌙🛏️ |
| camping | camping-campfire | Campfire | 🔥🪵🌙🍫 | 🪵🌙🍫 |
| camping | camping-flashlight | Flashlight | 🔦🌙🔋👀 | 🌙🔋👀 |
| camping | camping-compass | Compass | 🧭🗺️🌲➡️ | 🗺️🌲➡️ |
| camping | camping-canoe | Canoe | 🛶💧🌲🦆 | 💧🌲🦆 |
| camping | camping-binoculars | Binoculars | 🔭🐦🌲👀 | 🐦🌲👀 |
| national-parks | national-parks-glacier | Glacier | 🏔️🧊🐐🌲 | 🏔️🐐🌲 |
| holidays | holidays-halloween | Halloween | 🎃👻🍬🌙 | 👻🍬🌙 |
| holidays | holidays-christmas | Christmas | 🎄🎁⭐🎅 | 🎁⭐🎅 |
| holidays | holidays-hanukkah | Hanukkah | 🕎🕯️🎁🥔 | 🕯️🎁🥔 |
| halloween | halloween-jack-o-lantern | Jack-o'-Lantern | 🎃🕯️🔪🌙 | 🕯️🔪🌙 |
| halloween | halloween-ghost | Ghost | 👻🌙🏚️😱 | 🌙🏚️😱 |
| halloween | halloween-witch | Witch | 🧙‍♀️🧹🌙🐈‍⬛ | 🧹🌙🐈‍⬛ |
| halloween | halloween-vampire | Vampire | 🧛‍♂️🦇🌙🧄 | 🦇🌙🧄 |
| halloween | halloween-black-cat | Black Cat | 🐈‍⬛🌙👀✨ | 🌙👀✨ |
| winter-holidays | winter-holidays-christmas-tree | Christmas Tree | 🎄⭐🎁✨ | ⭐🎁✨ |
| winter-holidays | winter-holidays-snowman | Snowman | ☃️❄️🧣🥕 | ❄️🧣🥕 |
| winter-holidays | winter-holidays-menorah | Menorah | 🕎🕯️✨8️⃣ | 🕯️✨8️⃣ |
| winter-holidays | winter-holidays-ice-skating | Ice Skating | ⛸️🧊🎶❄️ | 🧊🎶❄️ |
| summer-fun | summer-fun-fireworks | Fireworks | 🎆🌙✨👀 | 🌙✨👀 |
| beach-day | beach-day-seashell | Seashell | 🐚🌊👂✨ | 🌊👂✨ |
| amusement-park | amusement-park-ferris-wheel | Ferris Wheel | 🎡🌃🎟️✨ | 🌃🎟️✨ |
| around-the-house | around-the-house-sofa | Sofa | 🛋️📺😴🏠 | 📺😴🏠 |
| around-the-house | around-the-house-bed | Bed | 🛏️🌙😴⏰ | 🌙😴⏰ |
| around-the-house | around-the-house-lamp | Lamp | 💡🛋️📖🔌 | 🛋️📖🔌 |
| around-the-house | around-the-house-washing-machine | Washing Machine | 🧺🌀💧👕 | 🌀💧👕 |
| around-the-house | around-the-house-refrigerator | Refrigerator | 🧊🚪🥛🍎 | 🚪🥛🍎 |
| around-the-house | around-the-house-doorbell | Doorbell | 🚪🔔👂🏠 | 🚪👂🏠 |
| kitchen-tools | kitchen-tools-measuring-cup | Measuring Cup | 🥛📏🥣✅ | 📏🥣✅ |
| kitchen-tools | kitchen-tools-blender | Blender | 🥤🌀🍓🔌 | 🌀🍓🔌 |
| kitchen-tools | kitchen-tools-colander | Colander | 🍝💧🕳️🥣 | 🍝💧🕳️ |
| kitchen-tools | kitchen-tools-can-opener | Can Opener | 🥫🔧🔄🍲 | 🔧🔄🍲 |
| emotions | emotions-angry | Angry | 😡🔥💢✊ | 🔥💢✊ |
| emotions | emotions-surprised | Surprised | 😲🎁⚡❗ | 🎁⚡❗ |
| robots | robots-robot | Robot | 🤖⚙️🔋💬 | ⚙️🔋💬 |
| robots | robots-drone | Drone | 🚁📷🔋🌤️ | 📷🔋🌤️ |
| robots | robots-rover | Rover | 🤖🛞🔴🪐 | 🛞🔴🪐 |
| robots | robots-ai-assistant | AI Assistant | 💬🤖💡📱 | 💬💡📱 |
| robots | robots-robot-dog | Robot Dog | 🐕🤖⚙️🏃 | ⚙️🏃 |
| plants | plants-sunflower | Sunflower | 🌻☀️🌱🐝 | ☀️🌱🐝 |
| plants | plants-cactus | Cactus | 🌵🏜️💧☀️ | 🏜️💧☀️ |
| plants | plants-rose | Rose | 🌹❤️🌿🪴 | ❤️🌿🪴 |
| plants | plants-mushroom | Mushroom | 🍄🌧️🌲🧺 | 🌧️🌲🧺 |
| plants | plants-palm-tree | Palm Tree | 🌴🏝️🥥☀️ | 🏝️🥥☀️ |
| plants | plants-pumpkin-vine | Pumpkin Vine | 🎃🌿🌼🍂 | 🌿🌼🍂 |

## Allowed Exceptions

Required fields for any future exception row: puzzle id, answer, emoji, reason, reviewer status.

None.

## Source Consistency Snapshot

- Category rows in review matrix: 60
- Missing category ids from review matrix: 0
- Non-random cards reviewed: 600
- Unreviewed non-random cards: 0
- Direct-answer emoji leaks after cleanup: 0
- Random Mix status: derived-reviewed; it pulls from reviewed source puzzles and has 0 direct cards of its own.

## Actual Category Id Mapping Notes

The plan uses some short group labels in prose. This audit records the current source ids exactly, including `world-landmarks`, `us-landmarks`, `world-geography`, `music-instruments`, and `music-genres`.
