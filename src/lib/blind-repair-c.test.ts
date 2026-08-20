import { describe, expect, it } from "vitest";
import { answerEmojiBanlist } from "@/data/answerEmojiBanlist";
import { expandedPuzzles } from "@/data/expandedPacks";

const repairedCards = [
  {
    "id": "vehicles-bus",
    "categoryId": "vehicles",
    "answer": "Bus",
    "difficulty": "easy",
    "emojis": "🪑👥🛞🔁",
    "hint": "A shared road vehicle with rows of seats and frequent stops.",
    "explanation": "🪑 gives rows of passenger seats, 👥 gives the many riders, 🛞 signals a wheeled road vehicle, and 🔁 shows its repeating route."
  },
  {
    "id": "vehicles-motorcycle",
    "categoryId": "vehicles",
    "answer": "Motorcycle",
    "difficulty": "easy",
    "emojis": "🛞🪖🧍💨",
    "hint": "A motorized two-wheeler ridden with a helmet.",
    "explanation": "🛞 gives the two-wheel base, 🪖 gives rider safety gear, 🧍 is the rider, and 💨 signals powered speed."
  },
  {
    "id": "vehicles-tram",
    "categoryId": "vehicles",
    "answer": "Tram",
    "difficulty": "medium",
    "emojis": "🔌🛤️🚏👥",
    "hint": "An electric rail vehicle that shares streets and stops for local passengers.",
    "explanation": "🔌 signals electric power, 🛤️ gives the rail guideway, 🚏 gives frequent street stops, and 👥 gives local passengers."
  },
  {
    "id": "vehicles-golf-cart",
    "categoryId": "vehicles",
    "answer": "Golf Cart",
    "difficulty": "easy",
    "emojis": "🏌️🧳🔋🛞",
    "hint": "A small low-speed vehicle carrying clubs around a golf course.",
    "explanation": "🏌️ identifies the course activity, 🧳 gives carried equipment, 🔋 signals common electric power, and 🛞 gives the compact vehicle."
  },
  {
    "id": "vehicles-skateboard",
    "categoryId": "vehicles",
    "answer": "Skateboard",
    "difficulty": "easy",
    "emojis": "🪵🛞🦵⚖️",
    "hint": "A short wheeled board ridden by pushing with one foot.",
    "explanation": "🪵 suggests the short deck, 🛞 gives its wheels, 🦵 shows one-foot pushing, and ⚖️ gives the balance needed to ride."
  },
  {
    "id": "vehicles-wagon",
    "categoryId": "vehicles",
    "answer": "Wagon",
    "difficulty": "medium",
    "emojis": "🌾🏕️🧺🕰️",
    "hint": "A historic carrier pulled along rough roads for people or goods.",
    "explanation": "🌾 gives farm use, 🏕️ evokes pioneer travel, 🧺 gives carried goods, and 🕰️ marks the vehicle's historic role."
  },
  {
    "id": "construction-crane",
    "categoryId": "construction",
    "answer": "Crane",
    "difficulty": "easy",
    "emojis": "🔗⬆️⚖️📦",
    "hint": "A tall lifting machine balanced by a counterweight.",
    "explanation": "🔗 gives lifting cables, ⬆️ shows the raised load, ⚖️ gives the counterweight balance, and 📦 is the suspended cargo."
  },
  {
    "id": "construction-bulldozer",
    "categoryId": "construction",
    "answer": "Bulldozer",
    "difficulty": "easy",
    "emojis": "🛠️🪨➡️🟫",
    "hint": "A tracked machine with a broad blade that pushes soil into piles.",
    "explanation": "🛠️ establishes heavy work, 🪨 and 🟫 give earth and soil, and ➡️ shows the broad forward push."
  },
  {
    "id": "construction-dump-truck",
    "categoryId": "construction",
    "answer": "Dump Truck",
    "difficulty": "easy",
    "emojis": "🪨📦↗️⬇️",
    "hint": "A hauling vehicle whose raised bed releases rubble.",
    "explanation": "🪨 gives the rubble, 📦 gives a hauled load, ↗️ shows the bed lifting, and ⬇️ shows the load being tipped out."
  },
  {
    "id": "construction-wheelbarrow",
    "categoryId": "construction",
    "answer": "Wheelbarrow",
    "difficulty": "easy",
    "emojis": "🪣🤲↪️⚖️",
    "hint": "A single-wheel carrier pushed by one person.",
    "explanation": "🪣 gives a typical load, 🤲 gives the handles and one-person effort, ↪️ shows maneuvering, and ⚖️ gives the balancing task."
  },
  {
    "id": "construction-scaffolding",
    "categoryId": "construction",
    "answer": "Scaffolding",
    "difficulty": "medium",
    "emojis": "🔗↔️⬆️🛡️",
    "hint": "A temporary work platform assembled around a building.",
    "explanation": "🔗 gives the modular frame, ↔️ gives a working platform, ⬆️ gives access at height, and 🛡️ gives the safety purpose."
  },
  {
    "id": "construction-nail-gun",
    "categoryId": "construction",
    "answer": "Nail Gun",
    "difficulty": "medium",
    "emojis": "📌🪵💨↘️",
    "hint": "A powered fastener tool used for rapid framing.",
    "explanation": "📌 gives a driven fastener, 🪵 gives the framing material, 💨 signals powered rapid action, and ↘️ shows driving it into the surface."
  },
  {
    "id": "construction-work-gloves",
    "categoryId": "construction",
    "answer": "Work Gloves",
    "difficulty": "easy",
    "emojis": "🤲🛡️🪨⚠️",
    "hint": "Protective handwear for handling rough materials.",
    "explanation": "🤲 gives hands at work, 🛡️ gives protection, 🪨 gives rough material, and ⚠️ gives the hazard the gear helps prevent."
  },
  {
    "id": "jobs-artist",
    "categoryId": "jobs",
    "answer": "Artist",
    "difficulty": "easy",
    "emojis": "🖼️🎭🧵💡",
    "hint": "A creative career that can use many kinds of visual media.",
    "explanation": "🖼️ gives visual work, 🎭 adds performance art, 🧵 gives hands-on craft, and 💡 gives the ideas behind creative work."
  },
  {
    "id": "jobs-designer",
    "categoryId": "jobs",
    "answer": "Designer",
    "difficulty": "medium",
    "emojis": "📐🧩👀🖼️🧪",
    "hint": "A creative planner who tests how a product looks and works for people.",
    "explanation": "📐 gives layout, 🧩 gives design constraints, 👀 gives observing users, 🖼️ gives the visual result, and 🧪 gives prototype testing."
  },
  {
    "id": "music-instruments-tambourine",
    "categoryId": "music-instruments",
    "answer": "Tambourine",
    "difficulty": "easy",
    "emojis": "🤲🫨🪙⭕",
    "hint": "A handheld instrument that shakes or taps to make a jingle.",
    "explanation": "🤲 gives handheld playing, 🫨 gives the shake, 🪙 suggests the small jingling discs, and ⭕ gives the circular frame."
  },
  {
    "id": "music-instruments-cello",
    "categoryId": "music-instruments",
    "answer": "Cello",
    "difficulty": "medium",
    "emojis": "🪑🫳⬇️🎼",
    "hint": "A bowed string instrument bigger than a violin, played between the knees.",
    "explanation": "🪑 gives the seated posture, 🫳 gives the bowing hand, ⬇️ gives the low register, and 🎼 gives the orchestral role."
  },
  {
    "id": "music-instruments-clarinet",
    "categoryId": "music-instruments",
    "answer": "Clarinet",
    "difficulty": "medium",
    "emojis": "🗝️🕳️1️⃣📣",
    "hint": "A single-reed wind instrument with keys and a warm, focused tone.",
    "explanation": "🗝️ suggests the keyed mechanism, 🕳️ gives tone holes, 1️⃣ gives the single reed, and 📣 gives the focused projected tone."
  },
  {
    "id": "music-instruments-banjo",
    "categoryId": "music-instruments",
    "answer": "Banjo",
    "difficulty": "medium",
    "emojis": "🧑‍🤝‍🧑🌾🫳🔘",
    "hint": "A plucked string instrument with a round resonator common in bluegrass.",
    "explanation": "🧑‍🤝‍🧑 gives communal playing, 🌾 gives the bluegrass setting, 🫳 gives the plucking motion, and 🔘 gives the round resonator."
  },
  {
    "id": "music-genres-funk",
    "categoryId": "music-genres",
    "answer": "Funk",
    "difficulty": "medium",
    "emojis": "🕺🪘🥁🔁",
    "hint": "A groove-centered dance style with syncopation and strong bass.",
    "explanation": "🕺 gives the dance floor, 🪘 and 🥁 give layered rhythm, and 🔁 gives the repeated groove that drives funk."
  },
  {
    "id": "music-genres-randb",
    "categoryId": "music-genres",
    "answer": "R&B",
    "difficulty": "medium",
    "emojis": "🎙️🫀🪘🌃",
    "hint": "A groove-driven style with expressive vocals, keyboard lines, and a late-night feel.",
    "explanation": "🎙️ gives expressive vocals, 🫀 gives emotional feeling, 🪘 gives the rhythmic groove, and 🌃 gives the late-night performance mood."
  },
  {
    "id": "art-supplies-crayons",
    "categoryId": "art-supplies",
    "answer": "Crayons",
    "difficulty": "easy",
    "emojis": "🕯️🌈📄🤲",
    "hint": "Solid wax-color sticks for drawing on paper.",
    "explanation": "🕯️ suggests wax, 🌈 gives many pigments, 📄 gives the drawing surface, and 🤲 gives hand coloring."
  },
  {
    "id": "art-supplies-markers",
    "categoryId": "art-supplies",
    "answer": "Markers",
    "difficulty": "easy",
    "emojis": "🧽🟣📄🖐️",
    "hint": "Color tools that leave bold ink through a porous tip.",
    "explanation": "🧽 gives the porous felt tip, 🟣 gives bold ink color, 📄 gives the page, and 🖐️ gives the hand-held drawing action."
  },
  {
    "id": "art-supplies-colored-pencils",
    "categoryId": "art-supplies",
    "answer": "Colored Pencils",
    "difficulty": "easy",
    "emojis": "🪵🔺🟠🟣",
    "hint": "Slim wooden drawing tools with colored cores that can layer.",
    "explanation": "🪵 gives the wooden casing, 🔺 gives the sharpened point, and 🟠🟣 give separate pigment colors that can be layered."
  },
  {
    "id": "art-supplies-glue",
    "categoryId": "art-supplies",
    "answer": "Glue",
    "difficulty": "easy",
    "emojis": "🫧🧷🧩👐",
    "hint": "A craft adhesive that bonds separate pieces.",
    "explanation": "🫧 gives a spreadable adhesive, 🧷 gives fastening, 🧩 gives separate pieces becoming one, and 👐 gives craft application."
  },
  {
    "id": "art-supplies-palette",
    "categoryId": "art-supplies",
    "answer": "Palette",
    "difficulty": "easy",
    "emojis": "🟠🟣⚪🔄",
    "hint": "A hand-held surface with small wells for mixing colors.",
    "explanation": "🟠🟣⚪ give separate paint dabs, and 🔄 gives arranging and mixing them on one working surface."
  },
  {
    "id": "art-supplies-watercolor-paint",
    "categoryId": "art-supplies",
    "answer": "Watercolor Paint",
    "difficulty": "easy",
    "emojis": "🖌️📜🌫️🟦",
    "hint": "A transparent painting medium that makes pale washes on paper.",
    "explanation": "🖌️ gives the brush, 📜 gives paper, 🌫️ gives the translucent wash, and 🟦 gives a diluted color pigment."
  },
  {
    "id": "art-supplies-acrylic-paint",
    "categoryId": "art-supplies",
    "answer": "Acrylic Paint",
    "difficulty": "medium",
    "emojis": "🖼️🧱⏱️🧪",
    "hint": "A fast-drying paint medium that forms a durable film on many surfaces.",
    "explanation": "🖼️ gives an art surface, 🧱 gives a rigid support, ⏱️ gives fast drying, and 🧪 gives the synthetic medium being tested and mixed."
  },
  {
    "id": "art-supplies-chalk",
    "categoryId": "art-supplies",
    "answer": "Chalk",
    "difficulty": "easy",
    "emojis": "⚪🧱🫳💨",
    "hint": "A soft drawing stick that leaves a dusty mark on a board.",
    "explanation": "⚪ gives the pale mark, 🧱 gives a board or wall surface, 🫳 gives the drawing hand, and 💨 gives the dust it leaves behind."
  },
  {
    "id": "art-supplies-beads",
    "categoryId": "art-supplies",
    "answer": "Beads",
    "difficulty": "easy",
    "emojis": "🟣🕳️🪢👐",
    "hint": "Small colorful pieces with holes that can be threaded into crafts.",
    "explanation": "🟣 gives colorful pieces, 🕳️ gives their holes, 🪢 gives threading and knotting, and 👐 gives the craft work."
  },
  {
    "id": "school-supplies-notebook",
    "categoryId": "school-supplies",
    "answer": "Notebook",
    "difficulty": "easy",
    "emojis": "🗒️🌀🧵🗂️",
    "hint": "A bound set of blank or lined pages for notes.",
    "explanation": "🗒️ gives the pages, 🌀 gives a spiral binding, 🧵 gives the bound edge, and 🗂️ gives organized notes."
  },
  {
    "id": "camping-hiking-boots",
    "categoryId": "camping",
    "answer": "Hiking Boots",
    "difficulty": "easy",
    "emojis": "🪢🧦🛡️🪨",
    "hint": "Sturdy lace-up footwear with grippy soles for rocky trails.",
    "explanation": "🪢 gives laces, 🧦 gives footwear around the ankle, 🛡️ gives support and protection, and 🪨 gives rough trail terrain."
  },
  {
    "id": "camping-trail-map",
    "categoryId": "camping",
    "answer": "Trail Map",
    "difficulty": "medium",
    "emojis": "📍🔀📐🧭",
    "hint": "A paper guide showing distances, turns, and landmarks along a hike.",
    "explanation": "📍 gives mapped landmarks, 🔀 gives route branches, 📐 gives measured distance, and 🧭 gives navigation."
  },
  {
    "id": "camping-headlamp",
    "categoryId": "camping",
    "answer": "Headlamp",
    "difficulty": "easy",
    "emojis": "🧢🔆👐🌌",
    "hint": "A hands-free light worn above your eyes for night travel.",
    "explanation": "🧢 gives the head-worn band, 🔆 gives directed brightness, 👐 gives hands-free use, and 🌌 gives night travel."
  },
  {
    "id": "camping-water-bottle",
    "categoryId": "camping",
    "answer": "Water Bottle",
    "difficulty": "easy",
    "emojis": "🫗🥤🔄🤲",
    "hint": "A refillable drinking container carried separately from a pack.",
    "explanation": "🫗 gives pouring, 🥤 gives a drink, 🔄 gives repeated refilling, and 🤲 gives carrying the container by hand."
  },
  {
    "id": "camping-camp-pillow",
    "categoryId": "camping",
    "answer": "Camp Pillow",
    "difficulty": "easy",
    "emojis": "🧠😴🫧🧳",
    "hint": "A small cushion that supports your head, not your whole sleeping body.",
    "explanation": "🧠 gives head support, 😴 gives sleep, 🫧 gives a compressible cushion, and 🧳 gives packable travel gear."
  },
  {
    "id": "national-parks-grand-canyon",
    "categoryId": "national-parks",
    "answer": "Grand Canyon",
    "difficulty": "easy",
    "emojis": "🔻📚🌅🧭",
    "hint": "A famous deep gorge cut by a river through colorful rock layers.",
    "explanation": "🔻 gives the narrowing gorge, 📚 gives stacked layers, 🌅 gives the vast overlook, and 🧭 gives the famous destination."
  },
  {
    "id": "national-parks-arches",
    "categoryId": "national-parks",
    "answer": "Arches",
    "difficulty": "medium",
    "emojis": "🌀🟠🚪🌵",
    "hint": "A desert park with natural stone openings shaped by erosion.",
    "explanation": "🌀 gives erosion, 🟠 gives warm sandstone, 🚪 gives the repeated natural openings, and 🌵 gives the desert setting."
  },
  {
    "id": "national-parks-great-sand-dunes-national-park-and-preserve",
    "categoryId": "national-parks",
    "answer": "Great Sand Dunes National Park and Preserve",
    "difficulty": "medium",
    "emojis": "🟤🦶↗️🏔️",
    "hint": "A Colorado park protecting North America's tallest dunes beside high mountains.",
    "explanation": "🟤 gives sand, 🦶 gives walking the dune face, ↗️ gives rising slopes, and 🏔️ gives the mountain backdrop."
  },
  {
    "id": "halloween-jack-o-lantern",
    "categoryId": "halloween",
    "answer": "Jack-o'-Lantern",
    "difficulty": "easy",
    "emojis": "👀🟠🧩🔆",
    "hint": "A hollow autumn gourd carved with a face and lit from inside.",
    "explanation": "👀 gives the carved face, 🟠 gives the autumn gourd, 🧩 gives cut openings, and 🔆 gives the inner light."
  },
  {
    "id": "halloween-ghost",
    "categoryId": "halloween",
    "answer": "Ghost",
    "difficulty": "easy",
    "emojis": "🫥🌫️🪞🚪",
    "hint": "A folklore figure said to drift through walls and appear translucent.",
    "explanation": "🫥 gives a fading figure, 🌫️ gives a translucent apparition, 🪞 gives the eerie reflection idea, and 🚪 gives passing through a doorway or wall."
  },
  {
    "id": "winter-holidays-hanukkiah",
    "categoryId": "winter-holidays",
    "answer": "Hanukkiah",
    "difficulty": "medium",
    "emojis": "9️⃣🧱🔆8️⃣",
    "hint": "A nine-branched candleholder used during Hanukkah.",
    "explanation": "9️⃣ gives the nine branches, 🧱 gives the standing holder, 🔆 gives the lights, and 8️⃣ recalls the eight nights of lighting.",
    "details": "Type: Holiday object; the nine-branched Hanukkah candelabrum is called a hanukkiah.",
    "funFact": "A Hanukkah hanukkiah has eight lights plus a separate helper light.",
    "tags": [
      "holidays",
      "winter",
      "winter-holidays"
    ]
  },
  {
    "id": "winter-holidays-gift-wrap",
    "categoryId": "winter-holidays",
    "answer": "Gift Wrap",
    "difficulty": "easy",
    "emojis": "📄🎀🧻📦",
    "hint": "Decorative paper and ribbon that cover a present.",
    "explanation": "📄 gives the paper, 🎀 gives ribbon, 🧻 gives the covering layer, and 📦 gives the wrapped package."
  },
  {
    "id": "winter-holidays-kwanzaa-kinara",
    "categoryId": "winter-holidays",
    "answer": "Kwanzaa Kinara",
    "difficulty": "medium",
    "emojis": "7️⃣🟥⬛🟩🔆",
    "hint": "The seven-candle holder used in a late-year cultural celebration.",
    "explanation": "7️⃣ gives the seven lights, 🟥⬛🟩 give the traditional red, black, and green arrangement, and 🔆 gives the lit display."
  },
  {
    "id": "summer-fun-swimming-pool",
    "categoryId": "summer-fun",
    "answer": "Swimming Pool",
    "difficulty": "easy",
    "emojis": "🔷🛟🧼↔️",
    "hint": "A built basin with lanes and filtered water for swimming.",
    "explanation": "🔷 gives pool tiles, 🛟 gives pool safety, 🧼 gives filtered cleanliness, and ↔️ gives marked lanes across the basin."
  },
  {
    "id": "summer-fun-water-balloon",
    "categoryId": "summer-fun",
    "answer": "Water Balloon",
    "difficulty": "easy",
    "emojis": "🫨🤲💥",
    "hint": "A thin rubber toy filled with water that bursts when tossed.",
    "explanation": "🫨 gives the flexible toy in motion, 🤲 gives the toss, and 💥 gives the burst without implying a group fight."
  },
  {
    "id": "summer-fun-fireworks",
    "categoryId": "summer-fun",
    "answer": "Fireworks",
    "difficulty": "easy",
    "emojis": "💥🌈📣⬆️",
    "hint": "A celebration display that bursts into colorful light overhead.",
    "explanation": "💥 gives the burst, 🌈 gives many colors, 📣 gives the loud report, and ⬆️ gives the upward launch."
  },
  {
    "id": "summer-fun-ice-cream-truck",
    "categoryId": "summer-fun",
    "answer": "Ice Cream Truck",
    "difficulty": "easy",
    "emojis": "🏘️🎵🧊🪙",
    "hint": "A neighborhood vehicle that plays music while selling frozen desserts.",
    "explanation": "🏘️ gives a neighborhood route, 🎵 gives the familiar announcement, 🧊 gives frozen treats, and 🪙 gives the small purchase."
  },
  {
    "id": "summer-fun-camping-trip",
    "categoryId": "summer-fun",
    "answer": "Camping Trip",
    "difficulty": "easy",
    "emojis": "🛌🧳🌌🧭",
    "hint": "A getaway that involves traveling to sleep outdoors.",
    "explanation": "🛌 gives sleeping outside, 🧳 gives a getaway, 🌌 gives an overnight setting, and 🧭 gives travel and exploration."
  },
  {
    "id": "beach-day-surfboard",
    "categoryId": "beach-day",
    "answer": "Surfboard",
    "difficulty": "easy",
    "emojis": "📏〰️🦶↔️",
    "hint": "A long board designed to carry a rider across breaking waves.",
    "explanation": "📏 gives the board's length, 〰️ gives the breaking wave, 🦶 gives the rider's stance, and ↔️ gives balance across the moving water."
  },
  {
    "id": "beach-day-beach-ball",
    "categoryId": "beach-day",
    "answer": "Beach Ball",
    "difficulty": "medium",
    "emojis": "⚪🔴🔵🤲",
    "hint": "A lightweight striped inflatable toy tossed between people on sand.",
    "explanation": "⚪ gives the round shape, 🔴 and 🔵 give contrasting panels, and 🤲 gives the hand-tossed play."
  },
  {
    "id": "beach-day-flip-flops",
    "categoryId": "beach-day",
    "answer": "Flip-Flops",
    "difficulty": "easy",
    "emojis": "🪶👣🔊🧷",
    "hint": "Open slip-on footwear with a toe strap that makes a slapping sound.",
    "explanation": "🪶 gives lightweight footwear, 👣 gives walking, 🔊 gives the familiar slap, and 🧷 gives the small toe-strap fastener."
  },
  {
    "id": "beach-day-beach-towel",
    "categoryId": "beach-day",
    "answer": "Beach Towel",
    "difficulty": "easy",
    "emojis": "🧺🛁🫧🪶",
    "hint": "A large absorbent cloth for drying after a swim.",
    "explanation": "🧺 gives a packed cloth, 🛁 gives washing and drying use, 🫧 gives soap or suds, and 🪶 gives its soft texture."
  },
  {
    "id": "amusement-park-arcade",
    "categoryId": "amusement-park",
    "answer": "Arcade",
    "difficulty": "easy",
    "emojis": "🪙💡🧩🚪",
    "hint": "An indoor park area filled with game machines and prize counters.",
    "explanation": "🪙 gives game payment, 💡 gives bright cabinets, 🧩 gives the games, and 🚪 gives the indoor attraction area."
  },
  {
    "id": "amusement-park-funnel-cake",
    "categoryId": "amusement-park",
    "answer": "Funnel Cake",
    "difficulty": "medium",
    "emojis": "🌾🫗🔥🍬",
    "hint": "A fried fair dessert made from batter drizzled into a spiral.",
    "explanation": "🌾 gives flour, 🫗 gives batter being poured, 🔥 gives frying heat, and 🍬 gives the sweet fair treat."
  },
  {
    "id": "amusement-park-mascot",
    "categoryId": "amusement-park",
    "answer": "Mascot",
    "difficulty": "easy",
    "emojis": "🎭🪪📣📸",
    "hint": "A costumed character that represents a park or team and welcomes guests.",
    "explanation": "🎭 gives the costume, 🪪 gives a recognizable identity, 📣 gives welcoming energy, and 📸 gives visitor photos."
  },
  {
    "id": "around-the-house-sofa",
    "categoryId": "around-the-house",
    "answer": "Sofa",
    "difficulty": "easy",
    "emojis": "👥📺😴🧵",
    "hint": "A long upholstered seat for several people.",
    "explanation": "👥 gives shared seating, 📺 gives the living-room setting, 😴 gives relaxing, and 🧵 gives upholstery."
  },
  {
    "id": "around-the-house-bed",
    "categoryId": "around-the-house",
    "answer": "Bed",
    "difficulty": "easy",
    "emojis": "🧺😴🌙🧵",
    "hint": "A piece of furniture with a mattress where someone sleeps.",
    "explanation": "🧺 gives bed linens, 😴 gives sleep, 🌙 gives nighttime, and 🧵 gives the soft bedding around the mattress."
  },
  {
    "id": "around-the-house-mirror",
    "categoryId": "around-the-house",
    "answer": "Mirror",
    "difficulty": "easy",
    "emojis": "👀↔️✨🧍",
    "hint": "A smooth surface that reflects a person and reverses the image.",
    "explanation": "👀 gives the reflected face, ↔️ gives reversal, ✨ gives reflected light, and 🧍 gives the person standing before it."
  },
  {
    "id": "around-the-house-trash-can",
    "categoryId": "around-the-house",
    "answer": "Trash Can",
    "difficulty": "easy",
    "emojis": "🧻🧹📦🛑",
    "hint": "A household container for items being thrown away.",
    "explanation": "🧻 gives common waste, 🧹 gives cleanup, 📦 gives discarded household items, and 🛑 gives the container waiting for emptying."
  },
  {
    "id": "around-the-house-shower",
    "categoryId": "around-the-house",
    "answer": "Shower",
    "difficulty": "easy",
    "emojis": "🫧🧴🧼⬆️",
    "hint": "A wall fixture that sprays water from above for washing.",
    "explanation": "🫧 gives spray, 🧴 gives bath products, 🧼 gives washing, and ⬆️ gives the overhead fixture."
  },
  {
    "id": "around-the-house-toilet",
    "categoryId": "around-the-house",
    "answer": "Toilet",
    "difficulty": "easy",
    "emojis": "🧻🫧🔄⬇️",
    "hint": "A bathroom fixture used with a flush for waste.",
    "explanation": "🧻 gives toilet paper, 🫧 gives hygiene, 🔄 gives the flush cycle, and ⬇️ gives waste moving through plumbing."
  },
  {
    "id": "around-the-house-stairs",
    "categoryId": "around-the-house",
    "answer": "Stairs",
    "difficulty": "easy",
    "emojis": "⬆️🧱↕️👣",
    "hint": "A fixed series of steps connecting floors inside a home.",
    "explanation": "⬆️ gives upward travel, 🧱 gives a built structure, ↕️ gives movement between levels, and 👣 gives repeated footsteps."
  },
  {
    "id": "kitchen-tools-ladle",
    "categoryId": "kitchen-tools",
    "answer": "Ladle",
    "difficulty": "easy",
    "emojis": "🍲🫳📏🫗",
    "hint": "A long-handled scoop used to serve soup from a deep pot.",
    "explanation": "🍲 gives soup, 🫳 gives the serving grip, 📏 gives the long handle, and 🫗 gives transferring liquid from pot to bowl."
  },
  {
    "id": "kitchen-tools-citrus-juicer",
    "categoryId": "kitchen-tools",
    "answer": "Citrus Juicer",
    "difficulty": "medium",
    "emojis": "🫳🔺🍹🫗",
    "hint": "A kitchen tool that presses cut citrus to release juice.",
    "explanation": "🫳 gives pressing, 🔺 gives the reamer cone, 🍹 gives the extracted juice, and 🫗 gives pouring the result."
  },
  {
    "id": "kitchen-tools-potato-masher",
    "categoryId": "kitchen-tools",
    "answer": "Potato Masher",
    "difficulty": "easy",
    "emojis": "🫳⬇️🕳️🧈",
    "hint": "A hand tool with a perforated plate that crushes cooked tubers.",
    "explanation": "🫳 gives the grip, ⬇️ gives pressing, 🕳️ gives the perforated plate, and 🧈 gives the soft mashed result."
  },
  {
    "id": "kitchen-tools-pastry-brush",
    "categoryId": "kitchen-tools",
    "answer": "Pastry Brush",
    "difficulty": "easy",
    "emojis": "🫗🧈🥐🪶",
    "hint": "A small-bristled tool for spreading glaze or egg wash over dough.",
    "explanation": "🫗 gives a liquid coating, 🧈 gives butter or glaze, 🥐 gives pastry, and 🪶 gives soft bristles."
  },
  {
    "id": "idioms-best-of-both-worlds",
    "categoryId": "idioms",
    "answer": "Best of Both Worlds",
    "difficulty": "medium",
    "emojis": "↔️🌍🌍🏆",
    "hint": "An idiom about getting the advantages of two different choices.",
    "explanation": "↔️ gives two choices, the two 🌍 emojis give two worlds, and 🏆 gives the benefit of coming away with the best from each."
  },
  {
    "id": "idioms-through-thick-and-thin",
    "categoryId": "idioms",
    "answer": "Through Thick and Thin",
    "difficulty": "medium",
    "emojis": "🤝🧊🔥⏳",
    "hint": "An idiom about staying loyal through good times and hard times.",
    "explanation": "🤝 gives loyalty, 🧊 and 🔥 give opposite difficult conditions, and ⏳ gives staying together over time."
  },
  {
    "id": "emotions-love",
    "categoryId": "emotions",
    "answer": "Love",
    "difficulty": "easy",
    "emojis": "👥🤝🧸⏳",
    "hint": "A deep feeling of care that grows through trust, time, and close connection.",
    "explanation": "👥 gives close relationships, 🤝 gives trust and connection, 🧸 gives caring comfort, and ⏳ gives lasting attachment."
  },
  {
    "id": "emotions-nervous",
    "categoryId": "emotions",
    "answer": "Nervous",
    "difficulty": "easy",
    "emojis": "👐💓📋⚡",
    "hint": "A jittery feeling before an important event.",
    "explanation": "👐 gives fidgeting, 💓 gives a racing heartbeat, 📋 gives preparation, and ⚡ gives the sudden jolt of nervous energy."
  },
  {
    "id": "emotions-frustrated",
    "categoryId": "emotions",
    "answer": "Frustrated",
    "difficulty": "easy",
    "emojis": "🧩🚧🔁🛑",
    "hint": "An upset feeling when repeated effort is blocked.",
    "explanation": "🧩 gives a difficult problem, 🚧 gives the obstacle, 🔁 gives repeated attempts, and 🛑 gives progress being stopped."
  },
  {
    "id": "robots-ai-assistant",
    "categoryId": "robots",
    "answer": "AI Assistant",
    "difficulty": "medium",
    "emojis": "💬💡📱🧠",
    "hint": "Software that answers and helps with tasks.",
    "explanation": "💬 represents conversation, 💡 signals help, 📱 shows a device interface, and 🧠 evokes language processing in software."
  },
  {
    "id": "robots-factory-robot",
    "categoryId": "robots",
    "answer": "Factory Robot",
    "difficulty": "easy",
    "emojis": "🏭🛠️📦🔁",
    "hint": "A programmable machine on an assembly line that repeatedly handles products.",
    "explanation": "🏭 gives the factory, 🛠️ gives automated work, 📦 gives products being handled, and 🔁 gives repeated assembly cycles."
  },
  {
    "id": "plants-fern",
    "categoryId": "plants",
    "answer": "Fern",
    "difficulty": "medium",
    "emojis": "🌫️🌀🪶🟢",
    "hint": "A nonflowering shade plant that unfurls fronds and reproduces with spores.",
    "explanation": "🌫️ gives damp shade, 🌀 gives unfurling fronds, 🪶 gives their featherlike shape, and 🟢 gives leafy green cover."
  },
  {
    "id": "plants-pumpkin-vine",
    "categoryId": "plants",
    "answer": "Pumpkin Vine",
    "difficulty": "medium",
    "emojis": "🪢🟠🍃🧺",
    "hint": "A sprawling vine whose large orange fruit develops from yellow blossoms.",
    "explanation": "🪢 gives the trailing vine, 🟠 gives the developing orange fruit, 🍃 gives leaves, and 🧺 gives the garden harvest."
  },
  {
    "id": "plants-aloe-vera",
    "categoryId": "plants",
    "answer": "Aloe Vera",
    "difficulty": "medium",
    "emojis": "🟢🧴🪨🌤️",
    "hint": "A warm-climate succulent with thick leaves and soothing inner gel.",
    "explanation": "🟢 gives fleshy green leaves, 🧴 gives the soothing gel use, 🪨 gives a dry rocky habitat, and 🌤️ gives warm growing conditions."
  },
  {
    "id": "harry-potter-ron-weasley",
    "categoryId": "harry-potter",
    "answer": "Ron Weasley",
    "difficulty": "easy",
    "emojis": "🟥♟️👨‍👩‍👧‍👦🧑‍🤝‍🧑",
    "hint": "Harry's chess-playing best friend from a large red-haired wizarding family.",
    "explanation": "🟥 gives red hair, ♟️ gives Wizard Chess, 👨‍👩‍👧‍👦 gives the large family, and 🧑‍🤝‍🧑 gives Ron's place in the trio."
  },
  {
    "id": "harry-potter-albus-dumbledore",
    "categoryId": "harry-potter",
    "answer": "Albus Dumbledore",
    "difficulty": "easy",
    "emojis": "🧔👓🧑‍🏫🍬",
    "hint": "An elderly wizard and school leader known for half-moon glasses and sweets.",
    "explanation": "🧔 gives the long beard, 👓 gives the half-moon glasses, 🧑‍🏫 gives the school-leader role, and 🍬 gives his fondness for sweets."
  },
  {
    "id": "harry-potter-rubeus-hagrid",
    "categoryId": "harry-potter",
    "answer": "Rubeus Hagrid",
    "difficulty": "easy",
    "emojis": "📏☂️🔑🐾",
    "hint": "A half-giant groundskeeper with a pink umbrella and love of magical creatures.",
    "explanation": "📏 gives Hagrid's giant size, ☂️ gives the distinctive umbrella, 🔑 gives Keeper of the Keys, and 🐾 gives his care for creatures."
  },
  {
    "id": "harry-potter-hedwig",
    "categoryId": "harry-potter",
    "answer": "Hedwig",
    "difficulty": "medium",
    "emojis": "🪶📬🌙❄️",
    "hint": "Harry's snowy owl companion who delivers messages.",
    "explanation": "🪶 gives the bird without a direct owl glyph, 📬 gives message delivery, 🌙 gives night flight, and ❄️ gives Hedwig's snowy appearance."
  },
  {
    "id": "harry-potter-the-deathly-hallows",
    "categoryId": "harry-potter",
    "answer": "The Deathly Hallows",
    "difficulty": "medium",
    "emojis": "3️⃣🔺👬🎁📜",
    "hint": "A legend about three powerful objects inherited by one wizarding family.",
    "explanation": "3️⃣ counts the set, 🔺 gives the Hallows emblem, 👬 gives the Peverell brothers, 🎁 gives inherited objects, and 📜 gives the old legend."
  }
] as const;

describe("partition C blind-review repairs", () => {
  it("uses the approved clues, hints, explanations, difficulty, and replacement fields", () => {
    const byId = new Map(expandedPuzzles.map((puzzle) => [puzzle.id, puzzle]));

    expect(repairedCards).toHaveLength(82);

    for (const expected of repairedCards) {
      const actual = byId.get(expected.id);
      expect(actual, expected.id + " should exist").toBeDefined();
      expect(actual).toMatchObject(expected);
    }

    expect(byId.has("winter-holidays-menorah")).toBe(false);
    expect(answerEmojiBanlist.hanukkiah).toContain("🕎");
  });
});
