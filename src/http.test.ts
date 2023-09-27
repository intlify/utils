import { describe, expect, test } from 'vitest'
import { getPathLanguage, getPathLocale } from './http.ts'

describe('getPathLanguage', () => {
  test('basic', () => {
    expect(getPathLanguage('/en/foo')).toBe('en')
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

  test('RangeError', () => {
    const nullLangParser = {
      parse: () => 'null',
    }
    expect(() => getPathLocale('/en/foo', nullLangParser)).toThrowError(
      RangeError,
    )
  })
})
