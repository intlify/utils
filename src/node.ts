import { IncomingMessage, OutgoingMessage } from 'node:http'
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
import { normalizeLanguageName } from './shared.ts'

import type { CookieOptions, HeaderOptions } from './http.ts'

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
  {
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader,
  }: HeaderOptions = {},
): string[] {
  const getter = () => request.headers[name] as string | undefined
  return getHeaderLanguagesWithGetter(getter, { name, parser })
}

/**
 * get language from header
 *
 * @description parse header string, default `accept-language`. if you use `accept-language`, this function retuns the **first language tag** of `accept-language` header.
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
 *
 * @returns {Array<Intl.Locale>} The locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLocales(
  request: IncomingMessage,
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
  { lang = DEFAULT_LANG_TAG, name = DEFAULT_COOKIE_NAME } = {},
): Intl.Locale {
  const getter = () => {
    const cookieRaw = request.headers.cookie
    const cookie = parse(cookieRaw || '')
    return cookie[name] || lang
  }
  return getLocaleWithGetter(getter)
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
  options: CookieOptions = { name: DEFAULT_COOKIE_NAME },
): void {
  validateLocale(locale)
  const setCookies = getExistCookies(
    options.name!,
    () => response.getHeader('set-cookie'),
  )
  const target = serialize(options.name!, locale.toString(), {
    path: '/',
    ...options,
  })
  response.setHeader('set-cookie', [...setCookies, target])
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
export function getNavigatorLanguages(): readonly string[] {
  if (navigatorLanguages && navigatorLanguages.length > 0) {
    return navigatorLanguages
  }

  const env = process.env
  const langs = new Set<string>()

  env.LC_ALL && langs.add(normalizeLanguageName(env.LC_ALL))
  env.LC_MESSAGES && langs.add(normalizeLanguageName(env.LC_MESSAGES))
  env.LANG && langs.add(normalizeLanguageName(env.LANG))
  env.LANGUAGE && langs.add(normalizeLanguageName(env.LANGUAGE))

  return navigatorLanguages = [...langs].filter(Boolean)
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
  return getNavigatorLanguages().map((lang) => new Intl.Locale(lang))
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
        LANGUAGE: 'en',
      })

      const values = [
        'en-GB',
        'en-US',
        'ja-JP',
        'en',
      ]
      expect(getNavigatorLanguages()).toEqual(values)
      // cache checking
      expect(navigatorLanguages).toEqual(values)
    })

    test('duplicate language', () => {
      vi.spyOn(process, 'env', 'get').mockReturnValue({
        LC_ALL: 'en-US',
        LC_MESSAGES: 'en-US',
        LANG: 'ja-JP',
        LANGUAGE: 'ja-JP',
      })

      const values = [
        'en-US',
        'ja-JP',
      ]
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
        LANGUAGE: 'en',
      })

      const values = [
        'en-GB',
        'en-US',
        'ja-JP',
        'en',
      ]
      expect(getNavigatorLocales().map((locale) => locale.toString())).toEqual([
        'en-GB',
        'en-US',
        'ja-JP',
        'en',
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
 * @returns {string} {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 language tag}, if you can't get the language tag, return a enmpty string.
 */
export function getNavigatorLanguage(): string {
  return navigatorLanguage ||
    (navigatorLanguage = getNavigatorLanguages()[0] || '')
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
        LANGUAGE: 'en',
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
        LANGUAGE: 'ja-JP',
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
        LANGUAGE: 'en',
      })

      expect(getNavigatorLocale().toString()).toEqual('en-GB')
      // cache checking
      expect(navigatorLanguage).toEqual('en-GB')
    })
  })
}
