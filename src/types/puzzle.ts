export type PuzzleDifficulty = "easy" | "medium" | "hard";

export type Puzzle = {
  id: string;
  answer: string;
  emojis: string;
  categoryId: string;
  difficulty: PuzzleDifficulty;
  hint?: string;
  explanation?: string;
  funFact?: string;
  tags?: string[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  colorTheme?: string;
  recommendedGradeBand?: string;
};
