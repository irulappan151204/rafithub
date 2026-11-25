import { describe, expect, it } from "vitest";
import { splitHeroHeadline } from "./hero-text";

describe("splitHeroHeadline", () => {
  it("keeps 'Body & Mind' grouped in the accented span", () => {
    expect(splitHeroHeadline("Transform Your Body & Mind")).toEqual({
      lead: "Transform Your",
      accent: "Body & Mind",
    });
  });

  it("splits standard multi-word headlines on the last two words", () => {
    expect(splitHeroHeadline("Train With Champions Today")).toEqual({
      lead: "Train With",
      accent: "Champions Today",
    });
  });

  it("handles two-word, one-word, and empty inputs safely", () => {
    expect(splitHeroHeadline("Stay Strong")).toEqual({ lead: "Stay", accent: "Strong" });
    expect(splitHeroHeadline("Rafithub")).toEqual({ lead: "", accent: "Rafithub" });
    expect(splitHeroHeadline("   ")).toEqual({
      lead: "Transform Your",
      accent: "Body & Mind",
    });
  });
});
