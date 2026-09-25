import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/cptsd/",
  plugins: [
    react(),
    {
      name: "remove-crossorigin",
      transformIndexHtml(html) {
        return html.split(" crossorigin").join("");
      },
    },
  ],
  server: {
    host: "127.0.0.1",
  },
  build: {
    assetsDir: "",
  },
});
