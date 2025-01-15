/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BIN_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
