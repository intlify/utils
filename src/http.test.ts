import { describe, expect, test } from 'vitest'
import { getPathLanguage, getPathLocale } from './http.ts'

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
