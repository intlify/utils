import { getAcceptLanguagesFromGetter, getLocaleWithGetter } from './http.ts'
import { getCookie, getHeaders } from 'h3'

import type { H3Event } from 'h3'

/**
 * get accpet languages
 *
 * @description parse `accept-language` header string
 *
 * @example
 * example for h3:
 *
 * ```ts
 * import { createApp, eventHandler } from 'h3'
 * import { getAcceptLanguages } from '@intlify/utils/h3'
 *
 * const app = createApp()
 * app.use(eventHandler(event) => {
 *   const acceptLanguages = getAcceptLanguages(event)
 *   // ...
 * })
 * ```
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 *
 * @returns {Array<string>} The array of language tags, if `*` (any language) or empty string is detected, return an empty array.
 */
export function getAcceptLanguages(event: H3Event): string[] {
  const getter = () => {
    const headers = getHeaders(event)
    return headers['accept-language']
  }
  return getAcceptLanguagesFromGetter(getter)
}

/**
 * get locale
 *
 * @example
 * example for h3:
 *
 * ```ts
 * import { createApp, eventHandler } from 'h3'
 * import { getLocale } from '@intlify/utils/h3'
 *
 * app.use(eventHandler(event) => {
 *   const locale = getLocale(event)
 *   console.log(locale) // output `Intl.Locale` instance
 *   // ...
 * })
 * ```
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 * @param {string} lang The default language tag, default is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 *
 * @throws {RangeError} Throws a {@link RangeError} if `lang` option or `accpet-languages` are not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The first locale that resolved from `accept-language` header string, first language tag is used. if `*` (any language) or empty string is detected, return `en-US`.
 */
export function getLocale(event: H3Event, lang = 'en-US'): Intl.Locale {
  return getLocaleWithGetter(() => getAcceptLanguages(event)[0] || lang)
}

/**
 * get locale from cookie
 *
 * @example
 * example for h3:
 *
 * ```ts
 * import { createApp, eventHandler } from 'h3'
 * import { getCookieLocale } from '@intlify/utils/h3'
 *
 * app.use(eventHandler(event) => {
 *   const locale = getCookieLocale(event)
 *   console.log(locale) // output `Intl.Locale` instance
 *   // ...
 * })
 * ```
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 * @param {string} options.lang The default language tag, default is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param {string} options.name The cookie name, default is `i18n_locale`
 *
 * @throws {RangeError} Throws a {@link RangeError} if `lang` option or cookie name value are not a well-formed BCP 47 language tag.
 *
 * @returns The locale that resolved from cookie
 */
export function getCookieLocale(
  event: H3Event,
  { lang = 'en-US', name = 'i18n_locale' } = {},
): Intl.Locale {
  return getLocaleWithGetter(() => getCookie(event, name) || lang)
}
