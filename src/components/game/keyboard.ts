export type GameKeyboardAction =
  | "close-settings"
  | "fullscreen"
  | "hide-clues"
  | "hint"
  | "next"
  | "previous"
  | "restart"
  | "shuffle"
  | "toggle-answer";

type GameKeyboardState = {
  isAnswerVisible: boolean;
  isComplete: boolean;
  isSettingsOpen: boolean;
};

export function getGameKeyboardAction(
  key: string,
  { isAnswerVisible, isComplete, isSettingsOpen }: GameKeyboardState,
): GameKeyboardAction | null {
  if (key === "Escape") {
    return isSettingsOpen ? "close-settings" : "hide-clues";
  }

  if (isComplete) {
    return null;
  }

  if (key === " ") {
    return "toggle-answer";
  }

  if (key === "ArrowRight") {
    return "next";
  }

  if (key === "ArrowLeft") {
    return "previous";
  }

  const normalizedKey = key.toLowerCase();

  if (normalizedKey === "h") {
    return isAnswerVisible ? null : "hint";
  }

  if (normalizedKey === "s") {
    return "shuffle";
  }

  if (normalizedKey === "r") {
    return "restart";
  }

  if (normalizedKey === "f") {
    return "fullscreen";
  }

  return null;
}
