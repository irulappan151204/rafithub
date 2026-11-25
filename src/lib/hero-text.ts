export interface HeroHeadlineParts {
  lead: string;
  accent: string;
}

/**
 * Splits a CMS hero headline into leading white text and an accented final phrase.
 * Handles conjunction pairs such as "Body & Mind" cleanly without stranding "&".
 */
export function splitHeroHeadline(rawTitle?: string | null): HeroHeadlineParts {
  const clean = (rawTitle ?? "").trim().replace(/\s+/g, " ");
  if (!clean) {
    return { lead: "Transform Your", accent: "Body & Mind" };
  }

  const words = clean.split(" ");
  if (words.length === 1) {
    return { lead: "", accent: words[0] };
  }
  if (words.length === 2) {
    return { lead: words[0], accent: words[1] };
  }

  // Keep "X & Y" together in the accented segment when "&" is near the end.
  const ampIndex = words.lastIndexOf("&");
  if (ampIndex > 0 && ampIndex >= words.length - 2 && words.length >= 4) {
    return {
      lead: words.slice(0, ampIndex - 1).join(" "),
      accent: words.slice(ampIndex - 1).join(" "),
    };
  }

  const splitAt = words.length - 2;
  return {
    lead: words.slice(0, splitAt).join(" "),
    accent: words.slice(splitAt).join(" "),
  };
}
