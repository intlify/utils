import { describe, expect, test } from 'vitest'
import supertest from 'supertest'
import {
  getAcceptLanguage,
  getAcceptLanguages,
  getAcceptLocale,
  getAcceptLocales,
  getCookieLocale,
  setCookieLocale,
} from './node.ts'
import { createServer, IncomingMessage, OutgoingMessage } from 'node:http'
import { DEFAULT_COOKIE_NAME, DEFAULT_LANG_TAG } from './constants.ts'

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

describe('getAcceptLanguage', () => {
  test('basic', () => {
    const mockRequest = {
      headers: {
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as IncomingMessage
    expect(getAcceptLanguage(mockRequest)).toBe('en-US')
  })

  test('any language', () => {
    const mockRequest = {
      headers: {
        'accept-language': '*',
      },
    } as IncomingMessage
    expect(getAcceptLanguage(mockRequest)).toBe('')
  })

  test('empty', () => {
    const mockRequest = {
      headers: {},
    } as IncomingMessage
    expect(getAcceptLanguage(mockRequest)).toBe('')
  })
})

describe('getAcceptLocales', () => {
  test('basic', () => {
    const mockRequest = {
      headers: {
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as IncomingMessage
    expect(getAcceptLocales(mockRequest).map((locale) => locale.baseName))
      .toEqual(['en-US', 'en', 'ja'])
  })

  test('any language', () => {
    const mockRequest = {
      headers: {
        'accept-language': '*',
      },
    } as IncomingMessage
    expect(getAcceptLocales(mockRequest)).toEqual([])
  })

  test('empty', () => {
    const mockRequest = {
      headers: {},
    } as IncomingMessage
    expect(getAcceptLocales(mockRequest)).toEqual([])
  })
})

describe('getAcceptLocale', () => {
  test('basic', () => {
    const mockRequest = {
      headers: {
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as IncomingMessage
    const locale = getAcceptLocale(mockRequest)

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
    const locale = getAcceptLocale(mockRequest)

    expect(locale.baseName).toEqual(DEFAULT_LANG_TAG)
  })

  test('specify default language', () => {
    const mockRequest = {
      headers: {
        'accept-language': '*',
      },
    } as IncomingMessage
    const locale = getAcceptLocale(mockRequest, 'ja-JP')

    expect(locale.baseName).toEqual('ja-JP')
  })

  test('RangeError', () => {
    const mockRequest = {
      headers: {
        'accept-language': 's',
      },
    } as IncomingMessage
    expect(() => getAcceptLocale(mockRequest, 'ja-JP')).toThrowError(RangeError)
  })
})

describe('getCookieLocale', () => {
  test('basic', () => {
    const mockRequest = {
      headers: {
        cookie: `${DEFAULT_COOKIE_NAME}=ja-US`,
      },
    } as IncomingMessage
    const locale = getCookieLocale(mockRequest)

    expect(locale.baseName).toEqual('ja-US')
    expect(locale.language).toEqual('ja')
    expect(locale.region).toEqual('US')
  })

  test('cookie is empty', () => {
    const mockRequest = {
      headers: {
        cookie: '',
      },
    } as IncomingMessage
    const locale = getCookieLocale(mockRequest)

    expect(locale.baseName).toEqual(DEFAULT_LANG_TAG)
  })

  test('specify default language', () => {
    const mockRequest = {
      headers: {},
    } as IncomingMessage
    const locale = getCookieLocale(mockRequest, { lang: 'ja-JP' })

    expect(locale.baseName).toEqual('ja-JP')
  })

  test('specify cookie name', () => {
    const mockRequest = {
      headers: {
        cookie: 'intlify_locale=fr-FR',
      },
    } as IncomingMessage
    const locale = getCookieLocale(mockRequest, { name: 'intlify_locale' })

    expect(locale.baseName).toEqual('fr-FR')
  })

  test('RangeError', () => {
    const mockRequest = {
      headers: {
        cookie: 'intlify_locale=f',
      },
    } as IncomingMessage

    expect(() => getCookieLocale(mockRequest, { name: 'intlify_locale' }))
      .toThrowError(RangeError)
  })
})

describe('setCookieLocale', () => {
  test('specify Locale instance', async () => {
    const server = createServer((_req, res) => {
      const locale = new Intl.Locale('ja-JP')
      setCookieLocale(res, locale)
      res.writeHead(200)
      res.end('hello world!')
    })
    const request = supertest(server)
    const result = await request.get('/')
    expect(result.headers['set-cookie']).toEqual([
      `${DEFAULT_COOKIE_NAME}=ja-JP; Path=/`,
    ])
  })

  test('specify language tag', async () => {
    const server = createServer((_req, res) => {
      setCookieLocale(res, 'ja-JP')
      res.writeHead(200)
      res.end('hello world!')
    })
    const request = supertest(server)
    const result = await request.get('/')
    expect(result.headers['set-cookie']).toEqual([
      `${DEFAULT_COOKIE_NAME}=ja-JP; Path=/`,
    ])
  })

  test('specify cookie name', async () => {
    const server = createServer((_req, res) => {
      setCookieLocale(res, 'ja-JP', { name: 'intlify_locale' })
      res.writeHead(200)
      res.end('hello world!')
    })
    const request = supertest(server)
    const result = await request.get('/')
    expect(result.headers['set-cookie']).toEqual([
      'intlify_locale=ja-JP; Path=/',
    ])
  })

  test('Syntax Error', () => {
    const mockRes = {} as OutgoingMessage

    expect(() => setCookieLocale(mockRes, 'j'))
      .toThrowError(/locale is invalid: j/)
  })
})
