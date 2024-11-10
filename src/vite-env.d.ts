/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_OPENROUTER_API_KEY: string
  readonly VITE_OPENROUTER_REFERRER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}