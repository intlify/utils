const objectToString = Object.prototype.toString
const toTypeString = (value: unknown): string => objectToString.call(value)

/**
 * check whether the value is a {@link Intl.Locale} instance
 *
 * @param {unknown} val The locale value
 *
 * @returns {boolean} Returns `true` if the value is a {@link Intl.Locale} instance, else `false`.
 */
export function isLocale(val: unknown): val is Intl.Locale {
  return toTypeString(val) === '[object Intl.Locale]'
}

/**
 * parse `accept-language` header string
 *
 * @param {string} value The accept-language header string
 *
 * @returns {Array<string>} The array of language tags, if `*` (any language) or empty string is detected, return an empty array.
 */
export function parseAcceptLanguage(value: string): string[] {
  return value.split(',').map((tag) => tag.split(';')[0]).filter((tag) =>
    !(tag === '*' || tag === '')
  )
}

/**
 * validate the language tag whether is a well-formed {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 language tag}.
 *
 * @param {string} lang a language tag
 *
 * @returns {boolean} Returns `true` if the language tag is valid, else `false`.
 */
export function validateLanguageTag(lang: string): boolean {
  try {
    // TODO: if we have a better way to validate the language tag, we should use it.
    new Intl.Locale(lang)
    return true
  } catch {
    return false
  }
}

/**
 * nomralize the language name
 *
 * @description
 * This function normalizes the locale name defined in {@link https://www.gnu.org/software/gettext/manual/gettext.html#Locale-Names | gettext(libc) style} to {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 language tag}
 *
 * @example
 * ```ts
 * const oldLangName = 'en_US'
 * const langTag = nomralizeLanguageName(oldLangName)
 * conosle.log(langTag) // en-US
 * ```
 *
 * @param langName The target language name
 *
 * @returns {string} The normalized language tag
 */
export function normalizeLanguageName(langName: string): string {
  const [lang] = langName.split('.')
  return lang.replace(/_/g, '-')
}
