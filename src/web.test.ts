import { describe, expect, test } from 'vitest'
import { getAcceptLanguages, getLocale } from './web.ts'

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

describe('getLocale', () => {
  test('basic', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', 'en-US,en;q=0.9,ja;q=0.8')
    const locale = getLocale(mockRequest)

    expect(locale.baseName).toEqual('en-US')
    expect(locale.language).toEqual('en')
    expect(locale.region).toEqual('US')
  })

  test('accept-language is any language', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', '*')
    const locale = getLocale(mockRequest)

    expect(locale.baseName).toEqual('en-US')
  })

  test('specify default language', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', '*')
    const locale = getLocale(mockRequest, 'ja-JP')

    expect(locale.baseName).toEqual('ja-JP')
  })

  test('RangeError', () => {
    const mockRequest = new Request('https://example.com')
    mockRequest.headers.set('accept-language', 's')
    expect(() => getLocale(mockRequest, 'ja-JP')).toThrowError(RangeError)
  })
})
