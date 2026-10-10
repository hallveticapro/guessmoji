// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CustomPack } from "@/types/custom-pack";
import { PackEditor } from "./PackEditor";
import { PackPreview } from "./PackPreview";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const pack: CustomPack = {
  id: "pack-1",
  name: "Class themes",
  description: "",
  icon: "🎨",
  createdAt: 1,
  updatedAt: 1,
  cards: [
    {
      id: "card-1",
      answer: "First answer",
      emojis: "🌤️🧩",
      difficulty: "easy",
      hint: "Look up",
      explanation: "First explanation",
    },
    {
      id: "card-2",
      answer: "Second answer",
      emojis: "🏔️🧭",
      difficulty: "hard",
      hint: "Go exploring",
      explanation: "Second explanation",
    },
  ],
};
let root: Root;
let container: HTMLDivElement;
function render(element: React.ReactNode) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(element));
}
function button(text: string) {
  const match = [...container.querySelectorAll("button")].find(
    (item) => item.textContent === text,
  );
  if (!match) throw new Error(`Button ${text} not found`);
  return match;
}
afterEach(() => {
  act(() => root?.unmount());
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("custom pack editing", () => {
  it("keeps preview answers hidden and exposes hints separately from reveals", () => {
    render(<PackPreview card={pack.cards[0]} packName={pack.name} />);
    expect(container.textContent).not.toContain("First answer");
    act(() => button("Hint").click());
    expect(container.textContent).toContain("Look up");
    expect(container.textContent).not.toContain("First answer");
    act(() => button("Reveal").click());
    expect(container.textContent).toContain("First answer");
    expect(container.textContent).toContain("First explanation");
    expect(button("Hint").disabled).toBe(true);
    act(() => button("Hide answer").click());
    expect(container.textContent).not.toContain("First answer");
  });

  it("deletes only the selected card after confirmation and preserves the pack", () => {
    const onChange = vi.fn();
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    render(
      <PackEditor pack={pack} saved onChange={onChange} onDelete={vi.fn()} />,
    );
    act(() => button("2. Second answer").click());
    expect(container.querySelector("input")?.value).toBe(pack.icon);
    act(() => button("Delete card").click());
    expect(onChange).not.toHaveBeenCalled();
    confirm.mockReturnValue(true);
    act(() => button("Delete card").click());
    expect(onChange).toHaveBeenCalledWith({ ...pack, cards: [pack.cards[0]] });
  });

  it("blocks playing incomplete or unsaved packs while retaining backup export", () => {
    render(
      <PackEditor
        pack={{ ...pack, name: "" }}
        saved={false}
        onChange={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(button("Play pack").disabled).toBe(true);
    expect(button("Export backup").disabled).toBe(false);
    expect(container.querySelector('a[href^="/studio/play"]')).toBeNull();
  });

  it("links a valid saved pack to the shared player with its identifier", () => {
    render(
      <PackEditor pack={pack} saved onChange={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(
      container.querySelector('a[href="/studio/play?id=pack-1"]')?.textContent,
    ).toBe("Play pack");
  });
});
