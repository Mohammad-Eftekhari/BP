import { EApiRoutes } from "@/constants/routes";

export const profileQueryKeys = {
  all: ["profile"] as const,
  current: [EApiRoutes.profile] as const,
};
