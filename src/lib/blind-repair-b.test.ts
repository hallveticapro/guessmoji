import { describe, expect, it } from "vitest";
import { expandedPuzzles } from "@/data/expandedPacks";
import { puzzles } from "@/data/puzzles";

const repairedCards = [
  {
    "id": "sports-tennis",
    "categoryId": "sports",
    "answer": "Tennis",
    "difficulty": "medium",
    "emojis": "0️⃣1️⃣3️⃣4️⃣↔️",
    "hint": "A racket sport uses a scoring ladder that goes from love to fifteen, thirty, and forty.",
    "explanation": "0️⃣, 1️⃣, 3️⃣, and 4️⃣ suggest the unusual love–15–30–40 scoring ladder; ↔️ shows the rally moving across the court."
  },
  {
    "id": "sports-track-and-field",
    "categoryId": "sports",
    "answer": "Track and Field",
    "difficulty": "medium",
    "emojis": "🏃‍♂️↗️🥏📏",
    "hint": "A multi-event program combines races with measured jumps and throws.",
    "explanation": "🏃‍♂️ gives the races; ↗️ marks a jump; 🥏 evokes a discus throw; 📏 records the measured mark."
  },
  {
    "id": "sports-wrestling",
    "categoryId": "sports",
    "answer": "Wrestling",
    "difficulty": "medium",
    "emojis": "🫂↘️🟫📍⏱️",
    "hint": "Two competitors use holds and takedowns to score control on a mat.",
    "explanation": "🫂 shows a close hold; ↘️ is a takedown; 🟫 is the mat; 📍 marks a pin; ⏱️ sets the period."
  },
  {
    "id": "sports-skateboarding",
    "categoryId": "sports",
    "answer": "Skateboarding",
    "difficulty": "medium",
    "emojis": "🛝🪖↗️🧱",
    "hint": "An action sport sends a rider over ramps and ledges on a small wheeled platform.",
    "explanation": "🛝 is the ramp; 🪖 is protective gear; ↗️ shows an airborne trick; 🧱 is an urban ledge or park feature."
  },
  {
    "id": "sports-bowling",
    "categoryId": "sports",
    "answer": "Bowling",
    "difficulty": "easy",
    "emojis": "🛤️🔟↘️🧮",
    "hint": "Roll a heavy ball down a lane to knock down a triangular set of pins.",
    "explanation": "🛤️ is the lane; 🔟 suggests ten pins; ↘️ is the roll; 🧮 captures scorekeeping."
  },
  {
    "id": "sports-snowboarding",
    "categoryId": "sports",
    "answer": "Snowboarding",
    "difficulty": "medium",
    "emojis": "🏔️🪖↔️🌀🧊",
    "hint": "A winter action sport uses sideways carving, jumps, and rails on a single runner.",
    "explanation": "🏔️ is the slope; 🪖 is safety gear; ↔️ shows sideways carving; 🌀 is a trick; 🧊 marks the icy course."
  },
  {
    "id": "outdoor-games-four-square",
    "categoryId": "outdoor-games",
    "answer": "Four Square",
    "difficulty": "medium",
    "emojis": "📍📍📍📍🤲",
    "hint": "Players bounce a ball among four marked court spaces, moving up when others miss.",
    "explanation": "📍📍📍📍 mark the four player spaces; 🤲 shows the quick hand bounce between them."
  },
  {
    "id": "outdoor-games-frisbee",
    "categoryId": "outdoor-games",
    "answer": "Frisbee",
    "difficulty": "easy",
    "emojis": "👐💨🐕↔️",
    "hint": "A flying disc travels between thrower and catcher, often with a dog nearby.",
    "explanation": "👐 shows throwing and catching; 💨 keeps the object airborne; 🐕 evokes a common fetch partner; ↔️ shows the return flight."
  },
  {
    "id": "outdoor-games-three-legged-race",
    "categoryId": "outdoor-games",
    "answer": "Three-Legged Race",
    "difficulty": "easy",
    "emojis": "🧑‍🤝‍🧑🔗👣🏁",
    "hint": "Pairs cross a finish line while their steps are linked side by side.",
    "explanation": "🧑‍🤝‍🧑 are paired teammates; 🔗 locks their steps together; 👣 show coordinated footwork; 🏁 is the finish."
  },
  {
    "id": "board-games-stratego",
    "categoryId": "board-games",
    "answer": "Stratego",
    "difficulty": "medium",
    "emojis": "🙈🔢🪖🗺️⚔️",
    "hint": "Pieces hide their ranks while players try to capture a flag on a battlefield.",
    "explanation": "🙈 hides the ranks; 🔢 represents numbered pieces; 🪖 and 🗺️ set a battle strategy; ⚔️ signals the encounter."
  },
  {
    "id": "board-games-sequence",
    "categoryId": "board-games",
    "answer": "Sequence",
    "difficulty": "easy",
    "emojis": "🃏📍📍📍📍📍",
    "hint": "Cards tell players where to place markers until they form a line of five.",
    "explanation": "🃏 supplies locations; the five 📍 markers form a line that earns the objective."
  },
  {
    "id": "party-games-simon-says",
    "categoryId": "party-games",
    "answer": "Simon Says",
    "difficulty": "medium",
    "emojis": "📣👂🛑👣🫡",
    "hint": "Players move only when a leader begins an instruction with a special two-word cue.",
    "explanation": "📣 is the leader; 👂 means listen; 🛑 marks waiting for the cue; 👣 are the movements; 🫡 shows following a valid instruction."
  },
  {
    "id": "party-games-rock-paper-scissors",
    "categoryId": "party-games",
    "answer": "Rock Paper Scissors",
    "difficulty": "medium",
    "emojis": "3️⃣🤝🔀⚡",
    "hint": "A quick hand game uses three choices in a cycle where each defeats one.",
    "explanation": "3️⃣ marks three choices; 🤝 is a hand-to-hand contest; 🔀 is the circular matchup; ⚡ captures the instant result."
  },
  {
    "id": "party-games-telephone",
    "categoryId": "party-games",
    "answer": "Telephone",
    "difficulty": "easy",
    "emojis": "👥🔄🤫➡️📣",
    "hint": "A whispered sentence travels around a circle and is compared at the end.",
    "explanation": "👥 form the circle; 🔄 passes the turn; 🤫 keeps the sentence quiet; ➡️ carries it onward; 📣 is the final retelling."
  },
  {
    "id": "party-games-heads-up",
    "categoryId": "party-games",
    "answer": "Heads Up!",
    "difficulty": "easy",
    "emojis": "🧑‍🤝‍🧑📱⬆️🎭✅",
    "hint": "One player holds a word above their head while the group acts it out.",
    "explanation": "🧑‍🤝‍🧑 are the group; 📱 rises above one player's head; 🎭 shows acted clues; ✅ marks the guessed word."
  },
  {
    "id": "party-games-catch-phrase",
    "categoryId": "party-games",
    "answer": "Catch Phrase",
    "difficulty": "medium",
    "emojis": "🔤🤲🔄⌛😬",
    "hint": "Explain a hidden word while a passing device counts down to a buzzer.",
    "explanation": "🔤 is the hidden word; 🤲 passes the prompt; 🔄 keeps it moving; ⌛ creates the countdown; 😬 shows the pressure."
  },
  {
    "id": "arcade-classics-frogger",
    "categoryId": "arcade-classics",
    "answer": "Frogger",
    "difficulty": "easy",
    "emojis": "🚦🛣️🌊↔️🏁",
    "hint": "Guide a small jumper across traffic and a river without getting hit.",
    "explanation": "🚦 and 🛣️ create crossing traffic; 🌊 is the river lane; ↔️ shows repeated crossings; 🏁 is the safe destination."
  },
  {
    "id": "arcade-classics-pinball",
    "categoryId": "arcade-classics",
    "answer": "Pinball",
    "difficulty": "medium",
    "emojis": "🟠🔁🎯🔔🕹️",
    "hint": "Keep a metal ball ricocheting between bumpers and flippers for points.",
    "explanation": "🟠 is the ball; 🔁 is its ricochet; 🎯 and 🔔 are targets and scoring signals; 🕹️ is the cabinet control."
  },
  {
    "id": "arcade-classics-track-and-field",
    "categoryId": "arcade-classics",
    "answer": "Track & Field",
    "difficulty": "medium",
    "emojis": "🕹️🔘🔘🏃‍♂️🥏",
    "hint": "A classic arcade sports title rewards rapid button presses across races, jumps, and throws.",
    "explanation": "🕹️ is the arcade cabinet; 🔘🔘 show rapid button mashing; 🏃‍♂️ is a race; 🥏 evokes a measured throwing event."
  },
  {
    "id": "pokemon-mew",
    "categoryId": "pokemon",
    "answer": "Mew",
    "difficulty": "medium",
    "emojis": "🧬🔄🧩🧠",
    "hint": "A tiny mythical creature is said to carry the genes of every species.",
    "explanation": "🧬 points to genetic origins; 🔄 is transformation; 🧩 suggests a full set of learned moves; 🧠 evokes psychic adaptability."
  },
  {
    "id": "pokemon-greninja",
    "categoryId": "pokemon",
    "answer": "Greninja",
    "difficulty": "medium",
    "emojis": "💧🫥🌀🎯",
    "hint": "A stealthy water fighter uses spinning projectiles and a scarf-like tongue.",
    "explanation": "💧 marks Water typing; 🫥 is stealth; 🌀 is rapid spinning movement; 🎯 is precise projectile aim."
  },
  {
    "id": "pokemon-piplup",
    "categoryId": "pokemon",
    "answer": "Piplup",
    "difficulty": "medium",
    "emojis": "🧊🌊😤🧣🎒",
    "hint": "A small, proud, blue Sinnoh starter waddles through a trainer's first journey.",
    "explanation": "🧊 and 🌊 evoke cold water; 😤 gives the determined personality; 🧣 suggests its bundled silhouette; 🎒 is the starter journey."
  },
  {
    "id": "pokemon-zubat",
    "categoryId": "pokemon",
    "answer": "Zubat",
    "difficulty": "easy",
    "emojis": "🕳️🔊🧭💨",
    "hint": "A winged cave creature navigates dark tunnels with sound instead of sight.",
    "explanation": "🕳️ is a dark tunnel; 🔊 represents sound pulses; 🧭 shows navigation without sight; 💨 is fast cave flight."
  },
  {
    "id": "pokemon-gardevoir",
    "categoryId": "pokemon",
    "answer": "Gardevoir",
    "difficulty": "medium",
    "emojis": "👗🫶🌀🌌",
    "hint": "An elegant Psychic/Fairy guardian protects its trainer through a powerful emotional bond.",
    "explanation": "👗 gives an elegant silhouette; 🫶 shows the bond with a trainer; 🌀 is psychic force; 🌌 suggests extraordinary protective power."
  },
  {
    "id": "minecraft-diamond-sword",
    "categoryId": "minecraft",
    "answer": "Diamond Sword",
    "difficulty": "medium",
    "emojis": "🟦👊💥🧱",
    "hint": "A high-tier Minecraft melee item deals damage at close range.",
    "explanation": "🟦 marks the blue high-tier material; 👊 shows close combat; 💥 is the hit; 🧱 is the block target."
  },
  {
    "id": "minecraft-crafting-table",
    "categoryId": "minecraft",
    "answer": "Crafting Table",
    "difficulty": "easy",
    "emojis": "🪵🧩3️⃣🟫",
    "hint": "A square work station opens a three-by-three recipe grid.",
    "explanation": "🪵 is the work material; 🧩 is the recipe; 3️⃣ suggests the three-by-three grid; 🟫 is the square station."
  },
  {
    "id": "minecraft-pickaxe",
    "categoryId": "minecraft",
    "answer": "Pickaxe",
    "difficulty": "medium",
    "emojis": "🕳️🪨🪵💥",
    "hint": "A handheld tool breaks stone and ore with a pointed striking head.",
    "explanation": "🕳️ opens the mine; 🪨 is the broken material; 🪵 is the handle; 💥 shows the striking work."
  },
  {
    "id": "minecraft-bee-nest",
    "categoryId": "minecraft",
    "answer": "Bee Nest",
    "difficulty": "easy",
    "emojis": "🌳🪵🔊🕳️",
    "hint": "A wooden tree home stores honey for a buzzing colony.",
    "explanation": "🌳 is the tree; 🪵 is the wooden home; 🔊 is the buzzing colony; 🕳️ is the cavity."
  },
  {
    "id": "science-magnet",
    "categoryId": "science",
    "answer": "Magnet",
    "difficulty": "medium",
    "emojis": "📎🧷↗️🫳",
    "hint": "A solid object can pull certain metals without touching them.",
    "explanation": "📎 and 🧷 are small metal objects; ↗️ shows them moving; 🫳 suggests attraction toward an unseen object."
  },
  {
    "id": "science-electricity",
    "categoryId": "science",
    "answer": "Electricity",
    "difficulty": "medium",
    "emojis": "🔋🔌💡📡",
    "hint": "Charge moving through a system powers light, communication, and devices.",
    "explanation": "🔋 supplies charge; 🔌 gives the connection; 💡 shows light; 📡 shows powered communication."
  },
  {
    "id": "science-ecosystem",
    "categoryId": "science",
    "answer": "Ecosystem",
    "difficulty": "medium",
    "emojis": "🌿💧☀️🦊🔄",
    "hint": "Living things interact with one another and with their nonliving surroundings.",
    "explanation": "🌿, 💧, and ☀️ provide living and nonliving surroundings; 🦊 is an organism; 🔄 shows interactions and cycles."
  },
  {
    "id": "science-matter",
    "categoryId": "science",
    "answer": "Matter",
    "difficulty": "medium",
    "emojis": "⚖️📦📏🫳",
    "hint": "Anything with mass that takes up space.",
    "explanation": "⚖️ stands for mass; 📦 is an object taking up room; 📏 measures space; 🫳 shows physical substance."
  },
  {
    "id": "science-hypothesis",
    "categoryId": "science",
    "answer": "Hypothesis",
    "difficulty": "easy",
    "emojis": "💭📝🎯🧪",
    "hint": "A testable prediction is written before an investigation begins.",
    "explanation": "💭 is an idea; 📝 records the prediction; 🎯 is the proposed outcome; 🧪 is the test."
  },
  {
    "id": "science-observation",
    "categoryId": "science",
    "answer": "Observation",
    "difficulty": "easy",
    "emojis": "👀📝🔎📋",
    "hint": "Evidence gathered by carefully noticing and recording what happens.",
    "explanation": "👀 notices; 📝 and 📋 record; 🔎 focuses on evidence."
  },
  {
    "id": "science-force",
    "categoryId": "science",
    "answer": "Force",
    "difficulty": "easy",
    "emojis": "🫷📦↔️💨",
    "hint": "A push or pull can change an object's motion.",
    "explanation": "🫷 shows a push or pull; 📦 is the object; ↔️ gives opposing directions; 💨 shows changed motion."
  },
  {
    "id": "science-pressure",
    "categoryId": "science",
    "answer": "Pressure",
    "difficulty": "medium",
    "emojis": "👟🏖️📉⚖️",
    "hint": "A force spread over an area becomes especially strong on a small contact patch.",
    "explanation": "👟 concentrates force on a small patch of 🏖️; 📉 shows sinking; ⚖️ supplies the weight."
  },
  {
    "id": "science-states-of-matter",
    "categoryId": "science",
    "answer": "States of Matter",
    "difficulty": "easy",
    "emojis": "🌡️↕️🧱↔️💧↔️💨",
    "hint": "Temperature changes can move a substance between rigid, flowing, and airy forms.",
    "explanation": "🌡️↕️ changes energy; 🧱, 💧, and 💨 represent rigid, flowing, and airy forms; ↔️ marks transitions between them."
  },
  {
    "id": "space-moon",
    "categoryId": "space",
    "answer": "Moon",
    "difficulty": "easy",
    "emojis": "🌊🌍🔄🌃",
    "hint": "Earth's natural satellite brightens the night and drives ocean tides.",
    "explanation": "🌊 shows tides; 🌍 is Earth; 🔄 is the orbit; 🌃 is the night sky."
  },
  {
    "id": "space-milky-way",
    "categoryId": "space",
    "answer": "Milky Way",
    "difficulty": "medium",
    "emojis": "🌃✨〰️🛣️",
    "hint": "The barred spiral galaxy that contains our solar system.",
    "explanation": "🌃 is the night sky; ✨ is the dense band of stars; 〰️ and 🛣️ suggest its long stripe across the sky."
  },
  {
    "id": "space-telescope",
    "categoryId": "space",
    "answer": "Telescope",
    "difficulty": "easy",
    "emojis": "👁️🔍🪜✨",
    "hint": "An instrument with lenses brings distant objects closer.",
    "explanation": "👁️ is observing; 🔍 magnifies; 🪜 is the support stand; ✨ are distant targets."
  },
  {
    "id": "space-dwarf-planet",
    "categoryId": "space",
    "answer": "Dwarf Planet",
    "difficulty": "medium",
    "emojis": "❄️🔄📏🚫",
    "hint": "A rounded body orbits the Sun but has not cleared its orbital neighborhood.",
    "explanation": "❄️ suggests an icy body; 🔄 is its orbit; 📏 is its small scale; 🚫 is the uncleared neighborhood."
  },
  {
    "id": "space-exoplanet",
    "categoryId": "space",
    "answer": "Exoplanet",
    "difficulty": "medium",
    "emojis": "⭐⬛📉🛰️",
    "hint": "A world orbiting a star beyond our solar system.",
    "explanation": "⭐ is the distant host star; ⬛ is a dark world crossing it; 📉 is the transit dip; 🛰️ indicates an object orbiting that star."
  },
  {
    "id": "weather-cloud",
    "categoryId": "weather",
    "answer": "Cloud",
    "difficulty": "medium",
    "emojis": "💧⬆️〰️🌬️",
    "hint": "A visible mass of tiny water droplets or ice floats in the sky.",
    "explanation": "💧 are droplets; ⬆️ shows lift; 〰️ is a suspended mass; 🌬️ is the surrounding air."
  },
  {
    "id": "weather-sleet",
    "categoryId": "weather",
    "answer": "Sleet",
    "difficulty": "medium",
    "emojis": "🌧️🧊↘️💥",
    "hint": "Small ice pellets fall between rain and snow, often bouncing on the ground.",
    "explanation": "🌧️ begins as rain; 🧊 turns it to pellets; ↘️ shows falling; 💥 marks bouncing impacts."
  },
  {
    "id": "weather-drizzle",
    "categoryId": "weather",
    "answer": "Drizzle",
    "difficulty": "easy",
    "emojis": "🌧️💧🪶🌱",
    "hint": "Very light rain made of tiny drops, not ground-level fog.",
    "explanation": "🌧️ is light rain; 💧 are tiny drops; 🪶 means gentle fall; 🌱 shows the damp result."
  },
  {
    "id": "weather-blizzard",
    "categoryId": "weather",
    "answer": "Blizzard",
    "difficulty": "medium",
    "emojis": "🌬️🌨️🚧🌫️",
    "hint": "A winter storm brings sustained wind, blowing snow, and dangerously low visibility.",
    "explanation": "🌬️ is sustained wind; 🌨️ is blowing snow; 🚧 shows travel being blocked; 🌫️ shows the lost visibility."
  },
  {
    "id": "math-circle",
    "categoryId": "math",
    "answer": "Circle",
    "difficulty": "easy",
    "emojis": "🎯📏🧭🧵",
    "hint": "A drawing tool can trace it from one fixed center at one distance.",
    "explanation": "🎯 marks the center; 📏 measures the radius; 🧭 traces the fixed distance; 🧵 follows the closed boundary."
  },
  {
    "id": "math-graph",
    "categoryId": "math",
    "answer": "Graph",
    "difficulty": "easy",
    "emojis": "↕️↔️📍📍🔗",
    "hint": "A visual display uses axes and marks to compare or connect data.",
    "explanation": "↕️ and ↔️ form axes; 📍📍 are plotted data; 🔗 connects the relationship."
  },
  {
    "id": "math-pi",
    "categoryId": "math",
    "answer": "Pi",
    "difficulty": "medium",
    "emojis": "3️⃣1️⃣4️⃣🔄📏",
    "hint": "The circle constant compares circumference with diameter.",
    "explanation": "3️⃣1️⃣4️⃣ recalls the opening digits; 🔄 and 📏 connect the constant to circular measurement."
  },
  {
    "id": "math-decimal",
    "categoryId": "math",
    "answer": "Decimal",
    "difficulty": "easy",
    "emojis": "🔢🔸🔟🪜",
    "hint": "A number uses a point to separate whole units from fractional places.",
    "explanation": "🔢 are numbers; 🔸 is the decimal point; 🔟 gives base ten; 🪜 shows place-value steps."
  },
  {
    "id": "math-angle",
    "categoryId": "math",
    "answer": "Angle",
    "difficulty": "easy",
    "emojis": "📍↗️↘️📏",
    "hint": "Two rays meet at one vertex and form a measurable opening.",
    "explanation": "📍 is the shared endpoint; ↗️ and ↘️ are the two rays; 📏 measures the opening."
  },
  {
    "id": "math-rectangle",
    "categoryId": "math",
    "answer": "Rectangle",
    "difficulty": "easy",
    "emojis": "🪟📏📐↔️",
    "hint": "A four-sided shape keeps opposite lengths alike while its long and short spans can differ.",
    "explanation": "🪟 gives a rectangular frame; 📏 measures its spans; 📐 marks right corners; ↔️ emphasizes the longer horizontal direction."
  },
  {
    "id": "math-square",
    "categoryId": "math",
    "answer": "Square",
    "difficulty": "easy",
    "emojis": "🏁🧩📐🟰",
    "hint": "A tile keeps the same side length in every direction and meets at right corners.",
    "explanation": "🏁 gives a grid of equal square cells; 🧩 gives a tile-like form; 📐 marks right corners; 🟰 shows equal side lengths."
  },
  {
    "id": "math-cube",
    "categoryId": "math",
    "answer": "Cube",
    "difficulty": "medium",
    "emojis": "↗️📐🧩8️⃣",
    "hint": "A solid has six square faces, eight corners, and twelve edges.",
    "explanation": "↗️ gives a three-dimensional view; 📐 suggests right-angled faces; 🧩 is a solid form; 8️⃣ counts its corners."
  },
  {
    "id": "math-perimeter",
    "categoryId": "math",
    "answer": "Perimeter",
    "difficulty": "easy",
    "emojis": "🔁🧵📐➕",
    "hint": "The distance all the way around a shape comes from adding its side lengths.",
    "explanation": "🔁 is a closed route; 🧵 traces the border; 📐 gives the shape; ➕ adds its sides."
  },
  {
    "id": "books-the-cat-in-the-hat",
    "categoryId": "books",
    "answer": "The Cat in the Hat",
    "difficulty": "medium",
    "emojis": "🟥⬜1️⃣2️⃣🚪",
    "hint": "A playful intruder brings two numbered companions into a quiet home.",
    "explanation": "🟥⬜ create the visitor's striped palette; 1️⃣2️⃣ are the two numbered companions; 🚪 is the unexpected doorway arrival."
  },
  {
    "id": "books-matilda",
    "categoryId": "books",
    "answer": "Matilda",
    "difficulty": "easy",
    "emojis": "👧🧠🪑⬆️🏫",
    "hint": "A gifted child turns an unfair school upside down with her mind.",
    "explanation": "👧 is the gifted child; 🧠 signals unusual mental power; 🪑⬆️ shows furniture lifted by thought; 🏫 is the school."
  },
  {
    "id": "books-the-bfg",
    "categoryId": "books",
    "answer": "The BFG",
    "difficulty": "easy",
    "emojis": "👧🧍‍♂️↕️💭📣",
    "hint": "A gentle oversized visitor collects dreams and befriends a child.",
    "explanation": "👧 and 🧍‍♂️ compare a child with an oversized friend; ↕️ emphasizes size; 💭 gives dreams; 📣 gives the giant's booming voice."
  },
  {
    "id": "myths-loki",
    "categoryId": "myths",
    "answer": "Loki",
    "difficulty": "medium",
    "emojis": "🦊🌀⛓️🐍",
    "hint": "A Norse shapeshifter repeatedly upsets the gods and slips between forms.",
    "explanation": "🦊 gives the trickster; 🌀 shows changing forms; ⛓️ recalls the binding punishment; 🐍 connects to Loki's serpent-linked mythology."
  },
  {
    "id": "myths-ra",
    "categoryId": "myths",
    "answer": "Ra",
    "difficulty": "easy",
    "emojis": "🪲🏺⛵🌅",
    "hint": "An Egyptian deity crosses the sky by sacred boat and returns through the night.",
    "explanation": "🪲 evokes Egyptian solar imagery; 🏺 sets the culture; ⛵ is the sacred boat; 🌅 is the daily dawn voyage."
  },
  {
    "id": "myths-osiris",
    "categoryId": "myths",
    "answer": "Osiris",
    "difficulty": "medium",
    "emojis": "🌿⚖️🏺🌊🔄",
    "hint": "An Egyptian god of the afterlife is linked with judgment, resurrection, and fertile land.",
    "explanation": "🌿 gives agricultural renewal; ⚖️ is judgment; 🏺 is Egyptian funerary culture; 🌊 is the Nile; 🔄 is rebirth."
  },
  {
    "id": "myths-theseus",
    "categoryId": "myths",
    "answer": "Theseus",
    "difficulty": "medium",
    "emojis": "🧵🏛️👑⚔️🧭",
    "hint": "An Athenian hero follows Ariadne's thread into a maze and returns to his city.",
    "explanation": "🧵 is Ariadne's thread; 🏛️ and 👑 place the hero in Athens; ⚔️ is the quest; 🧭 is the return through the maze."
  },
  {
    "id": "world-landmarks-great-wall-of-china",
    "categoryId": "world-landmarks",
    "answer": "Great Wall of China",
    "difficulty": "medium",
    "emojis": "↪️🏯🛡️👀📏",
    "hint": "A centuries-old frontier defense winds for miles across northern terrain.",
    "explanation": "↪️ shows the winding route; 🏯 gives watchtowers; 🛡️ is defense; 👀 is the lookout; 📏 emphasizes the long span."
  },
  {
    "id": "world-landmarks-golden-temple",
    "categoryId": "world-landmarks",
    "answer": "Golden Temple",
    "difficulty": "medium",
    "emojis": "✨🟡💧🤝",
    "hint": "A welcoming gurdwara centers a gold-covered shrine in a sacred pool.",
    "explanation": "✨🟡 show the gold-covered shrine; 💧 is the sacred pool; 🤝 represents the welcoming gurdwara community."
  },
  {
    "id": "world-landmarks-victoria-memorial",
    "categoryId": "world-landmarks",
    "answer": "Victoria Memorial",
    "difficulty": "medium",
    "emojis": "🏛️👑🌳📚🌴",
    "hint": "Kolkata's white-marble museum honors a British queen in formal gardens.",
    "explanation": "🏛️ is a memorial building; 👑 honors the monarch; 🌳 is its garden; 📚 is the museum; 🌴 hints at Kolkata's setting."
  },
  {
    "id": "us-landmarks-white-house",
    "categoryId": "us-landmarks",
    "answer": "White House",
    "difficulty": "medium",
    "emojis": "🏛️🧑‍💼🪑🌳📣",
    "hint": "The U.S. president both lives and works in this famous executive building.",
    "explanation": "🏛️ is the official building; 🧑‍💼 is the executive workplace; 🪑 suggests the office; 🌳 is the lawn; 📣 evokes public addresses."
  },
  {
    "id": "us-landmarks-gateway-arch",
    "categoryId": "us-landmarks",
    "answer": "Gateway Arch",
    "difficulty": "medium",
    "emojis": "🌊🏙️🚋⬆️↔️",
    "hint": "A shiny landmark beside a major waterway carries visitors upward in a Midwestern city.",
    "explanation": "🌊 places the landmark beside the Mississippi; 🏙️ gives the city setting; 🚋 is the tram inside; ⬆️↔️ show the rising span."
  },
  {
    "id": "us-landmarks-washington-monument",
    "categoryId": "us-landmarks",
    "answer": "Washington Monument",
    "difficulty": "easy",
    "emojis": "🪨⬆️🔺🌳",
    "hint": "A pointed stone landmark rises from the National Mall in the capital.",
    "explanation": "🪨 is the stone; ⬆️ gives the height; 🔺 shows the pointed obelisk profile; 🌳 evokes the National Mall."
  },
  {
    "id": "us-landmarks-independence-hall",
    "categoryId": "us-landmarks",
    "answer": "Independence Hall",
    "difficulty": "easy",
    "emojis": "🏛️🕰️🧱🤝📍",
    "hint": "A Philadelphia building hosted debates that shaped the Declaration and Constitution.",
    "explanation": "🏛️ is the historic building; 🕰️ gives its tower; 🧱 identifies the brick structure; 🤝 is the founding debate; 📍 places the meeting."
  },
  {
    "id": "us-landmarks-mount-vernon",
    "categoryId": "us-landmarks",
    "answer": "Mount Vernon",
    "difficulty": "medium",
    "emojis": "🌊🧑‍⚖️🌳🏛️",
    "hint": "George Washington's Virginia estate overlooks the Potomac River.",
    "explanation": "🌊 is the Potomac; 🧑‍⚖️ is Washington; 🌳 gives the grounds; 🏛️ is the estate mansion."
  },
  {
    "id": "us-landmarks-mammoth-cave",
    "categoryId": "us-landmarks",
    "answer": "Mammoth Cave",
    "difficulty": "hard",
    "emojis": "🔦🪨↘️🗺️🧭",
    "hint": "Kentucky's vast underground system contains hundreds of miles of mapped passages.",
    "explanation": "🔦 explores darkness; 🪨 is the underground rock; ↘️ leads below ground; 🗺️ and 🧭 map the passages."
  },
  {
    "id": "world-geography-africa",
    "categoryId": "world-geography",
    "answer": "Africa",
    "difficulty": "medium",
    "emojis": "🧭↕️🏜️🌴🌋",
    "hint": "A continent spans Mediterranean shores, equatorial forests, and southern grasslands.",
    "explanation": "🧭↕️ show the broad north-to-south span; 🏜️ gives desert landscapes; 🌴 gives tropical regions; 🌋 adds varied landforms."
  },
  {
    "id": "world-geography-island",
    "categoryId": "world-geography",
    "answer": "Island",
    "difficulty": "easy",
    "emojis": "🗺️🌊🟫🔄",
    "hint": "A piece of land is completely surrounded by water.",
    "explanation": "🗺️ gives the landform outline; 🌊 surrounds the 🟫 land; 🔄 completes the surrounding boundary."
  },
  {
    "id": "world-geography-peninsula",
    "categoryId": "world-geography",
    "answer": "Peninsula",
    "difficulty": "medium",
    "emojis": "🗺️🟫🌊↪️",
    "hint": "Land projects into water while remaining attached on one side.",
    "explanation": "🗺️ shows a protruding landform; 🟫 is attached land; 🌊 covers its sides; ↪️ shows the projection."
  },
  {
    "id": "world-geography-compass-rose",
    "categoryId": "world-geography",
    "answer": "Compass Rose",
    "difficulty": "easy",
    "emojis": "🗺️✳️↕️↔️",
    "hint": "A map symbol places north, south, east, and west around a center.",
    "explanation": "🗺️ is the map; ✳️ is the central directional marker; ↕️ and ↔️ show the four cardinal axes."
  },
  {
    "id": "world-geography-nile-river",
    "categoryId": "world-geography",
    "answer": "Nile River",
    "difficulty": "easy",
    "emojis": "🏜️🌊🌱🏺↘️",
    "hint": "A long African waterway runs north through Egypt before reaching the Mediterranean.",
    "explanation": "🏜️ is the desert; 🌊 is the river; 🌱 is its fertile edge; 🏺 places it in Egypt; ↘️ shows flow to the delta."
  },
  {
    "id": "world-geography-indian-ocean",
    "categoryId": "world-geography",
    "answer": "Indian Ocean",
    "difficulty": "medium",
    "emojis": "🌊🧭🌴⬇️",
    "hint": "A warm sea lies between eastern Africa, southern Asia, and Australia.",
    "explanation": "🌊 is the ocean; 🧭 gives its position between continents; 🌴 evokes tropical shores; ⬇️ marks the southern route."
  },
  {
    "id": "world-geography-arctic-ocean",
    "categoryId": "world-geography",
    "answer": "Arctic Ocean",
    "difficulty": "medium",
    "emojis": "🧊⬆️🚢🌬️",
    "hint": "The poleward sea is Earth's smallest, mostly ice-covered basin.",
    "explanation": "🧊 is sea ice; ⬆️ marks the poleward position; 🚢 gives the waterway; 🌬️ supplies the polar wind."
  },
  {
    "id": "world-geography-asia",
    "categoryId": "world-geography",
    "answer": "Asia",
    "difficulty": "easy",
    "emojis": "🗺️🏔️🌾🌴🌐",
    "hint": "The largest continent stretches from the Arctic to the Indian and Pacific coasts.",
    "explanation": "🗺️ gives continental scale; 🏔️, 🌾, and 🌴 show varied regions; 🌐 connects them across one continent."
  },
  {
    "id": "world-geography-europe",
    "categoryId": "world-geography",
    "answer": "Europe",
    "difficulty": "easy",
    "emojis": "🏛️🚆🧭🧱",
    "hint": "A continent west of Asia contains many neighboring countries linked by old cities and railways.",
    "explanation": "🏛️ represents old cities; 🚆 links neighboring countries; 🧭 gives the region; 🧱 suggests many borders and historic towns."
  },
  {
    "id": "world-geography-south-america",
    "categoryId": "world-geography",
    "answer": "South America",
    "difficulty": "medium",
    "emojis": "🗺️🏔️🌿🌋⬇️",
    "hint": "A continent stretches from the Caribbean edge toward Cape Horn, crossing the Andes and Amazon Basin.",
    "explanation": "🗺️ gives continental scale; 🏔️ is the Andes; 🌿 is the Amazon; 🌋 and ⬇️ span its landforms from north to south."
  },
  {
    "id": "world-geography-himalayas",
    "categoryId": "world-geography",
    "answer": "Himalayas",
    "difficulty": "medium",
    "emojis": "🇳🇵📏❄️🧗‍♀️",
    "hint": "A range along the Indian–Eurasian collision includes the planet's highest summit.",
    "explanation": "🇳🇵 places the range by Nepal; 📏 emphasizes extreme height; ❄️ shows snow; 🧗‍♀️ shows high-altitude climbing."
  },
  {
    "id": "world-geography-danube-river",
    "categoryId": "world-geography",
    "answer": "Danube River",
    "difficulty": "medium",
    "emojis": "🏛️🏛️🏛️🚢➡️",
    "hint": "A long waterway links four capital cities before reaching the Black Sea.",
    "explanation": "🏛️🏛️🏛️ represent the capitals along its course; 🚢 shows navigable travel; ➡️ marks the long route east."
  }
] as const;

const difficultyChanges = [
  {
    "id": "sports-tennis",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "minecraft-pickaxe",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "science-magnet",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "science-matter",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "weather-cloud",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "sports-track-and-field",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "sports-skateboarding",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "sports-snowboarding",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "party-games-simon-says",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "science-electricity",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "weather-blizzard",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "books-the-cat-in-the-hat",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "world-landmarks-great-wall-of-china",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "us-landmarks-white-house",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "world-geography-africa",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "world-geography-arctic-ocean",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "world-geography-himalayas",
    "from": "easy",
    "to": "medium"
  },
  {
    "id": "world-geography-south-america",
    "from": "easy",
    "to": "medium"
  }
] as const;

describe("partition B blind-review repairs", () => {
  it("uses the approved clue, hint, explanation, and difficulty for every repaired card", () => {
    const sourcePuzzles = [...puzzles, ...expandedPuzzles];
    const byId = new Map(sourcePuzzles.map((puzzle) => [puzzle.id, puzzle]));

    expect(repairedCards).toHaveLength(83);

    for (const expected of repairedCards) {
      const actual = byId.get(expected.id);
      expect(actual, expected.id + " should exist").toBeDefined();
      expect(actual).toMatchObject(expected);
    }
  });

  it("applies exactly the five approved difficulty changes", () => {
    const sourcePuzzles = [...puzzles, ...expandedPuzzles];
    const byId = new Map(sourcePuzzles.map((puzzle) => [puzzle.id, puzzle]));

    expect(difficultyChanges).toEqual([
      { id: "sports-tennis", from: "easy", to: "medium" },
      { id: "minecraft-pickaxe", from: "easy", to: "medium" },
      { id: "science-magnet", from: "easy", to: "medium" },
      { id: "science-matter", from: "easy", to: "medium" },
      { id: "weather-cloud", from: "easy", to: "medium" },
      { id: "sports-track-and-field", from: "easy", to: "medium" },
      { id: "sports-skateboarding", from: "easy", to: "medium" },
      { id: "sports-snowboarding", from: "easy", to: "medium" },
      { id: "party-games-simon-says", from: "easy", to: "medium" },
      { id: "science-electricity", from: "easy", to: "medium" },
      { id: "weather-blizzard", from: "easy", to: "medium" },
      { id: "books-the-cat-in-the-hat", from: "easy", to: "medium" },
      { id: "world-landmarks-great-wall-of-china", from: "easy", to: "medium" },
      { id: "us-landmarks-white-house", from: "easy", to: "medium" },
      { id: "world-geography-africa", from: "easy", to: "medium" },
      { id: "world-geography-arctic-ocean", from: "easy", to: "medium" },
      { id: "world-geography-himalayas", from: "easy", to: "medium" },
      { id: "world-geography-south-america", from: "easy", to: "medium" },
    ]);

    for (const change of difficultyChanges) {
      expect(byId.get(change.id)?.difficulty, change.id + " difficulty").toBe(change.to);
    }
  });
});
