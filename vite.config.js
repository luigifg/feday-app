import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import svgr from "vite-plugin-svgr"; // Plugin para suportar importação de SVGs como componentes

export default defineConfig({
  build: {
    outDir: "dist",
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    reportCompressedSize: false,
    sourcemap: false,

    // 🚀 Ajuste da minificação para evitar erros
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        keep_fnames: true, // Mantém os nomes das funções
        keep_classnames: true, // Mantém os nomes das classes
      },
      mangle: {
        keep_fnames: true, // Evita renomeação de funções
        keep_classnames: true,
      },
    },

    // 🚀 Ajuste do Rollup para evitar importações circulares
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react";
            if (id.includes("framer-motion")) return "animations";
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
        moduleSideEffects: "no-external", // Mantém efeitos colaterais necessários
      },
    },
  },

  // 🚀 Ajuste para evitar conflitos com arquivos comprimidos
  assetsInclude: ["**/*.svg"],

  plugins: [
    react(),
    svgr(),
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240,
      deleteOriginFile: false,
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  // 🚀 Evita otimizações erradas no desenvolvimento
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion"],
    force: true, // Garante que o Vite reanalise dependências
  },

  // 🚀 Ajustes do servidor para garantir que os arquivos Gzip sejam servidos corretamente
  server: {
    hmr: true,
    cors: true,
    compress: true,
  },
});
