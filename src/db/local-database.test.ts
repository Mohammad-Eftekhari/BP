import { describe, expect, it } from "vitest";

import { assertLocalDatabase } from "./local-database";

describe("assertLocalDatabase", () => {
  it("allows a localhost database", () => {
    expect(() =>
      assertLocalDatabase("postgresql://postgres:postgres@localhost:5432/app"),
    ).not.toThrow();
  });

  it("refuses a non-local database without an override", () => {
    const previous = process.env.ALLOW_DESTRUCTIVE_DB;
    delete process.env.ALLOW_DESTRUCTIVE_DB;

    expect(() =>
      assertLocalDatabase("postgresql://postgres:postgres@db.example.com:5432/app"),
    ).toThrow(/Refusing to run a destructive database command/);

    if (previous) {
      process.env.ALLOW_DESTRUCTIVE_DB = previous;
    }
  });
});
