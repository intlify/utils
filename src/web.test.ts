import { describe, expect, test, vi } from 'vitest'
import {
  getCookieLocale,
  getHeaderLanguage,
  getHeaderLanguages,
  getHeaderLocale,
  getHeaderLocales,
  getNavigatorLanguage,
  getNavigatorLanguages,
  getNavigatorLocale,
  getNavigatorLocales,
  setCookieLocale,
} from './web.ts'
import { DEFAULT_COOKIE_NAME, DEFAULT_LANG_TAG } from './constants.ts'

describe('getHeaderLanguages', () => {
  test('basic', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', 'en-US,en;q=0.9,ja;q=0.8')
    expect(getHeaderLanguages(mockRequest)).toEqual(['en-US', 'en', 'ja'])
  })

  test('any language', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', '*')
    expect(getHeaderLanguages(mockRequest)).toEqual([])
  })

  test('empty', () => {
    const mockRequest = new Request('https://example.com')
    expect(getHeaderLanguages(mockRequest)).toEqual([])
  })

  test('custom header', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('x-inlitfy-language', 'en-US,en,ja')
    expect(getHeaderLanguages(mockRequest, {
      name: 'x-inlitfy-language',
      parser: (header) => header.split(','),
    })).toEqual(['en-US', 'en', 'ja'])
  })
})

describe('getHeaderLocales', () => {
  test('basic', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', 'en-US,en;q=0.9,ja;q=0.8')
    expect(getHeaderLocales(mockRequest).map((locale) => locale.baseName))
      .toEqual(['en-US', 'en', 'ja'])
  })

  test('any language', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', '*')
    expect(getHeaderLocales(mockRequest)).toEqual([])
  })

  test('empty', () => {
    const mockRequest = new Request('https://example.com')
    expect(getHeaderLocales(mockRequest)).toEqual([])
  })

  test('custom header', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('x-inlitfy-language', 'en-US,en,ja')
    expect(
      getHeaderLanguage(mockRequest, {
        name: 'x-inlitfy-language',
        parser: (header) => header.split(','),
      }),
    ).toEqual('en-US')
  })
})

describe('getAcceptLanguage', () => {
  test('basic', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', 'en-US,en;q=0.9,ja;q=0.8')
    expect(getHeaderLanguage(mockRequest)).toBe('en-US')
  })

  test('any language', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', '*')
    expect(getHeaderLanguage(mockRequest)).toBe('')
  })

  test('empty', () => {
    const mockRequest = new Request('https://example.com')
    expect(getHeaderLanguage(mockRequest)).toBe('')
  })

  test('custom header', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('x-inlitfy-language', 'en-US,en,ja')
    expect(
      getHeaderLocales(mockRequest, {
        name: 'x-inlitfy-language',
        parser: (header) => header.split(','),
      }).map((locale) => locale.baseName),
    ).toEqual(['en-US', 'en', 'ja'])
  })
})

describe('getHeaderLocale', () => {
  test('basic', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', 'en-US,en;q=0.9,ja;q=0.8')
    const locale = getHeaderLocale(mockRequest)

    expect(locale.baseName).toEqual('en-US')
    expect(locale.language).toEqual('en')
    expect(locale.region).toEqual('US')
  })

  test('accept-language is any language', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', '*')
    const locale = getHeaderLocale(mockRequest)

    expect(locale.baseName).toEqual(DEFAULT_LANG_TAG)
  })

  test('specify default language', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', '*')
    const locale = getHeaderLocale(mockRequest, { lang: 'ja-JP' })

    expect(locale.baseName).toEqual('ja-JP')
  })

  test('RangeError', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', 's')
    expect(() => getHeaderLocale(mockRequest, { lang: 'ja-JP' })).toThrowError(
      RangeError,
    )
  })

  test('custom header', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('x-inlitfy-language', 'en-US,en,ja')
    expect(
      getHeaderLocale(mockRequest, {
        name: 'x-inlitfy-language',
        parser: (header) => header.split(','),
      }).toString(),
    ).toEqual('en-US')
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

describe('getNavigatorLocales', () => {
  test('basic', () => {
    vi.stubGlobal('navigator', {
      languages: ['en-US', 'en', 'ja'],
    })

    expect(getNavigatorLocales().map((locale) => locale.toString())).toEqual([
      'en-US',
      'en',
      'ja',
    ])
  })

  test('error', () => {
    vi.stubGlobal('navigator', undefined)

    expect(() => getNavigatorLocales()).toThrowError(
      /not support `navigator`/,
    )
  })
})

describe('getNavigatorLanguage', () => {
  test('basic', () => {
    vi.stubGlobal('navigator', {
      language: 'en-US',
    })

    expect(getNavigatorLocale().toString()).toEqual('en-US')
  })

  test('error', () => {
    vi.stubGlobal('navigator', undefined)

    expect(() => getNavigatorLocale()).toThrowError(
      /not support `navigator`/,
    )
  })
})
