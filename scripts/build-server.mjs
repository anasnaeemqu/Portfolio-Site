// scripts/build-server.mjs
// Bundles the Express server via esbuild.
// Resolves @shared/* path aliases at build time → no runtime TS paths needed.

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
    // Treat ALL node_modules as external – they are installed on Render anyway.
    packages: "external",
    // Resolve @shared/* and @/* aliases at build time:
    alias: {
        "@shared": path.join(root, "shared"),
        "@": path.join(root, "client/src"),
        "@assets": path.join(root, "attached_assets"),
    },
    // Needed so import.meta.dirname works in the output:
    define: {},
    sourcemap: false,
    banner: {
        // Polyfill __dirname / __filename for any transitive dep that still uses them
        js: [
            "import { createRequire } from 'module';",
            "import { fileURLToPath as __ftu } from 'url';",
            "import { dirname as __dn } from 'path';",
            "const require = createRequire(import.meta.url);",
            "const __filename = __ftu(import.meta.url);",
            "const __dirname = __dn(__filename);",
        ].join("\n"),
    },
});

console.log("✅  Server bundle → dist/server/index.js");
