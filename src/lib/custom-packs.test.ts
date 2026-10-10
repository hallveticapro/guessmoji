import { describe, expect, it } from "vitest";
import type { CustomPack } from "@/types/custom-pack";
import {
  createEmptyCard,
  createEmptyPack,
  exportPack,
  getPackProblems,
  importPack,
  isEmojiClue,
  MAX_CARDS,
  MAX_CLUE_EMOJI,
  MAX_IMPORT_BYTES,
  MAX_PACKS,
  packToGame,
  readPackLibrary,
  serializePackLibrary,
} from "./custom-packs";

function example(): CustomPack {
  return {
    ...createEmptyPack(),
    name: "Weekend",
    description: "Things we do",
    cards: [
      {
        ...createEmptyCard(),
        answer: "Camping",
        emojis: "🏕️ 🌙",
        hint: "Outdoors",
        explanation: "A tent beneath the moon.",
        difficulty: "easy" as const,
      },
    ],
  };
}

describe("custom pack files", () => {
  it("creates unique IDs when randomUUID is unavailable on HTTP", () => {
    const original = Object.getOwnPropertyDescriptor(crypto, "randomUUID");
    Object.defineProperty(crypto, "randomUUID", {
      value: undefined,
      configurable: true,
    });
    try {
      const ids = [
        createEmptyPack().id,
        createEmptyCard().id,
        createEmptyPack().id,
      ];
      expect(new Set(ids).size).toBe(3);
      for (const id of ids)
        expect(id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
        );
    } finally {
      if (original) Object.defineProperty(crypto, "randomUUID", original);
      else Reflect.deleteProperty(crypto, "randomUUID");
    }
  });
  it("roundtrips every author field while giving each imported copy new identities", () => {
    const pack = example();
    const first = importPack(exportPack(pack));
    const second = importPack(exportPack(pack));
    expect(first).toMatchObject({
      name: pack.name,
      description: pack.description,
      icon: pack.icon,
      cards: [
        {
          answer: "Camping",
          emojis: "🏕️ 🌙",
          hint: "Outdoors",
          explanation: "A tent beneath the moon.",
          difficulty: "easy",
        },
      ],
    });
    expect(new Set([pack.id, first.id, second.id]).size).toBe(3);
    expect(
      new Set([pack.cards[0].id, first.cards[0].id, second.cards[0].id]).size,
    ).toBe(3);
  });

  it("exports and imports an unfinished draft for recovery", () => {
    const draft = createEmptyPack();
    draft.cards.push(createEmptyCard());
    expect(importPack(exportPack(draft)).cards[0].answer).toBe("");
    expect(importPack(exportPack(createEmptyPack())).cards).toEqual([]);
    expect(getPackProblems(draft)).toEqual([
      "Give your pack a name.",
      "Card 1: add an answer.",
      "Card 1: add a clue using only emoji.",
    ]);
  });

  it.each([
    ["bad JSON", "{"],
    [
      "unknown version",
      JSON.stringify({
        format: "guessmoji-custom-pack",
        version: 2,
        pack: example(),
      }),
    ],
    [
      "wrong format",
      JSON.stringify({ format: "other", version: 1, pack: example() }),
    ],
    [
      "missing required fields",
      JSON.stringify({
        format: "guessmoji-custom-pack",
        version: 1,
        pack: { name: "A" },
      }),
    ],
    [
      "invalid difficulty",
      JSON.stringify({
        format: "guessmoji-custom-pack",
        version: 1,
        pack: {
          ...example(),
          cards: [{ ...createEmptyCard(), difficulty: "impossible" }],
        },
      }),
    ],
    [
      "oversized card list",
      JSON.stringify({
        format: "guessmoji-custom-pack",
        version: 1,
        pack: {
          ...example(),
          cards: Array.from({ length: MAX_CARDS + 1 }, createEmptyCard),
        },
      }),
    ],
    [
      "oversized field",
      JSON.stringify({
        format: "guessmoji-custom-pack",
        version: 1,
        pack: { ...example(), name: "a".repeat(81) },
      }),
    ],
    ["oversized bytes", "🦋".repeat(MAX_IMPORT_BYTES / 4 + 1)],
  ])("rejects %s without partially importing", (_label, text) => {
    expect(() => importPack(text)).toThrow();
  });

  it("whitelists fields and drops prototype-related payload properties", () => {
    const json = JSON.parse(exportPack(example()));
    json.pack.extra = "untrusted";
    json.pack.cards[0].extra = "untrusted";
    Object.defineProperty(json.pack, "__proto__", {
      value: { polluted: true },
      enumerable: true,
    });
    const imported = importPack(JSON.stringify(json));
    expect(Object.keys(imported)).not.toContain("extra");
    expect(Object.keys(imported)).not.toContain("__proto__");
    expect(Object.keys(imported.cards[0])).not.toContain("extra");
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
  });

  it("preserves library identities and rejects corrupt or unsupported existing storage", () => {
    const pack = example();
    expect(readPackLibrary(serializePackLibrary([pack]))).toEqual([pack]);
    expect(readPackLibrary(null)).toEqual([]);
    expect(() => readPackLibrary("oops")).toThrow();
    expect(() => readPackLibrary('{"version":9,"packs":[]}')).toThrow(
      /version/,
    );
    expect(() =>
      serializePackLibrary(
        Array.from({ length: MAX_PACKS + 1 }, createEmptyPack),
      ),
    ).toThrow();
  });
});

describe("custom game validation", () => {
  it("allows complex graphemes but bounds playable clue length for small screens", () => {
    const pack = example();
    pack.cards[0].emojis = Array.from(
      { length: MAX_CLUE_EMOJI },
      () => "👨‍👩‍👧‍👦",
    ).join(" ");
    expect(getPackProblems(pack)).toEqual([]);
    pack.cards[0].emojis += " 🎉";
    expect(getPackProblems(pack)).toEqual([
      "Card 1: use at most 8 emoji so the clue fits the screen.",
    ]);
    expect(importPack(exportPack(pack)).cards[0].emojis).toBe(
      pack.cards[0].emojis,
    );
  });
  it.each([
    "🎉",
    "👨‍👩‍👧‍👦",
    "🇺🇸",
    "1️⃣",
    "🏕️ 🌙",
    "👍🏽",
    "🏴\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",
  ])("accepts an emoji clue %s", (clue) =>
    expect(isEmojiClue(clue)).toBe(true),
  );
  it.each(["", "  ", "Camping 🏕️", "1", "#", "🏽", "hello", "🎉+🎈"])(
    "rejects non-clue %s",
    (clue) => expect(isEmojiClue(clue)).toBe(false),
  );
  it("identifies incomplete cards and maps populated optional reveal fields only", () => {
    const pack = example();
    expect(getPackProblems(pack)).toEqual([]);
    pack.cards.push({ ...createEmptyCard(), answer: "Party", emojis: "🎉" });
    const game = packToGame(pack);
    expect(game.category.id).toBe(`custom-${pack.id}`);
    expect(game.puzzles[0]).toMatchObject({
      categoryId: game.category.id,
      hint: "Outdoors",
      explanation: "A tent beneath the moon.",
    });
    expect(game.puzzles[1]).not.toHaveProperty("hint");
    expect(game.puzzles[1]).not.toHaveProperty("explanation");
    pack.cards[1].emojis = "word";
    expect(getPackProblems(pack)).toEqual([
      "Card 2: add a clue using only emoji.",
    ]);
    expect(() => packToGame(pack)).toThrow(/Card 2/);
  });
});
