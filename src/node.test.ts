import { describe, expect, test } from 'vitest'
import { getAcceptLanguages, getLocale } from './node.ts'
import { IncomingMessage } from 'node:http'

describe('getAcceptLanguages', () => {
  test('basic', () => {
    const mockRequest = {
      headers: {
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as IncomingMessage
    expect(getAcceptLanguages(mockRequest)).toEqual(['en-US', 'en', 'ja'])
  })

  test('any language', () => {
    const mockRequest = {
      headers: {
        'accept-language': '*',
      },
    } as IncomingMessage
    expect(getAcceptLanguages(mockRequest)).toEqual([])
  })

  test('empty', () => {
    const mockRequest = {
      headers: {},
    } as IncomingMessage
    expect(getAcceptLanguages(mockRequest)).toEqual([])
  })
})

describe('getLocale', () => {
  test('basic', () => {
    const mockRequest = {
      headers: {
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as IncomingMessage
    const locale = getLocale(mockRequest)

    expect(locale.baseName).toEqual('en-US')
    expect(locale.language).toEqual('en')
    expect(locale.region).toEqual('US')
  })

  test('accept-language is any language', () => {
    const mockRequest = {
      headers: {
        'accept-language': '*',
      },
    } as IncomingMessage
    const locale = getLocale(mockRequest)

    expect(locale.baseName).toEqual('en-US')
  })

  test('specify default language', () => {
    const mockRequest = {
      headers: {
        'accept-language': '*',
      },
    } as IncomingMessage
    const locale = getLocale(mockRequest, 'ja-JP')

    expect(locale.baseName).toEqual('ja-JP')
  })

  test('RangeError', () => {
    const mockRequest = {
      headers: {
        'accept-language': 's',
      },
    } as IncomingMessage
    expect(() => getLocale(mockRequest, 'ja-JP')).toThrowError(RangeError)
  })
})
