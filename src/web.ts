/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { parse, serialize } from 'cookie-es'
import { ACCEPT_LANGUAGE_HEADER, DEFAULT_COOKIE_NAME, DEFAULT_LANG_TAG } from './constants.ts'
import {
  getPathLocale as _getPathLocale,
  getQueryLocale as _getQueryLocale,
  getExistCookies,
  getHeaderLanguagesWithGetter,
  getLocaleWithGetter,
  mapToLocaleFromLanguageTag,
  parseDefaultHeader,
  validateLocale
} from './http.ts'
import { pathLanguageParser } from './shared.ts'

import type { CookieOptions, HeaderOptions, PathOptions, QueryOptions } from './http.ts'

/**
 * get languages from header
 *
 * @description parse header string, default `accept-language` header
 *
 * @example
 * example for Web API request on Deno:
 *
 * ```ts
 * import { getHeaderLanguages } from 'https://esm.sh/@intlify/utils/web'
 *
 * Deno.serve({
 *   port: 8080,
 * }, (req) => {
 *   const langTags = getHeaderLanguages(req)
 *   // ...
 *   return new Response(`accepted languages: ${langTags.join(', ')}`
 * })
 * ```
 *
 * @param request - The {@link Request | request}
 * @param options.name - The header name, which is as default `accept-language`.
 * @param options.parser - The parser function, which is as default {@linkcode parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns The array of language tags, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLanguages(
  request: Request,
  { name = ACCEPT_LANGUAGE_HEADER, parser = parseDefaultHeader }: HeaderOptions = {}
): string[] {
  const getter = () => request.headers.get(name)
  return getHeaderLanguagesWithGetter(getter, { name, parser })
}

/**
 * get language from header
 *
 * @description parse header string, default `accept-language`. if you use `accept-language`, this function returns the **first language tag** of `accept-language` header.
 *
 * @example
 * example for Web API request on Deno:
 *
 * ```ts
 * import { getAcceptLanguage } from 'https://esm.sh/@intlify/utils/web'
 *
 * Deno.serve({
 *   port: 8080,
 * }, (req) => {
 *   const langTag = getHeaderLanguage(req)
 *   // ...
 *   return new Response(`accepted language: ${langTag}`
 * })
 * ```
 *
 * @param request - The {@link Request | request}
 * @param options.name - The header name, which is as default `accept-language`.
 * @param options.parser - The parser function, which is as default {@linkcode parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns The **first language tag** of header, if header is not exists, or `*` (any language), return empty string.
 */
export function getHeaderLanguage(
  request: Request,
  { name = ACCEPT_LANGUAGE_HEADER, parser = parseDefaultHeader }: HeaderOptions = {}
): string {
  return getHeaderLanguages(request, { name, parser })[0] || ''
}

/**
 * get locales from header
 *
 * @description wrap language tags with {@link Intl.Locale | locale}, languages tags will be parsed from `accept-language` header as default.
 *
 * @example
 * example for Web API request on Bun:
 *
 * ```ts
 * import { getHeaderLocales } from '@intlify/utils/web'
 *
 * Bun.serve({
 *   port: 8080,
 *   fetch(req) {
 *     const locales = getHeaderLocales(req)
 *     // ...
 *     return new Response(`accpected locales: ${locales.map(locale => locale.toString()).join(', ')}`)
 *   },
 * })
 * ```
 *
 * @param request - The {@link Request | request}
 * @param options.name - The header name, which is as default `accept-language`.
 * @param options.parser - The parser function, which is as default {@linkcode parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if header are not a well-formed BCP 47 language tag.
 *
 * @returns The locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLocales(
  request: Request,
  { name = ACCEPT_LANGUAGE_HEADER, parser = parseDefaultHeader }: HeaderOptions = {}
): Intl.Locale[] {
  // @ts-expect-error -- FIXME: this type error needs to be fixed
  return mapToLocaleFromLanguageTag(getHeaderLanguages, request, {
    name,
    parser
  })
}

/**
 * try to get locales from header
 *
 * @description wrap language tags with {@link Intl.Locale | locale}, languages tags will be parsed from `accept-language` header as default. Unlike {@link getHeaderLocales}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param request - The {@link Request | request}
 * @param options.name - The header name, which is as default `accept-language`.
 * @param options.parser - The parser function, which is as default {@linkcode parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns The locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array. if header are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryHeaderLocales(
  request: Request,
  { name = ACCEPT_LANGUAGE_HEADER, parser = parseDefaultHeader }: HeaderOptions = {}
): Intl.Locale[] | null {
  try {
    return getHeaderLocales(request, { name, parser })
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
 * example for Web API request on Bun:
 *
 * import { getHeaderLocale } from '@intlify/utils/web'
 *
 * Bun.serve({
 *   port: 8080,
 *   fetch(req) {
 *     const locale = getHeaderLocale(req)
 *     // ...
 *     return new Response(`accpected locale: ${locale.toString()}`)
 *   },
 * })
 *
 * @param request - The {@link Request | request}
 * @param options.lang - The default language tag, Optional. default value is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param options.name - The header name, which is as default `accept-language`.
 * @param options.parser - The parser function, which is as default {@linkcode parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if `lang` option or header are not a well-formed BCP 47 language tag.
 *
 * @returns The first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`.
 */
export function getHeaderLocale(
  request: Request,
  {
    lang = DEFAULT_LANG_TAG,
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader
  }: HeaderOptions & { lang?: string } = {}
): Intl.Locale {
  return getLocaleWithGetter(() => getHeaderLanguages(request, { name, parser })[0] || lang)
}

/**
 * try to get locale from header
 *
 * @description wrap language tag with {@link Intl.Locale | locale}, languages tags will be parsed from `accept-language` header as default. Unlike {@link getHeaderLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param request - The {@link Request | request}
 * @param options.lang - The default language tag, Optional. default value is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param options.name - The header name, which is as default `accept-language`.
 * @param options.parser - The parser function, which is as default {@linkcode parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns The first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`. if `lang` option or header are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryHeaderLocale(
  request: Request,
  {
    lang = DEFAULT_LANG_TAG,
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader
  }: HeaderOptions & { lang?: string } = {}
): Intl.Locale | null {
  try {
    return getHeaderLocale(request, { lang, name, parser })
  } catch {
    return null
  }
}

/**
 * get locale from cookie
 *
 * @example
 * example for Web API request on Deno:
 *
 * ```ts
 * import { getCookieLocale } from 'https://esm.sh/@intlify/utils/web'
 *
 * Deno.serve({
 *   port: 8080,
 * }, (req) => {
 *   const locale = getCookieLocale(req)
 *   console.log(locale) // output `Intl.Locale` instance
 *   // ...
 * })
 * ```
 *
 * @param request - The {@link Request | request}
 * @param options.lang - The default language tag, default is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param options.name - The cookie name, default is `i18n_locale`
 *
 * @throws {RangeError} Throws a {@linkcode RangeError} if `lang` option or cookie name value are not a well-formed BCP 47 language tag.
 *
 * @returns The locale that resolved from cookie
 */
export function getCookieLocale(
  request: Request,
  { lang = DEFAULT_LANG_TAG, name = DEFAULT_COOKIE_NAME } = {}
): Intl.Locale {
  const getter = () => {
    const cookieRaw = request.headers.get('cookie')
    const cookie = parse(cookieRaw || '')
    return cookie[name] || lang
  }
  return getLocaleWithGetter(getter)
}

/**
 * try to get locale from cookie
 *
 * @description Unlike {@linkcode getCookieLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param request - The {@link Request | request}
 * @param options.lang - The default language tag, default is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param options.name - The cookie name, default is `i18n_locale`
 *
 * @returns The locale that resolved from cookie. if `lang` option or cookie name value are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryCookieLocale(
  request: Request,
  { lang = DEFAULT_LANG_TAG, name = DEFAULT_COOKIE_NAME } = {}
): Intl.Locale | null {
  try {
    return getCookieLocale(request, { lang, name })
  } catch {
    return null
  }
}

/**
 * set locale to the response `Set-Cookie` header.
 *
 * @example
 * example for Web API response on Bun:
 *
 * ```ts
 * import { setCookieLocale } from '@intlify/utils/web'
 *
 * Bun.serve({
 *   port: 8080,
 *   fetch(req) {
 *     const res = new Response('こんにちは、世界！')
 *     setCookieLocale(res, 'ja-JP')
 *     // ...
 *     return res
 *   },
 * })
 * ```
 *
 * @param response - The {@link Response | response}
 * @param locale - The locale value
 * @param options - The cookie options, `name` option is `i18n_locale` as default, and `path` option is `/` as default.
 *
 * @throws {SyntaxError} Throws the {@linkcode SyntaxError} if `locale` is invalid.
 */
export function setCookieLocale(
  response: Response,
  locale: string | Intl.Locale,
  options: CookieOptions = { name: DEFAULT_COOKIE_NAME } // eslint-disable-line unicorn/no-object-as-default-parameter -- NOTE: allow
): void {
  validateLocale(locale)
  const setCookies = getExistCookies(options.name!, () => response.headers.getSetCookie())
  const target = serialize(options.name!, locale.toString(), {
    path: '/',
    ...options
  })
  response.headers.set('set-cookie', [...setCookies, target].join('; '))
}

/**
 * get the locale from the path
 *
 * @param request - the {@link Request | request}
 * @param options.lang - the language tag, which is as default `'en-US'`. optional
 * @param options.parser - the path language parser, default {@linkcode pathLanguageParser}, optional
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if the language in the path, that is not a well-formed BCP 47 language tag.
 *
 * @returns The locale that resolved from path
 */
export function getPathLocale(
  request: Request,
  { lang = DEFAULT_LANG_TAG, parser = pathLanguageParser }: PathOptions = {}
): Intl.Locale {
  return _getPathLocale(new URL(request.url), { lang, parser })
}

/**
 * try to get the locale from the path
 *
 * @description Unlike {@linkcode getPathLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param request - the {@link Request | request}
 * @param options.lang - the language tag, which is as default `'en-US'`. optional
 * @param options.parser - the path language parser, default {@linkcode pathLanguageParser}, optional
 *
 * @returns The locale that resolved from path. if the language in the path, that is not a well-formed BCP 47 language tag, return `null`.
 */
export function tryPathLocale(
  request: Request,
  { lang = DEFAULT_LANG_TAG, parser = pathLanguageParser }: PathOptions = {}
): Intl.Locale | null {
  try {
    return getPathLocale(request, { lang, parser })
  } catch {
    return null
  }
}

/**
 * get the locale from the query
 *
 * @param request - the {@link Request | request}
 * @param options.lang - the language tag, which is as default `'en-US'`. optional
 * @param options.name - the query param name, default `'locale'`. optional
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if the language in the query, that is not a well-formed BCP 47 language tag.
 *
 * @returns The locale that resolved from query
 */
export function getQueryLocale(
  request: Request,
  { lang = DEFAULT_LANG_TAG, name = 'locale' }: QueryOptions = {}
): Intl.Locale {
  return _getQueryLocale(new URL(request.url), { lang, name })
}

/**
 * try to get the locale from the query
 *
 * @description Unlike {@linkcode getQueryLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param request - the {@link Request | request}
 * @param options.lang - the language tag, which is as default `'en-US'`. optional
 * @param options.name - the query param name, default `'locale'`. optional
 *
 * @returns The locale that resolved from query. if the language in the query, that is not a well-formed BCP 47 language tag, return `null`.
 */
export function tryQueryLocale(
  request: Request,
  { lang = DEFAULT_LANG_TAG, name = 'locale' }: QueryOptions = {}
): Intl.Locale | null {
  try {
    return getQueryLocale(request, { lang, name })
  } catch {
    return null
  }
}

/**
 * get navigator languages
 *
 * @description
 * The value depends on the environments. if you use this function on the browser, you can get the languages, that are set in the browser, else if you use this function on the server side (Deno only), that value is the languages set in the server.
 *
 * @throws {TypeError} Throws the {@linkcode TypeError} if the `navigator` is not exists.
 *
 * @returns The array of language tags
 */
function getNavigatorLanguages(): readonly string[] {
  if (typeof navigator === 'undefined') {
    throw new TypeError('not support `navigator`')
  }
  return navigator.languages
}

/**
 * get navigator language
 *
 * @description
 * The value depends on the environments. if you use this function on the browser, you can get the languages, that are set in the browser, else if you use this function on the server side (Deno only), that value is the language set in the server.
 *
 * @throws {TypeError} Throws the {@link TypeError} if the `navigator` is not exists.
 *
 * @returns The language tag
 */
function getNavigatorLanguage(): string {
  if (typeof navigator === 'undefined') {
    throw new TypeError('not support `navigator`')
  }
  return navigator.language
}

/**
 * get navigator locales
 *
 * @description
 * This function is a wrapper that maps in {@linkcode Intl.Locale} in `navigator.languages`.
 * This function return values depends on the environments. if you use this function on the browser, you can get the languages, that are set in the browser, else if you use this function on the server side (Deno only), that value is the languages set in the server.
 *
 * @returns The array of {@link Intl.Locale | locales}
 */
export function getNavigatorLocales(): readonly Intl.Locale[] {
  return getNavigatorLanguages().map(lang => new Intl.Locale(lang))
}

/**
 * get navigator locale
 *
 * @description
 * This function is the {@linkcode Intl.Locale} wrapper of `navigator.language`.
 * The value depends on the environments. if you use this function on the browser, you can get the languages, that are set in the browser, else if you use this function on the server side (Deno only), that value is the language set in the server.
 *
 * @returns The {@link Intl.Locale | locale}
 */
export function getNavigatorLocale(): Intl.Locale {
  return new Intl.Locale(getNavigatorLanguage())
}
