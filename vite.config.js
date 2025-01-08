import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/me": "https://localhost:3309", // URL do backend
      "/userGroup": "https://localhost:3309", // URL do backend
    },
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["qrcode.react"],
  },
});
