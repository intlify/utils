export {
  createPathIndexLanguageParser,
  isLocale,
  normalizeLanguageName,
  parseAcceptLanguage,
  registerPathLanguageParser,
  validateLanguageTag,
} from './shared.ts'
export {
  getPathLanguage,
  getPathLocale,
  getQueryLanguage,
  getQueryLocale,
} from './http.ts'
export * from './web.ts'
