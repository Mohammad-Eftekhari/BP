import type { MetadataRoute } from "next";

import { getServerEnv } from "@/lib/env/server";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/profile"],
    },
    sitemap: new URL("/sitemap.xml", getServerEnv().BETTER_AUTH_URL).toString(),
  };
}
