import { readdir } from "node:fs/promises";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import leetcodeHandler from "./server/leetcodeHandler.js";

function certificateManifest() {
  const virtualModuleId = "virtual:certificates";
  const resolvedVirtualModuleId = `\0${virtualModuleId}`;
  let certificateDirectory;

  async function getCertificates() {
    const entries = await readdir(certificateDirectory, { withFileTypes: true });
    const supportedExtensions = new Set([
      ".avif",
      ".gif",
      ".jpeg",
      ".jpg",
      ".pdf",
      ".png",
      ".svg",
      ".webp",
    ]);

    return entries
      .filter(
        (entry) =>
          entry.isFile() &&
          supportedExtensions.has(path.extname(entry.name).toLowerCase()),
      )
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((entry) => ({
        filename: entry.name,
        src: `/Certificates/${encodeURIComponent(entry.name)}`,
        type: path.extname(entry.name).toLowerCase() === ".pdf" ? "pdf" : "image",
      }));
  }

  return {
    name: "certificate-manifest",
    configResolved(config) {
      certificateDirectory = path.join(config.publicDir, "Certificates");
    },
    resolveId(id) {
      return id === virtualModuleId ? resolvedVirtualModuleId : null;
    },
    async load(id) {
      if (id !== resolvedVirtualModuleId) return null;
      return `export default ${JSON.stringify(await getCertificates())};`;
    },
    configureServer(server) {
      server.watcher.add(certificateDirectory);
      server.watcher.on("all", (event, changedPath) => {
        if (
          (event === "add" || event === "unlink") &&
          path.dirname(path.resolve(changedPath)) === certificateDirectory
        ) {
          const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
          if (module) server.moduleGraph.invalidateModule(module);
          server.ws.send({ type: "full-reload" });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Vite only exposes VITE_-prefixed vars to the client; the dev API handler
  // needs the plain ones (LEETCODE_USERNAME, LEETCODE_CACHE_TTL_MS).
  // Nothing here is ever shipped to the browser bundle.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [
      react(),
      certificateManifest(),
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
