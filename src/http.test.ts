import { describe, expect, test } from 'vitest'
import {
  getPathLanguage,
  getPathLocale,
  getQueryLanguage,
  getQueryLocale,
} from './http.ts'

describe('getPathLanguage', () => {
  test('basic', () => {
    expect(getPathLanguage('/en/foo')).toBe('en')
  })

  test('URL instance', () => {
    const url = new URL('https://example.com/en/foo')
    expect(getPathLanguage(url)).toBe('en')
  })

  test('parser option', () => {
    const nullLangParser = {
      parse: () => 'null',
    }
    expect(getPathLanguage('/en/foo', nullLangParser)).toBe('null')
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

  test('RangeError', () => {
    const nullLangParser = {
      parse: () => 'null',
    }
    expect(() => getPathLocale('/en/foo', nullLangParser)).toThrowError(
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
    expect(getQueryLanguage(url, 'locale')).toBe('ja-JP')
  })

  test('URLSearchParams instance', () => {
    const params = new URLSearchParams('lang=ja-JP')
    params.set('flag', '1')
    expect(getQueryLanguage(params)).toBe('ja-JP')
  })

  test('empty', () => {
    const params = new URLSearchParams()
    expect(getQueryLanguage(params)).toBe('')
  })
})

describe('getQueryLocale', () => {
  test('basic', () => {
    expect(getQueryLocale('lang=en-US&flag=1', 'lang').toString()).toBe('en-US')
  })

  test('URL instance', () => {
    const url = new URL('https://example.com/?locale=ja-JP')
    expect(getQueryLocale(url).toString()).toBe('ja-JP')
  })

  test('URLSearchParams instance', () => {
    const params = new URLSearchParams('lang=ja-JP')
    params.set('flag', '1')
    expect(getQueryLocale(params, 'lang').toString()).toBe('ja-JP')
  })

  test('RangeError', () => {
    const params = new URLSearchParams()
    expect(() => getQueryLocale(params)).toThrowError(RangeError)
  })
})
