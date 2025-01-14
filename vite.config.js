import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  build: {
    assetsInlineLimit: 0, // Desativa a conversão para base64 para arquivos grandes
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]", // Organiza os arquivos de saída
      },
    },
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["qrcode.react"], // Dependências que devem ser pré-otimizadas
  },
});
