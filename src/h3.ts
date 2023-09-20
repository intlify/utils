import { getAcceptLanguagesFromGetter } from './http.ts'
import { getHeaders } from 'h3'

import type { H3Event } from 'h3'

/**
 * get accpet languages
 *
 * @description parse `accept-language` header string
 *
 * @param {H3Event} event The {@link H3Event | H3} event
 *
 * @returns {Array<string>} The array of language tags, if `*` (any language) or empty string is detected, return an empty array.
 */
export function getAcceptLanguages(event: H3Event): string[] {
  const getter = () => {
    const headers = getHeaders(event)
    return headers['accept-language']
  }
  return getAcceptLanguagesFromGetter(getter)
}
