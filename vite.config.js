import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/me": {
        target: "https://feday-api.onrender.com",
        changeOrigin: true,
        secure: false,
        withCredentials: true
      }
    }
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["qrcode.react"],
  },
});
