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
