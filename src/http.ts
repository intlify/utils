/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { ACCEPT_LANGUAGE_HEADER, DEFAULT_LANG_TAG } from './constants.ts'
import {
  isLocale,
  isURL,
  isURLSearchParams,
  parseAcceptLanguage,
  pathLanguageParser,
  toLocale,
  validateLangTag
} from './shared.ts'

import type { PathLanguageParser } from './shared.ts'
// import type { CookieSerializeOptions } from 'cookie-es'
// NOTE: This is a copy of the type definition from `cookie-es` package, we want to avoid building error for this type definition ...

interface CookieSerializeOptions {
  /**
   * Specifies the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.3|Domain Set-Cookie attribute}. By default, no
   * domain is set, and most clients will consider the cookie to apply to only
   * the current domain.
   */
  domain?: string | undefined
  /**
   * Specifies a function that will be used to encode a cookie's value. Since
   * value of a cookie has a limited character set (and must be a simple
   * string), this function can be used to encode a value into a string suited
   * for a cookie's value.
   *
   * The default function is the global `encodeURIComponent`, which will
   * encode a JavaScript string into UTF-8 byte sequences and then URL-encode
   * any that fall outside of the cookie range.
   */
  encode?(value: string): string
  /**
   * Specifies the `Date` object to be the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.1|`Expires` `Set-Cookie` attribute}. By default,
   * no expiration is set, and most clients will consider this a "non-persistent cookie" and will delete
   * it on a condition like exiting a web browser application.
   *
   * Note* the {@link https://tools.ietf.org/html/rfc6265#section-5.3|cookie storage model specification}
   * states that if both `expires` and `maxAge` are set, then `maxAge` takes precedence, but it is
   * possible not all clients by obey this, so if both are set, they should
   * point to the same date and time.
   */
  expires?: Date | undefined
  /**
   * Specifies the boolean value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.6|`HttpOnly` `Set-Cookie` attribute}.
   * When truthy, the `HttpOnly` attribute is set, otherwise it is not. By
   * default, the `HttpOnly` attribute is not set.
   *
   * Note* be careful when setting this to true, as compliant clients will
   * not allow client-side JavaScript to see the cookie in `document.cookie`.
   */
  httpOnly?: boolean | undefined
  /**
   * Specifies the number (in seconds) to be the value for the `Max-Age`
   * `Set-Cookie` attribute. The given number will be converted to an integer
   * by rounding down. By default, no maximum age is set.
   *
   * Note* the {@link https://tools.ietf.org/html/rfc6265#section-5.3|cookie storage model specification}
   * states that if both `expires` and `maxAge` are set, then `maxAge` takes precedence, but it is
   * possible not all clients by obey this, so if both are set, they should
   * point to the same date and time.
   */
  maxAge?: number | undefined
  /**
   * Specifies the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.4|`Path` `Set-Cookie` attribute}.
   * By default, the path is considered the "default path".
   */
  path?: string | undefined
  /**
   * Specifies the `string` to be the value for the [`Priority` `Set-Cookie` attribute][rfc-west-cookie-priority-00-4.1].
   *
   * - `'low'` will set the `Priority` attribute to `Low`.
   * - `'medium'` will set the `Priority` attribute to `Medium`, the default priority when not set.
   * - `'high'` will set the `Priority` attribute to `High`.
   *
   * More information about the different priority levels can be found in
   * [the specification][rfc-west-cookie-priority-00-4.1].
   *
   * **note** This is an attribute that has not yet been fully standardized, and may change in the future.
   * This also means many clients may ignore this attribute until they understand it.
   */
  priority?: 'low' | 'medium' | 'high' | undefined
  /**
   * Specifies the boolean or string to be the value for the {@link https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7|`SameSite` `Set-Cookie` attribute}.
   *
   * - `true` will set the `SameSite` attribute to `Strict` for strict same
   * site enforcement.
   * - `false` will not set the `SameSite` attribute.
   * - `'lax'` will set the `SameSite` attribute to Lax for lax same site
   * enforcement.
   * - `'strict'` will set the `SameSite` attribute to Strict for strict same
   * site enforcement.
   *  - `'none'` will set the SameSite attribute to None for an explicit
   *  cross-site cookie.
   *
   * More information about the different enforcement levels can be found in {@link https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7|the specification}.
   *
   * note* This is an attribute that has not yet been fully standardized, and may change in the future. This also means many clients may ignore this attribute until they understand it.
   */
  sameSite?: true | false | 'lax' | 'strict' | 'none' | undefined
  /**
   * Specifies the boolean value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.5|`Secure` `Set-Cookie` attribute}. When truthy, the
   * `Secure` attribute is set, otherwise it is not. By default, the `Secure` attribute is not set.
   *
   * Note* be careful when setting this to `true`, as compliant clients will
   * not send the cookie back to the server in the future if the browser does
   * not have an HTTPS connection.
   */
  secure?: boolean | undefined
}

/**
 * Cookie options type
 */
export type CookieOptions = CookieSerializeOptions & {
  /**
   * Cookie name
   */
  name?: string
}

/**
 * Header options type
 */
export type HeaderOptions = {
  /**
   * Header name
   */
  name?: string
  /**
   * Header parser function
   */
  parser?: typeof parseAcceptLanguage
}

/**
 * default header parser
 *
 * @param input - the header string
 *
 * @returns The array that include the input string
 */
export function parseDefaultHeader(input: string): string[] {
  return [input]
}

/**
 * get languages from header with getter function
 *
 * @param getter - the header string getter function
 *
 * @returns The array of language tags
 */
export function getHeaderLanguagesWithGetter(
  getter: () => string | null | undefined,
  { name = ACCEPT_LANGUAGE_HEADER, parser = parseDefaultHeader }: HeaderOptions = {}
): string[] {
  const langString = getter()
  return langString
    ? name === ACCEPT_LANGUAGE_HEADER
      ? parser === parseDefaultHeader
        ? parseAcceptLanguage(langString)
        : parser(langString)
      : parser(langString)
    : []
}

/**
 * get locale from language tag with getter function
 *
 * @param getter - the language tag getter function
 *
 * @returns The {@link Intl.Locale} object
 */
export function getLocaleWithGetter(getter: () => string): Intl.Locale {
  return toLocale(getter())
}

/**
 * validate the locale
 *
 * @param locale - the locale to validate
 *
 * @throws {SyntaxError} Throws the {@linkcode SyntaxError} if the locale is invalid.
 */
export function validateLocale(locale: string | Intl.Locale): void {
  if (!(isLocale(locale) || (typeof locale === 'string' && validateLangTag(locale)))) {
    throw new SyntaxError(`locale is invalid: ${locale.toString()}`)
  }
}

/**
 * map to locale from language tag with getter function
 *
 * @param getter - the language tag getter function
 * @param args - the arguments for the getter function
 *
 * @returns The array of {@linkcode Intl.Locale} objects
 */
export function mapToLocaleFromLanguageTag(
  getter: (...args: unknown[]) => string[],
  ...args: unknown[]
): Intl.Locale[] {
  return Reflect.apply(getter, null, args).map(lang => getLocaleWithGetter(() => lang))
}

/**
 * get existing cookies by name with getter function
 *
 * @param name - cookie name
 * @param getter - cookie getter function
 *
 * @returns The array of existing cookies
 */
export function getExistCookies(name: string, getter: () => unknown) {
  let setCookies = getter()
  if (!Array.isArray(setCookies)) {
    setCookies = [setCookies]
  }
  setCookies = (setCookies as string[]).filter(
    (cookieValue: string) => cookieValue && !cookieValue.startsWith(name + '=')
  )
  return setCookies as string[]
}

/**
 * path options type
 */
export type PathOptions = {
  /**
   * The language tag, which is as default `'en-US'`. optional
   */
  lang?: string
  /**
   * The path language parser, optional
   */
  parser?: PathLanguageParser
}

/**
 * get the language from the path
 *
 * @param path - the target path
 * @param options.lang - the language tag, which is as default `'en-US'`. optional
 * @param options.parser - the path language parser, optional
 *
 * @returns the language that is parsed by the path language parser, if the language is not detected, return a `options.lang` value
 */
export function getPathLanguage(
  path: string | URL,
  { lang = DEFAULT_LANG_TAG, parser = pathLanguageParser }: PathOptions = {}
): string {
  return (parser || pathLanguageParser)(path) || lang
}

/**
 * get the locale from the path
 *
 * @param path - the target path
 * @param options.lang - the language tag, which is as default `'en-US'`. optional
 * @param options.parser - the path language parser, optional
 *
 * @throws {RangeError} Throws the {@link RangeError} if the language in the path, that is not a well-formed BCP 47 language tag.
 *
 * @returns The locale that resolved from path
 */
export function getPathLocale(
  path: string | URL,
  { lang = DEFAULT_LANG_TAG, parser = pathLanguageParser }: PathOptions = {}
): Intl.Locale {
  return new Intl.Locale(getPathLanguage(path, { lang, parser }))
}

function getURLSearchParams(input: string | URL | URLSearchParams): URLSearchParams {
  if (isURLSearchParams(input)) {
    return input
  } else if (isURL(input)) {
    return input.searchParams
  } else {
    return new URLSearchParams(input)
  }
}

/**
 * query options type
 */
export type QueryOptions = {
  /**
   * The language tag, which is as default `'en-US'`. optional
   */
  lang?: string
  /**
   * The query param name, default `'lang'`. optional
   */
  name?: string
}

/**
 * get the language from the query
 *
 * @param query - the target query
 * @param options.lang - the language tag, which is as default `'en-US'`. optional
 * @param options.name - the query param name, default `'lang'`. optional
 *
 * @returns the language from query, if the language is not detected, return an `options.lang` option string.
 */
export function getQueryLanguage(
  query: string | URL | URLSearchParams,
  { lang = DEFAULT_LANG_TAG, name = 'lang' }: QueryOptions = {}
): string {
  const queryParams = getURLSearchParams(query)
  return queryParams.get(name) || lang
}

/**
 * get the locale from the query
 *
 * @param query - the target query
 * @param options.lang - the language tag, which is as default `'en-US'`. optional
 * @param options.name - the query param name, default `'locale'`. optional
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if the language in the query, that is not a well-formed BCP 47 language tag.
 *
 * @returns The locale that resolved from query
 */
export function getQueryLocale(
  query: string | URL | URLSearchParams,
  { lang = DEFAULT_LANG_TAG, name = 'locale' }: QueryOptions = {}
): Intl.Locale {
  return new Intl.Locale(getQueryLanguage(query, { lang, name }))
}
