import { describe, expect, it } from "vitest";
import { answerEmojiBanlist } from "@/data/answerEmojiBanlist";
import { categories } from "@/data/categories";
import { puzzles } from "@/data/puzzles";
import { findDirectAnswerEmojiLeaks, normalizeAnswerForAudit } from "@/lib/clue-audit";
import { getCategoryEmojiUsage } from "@/lib/content-audit";
import type { Puzzle, PuzzleDifficulty } from "@/types/puzzle";

const sourcePuzzles = puzzles;

type ExpectedCard = {
  id: string;
  categoryId: string;
  answer: string;
  difficulty: PuzzleDifficulty;
  emojis: string;
  hint: string;
  explanation: string;
};

const immediateRewrites: readonly ExpectedCard[] = [
  {
    id: "ariel",
    categoryId: "disney-princesses",
    answer: "Ariel",
    difficulty: "easy",
    emojis: "🌊🪸🪞🎶",
    hint: "An undersea princess collects human treasures and risks her voice to reach the surface.",
    explanation: "🌊 and 🪸 place the story below the surface, 🪞 represents the human objects she collects, and 🎶 points to the voice she risks.",
  },
  {
    id: "belle",
    categoryId: "disney-princesses",
    answer: "Belle",
    difficulty: "easy",
    emojis: "📚🌹🤝🕯️",
    hint: "A bookish village girl chooses compassion inside an enchanted castle.",
    explanation: "📚 shows her love of reading, 🌹 marks the enchanted rose, 🤝 represents the compassion she learns to choose, and 🕯️ evokes the enchanted household.",
  },
  {
    id: "jasmine",
    categoryId: "disney-princesses",
    answer: "Jasmine",
    difficulty: "medium",
    emojis: "🏜️🕌🪽🧭",
    hint: "A headstrong princess seeks freedom beyond a desert palace with a tiger companion.",
    explanation: "🏜️ places the story in the desert, 🕌 evokes the palace, 🪽 represents her wish for freedom beyond its walls, and 🧭 points to the journey she chooses.",
  },
  {
    id: "tiana",
    categoryId: "disney-princesses",
    answer: "Tiana",
    difficulty: "easy",
    emojis: "🍲🎺🌙🏙️",
    hint: "A determined New Orleans server works toward opening her own restaurant while a bayou spell changes her plans.",
    explanation: "🍲 represents her cooking, 🎺 evokes New Orleans jazz, 🌙 places the adventure in the bayou at night, and 🏙️ points to the restaurant dream in her city.",
  },
  {
    id: "rapunzel",
    categoryId: "disney-princesses",
    answer: "Rapunzel",
    difficulty: "easy",
    emojis: "📏🏮🗼🌄",
    hint: "A sheltered princess leaves her tower to chase a lantern festival and a life beyond the walls.",
    explanation: "📏 evokes the extraordinary length that defines her story, 🏮 points to the lantern festival, 🗼 is the tower she leaves, and 🌄 represents the wider world she longs to see.",
  },
  {
    id: "merida",
    categoryId: "disney-princesses",
    answer: "Merida",
    difficulty: "medium",
    emojis: "🏹🌄🧶🤝",
    hint: "A fiercely independent Highland princess challenges an old custom and fights to repair a family bond.",
    explanation: "🏹 shows her archery, 🌄 places her in the Highlands, 🧶 represents the family tapestry, and 🤝 marks the bond she works to repair.",
  },
  {
    id: "elsa",
    categoryId: "disney-princesses",
    answer: "Elsa",
    difficulty: "easy",
    emojis: "❄️🌀🧤🏰",
    hint: "A young queen learns to control a power that turns a palace into ice.",
    explanation: "❄️ shows the cold power she must control, 🌀 evokes its swirling magic, 🧤 recalls the restraint she tries to maintain, and 🏰 marks the palace transformed by it.",
  },
  {
    id: "anna",
    categoryId: "disney-princesses",
    answer: "Anna",
    difficulty: "easy",
    emojis: "❤️🧭🏔️🪢",
    hint: "A fearless younger sister crosses a frozen wilderness to bring her family home.",
    explanation: "❤️ represents her loyal love, 🧭 shows the journey she undertakes, 🏔️ places the crossing in a frozen mountain landscape, and 🪢 symbolizes the family bond she refuses to lose.",
  },
  {
    id: "animals-elephant",
    categoryId: "animals",
    answer: "Elephant",
    difficulty: "easy",
    emojis: "📏👂👐💧",
    hint: "A huge animal with a trunk and big ears.",
    explanation: "📏 emphasizes its enormous size, 👂 highlights its famously large ears, 👐 evokes the trunk used like a hand, and 💧 points to its need for water.",
  },
  {
    id: "animals-horse",
    categoryId: "animals",
    answer: "Horse",
    difficulty: "easy",
    emojis: "🪮🧑‍🌾🛞💨",
    hint: "A maned farm animal can gallop and pull or carry people.",
    explanation: "🪮 evokes grooming a mane, 🧑‍🌾 represents a rider or handler, 🛞 points to a horse-drawn cart, and 💨 signals a gallop.",
  },
  {
    id: "dinosaurs-carnotaurus",
    categoryId: "dinosaurs",
    answer: "Carnotaurus",
    difficulty: "medium",
    emojis: "🦬🇦🇷🤏🧠",
    hint: "A horned South American predator had unusually tiny arms and a deep skull.",
    explanation: "🦬 evokes the paired brow horns, 🇦🇷 points to South America, 🤏 shows the tiny arms, and 🧠 the deep skull.",
  },
  {
    id: "vegetables-broccoli",
    categoryId: "vegetables",
    answer: "Broccoli",
    difficulty: "easy",
    emojis: "💚🌳🧩♨️",
    hint: "A green, tree-shaped vegetable is steamed in bite-sized florets.",
    explanation: "💚 shows the green crown, 🌳 evokes its branching tree-like shape, 🧩 represents the clustered florets, and ♨️ signals steaming.",
  },
  {
    id: "vegetables-zucchini",
    categoryId: "vegetables",
    answer: "Zucchini",
    difficulty: "easy",
    emojis: "🟩🔘🍝🌀",
    hint: "A smooth summer squash can be sliced into rounds or spiralized into noodles.",
    explanation: "🟩 shows the smooth green skin, 🔘 represents round slices, 🍝 points to its noodle-like cooked preparation, and 🌀 shows spiralizing.",
  },
  {
    id: "breakfast-scrambled-eggs",
    categoryId: "breakfast",
    answer: "Scrambled Eggs",
    difficulty: "easy",
    emojis: "🟡🌀🧩♨️",
    hint: "Eggs are stirred into soft curds in a warm pan.",
    explanation: "🟡 represents the yolk, 🌀 shows the stirring motion, 🧩 represents the soft curds, and ♨️ signals the heat.",
  },
  {
    id: "breakfast-breakfast-casserole",
    categoryId: "breakfast",
    answer: "Breakfast Casserole",
    difficulty: "easy",
    emojis: "🫕🧱🔥⏱️",
    hint: "Eggs and other morning ingredients bake in layers in one dish.",
    explanation: "🫕 represents the baking dish, 🧱 shows the assembled layers, 🔥 signals oven heat, and ⏱️ points to the make-ahead timing that suits a group dish.",
  },
  {
    id: "desserts-macaron",
    categoryId: "desserts",
    answer: "Macaron",
    difficulty: "medium",
    emojis: "⭕🟡🫧🪞",
    hint: "A French meringue sweet pairs smooth shells with a creamy center.",
    explanation: "⭕ shows the paired round shells, 🟡 the filling, 🫧 the airy meringue, and 🪞 the smooth shell surface.",
  },
];

const secondPassARewrites: readonly ExpectedCard[] = [
  {
    id: "marvel-shuri",
    categoryId: "marvel",
    answer: "Shuri",
    difficulty: "medium",
    emojis: "👩‍🔬🛠️🏙️🧠",
    hint: "A brilliant Wakandan princess and scientist builds advanced tools for her kingdom.",
    explanation: "👩‍🔬 identifies a scientist, 🛠️ her inventions, 🏙️ the Wakandan city, and 🧠 her inventive mind.",
  },
  {
    id: "star-wars-rey",
    categoryId: "star-wars",
    answer: "Rey",
    difficulty: "medium",
    emojis: "🏜️🪵✨🧑",
    hint: "A human scavenger from Jakku follows a Jedi path after discovering her place in the Force.",
    explanation: "🏜️ places the character on Jakku; 🪵 gives the carried staff; ✨ represents the Force; and 🧑 distinguishes the human hero from the desert scavenger species suggested by the old clue.",
  },
  {
    id: "pokemon-i-choose-you",
    categoryId: "video-game-movies",
    answer: "Pokémon the Movie: I Choose You!",
    difficulty: "medium",
    emojis: "1️⃣🧢🐭🤝🛤️",
    hint: "A trainer relives the opening journey with a familiar electric partner.",
    explanation: "1️⃣ marks the first journey, 🧢 the trainer, 🐭 the familiar electric partner, 🤝 their chosen partnership, and 🛤️ the road retelling.",
  },
  {
    id: "kid-tv-shows-kim-possible",
    categoryId: "kid-tv-shows",
    answer: "Kim Possible",
    difficulty: "easy",
    emojis: "🧑‍🎓📱🦰🛡️",
    hint: "A red-haired high-school spy balances homework with missions against villains.",
    explanation: "🧑‍🎓 establishes high school, 📱 is the mission communicator, 🦰 identifies the red-haired heroine, and 🛡️ signals her protective hero work.",
  },
  {
    id: "animated-classics-the-land-before-time",
    categoryId: "animated-classics",
    answer: "The Land Before Time",
    difficulty: "easy",
    emojis: "🦕👥🏞️🧭",
    hint: "A herd of young dinosaurs travels toward a legendary safe valley.",
    explanation: "🦕 identifies the prehistoric children, 👥 the young herd, 🏞️ the valley landscape, and 🧭 their long journey.",
  },
  {
    id: "ocean-animals-seal",
    categoryId: "ocean-animals",
    answer: "Seal",
    difficulty: "medium",
    emojis: "⚪⚫🧊📣🫧",
    hint: "A spotted marine mammal rests on ice and makes a barking call.",
    explanation: "⚪ and ⚫ suggest the spotted coat; 🧊 gives the ice haul-out; 📣 represents the bark-like call; and 🫧 shows the underwater dives of this buoyant marine mammal.",
  },
  {
    id: "dinosaurs-carnotaurus",
    categoryId: "dinosaurs",
    answer: "Carnotaurus",
    difficulty: "medium",
    emojis: "🦬🇦🇷🤏🧠",
    hint: "A horned South American predator had unusually tiny arms and a deep skull.",
    explanation: "🦬 evokes the paired brow horns, 🇦🇷 points to South America, 🤏 shows the tiny arms, and 🧠 the deep skull.",
  },
  {
    id: "dinosaurs-allosaurus",
    categoryId: "dinosaurs",
    answer: "Allosaurus",
    difficulty: "medium",
    emojis: "3️⃣🖐️👀🦷",
    hint: "A large Jurassic predator had three-fingered hands and ridges above its eyes.",
    explanation: "3️⃣ and 🖐️ identify the three-fingered hands, 👀 the paired brow ridges, and 🦷 the large predator.",
  },
  {
    id: "fruit-honeydew",
    categoryId: "fruit",
    answer: "Honeydew",
    difficulty: "medium",
    emojis: "🟢⚪🧊🌱",
    hint: "A smooth-rind melon has pale-green flesh and mild sweetness.",
    explanation: "🟢 and ⚪ distinguish the smooth green rind and pale interior, 🧊 evokes chilled serving, and 🌱 the melon growing on a vine.",
  },
  {
    id: "vegetables-celery",
    categoryId: "vegetables",
    answer: "Celery",
    difficulty: "easy",
    emojis: "📏🌿🧵🥗",
    hint: "A leafy-topped stalk has stringy ribs and a crisp, watery bite.",
    explanation: "📏 gives the long stalk; 🌿 supplies its leafy top; 🧵 shows the stringy ribs; and 🥗 evokes the raw salad or snack use of the crisp stalk.",
  },
  {
    id: "vegetables-cabbage",
    categoryId: "vegetables",
    answer: "Cabbage",
    difficulty: "easy",
    emojis: "🍃🫙🥗🍲",
    hint: "A leafy head is shredded for slaw, soups, and fermented dishes.",
    explanation: "🍃 represents the layered leaves, 🫙 fermented preparations, 🥗 slaw, and 🍲 soup use.",
  },
  {
    id: "vegetables-brussels-sprouts",
    categoryId: "vegetables",
    answer: "Brussels Sprouts",
    difficulty: "easy",
    emojis: "🟢🔘🪵🔥",
    hint: "Small green heads grow along a stalk and become tender when roasted.",
    explanation: "🟢 and 🔘 show the small green heads, 🪵 the stalk, and 🔥 the common roasting preparation.",
  },
  {
    id: "vegetables-artichoke",
    categoryId: "vegetables",
    answer: "Artichoke",
    difficulty: "medium",
    emojis: "🔺👐🥣🌿",
    hint: "A layered flower bud is pulled apart and dipped before eating.",
    explanation: "🔺 suggests the pointed bracts, 👐 the pull-apart leaves, 🥣 a dipping bowl, and 🌿 the thistle-like plant.",
  },
  {
    id: "vegetables-okra",
    categoryId: "vegetables",
    answer: "Okra",
    difficulty: "medium",
    emojis: "📐⭐🍲🟢",
    hint: "A ridged green pod makes a star-shaped cross-section and thickens stews.",
    explanation: "📐 shows the ridges, ⭐ the star-shaped slice, 🍲 the stew use, and 🟢 the green pod.",
  },
  {
    id: "vegetables-swiss-chard",
    categoryId: "vegetables",
    answer: "Swiss Chard",
    difficulty: "medium",
    emojis: "🌈🍃🧵👐",
    hint: "A leafy green has brightly colored stalks and can be cooked like spinach.",
    explanation: "🌈 identifies the colorful stalks, 🍃 the broad leaf, 🧵 the fibrous stems, and 👐 the separate handling of leaves and stalks.",
  },
  {
    id: "desserts-cupcake",
    categoryId: "desserts",
    answer: "Cupcake",
    difficulty: "easy",
    emojis: "📄🌀🕯️🤏",
    hint: "A single frosted bake rises in a pleated paper liner.",
    explanation: "📄 is the pleated paper liner; 🌀 gives the frosting swirl; 🕯️ evokes a celebratory topping; and 🤏 emphasizes the small individual portion.",
  },
  {
    id: "desserts-s-mores",
    categoryId: "desserts",
    answer: "S'mores",
    difficulty: "easy",
    emojis: "⛺🪵⚪⬜",
    hint: "A camp treat stacks a toasted soft center between two crisp squares.",
    explanation: "⛺ establishes the camp setting, 🪵 the firewood setting, ⚪ the soft toasted center, and ⬜ the crisp square layers.",
  },
  {
    id: "desserts-macaron",
    categoryId: "desserts",
    answer: "Macaron",
    difficulty: "medium",
    emojis: "⭕🟡🫧🪞",
    hint: "A French meringue sweet pairs smooth shells with a creamy center.",
    explanation: "⭕ shows the paired round shells, 🟡 the filling, 🫧 the airy meringue, and 🪞 the smooth shell surface.",
  },
  {
    id: "desserts-clair",
    categoryId: "desserts",
    answer: "Éclair",
    difficulty: "medium",
    emojis: "📏🧴🟫👐",
    hint: "An oblong hand-held pastry carries cream beneath a glossy top.",
    explanation: "📏 shows the elongated shape, 🧴 the piped cream, 🟫 the glossy top, and 👐 its hand-held form.",
  },
  {
    id: "desserts-fruit-tart",
    categoryId: "desserts",
    answer: "Fruit Tart",
    difficulty: "medium",
    emojis: "📐🌈🧺🪞",
    hint: "A crisp pastry shell holds cream under a neat fruit mosaic.",
    explanation: "📐 shows the crisp shell edge, 🌈 the colorful fruit arrangement, 🧺 the fresh topping, and 🪞 its glossy finish.",
  },
  {
    id: "snacks-chips",
    categoryId: "snacks",
    answer: "Chips",
    difficulty: "easy",
    emojis: "🛍️🟨🧂⚡",
    hint: "Thin salted slices come in a crinkly bag and snap when bitten.",
    explanation: "🛍️ evokes a crinkly snack bag, 🟨 the thin golden slices, 🧂 the salt, and ⚡ the crisp snap.",
  },
  {
    id: "snacks-rice-cakes",
    categoryId: "snacks",
    answer: "Rice Cakes",
    difficulty: "medium",
    emojis: "⭕🫧📦⬜",
    hint: "Flat puffed-grain discs stack into a light, porous snack.",
    explanation: "⭕ shows the discs, 🫧 the porous puffed texture, 📦 the packaged snack, and ⬜ the pale grain color.",
  },
  {
    id: "snacks-biscotti",
    categoryId: "snacks",
    answer: "Biscotti",
    difficulty: "medium",
    emojis: "☕🫗📏🔁",
    hint: "A dry oblong treat is baked twice and made for dunking.",
    explanation: "☕ and 🫗 show the dunking drink, 📏 the oblong biscuit, and 🔁 the defining second bake.",
  },
  {
    id: "breakfast-breakfast-burrito",
    categoryId: "breakfast",
    answer: "Breakfast Burrito",
    difficulty: "medium",
    emojis: "📜🥚🧀🌶️",
    hint: "A soft flatbread folds around eggs, cheese, and savory morning fillings.",
    explanation: "📜 represents the folded tortilla, 🥚 and 🧀 the core fillings, and 🌶️ the savory breakfast profile.",
  },
  {
    id: "breakfast-eggs-benedict",
    categoryId: "breakfast",
    answer: "Eggs Benedict",
    difficulty: "medium",
    emojis: "🫗🟡🥓🍞",
    hint: "A poached center and rich sauce crown a toasted breakfast base.",
    explanation: "🫗 is the rich hollandaise, 🟡 the poached egg center, 🥓 the traditional savory topping, and 🍞 the toasted base.",
  },
  {
    id: "breakfast-breakfast-sandwich",
    categoryId: "breakfast",
    answer: "Breakfast Sandwich",
    difficulty: "easy",
    emojis: "🥚🍞🧀🤲",
    hint: "A warm morning meal places a cooked egg and savory filling between bread layers for eating by hand.",
    explanation: "🥚 gives the cooked egg; 🍞 supplies the bread layers; 🧀 gives a savory filling; and 🤲 marks the handheld serving format.",
  },
  {
    id: "breakfast-english-muffin",
    categoryId: "breakfast",
    answer: "English Muffin",
    difficulty: "easy",
    emojis: "🍞🧩↔️🔘",
    hint: "A round yeast bread splits open to reveal nooks and a coarse surface for toasting.",
    explanation: "🍞 gives the bread; 🧩 represents its nooks; ↔️ shows the split; and 🔘 supplies the round form.",
  },
  {
    id: "breakfast-quiche",
    categoryId: "breakfast",
    answer: "Quiche",
    difficulty: "medium",
    emojis: "🫕🟡🌿📐",
    hint: "A savory custard bakes inside a crisp shell with cheese or vegetables.",
    explanation: "🫕 shows the baked dish, 🟡 the egg custard, 🌿 a vegetable filling, and 📐 the crisp tart shell.",
  },
  {
    id: "breakfast-chia-pudding",
    categoryId: "breakfast",
    answer: "Chia Pudding",
    difficulty: "medium",
    emojis: "⚫🫙🫧🥄",
    hint: "Tiny seeds swell into a chilled, spoonable gel.",
    explanation: "⚫ shows the seeds, 🫙 the soaked jar, 🫧 the gelled texture, and 🥄 the spoonable preparation.",
  },
  {
    id: "breakfast-danish-pastry",
    categoryId: "breakfast",
    answer: "Danish Pastry",
    difficulty: "medium",
    emojis: "📜✨🍓👐",
    hint: "A flaky layered bake holds fruit or cream beneath a glaze.",
    explanation: "📜 represents flaky laminated layers; ✨ gives the glaze; 🍓 supplies a fruit filling; and 👐 shows the hand-held baked good.",
  },
  {
    id: "breakfast-biscuit-and-gravy",
    categoryId: "breakfast",
    answer: "Biscuit and Gravy",
    difficulty: "easy",
    emojis: "🟤✂️🫗🌶️",
    hint: "A Southern morning plate pairs split baked rounds with a warm pepper-seasoned sauce.",
    explanation: "🟤 gives the browned baked rounds; ✂️ shows them split open; 🫗 represents the poured gravy; and 🌶️ supplies the peppered savory seasoning.",
  },
];

const secondPassAPreservedRevealFields = [
  { id: "marvel-shuri", details: "Marvel's Wakandan princess and scientist who develops advanced tools and later takes on a heroic mantle.", funFact: "Shuri first appeared in Marvel Comics in 2005.", tags: ["marvel", "hero", "wakanda"] },
  { id: "star-wars-rey", details: "Star Wars hero introduced in the sequel trilogy who becomes a Jedi.", funFact: "Rey first appears in The Force Awakens, played by Daisy Ridley.", tags: ["star-wars", "jedi", "film"] },
  { id: "pokemon-i-choose-you", details: "Released: 2017 | Type: anime movie", funFact: "Pokémon the Movie: I Choose You! commemorated the anime's 20th anniversary.", tags: ["video-games", "pokemon"] },
  { id: "kid-tv-shows-kim-possible", details: "Disney animated series about a teenage crime fighter aided by Ron Stoppable and Rufus.", funFact: "The opening theme asks, “What's the sitch?” as a shorthand for situation.", tags: ["kid-tv", "hero", "disney"] },
  { id: "animated-classics-the-land-before-time", details: "Animated adventure about orphaned dinosaur children traveling to the Great Valley.", funFact: "The film was produced by Steven Spielberg and George Lucas and released in 1988.", tags: ["animated-classics", "dinosaurs", "film"] },
  { id: "ocean-animals-seal", details: "Marine mammal that uses flippers to swim and often rests on shore or ice.", funFact: "Many seals can slow their heart rate during dives to conserve oxygen.", tags: ["ocean-animals", "mammal"] },
  { id: "dinosaurs-carnotaurus", details: "Late Cretaceous theropod dinosaur known for two horns above its eyes.", funFact: "Carnotaurus is one of the few known carnivorous dinosaurs with preserved skin impressions.", tags: ["dinosaurs", "carnivore", "paleontology"] },
  { id: "dinosaurs-allosaurus", details: "Large theropod dinosaur from the Late Jurassic, known for a deep skull and paired brow ridges.", funFact: "Allosaurus means “different lizard,” referring to the unusual shape of its vertebrae.", tags: ["dinosaurs", "carnivore", "paleontology"] },
  { id: "fruit-honeydew", details: "Melon with smooth rind and light green flesh, often served chilled.", funFact: "Honeydew is also called White Antibes melon in some parts of the world.", tags: ["fruit", "melon"] },
  { id: "vegetables-celery", details: "Type: Stalk vegetable", funFact: "Celery has long fibrous stalks and is mostly water.", tags: ["food", "vegetables"] },
  { id: "vegetables-cabbage", details: "Leafy vegetable that forms a compact head and is eaten raw or cooked.", funFact: "Kimchi and sauerkraut are both fermented cabbage preparations.", tags: ["vegetables", "leafy-green"] },
  { id: "vegetables-brussels-sprouts", details: "Compact buds of a cabbage-family plant, commonly roasted or steamed.", funFact: "The vegetable is named after Brussels, Belgium, where it was cultivated widely.", tags: ["vegetables", "cruciferous"] },
  { id: "vegetables-artichoke", details: "Edible immature flower head of a thistle plant, usually steamed or grilled.", funFact: "The heart is the tender center left after the tougher outer leaves are removed.", tags: ["vegetables", "flower-bud"] },
  { id: "vegetables-okra", details: "Warm-season flowering plant whose edible pods are used in soups, stews, and fried dishes.", funFact: "The mucilage released by okra pods is what thickens gumbo.", tags: ["vegetables", "pod"] },
  { id: "vegetables-swiss-chard", details: "Leafy vegetable with broad green leaves and stalks that may be red, yellow, orange, or white.", funFact: "The stalks and leaves can be cooked separately because they soften at different rates.", tags: ["vegetables", "leafy-green"] },
  { id: "desserts-cupcake", details: "Type: Baked dessert", funFact: "Cupcakes became popular because they bake quickly in small cups.", tags: ["food", "dessert", "desserts"] },
  { id: "desserts-s-mores", details: "Type: Campfire dessert", funFact: "The name is short for some more.", tags: ["food", "dessert", "desserts"] },
  { id: "desserts-macaron", details: "French-style almond meringue cookie made from two shells joined by a filling.", funFact: "Macarons and coconut macaroons are different confections despite their similar names.", tags: ["desserts", "cookie"] },
  { id: "desserts-clair", details: "Oblong French pastry made from choux dough, filled with cream, and finished with icing.", funFact: "Éclair dough is made from pâte à choux, the same dough used for cream puffs.", tags: ["desserts", "pastry"] },
  { id: "desserts-fruit-tart", details: "Open pastry dessert topped with pastry cream or another filling and arranged fruit.", funFact: "Many fruit tarts combine a baked pastry shell with a layer of custard and fresh fruit.", tags: ["desserts", "pastry", "fruit"] },
  { id: "snacks-chips", details: "Type: Snack", funFact: "Potato chips were popularized in the 1800s.", tags: ["food", "snacks"] },
  { id: "snacks-rice-cakes", details: "Type: Puffed grain snack", funFact: "Puffed rice expands when heat and pressure are released.", tags: ["food", "snacks"] },
  { id: "snacks-biscotti", details: "Dry, oblong Italian biscuits baked twice for a firm, crisp texture, often with almonds.", funFact: "The name biscotti comes from Latin roots that mean “baked twice.”", tags: ["snacks", "baked", "cookie"] },
  { id: "breakfast-breakfast-burrito", details: "Type: Breakfast dish", funFact: "A breakfast burrito commonly wraps eggs and other morning fillings in a flour tortilla.", tags: ["food", "breakfast"] },
  { id: "breakfast-eggs-benedict", details: "Type: Brunch dish", funFact: "Eggs Benedict commonly combines poached eggs, Canadian bacon, an English muffin, and hollandaise sauce.", tags: ["food", "breakfast"] },
  { id: "breakfast-breakfast-sandwich", details: "Type: Breakfast dish", funFact: "Breakfast sandwiches often combine eggs with cheese and a bread or biscuit.", tags: ["food", "breakfast"] },
  { id: "breakfast-english-muffin", details: "Type: Bread", funFact: "English muffins are yeast-raised round breads with a coarse-textured surface, commonly split and toasted.", tags: ["food", "breakfast"] },
  { id: "breakfast-quiche", details: "Pastry crust filled with an egg-and-dairy custard and savory additions.", funFact: "Quiche Lorraine traditionally includes bacon and comes from the Lorraine region of France.", tags: ["breakfast", "savory"] },
  { id: "breakfast-chia-pudding", details: "No-cook breakfast made by soaking chia seeds in milk or another liquid until gelled.", funFact: "Chia seeds can absorb many times their weight in liquid because of their soluble fiber.", tags: ["breakfast", "plant-based"] },
  { id: "breakfast-danish-pastry", details: "Sweet laminated yeast pastry associated with Danish baking and often filled or glazed.", funFact: "Danish pastry developed from Austrian baking techniques brought to Denmark in the nineteenth century.", tags: ["breakfast", "baked"] },
  { id: "breakfast-biscuit-and-gravy", details: "Southern U.S. breakfast of biscuits served with a thick sausage or peppered gravy.", funFact: "The dish became especially common in the American South because the ingredients were inexpensive and filling.", tags: ["breakfast", "savory"] },
] as const;

const secondPassADifficultyChanges = [
  { id: "fruit-honeydew", from: "easy", to: "medium" },
  { id: "star-wars-rey", from: "easy", to: "medium" },
  { id: "ocean-animals-seal", from: "easy", to: "medium" },
] as const;

type FocusedReview = {
  id: string;
  categoryId: string;
  answer: string;
  difficulty: PuzzleDifficulty;
  candidate: Omit<ExpectedCard, "id" | "categoryId" | "answer" | "difficulty">;
  fallback: Omit<ExpectedCard, "id" | "categoryId" | "answer" | "difficulty">;
  priorAlias: string;
};

const focusedReviews: readonly FocusedReview[] = [
  {
    id: "snacks-fruit-snacks",
    categoryId: "snacks",
    answer: "Fruit Snacks",
    difficulty: "easy",
    candidate: {
      emojis: "🌈🎒🧃🧩",
      hint: "Colorful fruit-flavored chews come in a lunchbox-friendly pouch.",
      explanation: "🌈 evokes varied fruit flavors, 🎒 points to a lunchbox snack, 🧃 suggests fruit-drink packaging, and 🧩 shows the playful molded shapes.",
    },
    fallback: {
      emojis: "🌈🍎🎒📦",
      hint: "Small fruit-flavored chews are packed for a lunchbox snack.",
      explanation: "🌈 gives varied fruit colors, 🍎 gives the fruit flavor cue, 🎒 gives the lunchbox setting, and 📦 gives the packaged snack format.",
    },
    priorAlias: "Gummy candy",
  },
  {
    id: "dinosaurs-pteranodon",
    categoryId: "dinosaurs",
    answer: "Pteranodon",
    difficulty: "medium",
    candidate: {
      emojis: "🪽📐↩️🐟",
      hint: "A Late Cretaceous pterosaur has a long toothless jaw and a backward-pointing crest.",
      explanation: "🪽 shows flight, 📐 signals the long jaw, ↩️ marks the backward-pointing crest, and 🐟 suggests coastal prey.",
    },
    fallback: {
      emojis: "🪽📐↩️🌊",
      hint: "A flying Late Cretaceous reptile had a long toothless jaw and a backward crest above the coast.",
      explanation: "🪽 gives powered flight, 📐 gives the long jaw, ↩️ gives the backward crest, and 🌊 places this coastal pterosaur in its habitat.",
    },
    priorAlias: "Pterodactyl",
  },
];

const princessDirectCueGlyphs: Readonly<Record<string, readonly string[]>> = {
  Ariel: ["🧜‍♀️", "🦰", "🦀", "🔱", "🦵"],
  Belle: ["🫖", "👗"],
  Jasmine: ["🐅", "🪄", "🧞‍♂️", "💎"],
  Tiana: ["🐸", "👑"],
  Rapunzel: ["💇‍♀️", "🦎", "🌸"],
  Merida: ["🐻", "🧡"],
  Elsa: ["👑", "🎶", "🧊"],
  Anna: ["👩‍🦰", "👭", "⛄"],
};

function findPuzzle(id: string): Puzzle {
  const puzzle = sourcePuzzles.find((candidate) => candidate.id === id);
  if (!puzzle) {
    throw new Error(`Missing expected puzzle ${id}`);
  }
  return puzzle;
}

function graphemes(value: string): string[] {
  return [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(value)].map(
    ({ segment }) => segment,
  );
}

function normalizedEmoji(value: string): string {
  return value.replace(/\uFE0F/g, "");
}

function emojiSet(value: string): Set<string> {
  return new Set(graphemes(normalizedEmoji(value)));
}

function sharedEmojis(first: string, second: string): string[] {
  const secondSet = emojiSet(second);
  return [...emojiSet(first)].filter((emoji) => secondSet.has(emoji)).sort();
}

function expectClueShape(emojis: string): void {
  expect(emojis).not.toMatch(/[\s\n\r]/);
  expect(graphemes(emojis).length).toBeGreaterThanOrEqual(3);
  expect(graphemes(emojis).length).toBeLessThanOrEqual(5);
}

function expectNoAnswerOrAliasText(text: string | undefined, answer: string, alias?: string): void {
  const normalizedText = normalizeAnswerForAudit(text ?? "");
  expect(normalizedText).not.toContain(normalizeAnswerForAudit(answer));
  if (alias) {
    expect(normalizedText).not.toContain(normalizeAnswerForAudit(alias));
  }
}

describe("partition A blind-review follow-up repairs", () => {
  it("covers every second-pass A row exactly once with its approved rewrite", () => {
    const expectedIds = secondPassARewrites.map(({ id }) => id);

    expect(secondPassARewrites).toHaveLength(31);
    expect(new Set(expectedIds).size).toBe(31);

    for (const expected of secondPassARewrites) {
      const puzzle = findPuzzle(expected.id);

      expect(puzzle.categoryId, `${expected.id} category`).toBe(expected.categoryId);
      expect(puzzle.answer, `${expected.id} answer`).toBe(expected.answer);
      expect(puzzle.difficulty, `${expected.id} difficulty`).toBe(expected.difficulty);
      expect(puzzle.emojis, `${expected.id} emojis`).toBe(expected.emojis);
      expect(puzzle.hint, `${expected.id} hint`).toBe(expected.hint);
      expect(puzzle.explanation, `${expected.id} explanation`).toBe(expected.explanation);
      expectClueShape(puzzle.emojis);
      expectNoAnswerOrAliasText(puzzle.hint, puzzle.answer);
      expect(findDirectAnswerEmojiLeaks([puzzle], answerEmojiBanlist)).toEqual([]);
    }
  });

  it("applies exactly the second-pass A difficulty recalibrations", () => {
    expect(secondPassADifficultyChanges).toEqual([
      { id: "fruit-honeydew", from: "easy", to: "medium" },
      { id: "star-wars-rey", from: "easy", to: "medium" },
      { id: "ocean-animals-seal", from: "easy", to: "medium" },
    ]);

    for (const change of secondPassADifficultyChanges) {
      expect(findPuzzle(change.id).difficulty, `${change.id} difficulty`).toBe(change.to);
    }
    expect(secondPassARewrites.filter(({ id }) => id === "fruit-honeydew")).toHaveLength(1);
  });

  it("preserves every second-pass A card's identity and reveal metadata", () => {
    expect(puzzles).toHaveLength(1320);
    expect(new Set(puzzles.map((puzzle) => puzzle.id)).size).toBe(1320);
    expect(secondPassAPreservedRevealFields).toHaveLength(31);

    const preservedById = new Map<string, (typeof secondPassAPreservedRevealFields)[number]>(
      secondPassAPreservedRevealFields.map((card) => [card.id, card]),
    );
    for (const expected of secondPassARewrites) {
      const actual = findPuzzle(expected.id);
      const preserved = preservedById.get(expected.id);

      expect(preserved, `${expected.id} preserved field snapshot`).toBeDefined();
      expect({
        id: actual.id,
        categoryId: actual.categoryId,
        answer: actual.answer,
        details: actual.details,
        funFact: actual.funFact,
        tags: actual.tags,
      }).toEqual({
        id: actual.id,
        categoryId: actual.categoryId,
        answer: actual.answer,
        details: preserved?.details,
        funFact: preserved?.funFact,
        tags: preserved?.tags,
      });
    }
  });

  it("keeps every second-pass A clue free of answer leaks and category-context filler", () => {
    const categoryById = new Map(categories.map((category) => [category.id, category]));

    for (const expected of secondPassARewrites) {
      const puzzle = findPuzzle(expected.id);
      const category = categoryById.get(puzzle.categoryId);

      expect(category, `${expected.id} category`).toBeDefined();
      if (expected.id !== "star-wars-rey") {
        expect(puzzle.emojis).not.toContain(category?.icon ?? "");
      }
      expectNoAnswerOrAliasText(puzzle.hint, puzzle.answer);
      expect(findDirectAnswerEmojiLeaks([puzzle], answerEmojiBanlist)).toEqual([]);
    }
  });

  it("keeps repaired cards distinct from every same-category clue and preserves reviewed repetition warnings", () => {
    const repairedIds = new Set(secondPassARewrites.map(({ id }) => id));
    const categoryIds = new Set(secondPassARewrites.map(({ categoryId }) => categoryId));

    for (const categoryId of categoryIds) {
      const categoryCards = sourcePuzzles.filter((puzzle) => puzzle.categoryId === categoryId);
      for (const puzzle of categoryCards.filter(({ id }) => repairedIds.has(id))) {
        for (const other of categoryCards) {
          if (other.id === puzzle.id) continue;
          expect(puzzle.emojis, `${puzzle.id}/${other.id} exact clue`).not.toBe(other.emojis);
          expect(
            sharedEmojis(puzzle.emojis, other.emojis).length,
            `${puzzle.id}/${other.id} shared clue glyphs`,
          ).toBeLessThanOrEqual(2);
        }
      }
    }

    const warnings: Array<{ categoryId: string; emoji: string; count: number; ratio: number }> = [];
    for (const categoryId of categoryIds) {
      const usage = getCategoryEmojiUsage(
        sourcePuzzles.filter((puzzle) => puzzle.categoryId === categoryId),
      );
      for (const [emoji, summary] of usage) {
        if (summary.ratio > 0.2) {
          warnings.push({ categoryId, emoji, count: summary.count, ratio: summary.ratio });
        }
      }
    }

    expect(warnings).toEqual([
      { categoryId: "vegetables", emoji: "🍃", count: 7, ratio: 7 / 30 },
    ]);
  });

  it("applies every immediate rewrite field to its exact source card", () => {
    for (const expected of immediateRewrites) {
      const puzzle = findPuzzle(expected.id);

      expect(puzzle.categoryId, `${expected.id} category`).toBe(expected.categoryId);
      expect(puzzle.answer, `${expected.id} answer`).toBe(expected.answer);
      expect(puzzle.difficulty, `${expected.id} difficulty`).toBe(expected.difficulty);
      expect(puzzle.emojis, `${expected.id} emojis`).toBe(expected.emojis);
      expect(puzzle.hint, `${expected.id} hint`).toBe(expected.hint);
      expect(puzzle.explanation, `${expected.id} explanation`).toBe(expected.explanation);
      expectClueShape(puzzle.emojis);
      expectNoAnswerOrAliasText(puzzle.hint, puzzle.answer);
      expect(findDirectAnswerEmojiLeaks([puzzle], answerEmojiBanlist)).toEqual([]);
    }
  });

  it("keeps focused-review candidates active while preserving their deterministic fallbacks", () => {
    for (const review of focusedReviews) {
      const puzzle = findPuzzle(review.id);

      expect(puzzle.categoryId, `${review.id} category`).toBe(review.categoryId);
      expect(puzzle.answer, `${review.id} answer`).toBe(review.answer);
      expect(puzzle.difficulty, `${review.id} difficulty`).toBe(review.difficulty);
      expect(puzzle.emojis, `${review.id} candidate emojis`).toBe(review.candidate.emojis);
      expect(puzzle.hint, `${review.id} candidate hint`).toBe(review.candidate.hint);
      expect(puzzle.explanation, `${review.id} candidate explanation`).toBe(review.candidate.explanation);
      expect(puzzle.emojis).not.toBe(review.fallback.emojis);
      expectClueShape(review.candidate.emojis);
      expectClueShape(review.fallback.emojis);
      expectNoAnswerOrAliasText(review.candidate.hint, review.answer, review.priorAlias);
      expectNoAnswerOrAliasText(review.fallback.hint, review.answer, review.priorAlias);

      const fallback: Puzzle = {
        ...puzzle,
        emojis: review.fallback.emojis,
        hint: review.fallback.hint,
        explanation: review.fallback.explanation,
      };
      expect(findDirectAnswerEmojiLeaks([puzzle, fallback], answerEmojiBanlist)).toEqual([]);
    }
  });

  it("keeps the eight princess clues pairwise distinct and free of their old direct cues", () => {
    const princesses = immediateRewrites.filter(
      ({ categoryId }) => categoryId === "disney-princesses",
    );

    for (const princess of princesses) {
      const puzzle = findPuzzle(princess.id);
      for (const forbiddenGlyph of princessDirectCueGlyphs[princess.answer] ?? []) {
        expect(normalizedEmoji(puzzle.emojis)).not.toContain(normalizedEmoji(forbiddenGlyph));
      }
      expectNoAnswerOrAliasText(puzzle.hint, princess.answer);
    }

    for (let firstIndex = 0; firstIndex < princesses.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < princesses.length; secondIndex += 1) {
        const first = findPuzzle(princesses[firstIndex].id);
        const second = findPuzzle(princesses[secondIndex].id);
        expect(
          sharedEmojis(first.emojis, second.emojis).length,
          `${first.answer}/${second.answer} shared clue glyphs`,
        ).toBeLessThan(2);
      }
    }
  });

  it("separates every named vegetable and breakfast collision at the grapheme level", () => {
    const pairChecks = [
      ["vegetables-broccoli", "vegetables-brussels-sprouts", []],
      ["vegetables-broccoli", "vegetables-cauliflower", ["🧩"]],
      ["vegetables-zucchini", "vegetables-green-beans", ["🟩"]],
      ["breakfast-scrambled-eggs", "breakfast-breakfast-casserole", []],
      ["elsa", "anna", []],
    ] as const;

    for (const [firstId, secondId, expectedShared] of pairChecks) {
      const first = findPuzzle(firstId);
      const second = findPuzzle(secondId);
      expect(sharedEmojis(first.emojis, second.emojis), `${first.answer}/${second.answer}`).toEqual(
        expectedShared,
      );
    }
  });

  it("matches every documented repetition disposition after the rewrites", () => {
    const countEmoji = (categoryId: string, emoji: string): number =>
      sourcePuzzles.filter(
        (puzzle) =>
          puzzle.categoryId === categoryId && emojiSet(puzzle.emojis).has(normalizedEmoji(emoji)),
      ).length;

    expect(countEmoji("animals", "🌾")).toBe(5);
    expect(countEmoji("vegetables", "🔪")).toBe(3);
    expect(countEmoji("vegetables", "🍃")).toBe(7);
    expect(countEmoji("desserts", "🥄")).toBe(4);
    expect(countEmoji("breakfast", "🔥")).toBe(6);
  });
});
