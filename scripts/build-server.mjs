// scripts/build-server.mjs
// Bundles the Express server via esbuild.
// Resolves @shared/* path aliases at build time → no runtime TS paths needed.
//
// WHY NO __filename/__dirname BANNER:
//   esbuild injects `var __filename` / `var __dirname` from source files that
//   declare them (server/static.ts, server/vite.ts). If the banner ALSO declares
//   `const __filename`, Node 20 ESM throws:
//     SyntaxError: Identifier '__filename' has already been declared
//   because `const` and `var` share the same module scope in ESM and you cannot
//   redeclare a `const` binding. esbuild does rename duplicate source-level
//   variables (e.g. __filename2) but it never processes the raw banner text,
//   so banner declarations always collide.
//   Solution: source files own their own __filename/__dirname; no banner needed.

import { build } from "esbuild";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

await build({
    entryPoints: [path.join(root, "server/index.ts")],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "esm",
    outfile: path.join(root, "dist/server/index.js"),
    // All node_modules stay external — they're installed on Render.
    packages: "external",
    // Resolve @shared/* path aliases at build time so no TS aliases survive
    // into the runtime bundle.
    alias: {
        "@shared": path.join(root, "shared"),
        "@": path.join(root, "client/src"),
        "@assets": path.join(root, "attached_assets"),
    },
    sourcemap: false,
    // No banner. Each source file that needs __filename/__dirname declares it
    // itself via fileURLToPath(import.meta.url). esbuild handles deduplication
    // by automatically suffix-renaming conflicts from separate source modules
    // (e.g. __filename → __filename2) without the raw-text collision problem.
});

console.log("✅  Server bundle → dist/server/index.js");
