import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomPackPlayer } from "@/components/studio/CustomPackPlayer";

export const metadata: Metadata = {
  title: "Play Your Pack",
  description: "Play a custom Guessmoji pack saved in this browser.",
  robots: { index: false, follow: false },
};

export default function CustomPlayPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Opening your pack…</p>}>
      <CustomPackPlayer />
    </Suspense>
  );
}
