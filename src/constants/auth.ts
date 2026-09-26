export const EUserRole = {
  user: "user",
  admin: "admin",
} as const;

export type TUserRole = (typeof EUserRole)[keyof typeof EUserRole];

export const USER_ROLES = [EUserRole.user, EUserRole.admin] as const;
