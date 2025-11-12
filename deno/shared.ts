/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

const objectToString = Object.prototype.toString // eslint-disable-line @typescript-eslint/unbound-method -- ignore
const toTypeString = (value: unknown): string => objectToString.call(value)

/**
 * check whether the value is a {@linkcode URL} instance
 *
 * @param val - The value to be checked
 *
 * @returns Returns `true` if the value is a {@linkcode URL} instance, else `false`.
 */
export function isURL(val: unknown): val is URL {
  return toTypeString(val) === '[object URL]'
}

/**
 * check whether the value is a {@linkcode URLSearchParams} instance
 *
 * @param val - The value to be checked
 *
 * @returns Returns `true` if the value is a {@linkcode URLSearchParams} instance, else `false`.
 */
export function isURLSearchParams(val: unknown): val is URLSearchParams {
  return toTypeString(val) === '[object URLSearchParams]'
}

/**
 * check whether the value is a {@linkcode Intl.Locale} instance
 *
 * @param val - The locale value
 *
 * @returns Returns `true` if the value is a {@linkcode Intl.Locale} instance, else `false`.
 */
export function isLocale(val: unknown): val is Intl.Locale {
  return toTypeString(val) === '[object Intl.Locale]'
}

/**
 * returns the {@link Intl.Locale | locale}
 *
 * @param val - The value for which the 'locale' is requested.
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if `val` is not a well-formed BCP 47 language tag.
 *
 * @returns The locale
 */
export function toLocale(val: string | Intl.Locale): Intl.Locale {
  return isLocale(val) ? val : new Intl.Locale(val)
}

/**
 * validate the language tag whether is a well-formed {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 language tag}.
 *
 * @param lang - a language tag
 *
 * @returns Returns `true` if the language tag is valid, else `false`.
 */
export function validateLangTag(lang: string): boolean {
  try {
    Intl.getCanonicalLocales(lang)
    return true
  } catch {
    return false
  }
}

/**
 * parse `accept-language` header string
 *
 * @param value - The accept-language header string
 *
 * @returns The array of language tags, if `*` (any language) or empty string is detected, return an empty array.
 */
export function parseAcceptLanguage(value: string): string[] {
  return value
    .split(',')
    .map(tag => tag.split(';')[0])
    .filter(tag => !(tag === '*' || tag === ''))
}

/**
 * normalize the language name
 *
 * @description
 * This function normalizes the locale name defined in {@link https://www.gnu.org/software/gettext/manual/gettext.html#Locale-Names | gettext(libc) style} to {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 language tag}
 *
 * @example
 * ```ts
 * const oldLangName = 'en_US'
 * const langTag = normalizeLanguageName(oldLangName)
 * conosle.log(langTag) // en-US
 * ```
 *
 * @param langName - The target language name
 *
 * @returns The normalized language tag
 */
export function normalizeLanguageName(langName: string): string {
  const [lang] = langName.split('.')
  return lang.replace(/_/g, '-')
}

/**
 * path language parser
 */
export interface PathLanguageParser {
  /**
   * parse the path that is include language
   *
   * @param path - the target path
   *
   * @returns The language, if it cannot parse the path is not found, you need to return empty string (`''`)
   */
  (path: string | URL): string
}

/**
 * create a parser, which can split with slash `/`
 *
 * @param index - An index of locale, which is included in path
 *
 * @returns A return a parser, which has {@linkcode PathLanguageParser} interface
 */
export function createPathIndexLanguageParser(index = 0): PathLanguageParser {
  return (path: string | URL): string => {
    const rawPath = typeof path === 'string' ? path : path.pathname
    const normalizedPath = rawPath.split('?')[0]
    const parts = normalizedPath.split('/')
    if (parts[0] === '') {
      parts.shift()
    }
    return parts.length > index ? parts[index] || '' : ''
  }
}

/**
 * A path parser that can get the zeroth part of a path split by `/` as local value
 *
 * @description
 * - `/en/nest/about` -> `en`
 */
export let pathLanguageParser: PathLanguageParser = /* #__PURE__*/ createPathIndexLanguageParser()

/**
 * register the path language parser
 *
 * @description register a parser to be used in the `getPathLanguage` utility function
 *
 * @param parser - the {@link PathLanguageParser | path language parser}
 */
export function registerPathLanguageParser(parser: PathLanguageParser): void {
  pathLanguageParser = parser
}
