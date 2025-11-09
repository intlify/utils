/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

declare namespace NodeJS {
  interface ProcessEnv {
    LC_ALL?: string
    LC_MESSAGES?: string
    LANG?: string
    LANGUAGE?: string
  }
}
