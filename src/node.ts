import { IncomingMessage, OutgoingMessage } from 'node:http'
import { parse, serialize } from 'cookie-es'
import {
  getAcceptLanguagesWithGetter,
  getExistCookies,
  getLocaleWithGetter,
  validateLocale,
} from './http.ts'
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
 * get {@link Intl.Locale | locale} from `accept-language` header
 *
 * @description wrap with {@link Intl.Locale | locale}
 *
 * @example
 * example for Node.js request:
 *
 * ```ts
 * import { createServer } from 'node:http'
 * import { getLocale } from '@intlify/utils/node'
 *
 * const server = createServer((req, res) => {
 *   const locale = getLocale(req)
 *   console.log(locale) // output `Intl.Locale` instance
 *   // ...
 * })
 * ```
 *
 * @param {IncomingMessage} request The {@link IncomingMessage | request}
 * @param {string} lang The default language tag, default is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 *
 * @throws {RangeError} Throws a {@link RangeError} if `lang` option or `accpet-languages` are not a well-formed BCP 47 language tag.
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
 * @returns The locale that resolved from cookie
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
