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
    sourcemap: true, // Ajuda na depuração no Vercel

    // 🚀 Evita minificação agressiva no Vercel
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        keep_fnames: true, // Mantém nomes de funções para evitar erros
        keep_classnames: true, // Mantém nomes de classes
      },
      mangle: {
        keep_fnames: true, // Evita renomeação de funções que pode quebrar no Vercel
        keep_classnames: true,
      },
    },

    // 🚀 Ajuste do Rollup para evitar importações circulares e problemas no `vendor.js`
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
        moduleSideEffects: "no-external", // Mantém dependências necessárias
      },
    },
  },

  // 🚀 Garante que SVGs sejam processados corretamente
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

  // 🚀 Evita otimizações erradas no ambiente de desenvolvimento
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion"],
    force: true, // Força Vite a reanalisar dependências
  },

  // 🚀 Configuração do servidor para rodar localmente antes do deploy na Vercel
  server: {
    hmr: true,
    cors: true,
    compress: true,
  },

  // 🚀 Garante que o Vercel use o formato correto
  esbuild: {
    target: "esnext",
  },
});
