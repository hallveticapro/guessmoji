import type { CustomCard, CustomPack } from "@/types/custom-pack";
import type { Category, Puzzle } from "@/types/puzzle";

export const CUSTOM_PACKS_STORAGE_KEY = "guessmoji:customPacks";
export const MAX_PACKS = 30;
export const MAX_CARDS = 100;
export const MAX_CLUE_EMOJI = 8;
export const MAX_IMPORT_BYTES = 1_000_000;
export const PACK_LIMITS = {
  name: 80,
  description: 300,
  icon: 32,
  answer: 120,
  emojis: 200,
  hint: 300,
  explanation: 1000,
} as const;
const VERSION = 1;
const FORMAT = "guessmoji-custom-pack";
const MAX_LIBRARY_BYTES = MAX_IMPORT_BYTES * MAX_PACKS;

function newId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // randomUUID requires HTTPS; getRandomValues also works on local HTTP hosts.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function createEmptyCard(): CustomCard {
  return {
    id: newId(),
    answer: "",
    emojis: "",
    difficulty: "medium",
    hint: "",
    explanation: "",
  };
}

export function createEmptyPack(): CustomPack {
  const now = Date.now();
  return {
    id: newId(),
    name: "",
    description: "",
    icon: "🎨",
    cards: [],
    createdAt: now,
    updatedAt: now,
  };
}

function object(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function string(
  value: unknown,
  label: string,
  limit: number,
  required = false,
): string {
  if (
    typeof value !== "string" ||
    value.length > limit ||
    (required && !value.trim())
  ) {
    throw new Error(
      `${label} must be ${required ? "a nonempty" : "a"} string of at most ${limit} characters.`,
    );
  }
  return value;
}

function timestamp(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0)
    throw new Error(`${label} must be a valid timestamp.`);
  return value;
}

function parseCard(value: unknown, index: number): CustomCard {
  const row = object(value, `Card ${index + 1}`);
  if (!["easy", "medium", "hard"].includes(row.difficulty as string))
    throw new Error(`Card ${index + 1} has an invalid difficulty.`);
  return {
    id: string(row.id, `Card ${index + 1} ID`, 100, true),
    answer: string(row.answer, `Card ${index + 1} answer`, PACK_LIMITS.answer),
    emojis: string(row.emojis, `Card ${index + 1} clue`, PACK_LIMITS.emojis),
    difficulty: row.difficulty as CustomCard["difficulty"],
    hint: string(row.hint, `Card ${index + 1} hint`, PACK_LIMITS.hint),
    explanation: string(
      row.explanation,
      `Card ${index + 1} explanation`,
      PACK_LIMITS.explanation,
    ),
  };
}

function parsePack(value: unknown): CustomPack {
  const row = object(value, "Pack");
  if (!Array.isArray(row.cards) || row.cards.length > MAX_CARDS)
    throw new Error(`A pack must contain at most ${MAX_CARDS} cards.`);
  const cards = row.cards.map(parseCard);
  if (new Set(cards.map((card) => card.id)).size !== cards.length)
    throw new Error("Card IDs must be unique within a pack.");
  return {
    id: string(row.id, "Pack ID", 100, true),
    name: string(row.name, "Pack name", PACK_LIMITS.name),
    description: string(
      row.description,
      "Pack description",
      PACK_LIMITS.description,
    ),
    icon: string(row.icon, "Pack icon", PACK_LIMITS.icon),
    cards,
    createdAt: timestamp(row.createdAt, "Created time"),
    updatedAt: timestamp(row.updatedAt, "Updated time"),
  };
}

function parseJson(text: string, limit: number): unknown {
  if (new TextEncoder().encode(text).byteLength > limit)
    throw new Error(
      `File is too large. Maximum size is ${limit.toLocaleString()} bytes.`,
    );
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("This is not a valid JSON pack file.");
  }
}

export function exportPack(pack: CustomPack): string {
  return JSON.stringify(
    { format: FORMAT, version: VERSION, pack: parsePack(pack) },
    null,
    2,
  );
}

export function importPack(text: string): CustomPack {
  const row = object(parseJson(text, MAX_IMPORT_BYTES), "Pack file");
  if (row.format !== FORMAT)
    throw new Error("This is not a Guessmoji custom pack file.");
  if (row.version !== VERSION)
    throw new Error("This pack file uses an unsupported version.");
  const pack = parsePack(row.pack);
  const now = Date.now();
  return {
    ...pack,
    id: newId(),
    cards: pack.cards.map((card) => ({ ...card, id: newId() })),
    createdAt: now,
    updatedAt: now,
  };
}

export function readPackLibrary(raw: string | null): CustomPack[] {
  if (raw === null) return [];
  const row = object(parseJson(raw, MAX_LIBRARY_BYTES), "Saved library");
  if (row.version !== VERSION)
    throw new Error("The saved library uses an unsupported version.");
  if (!Array.isArray(row.packs) || row.packs.length > MAX_PACKS)
    throw new Error(`A library must contain at most ${MAX_PACKS} packs.`);
  const packs = row.packs.map(parsePack);
  if (new Set(packs.map((pack) => pack.id)).size !== packs.length)
    throw new Error("Saved pack IDs must be unique.");
  return packs;
}

export function serializePackLibrary(packs: CustomPack[]): string {
  if (packs.length > MAX_PACKS)
    throw new Error(`You can save up to ${MAX_PACKS} packs.`);
  // Parsing also whitelists fields and verifies the entire library before writing.
  return JSON.stringify({
    version: VERSION,
    packs: readPackLibrary(JSON.stringify({ version: VERSION, packs })),
  });
}

export function isEmojiClue(value: string): boolean {
  const parts = [
    ...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(
      value.trim(),
    ),
  ];
  return (
    parts.length > 0 &&
    parts.every(({ segment }) => {
      if (/^\s+$/u.test(segment)) return true;
      if (/^[#*0-9]\uFE0F?\u20E3$/u.test(segment)) return true;
      if (/^🏴[\u{E0020}-\u{E007E}]+\u{E007F}$/u.test(segment)) return true;
      return (
        /^[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Regional_Indicator}\p{Emoji_Modifier}\uFE0F\u200D]+$/u.test(
          segment,
        ) &&
        /[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Regional_Indicator}]/u.test(
          segment,
        ) &&
        !/^\p{Emoji_Modifier}+$/u.test(segment)
      );
    })
  );
}

export function getPackProblems(pack: CustomPack): string[] {
  const problems: string[] = [];
  if (!pack.name.trim()) problems.push("Give your pack a name.");
  if (pack.cards.length === 0) problems.push("Add at least one card to play.");
  pack.cards.forEach((card, index) => {
    if (!card.answer.trim()) problems.push(`Card ${index + 1}: add an answer.`);
    if (!isEmojiClue(card.emojis))
      problems.push(`Card ${index + 1}: add a clue using only emoji.`);
    else {
      const count = [
        ...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(
          card.emojis.trim(),
        ),
      ].filter(({ segment }) => !/^\s+$/u.test(segment)).length;
      if (count > MAX_CLUE_EMOJI)
        problems.push(
          `Card ${index + 1}: use at most ${MAX_CLUE_EMOJI} emoji so the clue fits the screen.`,
        );
    }
  });
  return problems;
}

export function packToGame(pack: CustomPack): {
  category: Category;
  puzzles: Puzzle[];
} {
  const problems = getPackProblems(pack);
  if (problems.length) throw new Error(problems.join(" "));
  const categoryId = `custom-${pack.id}`;
  return {
    category: {
      id: categoryId,
      slug: categoryId,
      name: pack.name.trim(),
      description: pack.description.trim(),
      ...(pack.icon.trim() ? { icon: pack.icon.trim() } : {}),
    },
    puzzles: pack.cards.map((card) => ({
      id: `${categoryId}-${card.id}`,
      categoryId,
      answer: card.answer.trim(),
      emojis: card.emojis.trim(),
      difficulty: card.difficulty,
      ...(card.hint.trim() ? { hint: card.hint.trim() } : {}),
      ...(card.explanation.trim()
        ? { explanation: card.explanation.trim() }
        : {}),
    })),
  };
}
