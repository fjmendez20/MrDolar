import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import node from "@astrojs/node";

const isNetlify = process.env.NETLIFY === "true";

export default defineConfig({
  output: "server",
  adapter: isNetlify
    ? netlify()
    : node({ mode: "standalone" }),
});
