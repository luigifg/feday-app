import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/me": "https://api.futuredaybrasil.com.br", // URL do backend
      "/userGroup": "https://api.futuredaybrasil.com.br", // URL do backend
    },
  },
  build: {
    assetsInlineLimit: 0, // Desativa a conversão para base64
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["qrcode.react"],
  },
});
