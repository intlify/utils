import { ACCEPT_LANGUAGE_HEADER, DEFAULT_COOKIE_NAME, DEFAULT_LANG_TAG } from './constants.ts'
import {
  getHeaderLanguagesWithGetter,
  getLocaleWithGetter,
  getPathLocale as _getPathLocale,
  getQueryLocale as _getQueryLocale,
  mapToLocaleFromLanguageTag,
  parseDefaultHeader,
  validateLocale,
} from './http.ts'
import { pathLanguageParser } from './shared.ts'
import { getCookie, setCookie } from 'hono/cookie'

import type { Context } from 'hono'
import type { HeaderOptions, PathOptions, QueryOptions } from './http.ts'

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
 * @param {Context} context A {@link Context | Hono} context
 * @param {HeaderOptions['name']} options.name A header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser A parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {Array<string>} An array of language tags, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLanguages(context: Context, {
  name = ACCEPT_LANGUAGE_HEADER,
  parser = parseDefaultHeader,
}: HeaderOptions = {}): string[] {
  return getHeaderLanguagesWithGetter(() => context.req.header(name), {
    name,
    parser,
  })
}

/**
 * get language from header
 *
 * @description parse header string, default `accept-language`. if you use `accept-language`, this function retuns the **first language tag** of `accept-language` header.
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
 * @param {Context} context A {@link Context | Hono} context
 * @param {HeaderOptions['name']} options.name A header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser A parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {string} A **first language tag** of header, if header is not exists, or `*` (any language), return empty string.
 */
export function getHeaderLanguage(context: Context, {
  name = ACCEPT_LANGUAGE_HEADER,
  parser = parseDefaultHeader,
}: HeaderOptions = {}): string {
  return getHeaderLanguages(context, { name, parser })[0] || ''
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
 * @param {Context} context A {@link Context | Hono} context
 * @param {HeaderOptions['name']} options.name A header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser A parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @throws {RangeError} Throws the {@link RangeError} if header are not a well-formed BCP 47 language tag.
 *
 * @returns {Array<Intl.Locale>} Some locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.
 */
export function getHeaderLocales(
  context: Context,
  {
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader,
  }: HeaderOptions = {},
): Intl.Locale[] {
  return mapToLocaleFromLanguageTag(getHeaderLanguages, context, {
    name,
    parser,
  })
}

/**
 * try to get locales from header
 *
 * @description wrap language tags with {@link Intl.Locale | locale}, languages tags will be parsed from `accept-language` header as default. Unlike {@link getHeaderLocales}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param {Context} context A {@link Context | Hono} context
 * @param {HeaderOptions['name']} options.name A header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser A parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {Array<Intl.Locale> | null} Some locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array. if header are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryHeaderLocales(
  context: Context,
  {
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader,
  }: HeaderOptions = {},
): Intl.Locale[] | null {
  try {
    return getHeaderLocales(context, { name, parser })
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
 * @param {Context} context A {@link Context | Hono} context
 * @param {string} options.lang A default language tag, Optional. default value is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param {HeaderOptions['name']} options.name A header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser A parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @throws {RangeError} Throws the {@link RangeError} if `lang` option or header are not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} A first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`.
 */
export function getHeaderLocale(
  context: Context,
  {
    lang = DEFAULT_LANG_TAG,
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader,
  }: HeaderOptions & { lang?: string } = {},
): Intl.Locale {
  return getLocaleWithGetter(() => getHeaderLanguages(context, { name, parser })[0] || lang)
}

/**
 * try to get locale from header
 *
 * @description wrap language tag with {@link Intl.Locale | locale}, languages tags will be parsed from `accept-language` header as default. Unlike {@link getHeaderLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param {Context} context A {@link Context | Hono} context
 * @param {string} options.lang A default language tag, Optional. default value is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param {HeaderOptions['name']} options.name A header name, which is as default `accept-language`.
 * @param {HeaderOptions['parser']} options.parser A parser function, which is as default {@link parseDefaultHeader}. If you are specifying more than one in your own format, you need a parser.
 *
 * @returns {Intl.Locale | null} A first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`. if `lang` option or header are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryHeaderLocale(
  context: Context,
  {
    lang = DEFAULT_LANG_TAG,
    name = ACCEPT_LANGUAGE_HEADER,
    parser = parseDefaultHeader,
  }: HeaderOptions & { lang?: string } = {},
): Intl.Locale | null {
  try {
    return getHeaderLocale(context, { lang, name, parser })
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
 * @param {Context} context A {@link Context | Hono} context
 * @param {string} options.lang A default language tag, default is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param {string} options.name A cookie name, default is `i18n_locale`
 *
 * @throws {RangeError} Throws a {@link RangeError} if `lang` option or cookie name value are not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The locale that resolved from cookie
 */
export function getCookieLocale(
  context: Context,
  { lang = DEFAULT_LANG_TAG, name = DEFAULT_COOKIE_NAME } = {},
): Intl.Locale {
  return getLocaleWithGetter(() => getCookie(context, name) || lang)
}

/**
 * try to get locale from cookie
 *
 * @description Unlike {@link getCookieLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param {Context} context A {@link Context | Hono} context
 * @param {string} options.lang A default language tag, default is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 * @param {string} options.name A cookie name, default is `i18n_locale`
 *
 * @returns {Intl.Locale | null} The locale that resolved from cookie, if `lang` option or cookie name value are not a well-formed BCP 47 language tag, return `null`.
 */
export function tryCookieLocale(
  context: Context,
  { lang = DEFAULT_LANG_TAG, name = DEFAULT_COOKIE_NAME } = {},
): Intl.Locale | null {
  try {
    return getCookieLocale(context, { lang, name })
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
 * @param {Context} context A {@link Context | Hono} context
 * @param {string | Intl.Locale} locale A locale value
 * @param {CookieOptions} options A cookie options, `name` option is `i18n_locale` as default, and `path` option is `/` as default.
 *
 * @throws {SyntaxError} Throws the {@link SyntaxError} if `locale` is invalid.
 */
export function setCookieLocale(
  context: Context,
  locale: string | Intl.Locale,
  options: CookieOptions = { name: DEFAULT_COOKIE_NAME },
): void {
  validateLocale(locale)
  setCookie(context, options.name!, locale.toString(), options)
}

/**
 * get the locale from the path
 *
 * @param {Context} context A {@link Context | Hono} context
 * @param {PathOptions['lang']} options.lang A language tag, which is as default `'en-US'`. optional
 * @param {PathOptions['parser']} options.parser the path language parser, default {@link pathLanguageParser}, optional
 *
 * @throws {RangeError} Throws the {@link RangeError} if the language in the path, that is not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The locale that resolved from path
 */
export function getPathLocale(
  context: Context,
  { lang = DEFAULT_LANG_TAG, parser = pathLanguageParser }: PathOptions = {},
): Intl.Locale {
  return _getPathLocale(new URL(context.req.url), { lang, parser })
}

/**
 * try to get the locale from the path
 *
 * @description Unlike {@link getPathLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param {Context} context A {@link Context | Hono} context
 * @param {PathOptions['lang']} options.lang A language tag, which is as default `'en-US'`. optional
 * @param {PathOptions['parser']} options.parser the path language parser, default {@link pathLanguageParser}, optional
 *
 * @returns {Intl.Locale | null} The locale that resolved from path. if the language in the path, that is not a well-formed BCP 47 language tag, return `null`.
 */
export function tryPathLocale(
  context: Context,
  { lang = DEFAULT_LANG_TAG, parser = pathLanguageParser }: PathOptions = {},
): Intl.Locale | null {
  try {
    return getPathLocale(context, { lang, parser })
  } catch {
    return null
  }
}

/**
 * get the locale from the query
 *
 * @param {Context} context A {@link Context | Hono} context
 * @param {QueryOptions['lang']} options.lang A language tag, which is as default `'en-US'`. optional
 * @param {QueryOptions['name']} options.name A query param name, default `'locale'`. optional
 *
 * @throws {RangeError} Throws the {@link RangeError} if the language in the query, that is not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The locale that resolved from query
 */
export function getQueryLocale(
  context: Context,
  { lang = DEFAULT_LANG_TAG, name = 'locale' }: QueryOptions = {},
): Intl.Locale {
  return _getQueryLocale(new URL(context.req.url), { lang, name })
}

/**
 * try to get the locale from the query
 *
 * @description Unlike {@link getQueryLocale}, this function does not throw an error if the locale cannot be obtained, this function returns `null`.
 *
 * @param {Context} context A {@link Context | Hono} context
 * @param {QueryOptions['lang']} options.lang A language tag, which is as default `'en-US'`. optional
 * @param {QueryOptions['name']} options.name A query param name, default `'locale'`. optional
 *
 * @returns {Intl.Locale | null} The locale that resolved from query. if the language in the query, that is not a well-formed BCP 47 language tag, return `null`.
 */
export function tryQueryLocale(
  context: Context,
  { lang = DEFAULT_LANG_TAG, name = 'locale' }: QueryOptions = {},
): Intl.Locale | null {
  try {
    return getQueryLocale(context, { lang, name })
  } catch {
    return null
  }
}
