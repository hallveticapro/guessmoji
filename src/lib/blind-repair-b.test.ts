import { describe, expect, it } from "vitest";
import { answerEmojiBanlist } from "@/data/answerEmojiBanlist";
import { categories } from "@/data/categories";
import { expandedPuzzles } from "@/data/expandedPacks";
import { puzzles } from "@/data/puzzles";
import { findDirectAnswerEmojiLeaks, normalizeAnswerForAudit } from "@/lib/clue-audit";
import { getCategoryEmojiUsage, findContentInvariantViolations } from "@/lib/content-audit";
import { getRandomMixPuzzlePool } from "@/lib/puzzles";

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
    "emojis": "🏃‍♂️🏁↗️🥏📏",
    "hint": "A meet combines lane races with jumping and throwing events, all measured or timed.",
    "explanation": "🏃‍♂️ gives the lane races; 🏁 marks the timed meet; ↗️ shows a jump; 🥏 evokes a discus throw; 📏 records measured marks."
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
    "difficulty": "medium",
    "emojis": "🛤️⚪🔟↘️🧮",
    "hint": "Players take turns aiming at ten upright targets from a marked lane, then score each frame.",
    "explanation": "🛤️ gives the lane; ⚪ is the rolled ball; 🔟 gives the ten-target rack; ↘️ shows the delivery; 🧮 represents frame scoring."
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
    "difficulty": "medium",
    "emojis": "👐🌀💨↔️",
    "hint": "A flat flying throw-and-catch game sends a spinning object between players.",
    "explanation": "👐 shows the throw and catch; 🌀 gives the spinning flight; 💨 keeps the object airborne; ↔️ shows the return between players."
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
    "emojis": "🃏🔗5️⃣📍📍📍",
    "hint": "A card-and-board game rewards making a connected line of five markers.",
    "explanation": "🃏 supplies card locations; 🔗 shows a connected run; 5️⃣ is the line-of-five goal; 📍📍📍 are the board markers."
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
    "emojis": "🔵🪶😤🌊🎒",
    "hint": "A proud blue starter from Sinnoh waddles on two feet.",
    "explanation": "🔵 evokes the blue body; 🪶 gives a small feathered bird association; 😤 shows the determined personality; 🌊 marks Water typing; 🎒 is the trainer journey."
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
    "emojis": "🟫🧩3️⃣✖️3️⃣",
    "hint": "A square workstation opens a three-by-three recipe grid.",
    "explanation": "🟫 is the square workstation block; 🧩 is recipe assembly; the two 3️⃣ symbols and ✖️ form the three-by-three grid."
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
    "emojis": "🌳🍯🔊🕳️",
    "hint": "A hollow-tree block stores honey for a buzzing colony.",
    "explanation": "🌳 sets the tree habitat; 🍯 gives the stored honey; 🔊 suggests the buzzing colony; 🕳️ is the hollow cavity."
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
    "difficulty": "medium",
    "emojis": "🌍🛰️🌊🔄",
    "hint": "Earth's natural companion circles the planet and helps raise ocean tides.",
    "explanation": "🌍 is the planet being orbited; 🛰️ supplies an orbiting-satellite association; 🌊 gives the tide effect; 🔄 shows the repeated orbit."
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
    "answer": "Line Graph",
    "difficulty": "medium",
    "emojis": "📋↕️🔵🔗🕒",
    "hint": "A data display joins plotted values in order so a change over time is easy to follow.",
    "explanation": "📋 is the data sheet; ↕️ is the value scale; 🔵 are plotted points; 🔗 joins the points; 🕒 gives their ordered time sequence."
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
    "emojis": "1️⃣🔸5️⃣🔟",
    "hint": "Place-value notation puts tenths or hundredths after a separator.",
    "explanation": "1️⃣ is the whole-number digit; 🔸 is the separator; 5️⃣ is a fractional digit; 🔟 marks the base-ten system."
  },
  {
    "id": "math-angle",
    "categoryId": "math",
    "answer": "Angle",
    "difficulty": "easy",
    "emojis": "📍↗️↘️👐",
    "hint": "Two rays share one endpoint and open by a measurable amount.",
    "explanation": "📍 is the shared endpoint; ↗️ and ↘️ are the two rays; 👐 shows the opening between them."
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
    "emojis": "🧩📐⚖️4️⃣",
    "hint": "Its four sides match, and every corner is a right angle.",
    "explanation": "🧩 gives a tile-like shape; 📐 marks right-angle corners; ⚖️ shows equal side lengths; 4️⃣ counts the four matching sides."
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
    "difficulty": "medium",
    "emojis": "🧍‍♂️📏💭🫙🗣️",
    "hint": "A kind, towering visitor collects dreams in jars and speaks in playful made-up words.",
    "explanation": "🧍‍♂️📏 show the visitor's unusual height; 💭 are the dreams; 🫙 holds them; 🗣️ signals the visitor's playful invented speech."
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
    "emojis": "✨🟡💧🙏",
    "hint": "A Sikh gurdwara welcomes visitors around a gold-covered shrine set in a sacred pool.",
    "explanation": "✨ and 🟡 show the gold-covered shrine; 💧 is the sacred pool; 🙏 represents worship and the welcoming religious community."
  },
  {
    "id": "world-landmarks-victoria-memorial",
    "categoryId": "world-landmarks",
    "answer": "Victoria Memorial",
    "difficulty": "medium",
    "emojis": "🏛️🖼️🇬🇧🇮🇳🌆",
    "hint": "A Kolkata museum in formal gardens commemorates a British monarch.",
    "explanation": "🏛️ is the landmark building; 🖼️ signals its museum; 🇬🇧 gives the British royal connection; 🇮🇳 locates India; 🌆 gives the Kolkata city setting."
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
    "emojis": "🏛️📏🔺💧🌳",
    "hint": "A pointed stone obelisk rises beside the reflecting pool on the National Mall.",
    "explanation": "🏛️ gives the civic landmark; 📏 emphasizes its height; 🔺 gives the pointed obelisk profile; 💧 is the reflecting pool; 🌳 evokes the National Mall grounds."
  },
  {
    "id": "us-landmarks-independence-hall",
    "categoryId": "us-landmarks",
    "answer": "Independence Hall",
    "difficulty": "easy",
    "emojis": "🏛️📜🗣️🧱🤝",
    "hint": "In Philadelphia, a brick civic building hosted debates on the Declaration and Constitution.",
    "explanation": "🏛️ is the historic civic building; 📜 represents the founding documents; 🗣️ gives the debates; 🧱 identifies the brick structure; 🤝 shows the agreement reached there."
  },
  {
    "id": "us-landmarks-mount-vernon",
    "categoryId": "us-landmarks",
    "answer": "Mount Vernon",
    "difficulty": "medium",
    "emojis": "🌊🌳🏡🪖1️⃣",
    "hint": "A Virginia estate beside the Potomac preserves the home of the nation's first president.",
    "explanation": "🌊 is the Potomac setting; 🌳 are the estate grounds; 🏡 is the preserved residence; 🪖 recalls its owner's Revolutionary-era military service; 1️⃣ marks his role as the nation's first president."
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
    "emojis": "🗺️🌊🌱🏺↕️",
    "hint": "A long African waterway flows north through Egypt to the Mediterranean.",
    "explanation": "🗺️ gives the mapped route; 🌊 is the waterway; 🌱 is the fertile edge; 🏺 places it in Egypt; ↕️ makes the northward flow meaningful."
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
    "emojis": "🗺️🏛️🇫🇷🇩🇪🏰",
    "hint": "A continent west of Asia joins many languages, countries, and historic cities.",
    "explanation": "🗺️ gives continental scale; 🏛️ represents historic cities; 🇫🇷 and 🇩🇪 are two neighboring examples; 🏰 evokes shared European architectural heritage."
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
    "emojis": "🛶🇦🇹🇸🇰🇭🇺🇷🇸",
    "hint": "A navigable European waterway passes four capital cities before the Black Sea.",
    "explanation": "🛶 gives a navigable inland waterway; 🇦🇹, 🇸🇰, 🇭🇺, and 🇷🇸 are the four countries whose capitals lie along its route."
  }
] as const;

const secondPassRecheckIds = [
  "sports-track-and-field",
  "sports-bowling",
  "outdoor-games-frisbee",
  "board-games-sequence",
  "pokemon-piplup",
  "minecraft-crafting-table",
  "minecraft-bee-nest",
  "space-moon",
  "math-graph",
  "math-decimal",
  "math-angle",
  "math-square",
  "books-the-bfg",
  "world-landmarks-golden-temple",
  "world-landmarks-victoria-memorial",
  "us-landmarks-washington-monument",
  "us-landmarks-independence-hall",
  "us-landmarks-mount-vernon",
  "world-geography-nile-river",
  "world-geography-europe",
  "world-geography-danube-river",
] as const;

const secondPassDifficultyChanges = [
  { id: "outdoor-games-frisbee", from: "easy", to: "medium" },
  { id: "space-moon", from: "easy", to: "medium" },
  { id: "math-graph", from: "easy", to: "medium" },
] as const;

const secondPassPairChecks = [
  ["sports-track-and-field", "sports-bowling"],
  ["outdoor-games-frisbee", "outdoor-games-kite-flying"],
  ["math-graph", "math-angle"],
  ["math-square", "math-rectangle"],
  ["math-square", "math-symmetry"],
  ["world-landmarks-victoria-memorial", "world-landmarks-taj-mahal"],
  ["us-landmarks-washington-monument", "us-landmarks-mount-rushmore"],
  ["us-landmarks-independence-hall", "us-landmarks-liberty-bell"],
  ["world-geography-europe", "world-geography-danube-river"],
  ["world-geography-nile-river", "world-geography-mediterranean-sea"],
] as const;

const secondPassPreservedRevealFields = [
  {
    id: "sports-track-and-field",
    details: "Athletics category covering track races plus field events such as jumps and throws.",
    funFact: "Track and field has been part of every modern Summer Olympic Games.",
    tags: ["sports", "athletics"],
  },
  {
    id: "sports-bowling",
    details: "Indoor target sport in which players roll a ball to knock down pins.",
    funFact: "Ten-pin bowling uses a triangular rack of ten pins.",
    tags: ["sports", "indoor"],
  },
  {
    id: "outdoor-games-frisbee",
    details: "Type: Disc game",
    funFact: "Modern flying discs became popular in the 1900s.",
    tags: ["games", "outdoors", "outdoor-games"],
  },
  {
    id: "board-games-sequence",
    details: "Combination card-and-board game whose objective is to make lines of five markers.",
    funFact: "A corner space is usually wild and counts for every player's line.",
    tags: ["board-games", "cards", "lines", "family"],
  },
  {
    id: "pokemon-piplup",
    details: "Water-type Sinnoh starter with a penguin-inspired design and determined personality.",
    funFact: "Piplup is one of the three starter Pokémon offered to trainers at the beginning of Pokémon Diamond, Pearl, and Platinum.",
    tags: ["pokemon", "starter", "water", "sinnoh"],
  },
  {
    id: "minecraft-crafting-table",
    details: "Type: Utility block",
    funFact: "Crafting tables unlock a larger crafting grid.",
    tags: ["minecraft", "video-games"],
  },
  {
    id: "minecraft-bee-nest",
    details: "Type: Natural block",
    funFact: "Minecraft bees help pollinate crops as they fly.",
    tags: ["minecraft", "video-games"],
  },
  {
    id: "space-moon",
    details: "Type: Natural satellite",
    funFact: "People first walked on the Moon in 1969.",
    tags: ["space", "science"],
  },
  {
    id: "math-graph",
    details: "Type: Data display that connects values in sequence",
    funFact: "Line graphs are especially useful for showing change over time.",
    tags: ["math", "data", "line-graph"],
  },
  {
    id: "math-decimal",
    details: "Number representation based on powers of ten, often written with a decimal point.",
    funFact: "The word decimal comes from a Latin root meaning ten.",
    tags: ["math", "numbers", "place-value", "arithmetic"],
  },
  {
    id: "math-angle",
    details: "Figure formed by two rays or line segments sharing an endpoint.",
    funFact: "Angles can be measured in degrees, with a full turn measuring 360 degrees.",
    tags: ["math", "geometry", "measurement", "shapes"],
  },
  {
    id: "math-square",
    details: "Quadrilateral with four equal sides and four right angles.",
    funFact: "A square has several lines of symmetry and rotational symmetry as well.",
    tags: ["math", "geometry", "quadrilateral", "shapes"],
  },
  {
    id: "books-the-bfg",
    details: "Roald Dahl fantasy novel about Sophie and the Big Friendly Giant.",
    funFact: "The BFG's invented vocabulary is called Gobblefunk.",
    tags: ["books", "fantasy", "roald-dahl", "giants"],
  },
  {
    id: "world-landmarks-golden-temple",
    details: "Harmandir Sahib, also called the Golden Temple, is a major Sikh gurdwara in Amritsar, India.",
    funFact: "The complex's central shrine is surrounded by the Amrit Sarovar, the sacred pool that gives Amritsar its name.",
    tags: ["world-landmarks", "india", "sikh", "gurdwara"],
  },
  {
    id: "world-landmarks-victoria-memorial",
    details: "Large marble memorial in Kolkata, India, built in memory of Queen Victoria.",
    funFact: "Victoria Memorial opened to the public in 1921 and now houses a museum.",
    tags: ["world-landmarks", "india", "kolkata", "memorial"],
  },
  {
    id: "us-landmarks-washington-monument",
    details: "Obelisk memorial in Washington, D.C., honoring George Washington.",
    funFact: "Its two-tone stone reflects a pause in construction when the quarry source changed.",
    tags: ["us-landmarks", "washington-dc", "monument", "history"],
  },
  {
    id: "us-landmarks-independence-hall",
    details: "Historic Philadelphia building where the Declaration of Independence and U.S. Constitution were debated and adopted.",
    funFact: "The Declaration of Independence was adopted in the building on July 4, 1776.",
    tags: ["us-landmarks", "philadelphia", "history", "civic"],
  },
  {
    id: "us-landmarks-mount-vernon",
    details: "Historic plantation estate and home of George Washington in Mount Vernon, Virginia.",
    funFact: "Washington lived at Mount Vernon for much of his adult life, and the estate overlooks the Potomac.",
    tags: ["us-landmarks", "virginia", "history", "estate"],
  },
  {
    id: "world-geography-nile-river",
    details: "Type: River",
    funFact: "The Nile flows northward into the Mediterranean Sea.",
    tags: ["geography", "world-geography"],
  },
  {
    id: "world-geography-europe",
    details: "Continent west of Asia with many countries, climates, languages, and historic urban regions.",
    funFact: "Europe is conventionally treated as a continent even though it shares a continuous landmass with Asia.",
    tags: ["world-geography", "continent", "europe", "regions"],
  },
  {
    id: "world-geography-danube-river",
    details: "Second-longest river in Europe, flowing through or along many countries from Germany toward the Black Sea.",
    funFact: "The Danube passes through four capital cities: Vienna, Bratislava, Budapest, and Belgrade.",
    tags: ["world-geography", "river", "europe", "cities"],
  },
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

function graphemes(value: string): string[] {
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  return [...segmenter.segment(value)].map(({ segment }) => segment.replace(/[\uFE0E\uFE0F]/g, ""));
}

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

  it("covers every second-pass B recheck row exactly once", () => {
    const repairedIds = new Set(repairedCards.map((card) => card.id));

    expect(secondPassRecheckIds).toHaveLength(21);
    expect(new Set(secondPassRecheckIds).size).toBe(21);
    for (const id of secondPassRecheckIds) {
      expect(repairedIds.has(id), `${id} should be in the final repair manifest`).toBe(true);
    }
  });

  it("applies exactly the three second-pass difficulty calibrations", () => {
    const sourcePuzzles = [...puzzles, ...expandedPuzzles];
    const byId = new Map(sourcePuzzles.map((puzzle) => [puzzle.id, puzzle]));

    expect(secondPassDifficultyChanges).toEqual([
      { id: "outdoor-games-frisbee", from: "easy", to: "medium" },
      { id: "space-moon", from: "easy", to: "medium" },
      { id: "math-graph", from: "easy", to: "medium" },
    ]);
    for (const change of secondPassDifficultyChanges) {
      expect(byId.get(change.id)?.difficulty, `${change.id} difficulty`).toBe(change.to);
    }
  });

  it("preserves every recheck card's identity and reveal metadata", () => {
    const sourcePuzzles = [...puzzles, ...expandedPuzzles];
    const byId = new Map(sourcePuzzles.map((puzzle) => [puzzle.id, puzzle]));
    const expectedById = new Map(repairedCards.map((card) => [card.id, card]));
    const preservedById = new Map(secondPassPreservedRevealFields.map((card) => [card.id, card]));

    expect(expandedPuzzles).toHaveLength(1130);
    expect(new Set(expandedPuzzles.map((puzzle) => puzzle.id)).size).toBe(1130);
    expect(preservedById.size).toBe(21);

    for (const id of secondPassRecheckIds) {
      const actual = byId.get(id);
      const expected = expectedById.get(id);
      const preserved = preservedById.get(id);
      expect(actual, `${id} should exist`).toBeDefined();
      expect(actual?.categoryId).toBe(expected?.categoryId);
      expect(actual?.answer).toBe(expected?.answer);
      expect(preserved, `${id} preserved field snapshot`).toBeDefined();
      expect({
        id: actual?.id,
        details: actual?.details,
        funFact: actual?.funFact,
        tags: actual?.tags,
      }).toEqual(preserved);
    }
  });

  it("keeps Bowling's direct glyph banned and the full catalog leak-free", () => {
    expect(answerEmojiBanlist.bowling).toEqual(["🎳"]);
    expect(findDirectAnswerEmojiLeaks(puzzles, answerEmojiBanlist)).toEqual([]);
  });

  it("keeps every second-pass hint free of its full answer", () => {
    const byId = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]));

    for (const id of secondPassRecheckIds) {
      const puzzle = byId.get(id);
      expect(puzzle, `${id} should exist`).toBeDefined();
      expect(normalizeAnswerForAudit(puzzle?.hint ?? "")).not.toContain(
        normalizeAnswerForAudit(puzzle?.answer ?? ""),
      );
    }
  });

  it("keeps the recheck categories free of context filler and deterministic violations", () => {
    const categoryById = new Map(categories.map((category) => [category.id, category]));
    const contextBans: Record<string, string> = {
      books: "📚",
      "world-geography": "🌍",
      "world-landmarks": "🗺️",
    };

    for (const [categoryId, bannedEmoji] of Object.entries(contextBans)) {
      const usage = getCategoryEmojiUsage(
        expandedPuzzles.filter((puzzle) => puzzle.categoryId === categoryId),
      );
      expect(usage.get(bannedEmoji)?.count ?? 0, `${categoryId} context`).toBe(0);
    }

    const sourceById = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]));
    for (const id of secondPassRecheckIds) {
      const puzzle = sourceById.get(id);
      const category = categoryById.get(puzzle?.categoryId ?? "");
      expect(category, `${id} category`).toBeDefined();
      expect(puzzle?.emojis).not.toContain(category?.icon ?? "");
    }

    const findings = findContentInvariantViolations(categories, puzzles).filter((finding) =>
      secondPassRecheckIds.some((id) => finding.puzzleIds.includes(id)),
    );
    expect(findings).toEqual([]);

    const randomMixPool = getRandomMixPuzzlePool();
    expect(new Set(randomMixPool.map((puzzle) => normalizeAnswerForAudit(puzzle.answer))).size).toBe(
      randomMixPool.length,
    );
  });

  it("keeps every explicit high-risk pair distinct", () => {
    const byId = new Map(expandedPuzzles.map((puzzle) => [puzzle.id, puzzle]));

    for (const [leftId, rightId] of secondPassPairChecks) {
      const left = byId.get(leftId);
      const right = byId.get(rightId);
      expect(left, `${leftId} should exist`).toBeDefined();
      expect(right, `${rightId} should exist`).toBeDefined();
      expect(left?.emojis).not.toBe(right?.emojis);

      const rightEmojiSet = new Set(graphemes(right?.emojis ?? ""));
      const shared = graphemes(left?.emojis ?? "").filter((emoji) => rightEmojiSet.has(emoji));
      expect(shared.length, `${leftId} vs ${rightId}`).toBeLessThanOrEqual(2);
    }
  });

  it("keeps repetition warnings at the reviewed baseline", () => {
    const recheckCategoryIds = new Set(
      secondPassRecheckIds.map((id) => expandedPuzzles.find((puzzle) => puzzle.id === id)?.categoryId),
    );
    const warnings: Array<{ categoryId: string; emoji: string; count: number; ratio: number }> = [];

    for (const categoryId of recheckCategoryIds) {
      if (!categoryId) continue;
      const usage = getCategoryEmojiUsage(
        expandedPuzzles.filter((puzzle) => puzzle.categoryId === categoryId),
      );
      for (const [emoji, summary] of usage) {
        if (summary.ratio > 0.2) {
          warnings.push({ categoryId, emoji, count: summary.count, ratio: summary.ratio });
        }
      }
    }

    expect(warnings).toEqual([
      { categoryId: "math", emoji: "🧩", count: 5, ratio: 0.25 },
      { categoryId: "math", emoji: "📐", count: 5, ratio: 0.25 },
      { categoryId: "world-geography", emoji: "🗺", count: 7, ratio: 7 / 30 },
    ]);
    const geographyUsage = getCategoryEmojiUsage(
      expandedPuzzles.filter((puzzle) => puzzle.categoryId === "world-geography"),
    );
    expect(geographyUsage.get("🌊")).toEqual({ count: 6, ratio: 0.2 });
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
