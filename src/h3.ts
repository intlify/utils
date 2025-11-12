/**
 * `@intlify/utils` module entry for [H3](https://h3.dev/)
 *
 * @example
 * ```ts
 * import { getHeaderLocale } from '@intlify/utils/h3'
 * ```
 *
 * @module h3
 */

/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { getCookie, getHeaders, getRequestURL, setCookie } from 'h3'
import { ACCEPT_LANGUAGE_HEADER, DEFAULT_COOKIE_NAME, DEFAULT_LANG_TAG } from './constants.ts'
import {
  getPathLocale as _getPathLocale,
  getQueryLocale as _getQueryLocale,
  getHeaderLanguagesWithGetter,
  getLocaleWithGetter,
  mapToLocaleFromLanguageTag,
  parseDefaultHeader,
  validateLocale
} from './http.ts'
import { warnOnce } from './utils.ts'

import type { H3Event } from 'h3'
import type {
  CookieLocaleOptions,
  CookieOptions,
  HeaderOptions,
  PathOptions,
  QueryOptions
} from './http.ts'

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
 * @param event - The {@link H3Event | H3} event
 * @param options - The {@link HeaderOptions | header options} object. `name` option is `accept-language` as default.
 *
 * @returns The array of language tags, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLanguages(event: H3Event, options: HeaderOptions = {}): string[] {
  warnOnce(
    '`getHeaderLanguages` of `@intlify/utils/h3` is deprecated in v2. Use `getHeaderLanguages` of `@intlify/utils` instead.'
  )

  const { name = ACCEPT_LANGUAGE_HEADER } = options
  const getter = () => {
    const headers = getHeaders(event)
    return headers[name]
  }
  return getHeaderLanguagesWithGetter(getter, options)
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
 * @param event - The {@link H3Event | H3} event
 * @param options - The {@link HeaderOptions | header options} object
 *
 * @returns The **first language tag** of header, if header is not exists, or `*` (any language), return empty string.
 */
export function getHeaderLanguage(event: H3Event, options: HeaderOptions = {}): string {
  warnOnce(
    '`getHeaderLanguage` of `@intlify/utils/h3` is deprecated in v2. Use `getHeaderLanguage` of `@intlify/utils` instead.'
  )

  return getHeaderLanguages(event, options)[0] || ''
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
 * @param event - The {@link H3Event | H3} event
 * @param options - The {@link HeaderOptions | header options} object
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if header are not a well-formed BCP 47 language tag.
 *
 * @returns The locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLocales(event: H3Event, options: HeaderOptions = {}): Intl.Locale[] {
  warnOnce(
    '`getHeaderLocales` of `@intlify/utils/h3` is deprecated in v2. Use `getHeaderLocales` of `@intlify/utils` instead.'
  )

  return mapToLocaleFromLanguageTag(getHeaderLanguages, event, options)
}

/**
 * try to get locales from header
 *
 * @description wrap language tags with {@link Intl.Locale | locale}, languages tags will be parsed from `accept-language` header as default. Unlike {@link getHeaderLocales}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param event - The {@link H3Event | H3} event
 * @param options - The {@link HeaderOptions | header options} object
 *
 * @returns The locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array. if header are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryHeaderLocales(
  event: H3Event,
  options: HeaderOptions = {}
): Intl.Locale[] | null {
  warnOnce(
    '`tryHeaderLocales` of `@intlify/utils/h3` is deprecated in v2. Use `tryHeaderLocales` of `@intlify/utils` instead.'
  )

  try {
    return getHeaderLocales(event, options)
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
 * @param event - The {@link H3Event | H3} event
 * @param options - The {@link HeaderOptions | header options} object. `lang` option is `en-US` as default, you must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}. `name` option is `accept-language` as default, and `parser` option is {@linkcode parseDefaultHeader} as default.
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if `lang` option or header are not a well-formed BCP 47 language tag.
 *
 * @returns The first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`.
 */
export function getHeaderLocale(
  event: H3Event,
  options: HeaderOptions & { lang?: string } = {}
): Intl.Locale {
  warnOnce(
    '`getHeaderLocale` of `@intlify/utils/h3` is deprecated in v2. Use `getHeaderLocale` of `@intlify/utils` instead.'
  )

  const {
    lang = DEFAULT_LANG_TAG,
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader
  } = options
  return getLocaleWithGetter(() => getHeaderLanguages(event, { name, parser })[0] || lang)
}

/**
 * try to get locale from header
 *
 * @description wrap language tag with {@link Intl.Locale | locale}, languages tags will be parsed from `accept-language` header as default. Unlike {@link getHeaderLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param event - The {@link H3Event | H3} event
 * @param options - The {@link HeaderOptions | header options} object
 *
 * @returns The first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`. if header are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryHeaderLocale(
  event: H3Event,
  options: HeaderOptions & { lang?: string } = {}
): Intl.Locale | null {
  warnOnce(
    '`tryHeaderLocale` of `@intlify/utils/h3` is deprecated in v2. Use `tryHeaderLocale` of `@intlify/utils` instead.'
  )

  try {
    return getHeaderLocale(event, options)
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
 * @param event - The {@link H3Event | H3} event
 * @param options - The {@link CookieLocaleOptions | cookie locale options}, `lang` option is `en-US` as default, you must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}. `name` option is `i18n_locale` as default.
 *
 * @throws {RangeError} Throws a {@linkcode RangeError} if `lang` option or cookie name value are not a well-formed BCP 47 language tag.
 *
 * @returns The locale that resolved from cookie
 */
export function getCookieLocale(event: H3Event, options: CookieLocaleOptions = {}): Intl.Locale {
  warnOnce(
    '`getCookieLocale` of `@intlify/utils/h3` is deprecated in v2. Use `getCookieLocale` of `@intlify/utils` instead.'
  )

  const { lang = DEFAULT_LANG_TAG, name = DEFAULT_COOKIE_NAME } = options
  return getLocaleWithGetter(() => getCookie(event, name) || lang)
}

/**
 * try to get locale from cookie
 *
 * @description Unlike {@linkcode getCookieLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param event - The {@link H3Event | H3} event
 * @param options - The {@link CookieLocaleOptions | cookie locale options}
 *
 * @returns The locale that resolved from cookie. if `lang` option or cookie name value are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryCookieLocale(
  event: H3Event,
  options: CookieLocaleOptions = {}
): Intl.Locale | null {
  warnOnce(
    '`tryCookieLocale` of `@intlify/utils/h3` is deprecated in v2. Use `tryCookieLocale` of `@intlify/utils` instead.'
  )

  try {
    return getCookieLocale(event, options)
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
 * @param event - The {@link H3Event | H3} event
 * @param locale - The locale value
 * @param options - The {@link CookieOptions | cookie options}, `name` option is `i18n_locale` as default
 *
 * @throws {SyntaxError} Throws the {@linkcode SyntaxError} if `locale` is invalid.
 */
export function setCookieLocale(
  event: H3Event,
  locale: string | Intl.Locale,
  options: CookieOptions = {}
): void {
  warnOnce(
    '`setCookieLocale` of `@intlify/utils/h3` is deprecated in v2. Use `setCookieLocale` of `@intlify/utils` instead.'
  )

  const { name = DEFAULT_COOKIE_NAME } = options
  validateLocale(locale)
  setCookie(event, name, locale.toString(), options)
}

/**
 * get the locale from the path
 *
 * @param event - the {@link H3Event | H3} event
 * @param options - the {@link PathOptions | path options} object
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if the language in the path, that is not a well-formed BCP 47 language tag.
 *
 * @returns The locale that resolved from path
 */
export function getPathLocale(event: H3Event, options: PathOptions = {}): Intl.Locale {
  warnOnce(
    '`getPathLocale` of `@intlify/utils/h3` is deprecated in v2. Use `getPathLocale` of `@intlify/utils` instead.'
  )

  return _getPathLocale(getRequestURL(event), options)
}

/**
 * try to get the locale from the path
 *
 * @description Unlike {@linkcode getPathLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param event - the {@link H3Event | H3} event
 * @param options - the {@link PathOptions | path options} object
 *
 * @returns The locale that resolved from path. if the language in the path, that is not a well-formed BCP 47 language tag, return `null`.
 */
export function tryPathLocale(event: H3Event, options: PathOptions = {}): Intl.Locale | null {
  warnOnce(
    '`tryPathLocale` of `@intlify/utils/h3` is deprecated in v2. Use `tryPathLocale` of `@intlify/utils` instead.'
  )

  try {
    return getPathLocale(event, options)
  } catch {
    return null
  }
}

/**
 * get the locale from the query
 *
 * @param event - the {@link H3Event | H3} event
 * @param options - The {@link QueryOptions | query options}, `lang` option is `en-US` as default, `name` option is `locale` as default.
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if the language in the query, that is not a well-formed BCP 47 language tag.
 *
 * @returns The locale that resolved from query
 */
export function getQueryLocale(event: H3Event, options: QueryOptions = {}): Intl.Locale {
  warnOnce(
    '`getQueryLocale` of `@intlify/utils/h3` is deprecated in v2. Use `getQueryLocale` of `@intlify/utils` instead.'
  )

  const { lang = DEFAULT_LANG_TAG, name = 'locale' } = options
  return _getQueryLocale(getRequestURL(event), { lang, name })
}

/**
 * try to get the locale from the query
 *
 * @description Unlike {@linkcode getQueryLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param event - the {@link H3Event | H3} event
 * @param options - The {@link QueryOptions | query options}, `lang` option is `en-US` as default, `name` option is `locale` as default.
 *
 * @returns The locale that resolved from query. if the language in the query, that is not a well-formed BCP 47 language tag, return `null`.
 */
export function tryQueryLocale(event: H3Event, options: QueryOptions = {}): Intl.Locale | null {
  warnOnce(
    '`tryQueryLocale` of `@intlify/utils/h3` is deprecated in v2. Use `tryQueryLocale` of `@intlify/utils` instead.'
  )

  const { lang = DEFAULT_LANG_TAG, name = 'locale' } = options
  try {
    return getQueryLocale(event, { lang, name })
  } catch {
    return null
  }
}
