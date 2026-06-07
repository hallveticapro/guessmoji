import type { CSSProperties } from "react";
import type { Category } from "@/types/puzzle";

type ThemeStyle = Pick<CSSProperties, "backgroundColor" | "borderColor" | "color">;

const themeStyles: Record<string, ThemeStyle> = {
  amber: { backgroundColor: "#fef3c7", borderColor: "#f59e0b", color: "#78350f" },
  blue: { backgroundColor: "#dbeafe", borderColor: "#3b82f6", color: "#1e3a8a" },
  cyan: { backgroundColor: "#cffafe", borderColor: "#06b6d4", color: "#164e63" },
  emerald: { backgroundColor: "#d1fae5", borderColor: "#10b981", color: "#064e3b" },
  fuchsia: { backgroundColor: "#fae8ff", borderColor: "#d946ef", color: "#701a75" },
  green: { backgroundColor: "#dcfce7", borderColor: "#22c55e", color: "#14532d" },
  indigo: { backgroundColor: "#e0e7ff", borderColor: "#6366f1", color: "#312e81" },
  lime: { backgroundColor: "#ecfccb", borderColor: "#84cc16", color: "#365314" },
  orange: { backgroundColor: "#ffedd5", borderColor: "#f97316", color: "#7c2d12" },
  pink: { backgroundColor: "#fce7f3", borderColor: "#ec4899", color: "#831843" },
  purple: { backgroundColor: "#f3e8ff", borderColor: "#a855f7", color: "#581c87" },
  red: { backgroundColor: "#fee2e2", borderColor: "#ef4444", color: "#7f1d1d" },
  rose: { backgroundColor: "#ffe4e6", borderColor: "#f43f5e", color: "#881337" },
  sky: { backgroundColor: "#e0f2fe", borderColor: "#0ea5e9", color: "#0c4a6e" },
  slate: { backgroundColor: "#f1f5f9", borderColor: "#64748b", color: "#1e293b" },
  stone: { backgroundColor: "#f5f5f4", borderColor: "#78716c", color: "#292524" },
  teal: { backgroundColor: "#ccfbf1", borderColor: "#14b8a6", color: "#134e4a" },
  violet: { backgroundColor: "#ede9fe", borderColor: "#8b5cf6", color: "#4c1d95" },
  yellow: { backgroundColor: "#fef9c3", borderColor: "#eab308", color: "#713f12" },
};

export function getCategoryThemeStyle(category: Category): ThemeStyle {
  return themeStyles[category.colorTheme ?? "sky"] ?? themeStyles.sky;
}
