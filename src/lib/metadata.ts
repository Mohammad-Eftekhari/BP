import type { Metadata } from "next";

export const siteConfig = {
  name: "Application starter",
  description: "A reusable starting point for a full-stack web application.",
};

export const rootMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  robots: {
    index: true,
    follow: true,
  },
};
