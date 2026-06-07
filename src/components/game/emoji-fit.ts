export const MIN_EMOJI_FONT_SIZE = 40;
export const MAX_EMOJI_FONT_SIZE = 144;

type ResizeObserverWindow = {
  ResizeObserver?: unknown;
};

export function supportsResizeObserver(
  currentWindow: ResizeObserverWindow | undefined,
) {
  return typeof currentWindow?.ResizeObserver === "function";
}

export function getMaxEmojiFontSize(availableWidth: number) {
  if (availableWidth < 560) {
    return 72;
  }

  if (availableWidth < 760) {
    return 96;
  }

  if (availableWidth < 1000) {
    return 128;
  }

  return MAX_EMOJI_FONT_SIZE;
}
