import type { Puzzle } from "@/types/puzzle";

export type AnswerEmojiBanlist = Readonly<Record<string, readonly string[]>>;

export type DirectAnswerEmojiLeak = {
  puzzleId: string;
  answer: string;
  emojis: string;
  forbiddenEmoji: string;
};

export function normalizeAnswerForAudit(answer: string): string {
  return answer
    .normalize("NFKD")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findDirectAnswerEmojiLeaks(
  puzzleList: readonly Puzzle[],
  banlist: AnswerEmojiBanlist,
): DirectAnswerEmojiLeak[] {
  const leaks: DirectAnswerEmojiLeak[] = [];

  for (const puzzle of puzzleList) {
    const normalizedAnswer = normalizeAnswerForAudit(puzzle.answer);
    const forbiddenEmojis = banlist[normalizedAnswer] ?? [];
    const normalizedClue = normalizeEmojiText(puzzle.emojis);

    for (const forbiddenEmoji of forbiddenEmojis) {
      if (normalizedClue.includes(normalizeEmojiText(forbiddenEmoji))) {
        leaks.push({
          puzzleId: puzzle.id,
          answer: puzzle.answer,
          emojis: puzzle.emojis,
          forbiddenEmoji,
        });
      }
    }
  }

  return leaks;
}

function normalizeEmojiText(value: string): string {
  return value.replace(/\uFE0F/g, "");
}
