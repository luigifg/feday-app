import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';

export default defineConfig({
  build: {
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    reportCompressedSize: false,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react';
            if (id.includes('framer-motion')) return 'animations';
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    // Plugin para otimização de imagens
    {
      name: 'imagemin',
      enforce: 'pre',
      apply: 'build',
      transformIndexHtml: {
        enforce: 'pre',
        transform(html, ctx) {
          return html;
        },
      },
      async transform(code, id) {
        if (!/\.(jpe?g|png|gif|svg)$/.test(id)) return null;
        
        const imagemin = (await import('imagemin')).default;
        const plugins = [
          imageminMozjpeg({ quality: 75 }),
          imageminPngquant({ quality: [0.65, 0.8] }),
          imageminWebp({ quality: 75 })
        ];

        const optimizedBuffer = await imagemin.buffer(Buffer.from(code), {
          plugins
        });

        return {
          code: optimizedBuffer,
          map: null
        };
      }
    },
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
    ],
  },
  server: {
    hmr: true,
    cors: true,
    compress: true,
  },
});