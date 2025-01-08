import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/me": "https://fbf6-2804-d55-830c-1400-fdd5-7855-f91b-9b0a.ngrok-free.app ", // URL do backend
      "/userGroup": "https://fbf6-2804-d55-830c-1400-fdd5-7855-f91b-9b0a.ngrok-free.app ", // URL do backend
    },
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["qrcode.react"],
  },
});
