import type { MetadataRoute } from "next";

import { EAppRoutes } from "@/constants/routes";
import { getServerEnv } from "@/lib/env/server";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getServerEnv().BETTER_AUTH_URL;

  return [EAppRoutes.home, EAppRoutes.signIn, EAppRoutes.signUp].map((path) => ({
    url: new URL(path, baseUrl).toString(),
  }));
}
