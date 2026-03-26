import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    base: "./",
    plugins: [react()],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        cssCodeSplit: false,
        rollupOptions: {
            input: resolve(__dirname, "index.html"),
            output: {
                entryFileNames: "app.js",
                chunkFileNames: "app.js",
                assetFileNames(assetInfo) {
                    if (assetInfo.name && assetInfo.name.endsWith(".css")) {
                        return "app.css";
                    }

                    return assetInfo.name || "asset";
                }
            }
        }
    }
});