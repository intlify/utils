import { getAcceptLanguagesFromGetter, getLocaleWithGetter } from './http.ts'

/**
 * get accpet languages
 *
 * @description parse `accept-language` header string
 *
 * @param {Request} event The {@link Request | request}
 *
 * @returns {Array<string>} The array of language tags, if `*` (any language) or empty string is detected, return an empty array.
 */
export function getAcceptLanguages(req: Request) {
  const getter = () => req.headers.get('accept-language')
  return getAcceptLanguagesFromGetter(getter)
}

/**
 * get locale
 *
 * @param {Request} event The {@link Request | request}
 * @param {string} lang The default language tag, default is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 *
 * @throws {RangeError} Throws a {@link RangeError} if `lang` option or `accpet-languages` are not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The locale that resolved from `accept-language` header string, first language tag is used. if `*` (any language) or empty string is detected, return `en-US`.
 */
export function getLocale(req: Request, lang = 'en-US'): Intl.Locale {
  return getLocaleWithGetter(() => getAcceptLanguages(req)[0] || lang)
}
