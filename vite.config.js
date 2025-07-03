import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: "."
        },
        {
          src: "assets/*",
          dest: "assets"
        }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, "src/content.js"),
        options: resolve(__dirname, "options.html"),
        popup: resolve(__dirname, "popup.html")
      },
      output: {
        entryFileNames: "[name].js"
      }
    },
    outDir: "dist",
    emptyOutDir: true
  }
}); 