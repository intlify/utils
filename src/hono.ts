/**
 * `@intlify/utils` module entry for [Hono](https://hono.dev/)
 *
 * @example
 * ```ts
 * import { getHeaderLocale, setCookieLocale } from '@intlify/utils/hono'
 * ```
 *
 * @module hono
 */

/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { getCookie, setCookie } from 'hono/cookie'
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

import type { Context } from 'hono'
import type { CookieLocaleOptions, HeaderOptions, PathOptions, QueryOptions } from './http.ts'

type CookieOptions = Parameters<typeof setCookie>[3] & { name?: string }

/**
 * get languages from header
 *
 * @description parse header string, default `accept-language` header
 *
 * @example
 * example for Hono
 *
 * ```ts
 * import { Hono } from 'hono'
 * import { getHeaderLanguages } from '@intlify/utils/hono'
 *
 * const app = new Hono()
 * app.use('/', c => {
 *   const langTags = getHeaderLanguages(c)
 *   // ...
 *   return c.text(`accepted languages: ${acceptLanguages.join(', ')}`)
 * })
 * ```
 *
 * @param context - A {@link Context | Hono} context
 * @param options - The {@link HeaderOptions | header options} object. `name` option is `accept-language` as default.
 *
 * @returns An array of language tags, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLanguages(context: Context, options: HeaderOptions = {}): string[] {
  warnOnce(
    '`getHeaderLanguages` of `@intlify/utils/hono` is deprecated in v2. Use `getHeaderLanguages` of `@intlify/utils` instead.'
  )

  const { name = ACCEPT_LANGUAGE_HEADER } = options
  return getHeaderLanguagesWithGetter(() => context.req.header(name), options)
}

/**
 * get language from header
 *
 * @description parse header string, default `accept-language`. if you use `accept-language`, this function returns the **first language tag** of `accept-language` header.
 *
 * @example
 * example for Hone:
 *
 * ```ts
 * import { Hono } from 'hono'
 * import { getHeaderLanguage } from '@intlify/utils/hono'
 *
 * const app = new Hono()
 * app.use('/', c => {
 *   const langTag = getHeaderLanguage(c)
 *   // ...
 *   return c.text(`accepted language: ${langTag}`)
 * })
 * ```
 *
 * @param context - A {@link Context | Hono} context
 * @param options - The {@link HeaderOptions | header options} object
 *
 * @returns A **first language tag** of header, if header is not exists, or `*` (any language), return empty string.
 */
export function getHeaderLanguage(context: Context, options: HeaderOptions = {}): string {
  warnOnce(
    '`getHeaderLanguage` of `@intlify/utils/hono` is deprecated in v2. Use `getHeaderLanguage` of `@intlify/utils` instead.'
  )

  return getHeaderLanguages(context, options)[0] || ''
}

/**
 * get locales from header
 *
 * @description wrap language tags with {@link Intl.Locale | locale}, languages tags will be parsed from `accept-language` header as default.
 *
 * @example
 * example for Hono:
 *
 * ```ts
 * import { Hono } from 'hono'
 * import { getHeaderLocales } from '@intlify/utils/hono'
 *
 * const app = new Hono()
 * app.use('/', c => {
 *   const locales = getHeaderLocales(c)
 *   // ...
 *   return c.text(`accepted locales: ${locales.map(locale => locale.toString()).join(', ')}`)
 * })
 * ```
 *
 * @param context - A {@link Context | Hono} context
 * @param options - The {@link HeaderOptions | header options} object
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if header are not a well-formed BCP 47 language tag.
 *
 * @returns Some locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLocales(context: Context, options: HeaderOptions = {}): Intl.Locale[] {
  warnOnce(
    '`getHeaderLocales` of `@intlify/utils/hono` is deprecated in v2. Use `getHeaderLocales` of `@intlify/utils` instead.'
  )

  return mapToLocaleFromLanguageTag(getHeaderLanguages, context, options)
}

/**
 * try to get locales from header
 *
 * @description wrap language tags with {@link Intl.Locale | locale}, languages tags will be parsed from `accept-language` header as default. Unlike {@link getHeaderLocales}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param context - A {@link Context | Hono} context
 * @param options - The {@link HeaderOptions | header options} object
 *
 * @returns Some locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array. if header are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryHeaderLocales(
  context: Context,
  options: HeaderOptions = {}
): Intl.Locale[] | null {
  warnOnce(
    '`tryHeaderLocales` of `@intlify/utils/hono` is deprecated in v2. Use `tryHeaderLocales` of `@intlify/utils` instead.'
  )
  try {
    return getHeaderLocales(context, options)
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
 * example for Hono:
 *
 * ```ts
 * import { Hono } from 'hono'
 * import { getHeaderLocale } from '@intlify/utils/hono'
 *
 * const app = new Hono()
 * app.use('/', c => {
 *   const locale = getHeaderLocale(c)
 *   // ...
 *   return c.text(`accepted language: ${locale.toString()}`)
 * })
 * ```
 *
 * @param context - A {@link Context | Hono} context
 * @param options - The {@link HeaderOptions | header options} object. `lang` option is `en-US` as default, you must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}. `name` option is `accept-language` as default, and `parser` option is {@linkcode parseDefaultHeader} as default.
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if `lang` option or header are not a well-formed BCP 47 language tag.
 *
 * @returns A first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`.
 */
export function getHeaderLocale(
  context: Context,
  options: HeaderOptions & { lang?: string } = {}
): Intl.Locale {
  warnOnce(
    '`getHeaderLocale` of `@intlify/utils/hono` is deprecated in v2. Use `getHeaderLocale` of `@intlify/utils` instead.'
  )

  const {
    lang = DEFAULT_LANG_TAG,
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader
  } = options
  return getLocaleWithGetter(() => getHeaderLanguages(context, { name, parser })[0] || lang)
}

/**
 * try to get locale from header
 *
 * @description wrap language tag with {@link Intl.Locale | locale}, languages tags will be parsed from `accept-language` header as default. Unlike {@link getHeaderLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param context - A {@link Context | Hono} context
 * @param options - The {@link HeaderOptions | header options} object
 *
 * @returns A first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`. if `lang` option or header are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryHeaderLocale(
  context: Context,
  options: HeaderOptions & { lang?: string } = {}
): Intl.Locale | null {
  warnOnce(
    '`tryHeaderLocale` of `@intlify/utils/hono` is deprecated in v2. Use `tryHeaderLocale` of `@intlify/utils` instead.'
  )

  try {
    return getHeaderLocale(context, options)
  } catch {
    return null
  }
}

/**
 * get locale from cookie
 *
 * @example
 * example for Hono:
 *
 * ```ts
 * import { Hono } from 'hono'
 * import { getCookieLocale } from '@intlify/utils/hono'
 *
 * const app = new Hono()
 * app.use('/', c => {
 *   const locale = getCookieLocale(c)
 *   console.log(locale) // output `Intl.Locale` instance
 *   // ...
 * })
 * ```
 *
 * @param context - A {@link Context | Hono} context
 * @param options - The {@link CookieLocaleOptions | cookie locale options}, `lang` option is `en-US` as default, you must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}. `name` option is `i18n_locale` as default.
 *
 * @throws {RangeError} Throws a {@linkcode RangeError} if `lang` option or cookie name value are not a well-formed BCP 47 language tag.
 *
 * @returns The locale that resolved from cookie
 */
export function getCookieLocale(context: Context, options: CookieLocaleOptions = {}): Intl.Locale {
  warnOnce(
    '`getCookieLocale` of `@intlify/utils/hono` is deprecated in v2. Use `getCookieLocale` of `@intlify/utils` instead.'
  )

  const { lang = DEFAULT_LANG_TAG, name = DEFAULT_COOKIE_NAME } = options
  return getLocaleWithGetter(() => getCookie(context, name) || lang)
}

/**
 * try to get locale from cookie
 *
 * @description Unlike {@linkcode getCookieLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param context - A {@link Context | Hono} context
 * @param options - The {@link CookieLocaleOptions | cookie locale options}
 *
 * @returns The locale that resolved from cookie, if `lang` option or cookie name value are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryCookieLocale(
  context: Context,
  options: CookieLocaleOptions = {}
): Intl.Locale | null {
  warnOnce(
    '`tryCookieLocale` of `@intlify/utils/hono` is deprecated in v2. Use `tryCookieLocale` of `@intlify/utils` instead.'
  )

  try {
    return getCookieLocale(context, options)
  } catch {
    return null
  }
}

/**
 * set locale to the response `Set-Cookie` header.
 *
 * @example
 * example for Hono:
 *
 * ```ts
 * import { Hono } from 'hono'
 * import { setCookieLocale } from '@intlify/utils/hono'
 *
 * const app = new Hono()
 * app.use('/', c => {
 *   setCookieLocale(c, 'ja-JP')
 *   // ...
 * })
 * ```
 *
 * @param context - A {@link Context | Hono} context
 * @param locale - A locale value
 * @param options - The {@link CookieOptions | cookie options}, `name` option is `i18n_locale` as default
 *
 * @throws {SyntaxError} Throws the {@linkcode SyntaxError} if `locale` is invalid.
 */
export function setCookieLocale(
  context: Context,
  locale: string | Intl.Locale,
  options: CookieOptions = {}
): void {
  warnOnce(
    '`setCookieLocale` of `@intlify/utils/hono` is deprecated in v2. Use `setCookieLocale` of `@intlify/utils` instead.'
  )

  const { name = DEFAULT_COOKIE_NAME } = options
  validateLocale(locale)
  setCookie(context, name, locale.toString(), options)
}

/**
 * get the locale from the path
 *
 * @param context - A {@link Context | Hono} context
 * @param options - the {@link PathOptions | path options} object
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if the language in the path, that is not a well-formed BCP 47 language tag.
 *
 * @returns The locale that resolved from path
 */
export function getPathLocale(context: Context, options: PathOptions = {}): Intl.Locale {
  warnOnce(
    '`getPathLocale` of `@intlify/utils/hono` is deprecated in v2. Use `getPathLocale` of `@intlify/utils` instead.'
  )

  return _getPathLocale(new URL(context.req.url), options)
}

/**
 * try to get the locale from the path
 *
 * @description Unlike {@linkcode getPathLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param context - A {@link Context | Hono} context
 * @param options - the {@link PathOptions | path options} object
 *
 * @returns The locale that resolved from path. if the language in the path, that is not a well-formed BCP 47 language tag, return `null`.
 */
export function tryPathLocale(context: Context, options: PathOptions = {}): Intl.Locale | null {
  warnOnce(
    '`tryPathLocale` of `@intlify/utils/hono` is deprecated in v2. Use `tryPathLocale` of `@intlify/utils` instead.'
  )

  try {
    return getPathLocale(context, options)
  } catch {
    return null
  }
}

/**
 * get the locale from the query
 *
 * @param context - A {@link Context | Hono} context
 * @param options - The {@link QueryOptions | query options}, `lang` option is `en-US` as default, `name` option is `locale` as default.
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if the language in the query, that is not a well-formed BCP 47 language tag.
 *
 * @returns The locale that resolved from query
 */
export function getQueryLocale(context: Context, options: QueryOptions = {}): Intl.Locale {
  warnOnce(
    '`getQueryLocale` of `@intlify/utils/hono` is deprecated in v2. Use `getQueryLocale` of `@intlify/utils` instead.'
  )

  const { lang = DEFAULT_LANG_TAG, name = 'locale' } = options
  return _getQueryLocale(new URL(context.req.url), { lang, name })
}

/**
 * try to get the locale from the query
 *
 * @description Unlike {@linkcode getQueryLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param context - A {@link Context | Hono} context
 * @param options - The {@link QueryOptions | query options}, `lang` option is `en-US` as default, `name` option is `locale` as default.
 *
 * @returns The locale that resolved from query. if the language in the query, that is not a well-formed BCP 47 language tag, return `null`.
 */
export function tryQueryLocale(context: Context, options: QueryOptions = {}): Intl.Locale | null {
  warnOnce(
    '`tryQueryLocale` of `@intlify/utils/hono` is deprecated in v2. Use `tryQueryLocale` of `@intlify/utils` instead.'
  )

  const { lang = DEFAULT_LANG_TAG, name = 'locale' } = options
  try {
    return getQueryLocale(context, { lang, name })
  } catch {
    return null
  }
}
