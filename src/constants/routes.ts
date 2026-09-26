export const EAppRoutes = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  dashboard: "/dashboard",
  profile: "/profile",
} as const;

export const EApiRoutes = {
  health: "/api/health",
  me: "/api/me",
  profile: "/api/profile",
  adminStatus: "/api/admin/status",
} as const;

export type TAppRoute = (typeof EAppRoutes)[keyof typeof EAppRoutes];
export type TApiRoute = (typeof EApiRoutes)[keyof typeof EApiRoutes];
