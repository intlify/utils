/**
 * `@intlify/utils` default module entry.
 *
 * `@intlify/utils` will export javascript runtime agnostic utility functions and types.
 *
 * @example
 * ```ts
 * import { parseAcceptLanguage, isLocale, getHeaderLocale } from '@intlify/utils'
 * ```
 *
 * @module default
 */

/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

export {
  createPathIndexLanguageParser,
  isLocale,
  normalizeLanguageName,
  parseAcceptLanguage,
  registerPathLanguageParser,
  toLocale,
  validateLangTag
} from './shared.ts'
export * from './web.ts'
