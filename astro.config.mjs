// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://yokoyama-s.jp",
  base: process.env.ASTRO_BASE ?? "/",
  integrations: [sitemap()],
});
