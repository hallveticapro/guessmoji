import type { Metadata } from "next";
import { PackStudio } from "@/components/studio/PackStudio";

export const metadata: Metadata = {
  title: "Custom Pack Studio",
  description: "Create, preview, and play your own Guessmoji emoji packs.",
};

export default function StudioPage() {
  return <PackStudio />;
}
