import { getAcceptLanguagesFromGetter, getLocaleWithGetter } from './http.ts'

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
 * @param {Request} event The {@link Request | request}
 *
 * @returns {Array<string>} The array of language tags, if `*` (any language) or empty string is detected, return an empty array.
 */
export function getAcceptLanguages(req: Request) {
  const getter = () => req.headers.get('accept-language')
  return getAcceptLanguagesFromGetter(getter)
}

/**
 * get locale
 *
 * @example
 * example for Web API request on Bun:
 *
 * import { getAcceptLanguages } from '@intlify/utils/web'
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
 * @param {Request} event The {@link Request | request}
 * @param {string} lang The default language tag, default is `en-US`. You must specify the language tag with the {@link https://datatracker.ietf.org/doc/html/rfc4646#section-2.1 | BCP 47 syntax}.
 *
 * @throws {RangeError} Throws a {@link RangeError} if `lang` option or `accpet-languages` are not a well-formed BCP 47 language tag.
 *
 * @returns {Intl.Locale} The first locale that resolved from `accept-language` header string, first language tag is used. if `*` (any language) or empty string is detected, return `en-US`.
 */
export function getLocale(req: Request, lang = 'en-US'): Intl.Locale {
  return getLocaleWithGetter(() => getAcceptLanguages(req)[0] || lang)
}
