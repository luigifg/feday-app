import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/me": "http://localhost10", // URL do backend
      "/userGroup": "http://localhost:3310", // URL do backend
    },
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["qrcode.react"],
  },
});
