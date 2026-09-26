import { describe, expect, it } from "vitest";

import { AppError, fieldErrorsFromZod } from "./errors";
import { profileFormSchema } from "@/features/profile/schemas/profile.schema";

describe("AppError", () => {
  it("maps an unauthenticated error to status 401", () => {
    const error = new AppError("UNAUTHENTICATED", "Authentication required");

    expect(error.status).toBe(401);
    expect(error.code).toBe("UNAUTHENTICATED");
  });
});

describe("profileSchema", () => {
  it("trims the display name and allows an empty biography", () => {
    const parsed = profileFormSchema.parse({
      displayName: "  Ada Lovelace  ",
      bio: "  ",
    });

    expect(parsed).toEqual({
      displayName: "Ada Lovelace",
      bio: "",
    });
  });

  it("reports a field error when the display name is empty", () => {
    const result = profileFormSchema.safeParse({ displayName: "   ", bio: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrorsFromZod(result.error)[0]?.field).toBe("displayName");
    }
  });
});
