import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3001,
    open: true,
    host: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'element-plus': ['element-plus', '@element-plus/icons-vue'],
          utilities: ['lodash-es', 'dayjs', 'axios'],
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `:root { --color-text-primary: #303133; --color-text-regular: #606266; --color-text-secondary: #909399; --color-primary: #409eff; --color-success: #67c23a; --color-warning: #e6a23c; --color-danger: #f56c6c; --color-info: #909399; --bg-color: #f5f7fa; --border-color: #e4e7ed; }`,
      },
    },
  },
});
