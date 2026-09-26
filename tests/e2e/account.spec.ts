import { expect, test } from "@playwright/test";

test("visitor can register, save a profile, sign out, and lose access", async ({ page }) => {
  const email = `person-${Date.now()}@example.com`;

  await page.goto("/sign-up");
  await page.getByLabel("Name").fill("Ada Lovelace");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("password-ada");
  await page.getByLabel("Confirm password").fill("password-ada");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();

  await page.getByRole("link", { name: "Edit profile" }).click();
  await page.getByLabel("Display name").fill("Ada");
  await page.getByLabel("Biography").fill("Mathematician");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByText("Profile saved")).toBeVisible();

  await page.reload();
  await expect(page.getByLabel("Display name")).toHaveValue("Ada");

  const forbidden = await page.request.get("/api/admin/status");
  expect(forbidden.status()).toBe(403);

  const invalid = await page.request.put("/api/profile", {
    data: { displayName: "", bio: "Still here" },
  });
  expect(invalid.status()).toBe(400);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("heading", { name: "Application starter" })).toBeVisible();

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in/);
});

test("wrong password does not reveal which field failed", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill("missing-person@example.com");
  await page.getByLabel("Password").fill("password-missing");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Email or password is incorrect.")).toBeVisible();
});
