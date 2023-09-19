import { describe, expect, test } from 'vitest'
import { isLocale } from '../src/index.ts'

describe('isLocale', () => {
  test('Locale instance', () => {
    expect(isLocale(new Intl.Locale('en-US'))).toBe(true)
  })

  test('not Locale instance', () => {
    expect(isLocale('en-US')).toBe(false)
  })
})
