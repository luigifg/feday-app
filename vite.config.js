import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import imagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    react(),
    imagemin({
      disable: process.env.NODE_ENV === 'development',
      // Processar apenas JPG e PNG para WebP
      webp: {
        quality: 75,
        method: 4,
      },
      // Desabilitar outros processadores
      gifsicle: false,
      optipng: false,
      mozjpeg: false,
      pngquant: false,
      svgo: false,
    }),
  ],
  optimizeDeps: {
    include: ["qrcode.react"],
  },
});