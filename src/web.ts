import { getAcceptLanguagesFromGetter } from './http.ts'

/**
 * get accpet languages
 *
 * @description parse `accept-language` header string
 *
 * @param {Request} event The {@link Request | request}
 *
 * @returns {Array<string>} The array of language tags, if `*` (any language) or empty string is detected, return an empty array.
 */
export function getAcceptLanguages(req: Request) {
  const getter = () => req.headers.get('accept-language')
  return getAcceptLanguagesFromGetter(getter)
}
