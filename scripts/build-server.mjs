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
    alias: {
        "@shared": path.join(root, "shared"),
        "@": path.join(root, "client/src"),
        "@assets": path.join(root, "attached_assets"),
    },
    sourcemap: false,
});

console.log("✅  Server bundle → dist/server/index.js");
