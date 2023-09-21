import { parse } from 'cookie-es'
import { getAcceptLanguagesWithGetter, getLocaleWithGetter } from './http.ts'

/**
 * get accpet languages
 *
 * @description parse `accept-language` header string
 *
 * @example
 * example for Web API request on Deno:
 *
 * ```ts
 * import { getAcceptLanguages } from 'https://esm.sh/@intlify/utils/web'
 *
 * Deno.serve({
 *   port: 8080,
 * }, (req) => {
 *   const acceptLanguages = getAcceptLanguages(req)
 *   // ...
 *   return new Response('Hello World!')
 * })
 * ```
 *
 * @param {Request} request The {@link Request | request}
 *
 * @returns {Array<string>} The array of language tags, if `*` (any language) or empty string is detected, return an empty array.
 */
export function getAcceptLanguages(req: Request) {
  const getter = () => req.headers.get('accept-language')
  return getAcceptLanguagesWithGetter(getter)
}

/**
 * get locale
 *
 * @example
 * example for Web API request on Bun:
 *
 * import { getLocale } from '@intlify/utils/web'
 *
 * Bun.serve({
 *   port: 8080,
 *   fetch(req) {
 *     const locale = getLocale(req)
 *     console.log(locale) // output `Intl.Locale` instance
 *     // ...
 *   },
 * })
 *
 * @param {Request} request The {@link Request | request}
 * @param {string} lang The default language tag, default is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 *
 * @throws {RangeError} Throws a {@link RangeError} if `lang` option or `accpet-languages` are not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The first locale that resolved from `accept-language` header string, first language tag is used. if `*` (any language) or empty string is detected, return `en-US`.
 */
export function getLocale(req: Request, lang = 'en-US'): Intl.Locale {
  return getLocaleWithGetter(() => getAcceptLanguages(req)[0] || lang)
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
 * @returns The locale that resolved from cookie
 */
export function getCookieLocale(
  req: Request,
  { lang = 'en-US', name = 'i18n_locale' } = {},
): Intl.Locale {
  const getter = () => {
    const cookieRaw = req.headers.get('cookie')
    const cookie = parse(cookieRaw || '')
    return cookie[name] || lang
  }
  return getLocaleWithGetter(getter)
}
