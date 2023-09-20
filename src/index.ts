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
