/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { getCookie, getHeaders, getRequestURL, setCookie } from 'h3'
import { ACCEPT_LANGUAGE_HEADER, DEFAULT_COOKIE_NAME, DEFAULT_LANG_TAG } from './constants.ts'
import {
  getHeaderLanguagesWithGetter,
  getLocaleWithGetter,
  getPathLocale as _getPathLocale,
  getQueryLocale as _getQueryLocale,
  mapToLocaleFromLanguageTag,
  parseDefaultHeader,
  validateLocale
} from './http.ts'
import { pathLanguageParser } from './shared.ts'

import type { H3Event } from 'h3'
import type { CookieOptions, HeaderOptions, PathOptions, QueryOptions } from './http.ts'

/**
 * get languages from header
 *
 * @description parse header string, default `accept-language` header
 *
 * @example
 * example for h3:
 *
 * ```ts
 * import { createApp, eventHandler } from 'h3'
 * import { getHeaderLanguages } from '@intlify/utils/h3'
 *
 * const app = createApp()
 * app.use(eventHandler(event) => {
 *   const langTags = getHeaderLanguages(event)
 *   // ...
 *   return `accepted languages: ${acceptLanguages.join(', ')}`
 * })
 * ```
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {Array<string>} The array of language tags, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLanguages(
  event: H3Event,
  { name = ACCEPT_LANGUAGE_HEADER, parser = parseDefaultHeader }: HeaderOptions = {}
): string[] {
  const getter = () => {
    const headers = getHeaders(event)
    return headers[name]
  }
  return getHeaderLanguagesWithGetter(getter, { name, parser })
}

/**
 * get language from header
 *
 * @description parse header string, default `accept-language`. if you use `accept-language`, this function returns the **first language tag** of `accept-language` header.
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
 *   const langTag = getHeaderLanguage(event)
 *   // ...
 *   return `accepted language: ${langTag}`
 * })
 * ```
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {string} The **first language tag** of header, if header is not exists, or `*` (any language), return empty string.
 */
export function getHeaderLanguage(
  event: H3Event,
  { name = ACCEPT_LANGUAGE_HEADER, parser = parseDefaultHeader }: HeaderOptions = {}
): string {
  return getHeaderLanguages(event, { name, parser })[0] || ''
}

/**
 * get locales from header
 *
 * @description wrap language tags with {@link Intl.Locale | locale}, languages tags will be parsed from `accept-language` header as default.
 *
 * @example
 * example for h3:
 *
 * ```ts
 * import { createApp, eventHandler } from 'h3'
 * import { getHeaderLocales } from '@intlify/utils/h3'
 *
 * app.use(eventHandler(event) => {
 *   const locales = getHeaderLocales(event)
 *   // ...
 *   return `accepted locales: ${locales.map(locale => locale.toString()).join(', ')}`
 * })
 * ```
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @throws {RangeError} Throws the {@link RangeError} if header are not a well-formed BCP 47 language tag.
 *
 * @returns {Array<Intl.Locale>} The locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLocales(
  event: H3Event,
  { name = ACCEPT_LANGUAGE_HEADER, parser = parseDefaultHeader }: HeaderOptions = {}
): Intl.Locale[] {
  // @ts-expect-error -- FIXME: this type error needs to be fixed
  return mapToLocaleFromLanguageTag(getHeaderLanguages, event, { name, parser })
}

/**
 * try to get locales from header
 *
 * @description wrap language tags with {@link Intl.Locale | locale}, languages tags will be parsed from `accept-language` header as default. Unlike {@link getHeaderLocales}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {Array<Intl.Locale> | null} The locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array. if header are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryHeaderLocales(
  event: H3Event,
  { name = ACCEPT_LANGUAGE_HEADER, parser = parseDefaultHeader }: HeaderOptions = {}
): Intl.Locale[] | null {
  try {
    return getHeaderLocales(event, { name, parser })
  } catch {
    return null
  }
}

/**
 * get locale from header
 *
 * @description wrap language tag with {@link Intl.Locale | locale}, languages tags will be parsed from `accept-language` header as default.
 *
 * @example
 * example for h3:
 *
 * ```ts
 * import { createApp, eventHandler } from 'h3'
 * import { getHeaderLocale } from '@intlify/utils/h3'
 *
 * app.use(eventHandler(event) => {
 *   const locale = getHeaderLocale(event)
 *   // ...
 *   return `accepted locale: ${locale.toString()}`
 * })
 * ```
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 * @param {string} options.lang The default language tag, Optional. default value is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @throws {RangeError} Throws the {@link RangeError} if `lang` option or header are not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`.
 */
export function getHeaderLocale(
  event: H3Event,
  {
    lang = DEFAULT_LANG_TAG,
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader
  }: HeaderOptions & { lang?: string } = {}
): Intl.Locale {
  return getLocaleWithGetter(() => getHeaderLanguages(event, { name, parser })[0] || lang)
}

/**
 * try to get locale from header
 *
 * @description wrap language tag with {@link Intl.Locale | locale}, languages tags will be parsed from `accept-language` header as default. Unlike {@link getHeaderLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 * @param {string} options.lang The default language tag, Optional. default value is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {Intl.Locale | null} The first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`. if header are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryHeaderLocale(
  event: H3Event,
  {
    lang = DEFAULT_LANG_TAG,
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader
  }: HeaderOptions & { lang?: string } = {}
): Intl.Locale | null {
  try {
    return getHeaderLocale(event, { lang, name, parser })
  } catch {
    return null
  }
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
 * @returns {Intl.Locale} The locale that resolved from cookie
 */
export function getCookieLocale(
  event: H3Event,
  { lang = DEFAULT_LANG_TAG, name = DEFAULT_COOKIE_NAME } = {}
): Intl.Locale {
  return getLocaleWithGetter(() => getCookie(event, name) || lang)
}

/**
 * try to get locale from cookie
 *
 * @description Unlike {@link getCookieLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 * @param {string} options.lang The default language tag, default is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param {string} options.name The cookie name, default is `i18n_locale`
 *
 * @returns {Intl.Locale | null} The locale that resolved from cookie. if `lang` option or cookie name value are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryCookieLocale(
  event: H3Event,
  { lang = DEFAULT_LANG_TAG, name = DEFAULT_COOKIE_NAME } = {}
): Intl.Locale | null {
  try {
    return getCookieLocale(event, { lang, name })
  } catch {
    return null
  }
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
  options: CookieOptions = { name: DEFAULT_COOKIE_NAME } // eslint-disable-line unicorn/no-object-as-default-parameter -- NOTE: allow
): void {
  validateLocale(locale)
  setCookie(event, options.name!, locale.toString(), options)
}

/**
 * get the locale from the path
 *
 * @param {H3Event} event the {@link H3Event | H3} event
 * @param {PathOptions['lang']} options.lang the language tag, which is as default `'en-US'`. optional
 * @param {PathOptions['parser']} options.parser the path language parser, default {@link pathLanguageParser}, optional
 *
 * @throws {RangeError} Throws the {@link RangeError} if the language in the path, that is not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The locale that resolved from path
 */
export function getPathLocale(
  event: H3Event,
  { lang = DEFAULT_LANG_TAG, parser = pathLanguageParser }: PathOptions = {}
): Intl.Locale {
  return _getPathLocale(getRequestURL(event), { lang, parser })
}

/**
 * try to get the locale from the path
 *
 * @description Unlike {@link getPathLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param {H3Event} event the {@link H3Event | H3} event
 * @param {PathOptions['lang']} options.lang the language tag, which is as default `'en-US'`. optional
 * @param {PathOptions['parser']} options.parser the path language parser, default {@link pathLanguageParser}, optional
 *
 * @returns {Intl.Locale | null} The locale that resolved from path. if the language in the path, that is not a well-formed BCP 47 language tag, return `null`.
 */
export function tryPathLocale(
  event: H3Event,
  { lang = DEFAULT_LANG_TAG, parser = pathLanguageParser }: PathOptions = {}
): Intl.Locale | null {
  try {
    return getPathLocale(event, { lang, parser })
  } catch {
    return null
  }
}

/**
 * get the locale from the query
 *
 * @param {H3Event} event the {@link H3Event | H3} event
 * @param {QueryOptions['lang']} options.lang the language tag, which is as default `'en-US'`. optional
 * @param {QueryOptions['name']} options.name the query param name, default `'locale'`. optional
 *
 * @throws {RangeError} Throws the {@link RangeError} if the language in the query, that is not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The locale that resolved from query
 */
export function getQueryLocale(
  event: H3Event,
  { lang = DEFAULT_LANG_TAG, name = 'locale' }: QueryOptions = {}
): Intl.Locale {
  return _getQueryLocale(getRequestURL(event), { lang, name })
}

/**
 * try to get the locale from the query
 *
 * @description Unlike {@link getQueryLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param {H3Event} event the {@link H3Event | H3} event
 * @param {QueryOptions['lang']} options.lang the language tag, which is as default `'en-US'`. optional
 * @param {QueryOptions['name']} options.name the query param name, default `'locale'`. optional
 *
 * @returns {Intl.Locale | null} The locale that resolved from query. if the language in the query, that is not a well-formed BCP 47 language tag, return `null`.
 */
export function tryQueryLocale(
  event: H3Event,
  { lang = DEFAULT_LANG_TAG, name = 'locale' }: QueryOptions = {}
): Intl.Locale | null {
  try {
    return getQueryLocale(event, { lang, name })
  } catch {
    return null
  }
}
