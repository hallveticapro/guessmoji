import type { Category } from "@/types/puzzle";
import { expandedCategories } from "@/data/expandedPacks";

const coreCategories = [
  {
    id: "disney-movies",
    name: "Disney Movies",
    slug: "disney-movies",
    description: "Classic and modern Disney movie titles for familiar guessing.",
    icon: "🏰",
    colorTheme: "sky",
    recommendedGradeBand: "2-6",
  },
  {
    id: "disney-princesses",
    name: "Disney Princesses",
    slug: "disney-princesses",
    description: "Princesses, heroines, and favorite Disney characters with friendly clues.",
    icon: "👑",
    colorTheme: "rose",
    recommendedGradeBand: "2-6",
  },
  {
    id: "pixar",
    name: "Pixar",
    slug: "pixar",
    description: "Pixar movies and characters built around big, expressive emoji clues.",
    icon: "💡",
    colorTheme: "amber",
    recommendedGradeBand: "2-6",
  },
  {
    id: "marvel",
    name: "Marvel",
    slug: "marvel",
    description: "Super heroes and teams with clues focused on names, powers, and symbols.",
    icon: "🦸",
    colorTheme: "red",
    recommendedGradeBand: "3-8",
  },
  {
    id: "star-wars",
    name: "Star Wars",
    slug: "star-wars",
    description: "Characters, ships, planets, and story icons from a galaxy far, far away.",
    icon: "✨",
    colorTheme: "indigo",
    recommendedGradeBand: "3-8",
  },
  {
    id: "dreamworks",
    name: "DreamWorks",
    slug: "dreamworks",
    description: "DreamWorks favorites with silly, high-energy clue combinations.",
    icon: "🌙",
    colorTheme: "emerald",
    recommendedGradeBand: "2-6",
  },
  {
    id: "video-game-movies",
    name: "Video Game Movies",
    slug: "video-game-movies",
    description: "Movie and show clues inspired by game worlds and iconic characters.",
    icon: "🎮",
    colorTheme: "violet",
    recommendedGradeBand: "3-8",
  },
  {
    id: "kid-tv-shows",
    name: "Kid TV Shows",
    slug: "kid-tv-shows",
    description: "Popular kid-friendly TV shows from gentle picks to animated adventures.",
    icon: "📺",
    colorTheme: "cyan",
    recommendedGradeBand: "K-6",
  },
  {
    id: "animated-classics",
    name: "Animated Classics",
    slug: "animated-classics",
    description: "Animated movies and characters that are widely recognizable.",
    icon: "🎬",
    colorTheme: "orange",
    recommendedGradeBand: "2-6",
  },
  {
    id: "random-mix",
    name: "Random Mix",
    slug: "random-mix",
    description: "A shuffled cross-category set for quick games when you want variety.",
    icon: "🎲",
    colorTheme: "slate",
    recommendedGradeBand: "K-8",
  },
] satisfies Category[];

const randomMixCategory = coreCategories.find((category) => category.id === "random-mix");

export const categories = [
  ...coreCategories.filter((category) => category.id !== "random-mix"),
  ...expandedCategories,
  ...(randomMixCategory ? [randomMixCategory] : []),
] satisfies Category[];
