/**
 * Vite 环境类型定义
 */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_ENABLE_MOCK: string;
  readonly VITE_BASE_PATH: string;
  readonly VITE_WS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
