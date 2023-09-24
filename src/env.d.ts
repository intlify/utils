declare namespace NodeJS {
  interface ProcessEnv {
    LC_ALL?: string
    LC_MESSAGES?: string
    LANG?: string
    LANGUAGE?: string
  }
}

declare let __TEST__: boolean
