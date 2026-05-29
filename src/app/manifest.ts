import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Behind the Bar",
    short_name: "Bar",
    description: "Cocktails you can make with what you have",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#b45309",
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
  };
}
