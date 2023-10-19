import { describe, expect, test } from 'vitest'
import { getPathLanguage, getPathLocale, getQueryLanguage, getQueryLocale } from './http.ts'

describe('getPathLanguage', () => {
  test('basic', () => {
    expect(getPathLanguage('/en/foo')).toBe('en')
  })

  test('URL instance', () => {
    const url = new URL('https://example.com/en/foo')
    expect(getPathLanguage(url)).toBe('en')
  })

  test('default language, when the language is not detected', () => {
    expect(getPathLanguage('/')).toBe('en-US')
  })

  test('parser option', () => {
    const nullLangParser = () => 'null'
    expect(getPathLanguage('/en/foo', { parser: nullLangParser })).toBe('null')
  })

  test('lang option', () => {
    expect(getPathLanguage('/', { lang: 'ja' })).toBe('ja')
  })
})

describe('getPathLocale', () => {
  test('basic', () => {
    expect(getPathLocale('/en-US/foo').toString()).toBe('en-US')
  })

  test('URL instance', () => {
    const url = new URL('https://example.com/ja-JP/foo')
    expect(getPathLocale(url).toString()).toBe('ja-JP')
  })

  test('default locale, when the language is not detected', () => {
    expect(getPathLocale('/').toString()).toBe('en-US')
  })

  test('RangeError', () => {
    const nullLangParser = () => 'null'
    expect(() => getPathLocale('/en/foo', { parser: nullLangParser }))
      .toThrowError(
        RangeError,
      )
  })
})

describe('getQueryLanguage', () => {
  test('basic', () => {
    expect(getQueryLanguage('lang=en-US&flag=1')).toBe('en-US')
  })

  test('URL instance', () => {
    const url = new URL('https://example.com/?locale=ja-JP')
    expect(getQueryLanguage(url, { name: 'locale' })).toBe('ja-JP')
  })

  test('URLSearchParams instance', () => {
    const params = new URLSearchParams('lang=ja-JP')
    params.set('flag', '1')
    expect(getQueryLanguage(params)).toBe('ja-JP')
  })

  test('default language, when the language is not detected', () => {
    const params = new URLSearchParams()
    expect(getQueryLanguage(params)).toBe('en-US')
  })
})

describe('getQueryLocale', () => {
  test('basic', () => {
    expect(getQueryLocale('lang=en-US&flag=1', { name: 'lang' }).toString())
      .toBe('en-US')
  })

  test('URL instance', () => {
    const url = new URL('https://example.com/?locale=ja-JP')
    expect(getQueryLocale(url).toString()).toBe('ja-JP')
  })

  test('URLSearchParams instance', () => {
    const params = new URLSearchParams('lang=ja-JP')
    params.set('flag', '1')
    expect(getQueryLocale(params, { name: 'lang' }).toString()).toBe('ja-JP')
  })

  test('default language, when the language is not detected', () => {
    const params = new URLSearchParams()
    expect(getQueryLanguage(params)).toBe('en-US')
  })
})
