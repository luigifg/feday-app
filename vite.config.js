import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/me": "https://feday-api.onrender.com", // URL do backend
      "/userGroup": "https://feday-api.onrender.com", // URL do backend
    },
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["qrcode.react"],
  },
});
