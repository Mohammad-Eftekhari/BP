import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import { ELocale } from "@/lib/locale";

import { SignInForm } from "./SignInForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/lib/auth/auth-client", () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
    },
  },
}));

describe("SignInForm", () => {
  it("shows a field error and does not submit when the email is empty", async () => {
    const user = userEvent.setup();
    const { authClient } = await import("@/lib/auth/auth-client");

    render(<SignInForm copy={getDictionary(ELocale.en)} />);
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Enter a valid email address")).toBeInTheDocument();
    expect(authClient.signIn.email).not.toHaveBeenCalled();
  });
});
