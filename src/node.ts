import { IncomingMessage, OutgoingMessage } from 'node:http'
import { parse, serialize } from 'cookie-es'
import {
  getAcceptLanguagesWithGetter,
  getExistCookies,
  getLocaleWithGetter,
  mapToLocaleFromLanguageTag,
  validateLocale,
} from './http.ts'
import { normalizeLanguageName } from './shared.ts'
import { DEFAULT_COOKIE_NAME, DEFAULT_LANG_TAG } from './constants.ts'

import type { CookieOptions } from './http.ts'

/**
 * get accpet languages
 *
 * @description parse `accept-language` header string
 *
 * @example
 * example for Node.js request:
 *
 * ```ts
 * import { createServer } from 'node:http'
 * import { getAcceptLanguages } from '@intlify/utils/node'
 *
 * const server = createServer((req, res) => {
 *   const langTags = getAcceptLanguages(req)
 *   // ...
 *   res.writeHead(200)
 *   res.end(`detect accpect-languages: ${langTags.join(', ')}`)
 * })
 * ```
 *
 * @param {IncomingMessage} request The {@link IncomingMessage | request}
 *
 * @returns {Array<string>} The array of language tags, if `*` (any language) or empty string is detected, return an empty array.
 */
export function getAcceptLanguages(request: IncomingMessage): string[] {
  const getter = () => request.headers['accept-language']
  return getAcceptLanguagesWithGetter(getter)
}

/**
 * get accept language
 *
 * @description parse `accept-language` header string, this function retuns the **first language tag** of `accept-language` header.
 *
 * @example
 * example for Node.js request:
 *
 * ```ts
 * import { createServer } from 'node:http'
 * import { getAcceptLanguage } from '@intlify/utils/node'
 *
 * const server = createServer((req, res) => {
 *   const langTag = getAcceptLanguage(req)
 *   // ...
 *   res.writeHead(200)
 *   res.end(`detect accpect-language: ${langTag}`)
 * })
 * ```
 *
 * @param {IncomingMessage} request The {@link IncomingMessage | request}
 *
 * @returns {string} The **first language tag** of `accept-language` header, if `accept-language` header is not exists, or `*` (any language), return empty string.
 */
export function getAcceptLanguage(request: IncomingMessage): string {
  return getAcceptLanguages(request)[0] || ''
}

/**
 * get locales from `accept-language` header
 *
 * @description wrap language tags with {@link Intl.Locale | locale}
 *
 * @example
 * example for Node.js request:
 *
 * ```ts
 * import { createServer } from 'node:http'
 * import { getAcceptLocales } from '@intlify/utils/node'
 *
 * const server = createServer((req, res) => {
 *   const locales = getAcceptLocales(req)
 *   // ...
 *   res.writeHead(200)
 *   res.end(`accpected locales: ${locales.map(locale => locale.toString()).join(', ')}`)
 * })
 * ```
 *
 * @param {IncomingMessage} request The {@link IncomingMessage | request}
 *
 * @returns {Array<Intl.Locale>} The locales that wrapped from `accept-language` header, if `*` (any language) or empty string is detected, return an empty array.
 */
export function getAcceptLocales(
  request: IncomingMessage,
): Intl.Locale[] {
  return mapToLocaleFromLanguageTag(getAcceptLanguages, request)
}

/**
 * get locale from `accept-language` header
 *
 * @description wrap language tag with {@link Intl.Locale | locale}
 *
 * @example
 * example for Node.js request:
 *
 * ```ts
 * import { createServer } from 'node:http'
 * import { getAcceptLocale } from '@intlify/utils/node'
 *
 * const server = createServer((req, res) => {
 *   const locale = getAcceptLocale(req)
 *   // ...
 *   res.writeHead(200)
 *   res.end(`accpected locale: ${locale.toString()}`)
 * })
 * ```
 *
 * @param {IncomingMessage} request The {@link IncomingMessage | request}
 * @param {string} lang The default language tag, Optional. default value is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 *
 * @throws {RangeError} Throws the {@link RangeError} if `lang` option or `accpet-languages` are not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The first locale that resolved from `accept-language` header string, first language tag is used. if `*` (any language) or empty string is detected, return `en-US`.
 */
export function getAcceptLocale(
  request: IncomingMessage,
  lang = DEFAULT_LANG_TAG,
): Intl.Locale {
  return getLocaleWithGetter(() => getAcceptLanguages(request)[0] || lang)
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
 * in-source testing for `getNavigatorLanguage`
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
}
