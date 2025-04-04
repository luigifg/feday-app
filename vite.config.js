import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["qrcode.react"], // Dependências que devem ser pré-otimizadas
  },
});
