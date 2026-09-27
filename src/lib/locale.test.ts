import { describe, expect, it } from "vitest";

import { directionForLocale, ELocale, isLocale } from "./locale";

describe("directionForLocale", () => {
  it("uses right-to-left for Persian", () => {
    expect(directionForLocale(ELocale.fa)).toBe("rtl");
  });

  it("uses left-to-right for English", () => {
    expect(directionForLocale(ELocale.en)).toBe("ltr");
  });
});

describe("isLocale", () => {
  it("accepts the supported locales only", () => {
    expect(isLocale("fa")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });
});
