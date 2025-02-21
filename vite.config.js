import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import svgr from "vite-plugin-svgr"; // Suporte para SVG como componentes

export default defineConfig({
  build: {
    outDir: "dist",
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    reportCompressedSize: false,
    sourcemap: true,

    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        keep_fnames: true,
        keep_classnames: true,
      },
      mangle: {
        keep_fnames: true,
        keep_classnames: true,
      },
    },

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react";
            if (id.includes("framer-motion")) return "animations";
            if (id.includes("@emotion/react") || id.includes("@emotion/styled")) return "emotion";
            return "vendor";
          }
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? "")) {
            return "assets/images/[name]-[hash][extname]";
          }
          if (/\.css$/.test(name ?? "")) {
            return "assets/css/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
      treeshake: {
        moduleSideEffects: false, // Evita remoção de código necessário
      },
    },
  },

  plugins: [
    react(),
    svgr(),
    compression({
      algorithm: "brotliCompress", // Brotli é melhor que gzip
      ext: ".br",
      threshold: 10240,
      deleteOriginFile: false,
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion", "@emotion/react", "@emotion/styled"],
  },

  server: {
    hmr: true,
    cors: true,
    compress: true,
  },

  esbuild: {
    target: "es2020", // Melhor compatibilidade
  },
});
