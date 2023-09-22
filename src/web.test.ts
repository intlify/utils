import { describe, expect, test, vi } from 'vitest'
import {
  getAcceptLanguage,
  getAcceptLanguages,
  getAcceptLocale,
  getAcceptLocales,
  getCookieLocale,
  getNavigatorLanguage,
  getNavigatorLanguages,
  setCookieLocale,
} from './web.ts'
import { DEFAULT_COOKIE_NAME, DEFAULT_LANG_TAG } from './constants.ts'

describe('getAcceptLanguages', () => {
  test('basic', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', 'en-US,en;q=0.9,ja;q=0.8')
    expect(getAcceptLanguages(mockRequest)).toEqual(['en-US', 'en', 'ja'])
  })

  test('any language', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', '*')
    expect(getAcceptLanguages(mockRequest)).toEqual([])
  })

  test('empty', () => {
    const mockRequest = new Request('https://example.com')
    expect(getAcceptLanguages(mockRequest)).toEqual([])
  })
})

describe('getAcceptLocales', () => {
  test('basic', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', 'en-US,en;q=0.9,ja;q=0.8')
    expect(getAcceptLocales(mockRequest).map((locale) => locale.baseName))
      .toEqual(['en-US', 'en', 'ja'])
  })

  test('any language', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', '*')
    expect(getAcceptLocales(mockRequest)).toEqual([])
  })

  test('empty', () => {
    const mockRequest = new Request('https://example.com')
    expect(getAcceptLocales(mockRequest)).toEqual([])
  })
})

describe('getAcceptLanguage', () => {
  test('basic', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', 'en-US,en;q=0.9,ja;q=0.8')
    expect(getAcceptLanguage(mockRequest)).toBe('en-US')
  })

  test('any language', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', '*')
    expect(getAcceptLanguage(mockRequest)).toBe('')
  })

  test('empty', () => {
    const mockRequest = new Request('https://example.com')
    expect(getAcceptLanguage(mockRequest)).toBe('')
  })
})

describe('getAcceptLocale', () => {
  test('basic', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', 'en-US,en;q=0.9,ja;q=0.8')
    const locale = getAcceptLocale(mockRequest)

    expect(locale.baseName).toEqual('en-US')
    expect(locale.language).toEqual('en')
    expect(locale.region).toEqual('US')
  })

  test('accept-language is any language', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', '*')
    const locale = getAcceptLocale(mockRequest)

    expect(locale.baseName).toEqual(DEFAULT_LANG_TAG)
  })

  test('specify default language', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', '*')
    const locale = getAcceptLocale(mockRequest, 'ja-JP')

    expect(locale.baseName).toEqual('ja-JP')
  })

  test('RangeError', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', 's')
    expect(() => getAcceptLocale(mockRequest, 'ja-JP')).toThrowError(RangeError)
  })
})

describe('getCookieLocale', () => {
  test('basic', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('cookie', `${DEFAULT_COOKIE_NAME}=ja-US`)
    const locale = getCookieLocale(mockRequest)

    expect(locale.baseName).toEqual('ja-US')
    expect(locale.language).toEqual('ja')
    expect(locale.region).toEqual('US')
  })

  test('cookie is empty', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('cookie', '')
    const locale = getCookieLocale(mockRequest)

    expect(locale.baseName).toEqual(DEFAULT_LANG_TAG)
  })

  test('specify default language', () => {
    const mockRequest = new Request('https://example.com')
    const locale = getCookieLocale(mockRequest, { lang: 'ja-JP' })

    expect(locale.baseName).toEqual('ja-JP')
  })

  test('specify cookie name', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('cookie', 'intlify_locale=fr-FR')
    const locale = getCookieLocale(mockRequest, { name: 'intlify_locale' })

    expect(locale.baseName).toEqual('fr-FR')
  })

  test('RangeError', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('cookie', 'intlify_locale=f')
    expect(() => getCookieLocale(mockRequest, { name: 'intlify_locale' }))
      .toThrowError(RangeError)
  })
})

describe('setCookieLocale', () => {
  test('specify Locale instance', () => {
    const res = new Response('hello world!')
    const locale = new Intl.Locale('ja-JP')
    setCookieLocale(res, locale)
    expect(res.headers.getSetCookie()).toEqual([
      `${DEFAULT_COOKIE_NAME}=ja-JP; Path=/`,
    ])
  })

  test('specify language tag', () => {
    const res = new Response('hello world!')
    setCookieLocale(res, 'ja-JP')
    expect(res.headers.getSetCookie()).toEqual([
      `${DEFAULT_COOKIE_NAME}=ja-JP; Path=/`,
    ])
  })

  test('specify cookie name', () => {
    const res = new Response('hello world!')
    setCookieLocale(res, 'ja-JP', { name: 'intlify_locale' })
    expect(res.headers.getSetCookie()).toEqual([
      'intlify_locale=ja-JP; Path=/',
    ])
  })

  test('Syntax Error', () => {
    const res = new Response('hello world!')
    expect(() => setCookieLocale(res, 'j'))
      .toThrowError(/locale is invalid: j/)
  })
})

describe('getNavigatorLanguages', () => {
  test('basic', () => {
    vi.stubGlobal('navigator', {
      languages: ['en-US', 'en', 'ja'],
    })

    expect(getNavigatorLanguages()).toEqual(['en-US', 'en', 'ja'])
  })

  test('error', () => {
    vi.stubGlobal('navigator', undefined)

    expect(() => getNavigatorLanguages()).toThrowError(
      /not support `navigator`/,
    )
  })
})

describe('getNavigatorLanguage', () => {
  test('basic', () => {
    vi.stubGlobal('navigator', {
      language: 'en-US',
    })

    expect(getNavigatorLanguage()).toEqual('en-US')
  })

  test('error', () => {
    vi.stubGlobal('navigator', undefined)

    expect(() => getNavigatorLanguage()).toThrowError(
      /not support `navigator`/,
    )
  })
})
