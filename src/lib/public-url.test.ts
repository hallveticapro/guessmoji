import { describe, expect, it } from "vitest";
import { getPublicAppUrl, getPublicAppUrlString } from "@/lib/public-url";

describe("public URL helper", () => {
  it("falls back to local URL when missing", () => {
    expect(getPublicAppUrl(undefined).toString()).toBe("http://localhost:3000/");
  });

  it("falls back to local URL when blank", () => {
    expect(getPublicAppUrl("   ").toString()).toBe("http://localhost:3000/");
  });

  it("falls back to local URL when missing an HTTP scheme", () => {
    expect(getPublicAppUrl("guessmoji.example.com").toString()).toBe(
      "http://localhost:3000/",
    );
  });

  it("falls back to local URL for non-http protocols", () => {
    expect(getPublicAppUrl("ftp://guessmoji.example.com").toString()).toBe(
      "http://localhost:3000/",
    );
  });

  it("accepts absolute HTTPS URLs", () => {
    expect(getPublicAppUrlString(" https://guessmoji.example.com ")).toBe(
      "https://guessmoji.example.com/",
    );
  });
});
