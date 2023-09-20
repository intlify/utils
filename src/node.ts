import { IncomingMessage } from 'node:http'
import { getAcceptLanguagesFromGetter } from './http.ts'

/**
 * get accpet languages
 *
 * @description parse `accept-language` header string
 *
 * @param {IncomingMessage} event The {@link IncomingMessage | request}
 *
 * @returns {Array<string>} The array of language tags, if `*` (any language) or empty string is detected, return an empty array.
 */
export function getAcceptLanguages(req: IncomingMessage) {
  const getter = () => req.headers['accept-language']
  return getAcceptLanguagesFromGetter(getter)
}
