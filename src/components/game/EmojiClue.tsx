"use client";

import { useLayoutEffect, useRef, useState } from "react";

type EmojiClueProps = {
  emojis: string;
};

const MIN_EMOJI_FONT_SIZE = 40;
const MAX_EMOJI_FONT_SIZE = 144;

export function EmojiClue({ emojis }: EmojiClueProps) {
  const clueRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(MAX_EMOJI_FONT_SIZE);

  useLayoutEffect(() => {
    const clue = clueRef.current;
    const container = clue?.parentElement;

    if (!clue || !container) {
      return;
    }

    const clueElement = clue;
    const containerElement = container;

    function fitClue() {
      const availableWidth = Math.max(0, clueElement.clientWidth - 4);
      const maxFontSize = getMaxFontSize(availableWidth);

      clueElement.style.fontSize = `${maxFontSize}px`;

      if (clueElement.scrollWidth <= availableWidth) {
        setFontSize(maxFontSize);
        return;
      }

      const fittedSize = Math.max(
        MIN_EMOJI_FONT_SIZE,
        Math.floor((maxFontSize * availableWidth * 0.96) / clueElement.scrollWidth),
      );

      clueElement.style.fontSize = `${fittedSize}px`;
      setFontSize(fittedSize);
    }

    fitClue();

    const resizeObserver = new ResizeObserver(fitClue);
    resizeObserver.observe(containerElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [emojis]);

  return (
    <p
      ref={clueRef}
      className="w-full max-w-full whitespace-nowrap text-center leading-tight"
      style={{ fontSize }}
    >
      {emojis}
    </p>
  );
}

function getMaxFontSize(availableWidth: number) {
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
