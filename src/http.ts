import {
  isLocale,
  parseAcceptLanguage,
  pathLanguageParser,
  validateLanguageTag,
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
   * *Note* the {@link https://tools.ietf.org/html/rfc6265#section-5.3|cookie storage model specification}
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
   * *Note* be careful when setting this to true, as compliant clients will
   * not allow client-side JavaScript to see the cookie in `document.cookie`.
   */
  httpOnly?: boolean | undefined
  /**
   * Specifies the number (in seconds) to be the value for the `Max-Age`
   * `Set-Cookie` attribute. The given number will be converted to an integer
   * by rounding down. By default, no maximum age is set.
   *
   * *Note* the {@link https://tools.ietf.org/html/rfc6265#section-5.3|cookie storage model specification}
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
   * *note* This is an attribute that has not yet been fully standardized, and may change in the future. This also means many clients may ignore this attribute until they understand it.
   */
  sameSite?: true | false | 'lax' | 'strict' | 'none' | undefined
  /**
   * Specifies the boolean value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.5|`Secure` `Set-Cookie` attribute}. When truthy, the
   * `Secure` attribute is set, otherwise it is not. By default, the `Secure` attribute is not set.
   *
   * *Note* be careful when setting this to `true`, as compliant clients will
   * not send the cookie back to the server in the future if the browser does
   * not have an HTTPS connection.
   */
  secure?: boolean | undefined
}

export type CookieOptions = CookieSerializeOptions & { name?: string }

export function getAcceptLanguagesWithGetter(
  getter: () => string | null | undefined,
): string[] {
  const acceptLanguage = getter()
  return acceptLanguage ? parseAcceptLanguage(acceptLanguage) : []
}

export function getLocaleWithGetter(getter: () => string): Intl.Locale {
  return new Intl.Locale(getter())
}

export function validateLocale(locale: string | Intl.Locale): void {
  if (
    !(isLocale(locale) ||
      typeof locale === 'string' && validateLanguageTag(locale))
  ) {
    throw new SyntaxError(`locale is invalid: ${locale.toString()}`)
  }
}

export function mapToLocaleFromLanguageTag(
  // deno-lint-ignore no-explicit-any
  getter: (...args: any[]) => string[],
  arg: unknown,
): Intl.Locale[] {
  return (Reflect.apply(getter, null, [arg]) as string[]).map((lang) =>
    getLocaleWithGetter(() => lang)
  )
}

export function getExistCookies(
  name: string,
  getter: () => unknown,
) {
  let setCookies = getter()
  if (!Array.isArray(setCookies)) {
    setCookies = [setCookies]
  }
  setCookies = (setCookies as string[]).filter((cookieValue: string) =>
    cookieValue && !cookieValue.startsWith(name + '=')
  )
  return setCookies as string[]
}

/**
 * get the language from the path
 *
 * @param {string} path the target path
 * @param {PathLanguageParser} parser the path language parser, optional
 *
 * @returns {string} the language that is parsed by the path language parser
 */
export function getPathLanguage(
  path: string,
  parser?: PathLanguageParser,
): string {
  const _parser = parser || pathLanguageParser
  return _parser.parse(path)
}

/**
 * get the locale from the path
 *
 * @param {string} path the target path
 * @param {PathLanguageParser} parser the path language parser, optional
 *
 * @throws {RangeError} Throws the {@link RangeError} if the language in the path, that is not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The locale that resolved from path
 */
export function getPathLocale(
  path: string,
  parser?: PathLanguageParser,
): Intl.Locale {
  return new Intl.Locale(getPathLanguage(path, parser))
}
