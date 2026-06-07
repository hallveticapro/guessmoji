"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  getMaxEmojiFontSize,
  MIN_EMOJI_FONT_SIZE,
  supportsResizeObserver,
} from "./emoji-fit";

type EmojiClueProps = {
  emojis: string;
};

export function EmojiClue({ emojis }: EmojiClueProps) {
  const clueRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(MIN_EMOJI_FONT_SIZE);

  useLayoutEffect(() => {
    const clue = clueRef.current;
    const container = clue?.parentElement;

    if (!clue || !container) {
      return;
    }

    if (!supportsResizeObserver(window)) {
      return;
    }

    const clueElement = clue;
    const containerElement = container;

    function fitClue() {
      const availableWidth = Math.max(0, clueElement.clientWidth - 4);
      const maxFontSize = getMaxEmojiFontSize(availableWidth);

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
