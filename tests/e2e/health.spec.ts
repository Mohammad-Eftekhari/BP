import { expect, test } from "@playwright/test";

test("health check reports the application and database", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body).toEqual({
    success: true,
    data: {
      status: "ok",
      database: "up",
    },
  });
});

test("profile and admin routes reject anonymous callers", async ({ request }) => {
  const profile = await request.get("/api/profile");
  expect(profile.status()).toBe(401);

  const admin = await request.get("/api/admin/status");
  expect(admin.status()).toBe(401);
});
