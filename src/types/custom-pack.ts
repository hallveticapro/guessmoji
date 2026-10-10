import type { PuzzleDifficulty } from "./puzzle";

export type CustomCard = {
  id: string;
  answer: string;
  emojis: string;
  difficulty: PuzzleDifficulty;
  hint: string;
  explanation: string;
};

export type CustomPack = {
  id: string;
  name: string;
  description: string;
  icon: string;
  cards: CustomCard[];
  createdAt: number;
  updatedAt: number;
};
