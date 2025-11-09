/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { parse, serialize } from 'cookie-es'
import type { IncomingMessage, OutgoingMessage } from 'node:http'
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
import { normalizeLanguageName, pathLanguageParser } from './shared.ts'

import process from 'node:process'
import type { CookieOptions, HeaderOptions, PathOptions, QueryOptions } from './http.ts'

/**
 * get languages from header
 *
 * @description parse header string, default `accept-language` header
 *
 * @example
 * example for Node.js request:
 *
 * ```ts
 * import { createServer } from 'node:http'
 * import { getHeaderLanguages } from '@intlify/utils/node'
 *
 * const server = createServer((req, res) => {
 *   const langTags = getHeaderLanguages(req)
 *   // ...
 *   res.writeHead(200)
 *   res.end(`detect accpect-languages: ${langTags.join(', ')}`)
 * })
 * ```
 *
 * @param {IncomingMessage} request The {@link IncomingMessage | request}
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {Array<string>} The array of language tags, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLanguages(
  request: IncomingMessage,
  { name = ACCEPT_LANGUAGE_HEADER, parser = parseDefaultHeader }: HeaderOptions = {}
): string[] {
  const getter = () => request.headers[name] as string | undefined
  return getHeaderLanguagesWithGetter(getter, { name, parser })
}

/**
 * get language from header
 *
 * @description parse header string, default `accept-language`. if you use `accept-language`, this function returns the **first language tag** of `accept-language` header.
 *
 * @example
 * example for Node.js request:
 *
 * ```ts
 * import { createServer } from 'node:http'
 * import { getHeaderLanguage } from '@intlify/utils/node'
 *
 * const server = createServer((req, res) => {
 *   const langTag = getHeaderLanguage(req)
 *   // ...
 *   res.writeHead(200)
 *   res.end(`detect accpect-language: ${langTag}`)
 * })
 * ```
 *
 * @param {IncomingMessage} request The {@link IncomingMessage | request}
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {string} The **first language tag** of header, if header is not exists, or `*` (any language), return empty string.
 */
export function getHeaderLanguage(
  request: IncomingMessage,
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
 * example for Node.js request:
 *
 * ```ts
 * import { createServer } from 'node:http'
 * import { getHeaderLocales } from '@intlify/utils/node'
 *
 * const server = createServer((req, res) => {
 *   const locales = getHeaderLocales(req)
 *   // ...
 *   res.writeHead(200)
 *   res.end(`accpected locales: ${locales.map(locale => locale.toString()).join(', ')}`)
 * })
 * ```
 *
 * @param {IncomingMessage} request The {@link IncomingMessage | request}
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @throws {RangeError} Throws the {@link RangeError} if header are not a well-formed BCP 47 language tag.
 *
 * @returns {Array<Intl.Locale>} The locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLocales(
  request: IncomingMessage,
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
 * @param {IncomingMessage} request The {@link IncomingMessage | request}
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {Array<Intl.Locale> | null} The locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array. if header are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryHeaderLocales(
  request: IncomingMessage,
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
 * example for Node.js request:
 *
 * ```ts
 * import { createServer } from 'node:http'
 * import { getHeaderLocale } from '@intlify/utils/node'
 *
 * const server = createServer((req, res) => {
 *   const locale = getHeaderLocale(req)
 *   // ...
 *   res.writeHead(200)
 *   res.end(`accpected locale: ${locale.toString()}`)
 * })
 * ```
 *
 * @param {IncomingMessage} request The {@link IncomingMessage | request}
 * @param {string} options.lang The default language tag, Optional. default value is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @throws {RangeError} Throws the {@link RangeError} if `lang` option or header are not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`.
 */
export function getHeaderLocale(
  request: IncomingMessage,
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
 * @param {IncomingMessage} request The {@link IncomingMessage | request}
 * @param {string} options.lang The default language tag, Optional. default value is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param {HeaderOptions['name']} options.name The header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser The parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {Intl.Locale | null} The first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`. if `lang` option or header are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryHeaderLocale(
  request: IncomingMessage,
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
 * example for Node.js request:
 *
 * ```ts
 * import { createServer } from 'node:http'
 * import { getCookieLocale } from '@intlify/utils/node'
 *
 * const server = createServer((req, res) => {
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
  request: IncomingMessage,
  { lang = DEFAULT_LANG_TAG, name = DEFAULT_COOKIE_NAME } = {}
): Intl.Locale {
  const getter = () => {
    const cookieRaw = request.headers.cookie
    const cookie = parse(cookieRaw || '')
    return cookie[name] || lang
  }
  return getLocaleWithGetter(getter)
}

/**
 * try to get locale from cookie
 *
 * @description Unlike {@link getCookieLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param {IncomingMessage} request The {@link IncomingMessage | request}
 * @param {string} options.lang The default language tag, default is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param {string} options.name The cookie name, default is `i18n_locale`
 *
 * @returns {Intl.Locale | null} The locale that resolved from cookie. if `lang` option or cookie name value are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryCookieLocale(
  request: IncomingMessage,
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
 * example for Node.js response:
 *
 * ```ts
 * import { createServer } from 'node:http'
 * import { setCookieLocale } from '@intlify/utils/node'
 *
 * const server = createServer((req, res) => {
 *   setCookieLocale(res, 'ja-JP')
 *   // ...
 * })
 * ```
 *
 * @param {OutgoingMessage} response The {@link OutgoingMessage | response}
 * @param {string | Intl.Locale} locale The locale value
 * @param {CookieOptions} options The cookie options, `name` option is `i18n_locale` as default, and `path` option is `/` as default.
 *
 * @throws {SyntaxError} Throws the {@link SyntaxError} if `locale` is invalid.
 */
export function setCookieLocale(
  response: OutgoingMessage,
  locale: string | Intl.Locale,
  options: CookieOptions = { name: DEFAULT_COOKIE_NAME } // eslint-disable-line unicorn/no-object-as-default-parameter -- NOTE: allow
): void {
  validateLocale(locale)
  const setCookies = getExistCookies(options.name!, () => response.getHeader('set-cookie'))
  const target = serialize(options.name!, locale.toString(), {
    path: '/',
    ...options
  })
  response.setHeader('set-cookie', [...setCookies, target])
}

function getRequestProtocol(request: IncomingMessage, opts: { xForwardedProto?: boolean } = {}) {
  if (opts.xForwardedProto !== false && request.headers['x-forwarded-proto'] === 'https') {
    return 'https'
  }
  return (request.socket as { encrypted?: boolean }).encrypted ? 'https' : 'http'
}

function getRequestHost(request: IncomingMessage, opts: { xForwardedHost?: boolean } = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = request.headers['x-forwarded-host'] as string
    if (xForwardedHost) {
      return xForwardedHost
    }
  }
  return request.headers.host || 'localhost'
}

function getPath(request: IncomingMessage) {
  const raw = (request as { originalUrl?: string }).originalUrl || request.url || '/'
  return raw.replaceAll(/^[/\\]+/g, '/')
}

function getURL(request: IncomingMessage): URL {
  const protocol = getRequestProtocol(request)
  const host = getRequestHost(request)
  const path = getPath(request)
  return new URL(path, `${protocol}://${host}`)
}

/**
 * get the locale from the path
 *
 * @param {IncomingMessage} request the {@link IncomingMessage | request}
 * @param {PathOptions['lang']} options.lang the language tag, which is as default `'en-US'`. optional
 * @param {PathOptions['parser']} options.parser the path language parser, default {@link pathLanguageParser}, optional
 *
 * @throws {RangeError} Throws the {@link RangeError} if the language in the path, that is not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The locale that resolved from path
 */
export function getPathLocale(
  request: IncomingMessage,
  { lang = DEFAULT_LANG_TAG, parser = pathLanguageParser }: PathOptions = {}
): Intl.Locale {
  return _getPathLocale(getURL(request), { lang, parser })
}

/**
 * try to get the locale from the path
 *
 * @description Unlike {@link getPathLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param {IncomingMessage} request the {@link IncomingMessage | request}
 * @param {PathOptions['lang']} options.lang the language tag, which is as default `'en-US'`. optional
 * @param {PathOptions['parser']} options.parser the path language parser, default {@link pathLanguageParser}, optional
 *
 * @returns {Intl.Locale | null} The locale that resolved from path. if the language in the path, that is not a well-formed BCP 47 language tag, return `null`.
 */
export function tryPathLocale(
  request: IncomingMessage,
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
 * @param {IncomingMessage} request the {@link IncomingMessage | request}
 * @param {QueryOptions['lang']} options.lang the language tag, which is as default `'en-US'`. optional
 * @param {QueryOptions['name']} options.name the query param name, default `'locale'`. optional
 *
 * @throws {RangeError} Throws the {@link RangeError} if the language in the query, that is not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The locale that resolved from query
 */
export function getQueryLocale(
  request: IncomingMessage,
  { lang = DEFAULT_LANG_TAG, name = 'locale' }: QueryOptions = {}
): Intl.Locale {
  return _getQueryLocale(getURL(request), { lang, name })
}

/**
 * try to get the locale from the query
 *
 * @description Unlike {@link getQueryLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param {IncomingMessage} request the {@link IncomingMessage | request}
 * @param {QueryOptions['lang']} options.lang the language tag, which is as default `'en-US'`. optional
 * @param {QueryOptions['name']} options.name the query param name, default `'locale'`. optional
 *
 * @returns {Intl.Locale | null} The locale that resolved from query. if the language in the query, that is not a well-formed BCP 47 language tag, return `null`.
 */
export function tryQueryLocale(
  request: IncomingMessage,
  { lang = DEFAULT_LANG_TAG, name = 'locale' }: QueryOptions = {}
): Intl.Locale | null {
  try {
    return getQueryLocale(request, { lang, name })
  } catch {
    return null
  }
}

let navigatorLanguages: string[] | undefined

/**
 * get navigator languages
 *
 * @description
 * You can get the language tags from system environment variables.
 *
 * @returns {Array<string>} {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 language tags}, if you can't get the language tag, return an empty array.
 */
function getNavigatorLanguages(): readonly string[] {
  if (navigatorLanguages && navigatorLanguages.length > 0) {
    return navigatorLanguages
  }

  const env = process.env
  const langs = new Set<string>()

  if (env.LC_ALL) {
    langs.add(normalizeLanguageName(env.LC_ALL))
  }
  if (env.LC_MESSAGES) {
    langs.add(normalizeLanguageName(env.LC_MESSAGES))
  }
  if (env.LANG) {
    langs.add(normalizeLanguageName(env.LANG))
  }
  if (env.LANGUAGE) {
    langs.add(normalizeLanguageName(env.LANGUAGE))
  }

  return (navigatorLanguages = [...langs].filter(Boolean))
}

/**
 * get navigator locales
 *
 * @description
 * You can get some {@link Intl.Locale} from system environment variables.
 *
 * @returns {Array<Intl.Locale>}
 */
export function getNavigatorLocales(): readonly Intl.Locale[] {
  return getNavigatorLanguages().map(lang => new Intl.Locale(lang))
}

/**
 * in-source testing for `getNavigatorLanguages`
 */
if (import.meta.vitest) {
  const { describe, test, expect, afterEach, vi } = import.meta.vitest

  describe('getNavigatorLanguages', () => {
    afterEach(() => {
      vi.resetAllMocks()
      navigatorLanguages = undefined
    })

    test('basic', () => {
      vi.spyOn(process, 'env', 'get').mockReturnValue({
        LC_ALL: 'en-GB',
        LC_MESSAGES: 'en-US',
        LANG: 'ja-JP',
        LANGUAGE: 'en'
      })

      const values = ['en-GB', 'en-US', 'ja-JP', 'en']
      expect(getNavigatorLanguages()).toEqual(values)
      // cache checking
      expect(navigatorLanguages).toEqual(values)
    })

    test('duplicate language', () => {
      vi.spyOn(process, 'env', 'get').mockReturnValue({
        LC_ALL: 'en-US',
        LC_MESSAGES: 'en-US',
        LANG: 'ja-JP',
        LANGUAGE: 'ja-JP'
      })

      const values = ['en-US', 'ja-JP']
      expect(getNavigatorLanguages()).toEqual(values)
      // cache checking
      expect(navigatorLanguages).toEqual(values)
    })

    test('language nothing', () => {
      const mockEnv = vi.spyOn(process, 'env', 'get').mockReturnValue({})
      expect(getNavigatorLanguages()).toEqual([])
      expect(navigatorLanguages).toEqual([])
      expect(getNavigatorLanguages()).toEqual([])
      expect(mockEnv).toHaveBeenCalledTimes(2)
    })
  })

  describe('getNavigatorLocales', () => {
    afterEach(() => {
      vi.resetAllMocks()
      navigatorLanguages = undefined
    })

    test('basic', () => {
      vi.spyOn(process, 'env', 'get').mockReturnValue({
        LC_ALL: 'en-GB',
        LC_MESSAGES: 'en-US',
        LANG: 'ja-JP',
        LANGUAGE: 'en'
      })

      const values = ['en-GB', 'en-US', 'ja-JP', 'en']
      expect(getNavigatorLocales().map(locale => locale.toString())).toEqual([
        'en-GB',
        'en-US',
        'ja-JP',
        'en'
      ])
      // cache checking
      expect(navigatorLanguages).toEqual(values)
    })
  })
}

let navigatorLanguage = ''

/**
 * get navigator languages
 *
 * @description
 * You can get the language tag from system environment variables.
 *
 * @returns {string} {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 language tag}, if you can't get the language tag, return a empty string.
 */
function getNavigatorLanguage(): string {
  return navigatorLanguage || (navigatorLanguage = getNavigatorLanguages()[0] || '')
}

/**
 * get navigator locale
 *
 * @description
 * You can get the {@link Intl.Locale} from system environment variables.
 *
 * @returns {Intl.Locale}
 */
export function getNavigatorLocale(): Intl.Locale {
  return new Intl.Locale(getNavigatorLanguage())
}

/**
 * in-source testing for `getNavigatorLanguage` and `getNavigatorLocale`
 */
if (import.meta.vitest) {
  const { describe, test, expect, afterEach, vi } = import.meta.vitest

  describe('getNavigatorLanguage', () => {
    afterEach(() => {
      vi.resetAllMocks()
      navigatorLanguages = undefined
      navigatorLanguage = ''
    })

    test('basic', () => {
      vi.spyOn(process, 'env', 'get').mockReturnValue({
        LC_ALL: 'en-GB',
        LC_MESSAGES: 'en-US',
        LANG: 'ja-JP',
        LANGUAGE: 'en'
      })

      expect(getNavigatorLanguage()).toEqual('en-GB')
      // cache checking
      expect(navigatorLanguage).toEqual('en-GB')
    })

    test('duplicate language', () => {
      vi.spyOn(process, 'env', 'get').mockReturnValue({
        LC_ALL: 'en-US',
        LC_MESSAGES: 'en-US',
        LANG: 'ja-JP',
        LANGUAGE: 'ja-JP'
      })

      expect(getNavigatorLanguage()).toEqual('en-US')
      // cache checking
      expect(navigatorLanguage).toEqual('en-US')
    })

    test('language nothing', () => {
      const mockEnv = vi.spyOn(process, 'env', 'get').mockReturnValue({})
      expect(getNavigatorLanguage()).toBe('')
      expect(navigatorLanguage).toBe('')
      expect(getNavigatorLanguage()).toBe('')
      expect(mockEnv).toHaveBeenCalledTimes(2)
    })
  })

  describe('getNavigatorLocale', () => {
    afterEach(() => {
      vi.resetAllMocks()
      navigatorLanguages = undefined
      navigatorLanguage = ''
    })

    test('basic', () => {
      vi.spyOn(process, 'env', 'get').mockReturnValue({
        LC_ALL: 'en-GB',
        LC_MESSAGES: 'en-US',
        LANG: 'ja-JP',
        LANGUAGE: 'en'
      })

      expect(getNavigatorLocale().toString()).toEqual('en-GB')
      // cache checking
      expect(navigatorLanguage).toEqual('en-GB')
    })
  })
}
