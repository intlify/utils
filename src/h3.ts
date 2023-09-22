import {
  getAcceptLanguagesWithGetter,
  getLocaleWithGetter,
  mapToLocaleFromLanguageTag,
  validateLocale,
} from './http.ts'
import { getCookie, getHeaders, setCookie } from 'h3'
import { DEFAULT_COOKIE_NAME, DEFAULT_LANG_TAG } from './constants.ts'

import type { H3Event } from 'h3'
import type { CookieOptions } from './http.ts'

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
 *   const langTags = getAcceptLanguages(event)
 *   // ...
 *   return `accepted languages: ${acceptLanguages.join(', ')}`
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
  return getAcceptLanguagesWithGetter(getter)
}

/**
 * get accept language
 *
 * @description parse `accept-language` header string, this function retuns the **first language tag** of `accept-language` header.
 *
 * @example
 * example for h3:
 *
 * ```ts
 * import { createApp, eventHandler } from 'h3'
 * import { getAcceptLanguage } from '@intlify/utils/h3'
 *
 * const app = createApp()
 * app.use(eventHandler(event) => {
 *   const langTag = getAcceptLanguage(event)
 *   // ...
 *   return `accepted language: ${langTag}`
 * })
 * ```
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 *
 * @returns {string} The **first language tag** of `accept-language` header, if `accept-language` header is not exists, or `*` (any language), return empty string.
 */
export function getAcceptLanguage(event: H3Event): string {
  return getAcceptLanguages(event)[0] || ''
}

/**
 * get locales from `accept-language` header
 *
 * @description wrap language tags with {@link Intl.Locale | locale}
 *
 * @example
 * example for h3:
 *
 * ```ts
 * import { createApp, eventHandler } from 'h3'
 * import { getAcceptLocales } from '@intlify/utils/h3'
 *
 * app.use(eventHandler(event) => {
 *   const locales = getAcceptLocales(event)
 *   // ...
 *   return `accepted locales: ${locales.map(locale => locale.toString()).join(', ')}`
 * })
 * ```
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 *
 * @returns {Array<Intl.Locale>} The locales that wrapped from `accept-language` header, if `*` (any language) or empty string is detected, return an empty array.
 */
export function getAcceptLocales(
  event: H3Event,
): Intl.Locale[] {
  return mapToLocaleFromLanguageTag(getAcceptLanguages, event)
}

/**
 * get locale from `accept-language` header
 *
 * @description wrap language tag with {@link Intl.Locale | locale}
 *
 * @example
 * example for h3:
 *
 * ```ts
 * import { createApp, eventHandler } from 'h3'
 * import { getAcceptLocale } from '@intlify/utils/h3'
 *
 * app.use(eventHandler(event) => {
 *   const locale = getAcceptLocale(event)
 *   // ...
 *   return `accepted locale: ${locale.toString()}`
 * })
 * ```
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 * @param {string} lang The default language tag, Optional. default value is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 *
 * @throws {RangeError} Throws the {@link RangeError} if `lang` option or `accpet-languages` are not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The first locale that resolved from `accept-language` header string, first language tag is used. if `*` (any language) or empty string is detected, return `en-US`.
 */
export function getAcceptLocale(
  event: H3Event,
  lang = DEFAULT_LANG_TAG,
): Intl.Locale {
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
  { lang = DEFAULT_LANG_TAG, name = DEFAULT_COOKIE_NAME } = {},
): Intl.Locale {
  return getLocaleWithGetter(() => getCookie(event, name) || lang)
}

/**
 * set locale to the response `Set-Cookie` header.
 *
 * @example
 * example for h3:
 *
 * ```ts
 * import { createApp, eventHandler } from 'h3'
 * import { getCookieLocale } from '@intlify/utils/h3'
 *
 * app.use(eventHandler(event) => {
 *   setCookieLocale(event, 'ja-JP')
 *   // ...
 * })
 * ```
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 * @param {string | Intl.Locale} locale The locale value
 * @param {CookieOptions} options The cookie options, `name` option is `i18n_locale` as default, and `path` option is `/` as default.
 *
 * @throws {SyntaxError} Throws the {@link SyntaxError} if `locale` is invalid.
 */
export function setCookieLocale(
  event: H3Event,
  locale: string | Intl.Locale,
  options: CookieOptions = { name: DEFAULT_COOKIE_NAME },
): void {
  validateLocale(locale)
  setCookie(event, options.name!, locale.toString(), options)
}
