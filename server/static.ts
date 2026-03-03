import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM-safe __dirname (also works after esbuild bundling via the banner polyfill)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  // After build:
  //   dist/server/index.js  ← server bundle
  //   dist/public/          ← Vite frontend build
  // So from __dirname (dist/server/) we go one level up → dist/public/
  const distPath = path.resolve(__dirname, "..", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Fall through to index.html for client-side routing
 app.get("/.*/", (_req, res) => {
  res.sendFile(path.resolve(distPath, "index.html"));
});
}
