import { describe, expect, it } from "vitest";

import { getSafeNextPath } from "./get-safe-next-path";

describe("getSafeNextPath", () => {
  it("keeps a relative application path", () => {
    expect(getSafeNextPath("/profile", "/dashboard")).toBe("/profile");
  });

  it("rejects external and empty targets", () => {
    expect(getSafeNextPath("https://example.com", "/dashboard")).toBe("/dashboard");
    expect(getSafeNextPath("//example.com", "/dashboard")).toBe("/dashboard");
    expect(getSafeNextPath(null, "/dashboard")).toBe("/dashboard");
  });
});
