// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://yokoyama-s.jp",
  base: process.env.ASTRO_BASE ?? "/",
});
