import { EApiRoutes } from "@/constants/routes";
import { createQueryKey } from "@/lib/query/query-key";

export const profileQueryKeys = {
  all: ["profile"] as const,
  current: createQueryKey(EApiRoutes.profile),
};
