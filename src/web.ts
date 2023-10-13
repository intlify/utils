import { parse, serialize } from 'cookie-es'
import {
  getExistCookies,
  getHeaderLanguagesWithGetter,
  getLocaleWithGetter,
  mapToLocaleFromLanguageTag,
  parseDefaultHeader,
  validateLocale,
} from './http.ts'
import {
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_COOKIE_NAME,
  DEFAULT_LANG_TAG,
} from './constants.ts'

import type { CookieOptions, HeaderOptions } from './http.ts'

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
 * @param {Request} request The {@link Request | request}
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {Array<string>} The array of language tags, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLanguages(
  request: Request,
  {
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader,
  }: HeaderOptions = {},
): string[] {
  const getter = () => request.headers.get(name)
  return getHeaderLanguagesWithGetter(getter, { name, parser })
}

/**
 * get language from header
 *
 * @description parse header string, default `accept-language`. if you use `accept-language`, this function retuns the **first language tag** of `accept-language` header.
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
 * @param {Request} request The {@link Request | request}
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {string} The **first language tag** of header, if header is not exists, or `*` (any language), return empty string.
 */
export function getHeaderLanguage(
  request: Request,
  {
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader,
  }: HeaderOptions = {},
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
 * @param {Request} request The {@link Request | request}
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {Array<Intl.Locale>} The locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLocales(
  request: Request,
  {
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader,
  }: HeaderOptions = {},
): Intl.Locale[] {
  return mapToLocaleFromLanguageTag(getHeaderLanguages, request, {
    name,
    parser,
  })
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
 * @param {Request} request The {@link Request | request}
 * @param {string} options.lang The default language tag, Optional. default value is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @throws {RangeError} Throws the {@link RangeError} if `lang` option or header are not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`.
 */
export function getHeaderLocale(
  request: Request,
  {
    lang = DEFAULT_LANG_TAG,
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader,
  }: HeaderOptions & { lang?: string } = {},
): Intl.Locale {
  return getLocaleWithGetter(() =>
    getHeaderLanguages(request, { name, parser })[0] || lang
  )
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
 * @param {IncomingMessage} request The {@link IncomingMessage | request}
 * @param {string} options.lang The default language tag, default is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param {string} options.name The cookie name, default is `i18n_locale`
 *
 * @throws {RangeError} Throws a {@link RangeError} if `lang` option or cookie name value are not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The locale that resolved from cookie
 */
export function getCookieLocale(
  request: Request,
  { lang = DEFAULT_LANG_TAG, name = DEFAULT_COOKIE_NAME } = {},
): Intl.Locale {
  const getter = () => {
    const cookieRaw = request.headers.get('cookie')
    const cookie = parse(cookieRaw || '')
    return cookie[name] || lang
  }
  return getLocaleWithGetter(getter)
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
 * @param {Response} response The {@link Response | response}
 * @param {string | Intl.Locale} locale The locale value
 * @param {CookieOptions} options The cookie options, `name` option is `i18n_locale` as default, and `path` option is `/` as default.
 *
 * @throws {SyntaxError} Throws the {@link SyntaxError} if `locale` is invalid.
 */
export function setCookieLocale(
  response: Response,
  locale: string | Intl.Locale,
  options: CookieOptions = { name: DEFAULT_COOKIE_NAME },
): void {
  validateLocale(locale)
  const setCookies = getExistCookies(
    options.name!,
    () => response.headers.getSetCookie(),
  )
  const target = serialize(options.name!, locale.toString(), {
    path: '/',
    ...options,
  })
  response.headers.set('set-cookie', [...setCookies, target].join('; '))
}

/**
 * get navigator languages
 *
 * @description
 * The value depends on the environments. if you use this function on the browser, you can get the languages, that are set in the browser, else if you use this function on the server side (Deno only), that value is the languages set in the server.
 *
 * @throws Throws the {@link Error} if the `navigator` is not exists.
 *
 * @returns {Array<string>} {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 language tags}
 */
export function getNavigatorLanguages(): readonly string[] {
  if (typeof navigator === 'undefined') {
    throw new Error('not support `navigator`')
  }
  return navigator.languages
}

/**
 * get navigator language
 *
 * @description
 * The value depends on the environments. if you use this function on the browser, you can get the languages, that are set in the browser, else if you use this function on the server side (Deno only), that value is the language set in the server.
 *
 * @throws Throws the {@link Error} if the `navigator` is not exists.
 *
 * @returns {string} {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 language tag}
 */
export function getNavigatorLanguage(): string {
  if (typeof navigator === 'undefined') {
    throw new Error('not support `navigator`')
  }
  return navigator.language
}

/**
 * get navigator locales
 *
 * @description
 * This function is a wrapper that maps in {@link Intl.Locale} in `navigator.languages`.
 * This function return values depends on the environments. if you use this function on the browser, you can get the languages, that are set in the browser, else if you use this function on the server side (Deno only), that value is the languages set in the server.
 *
 * @throws Throws the {@link Error} if the `navigator` is not exists.
 *
 * @returns {Array<Intl.Locale>}
 */
export function getNavigatorLocales(): readonly Intl.Locale[] {
  return getNavigatorLanguages().map((lang) => new Intl.Locale(lang))
}

/**
 * get navigator locale
 *
 * @description
 * This function is the {@link Intl.Locale} wrapper of `navigator.language`.
 * The value depends on the environments. if you use this function on the browser, you can get the languages, that are set in the browser, else if you use this function on the server side (Deno only), that value is the language set in the server.
 *
 * @throws Throws the {@link Error} if the `navigator` is not exists.
 *
 * @returns {Intl.Locale}
 */
export function getNavigatorLocale(): Intl.Locale {
  return new Intl.Locale(getNavigatorLanguage())
}
