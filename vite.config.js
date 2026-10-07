import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import leetcodeHandler from "./server/leetcodeHandler.js";

export default defineConfig(({ mode }) => {
  // Vite only exposes VITE_-prefixed vars to the client; the dev API handler
  // needs the plain ones (LEETCODE_USERNAME, LEETCODE_CACHE_TTL_MS).
  // Nothing here is ever shipped to the browser bundle.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [
      react(),
      {
        // Local stand-in for the Vercel function in /api, so `GET
        // /api/leetcode` is same-origin in dev exactly as it is in production.
        name: "leetcode-dev-api",
        configureServer(server) {
          server.middlewares.use("/api/leetcode", (req, res) => {
            leetcodeHandler(req, res).catch((error) => {
              console.error("[dev api/leetcode]", error);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.end(JSON.stringify({ error: "internal_error" }));
              }
            });
          });
        },
      },
    ],
    test: {
      // RTL's auto-cleanup needs global `afterEach`.
      globals: true,
    },
  };
});
