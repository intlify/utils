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
import type { CookieSerializeOptions } from 'cookie-es'

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
 * Cookie locale options type
 */
export type CookieLocaleOptions = {
  /**
   * The default language tag
   */
  lang?: string
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
 * @param options - the {@link HeaderOptions | header options}
 *
 * @returns The array of language tags
 */
export function getHeaderLanguagesWithGetter(
  getter: () => string | null | undefined,
  options: HeaderOptions = {}
): string[] {
  const { name = ACCEPT_LANGUAGE_HEADER, parser = parseDefaultHeader } = options
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
export function mapToLocaleFromLanguageTag<T extends unknown[]>(
  getter: (...args: T) => string[],
  ...args: T
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
 * @param options - the {@link PathOptions | path options} object
 *
 * @returns the language that is parsed by the path language parser, if the language is not detected, return a `options.lang` value
 */
export function getPathLanguage(path: string | URL, options: PathOptions = {}): string {
  const { lang = DEFAULT_LANG_TAG, parser = pathLanguageParser } = options
  return (parser || pathLanguageParser)(path) || lang
}

/**
 * get the locale from the path
 *
 * @param path - the target path
 * @param options - the {@link PathOptions | path options} object
 *
 * @throws {RangeError} Throws the {@link RangeError} if the language in the path, that is not a well-formed BCP 47 language tag.
 *
 * @returns The locale that resolved from path
 */
export function getPathLocale(path: string | URL, options: PathOptions = {}): Intl.Locale {
  return new Intl.Locale(getPathLanguage(path, options))
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
 * @param options - The {@link QueryOptions | query options}
 * @param options.lang - the language tag, which is as default `'en-US'`. optional
 * @param options.name - the query param name, default `'locale'`. optional
 *
 * @throws {RangeError} Throws the {@linkcode RangeError} if the language in the query, that is not a well-formed BCP 47 language tag.
 *
 * @returns The locale that resolved from query
 */
export function getQueryLocale(
  query: string | URL | URLSearchParams,
  options: QueryOptions = {}
): Intl.Locale {
  const { lang = DEFAULT_LANG_TAG, name = 'locale' } = options
  return new Intl.Locale(getQueryLanguage(query, { lang, name }))
}
