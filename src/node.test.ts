import { describe, expect, test } from 'vitest'
import supertest from 'supertest'
import {
  getCookieLocale,
  getHeaderLanguage,
  getHeaderLanguages,
  getHeaderLocale,
  getHeaderLocales,
  getPathLocale,
  getQueryLocale,
  setCookieLocale,
  tryCookieLocale,
  tryHeaderLocale,
  tryHeaderLocales,
  tryPathLocale,
  tryQueryLocale,
} from './node.ts'
import { createServer, IncomingMessage, OutgoingMessage } from 'node:http'
import { DEFAULT_COOKIE_NAME, DEFAULT_LANG_TAG } from './constants.ts'

describe('getHeaderLanguages', () => {
  test('basic', () => {
    const mockRequest = {
      headers: {
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as IncomingMessage
    expect(getHeaderLanguages(mockRequest)).toEqual(['en-US', 'en', 'ja'])
  })

  test('any language', () => {
    const mockRequest = {
      headers: {
        'accept-language': '*',
      },
    } as IncomingMessage
    expect(getHeaderLanguages(mockRequest)).toEqual([])
  })

  test('empty', () => {
    const mockRequest = {
      headers: {},
    } as IncomingMessage
    expect(getHeaderLanguages(mockRequest)).toEqual([])
  })

  test('custom header', () => {
    // @ts-ignore: for mocking
    const mockRequest = {
      headers: {
        'x-inlitfy-language': 'en-US,en,ja',
      },
    } as IncomingMessage
    expect(getHeaderLanguages(mockRequest, {
      name: 'x-inlitfy-language',
      parser: (header) => header.split(','),
    })).toEqual(['en-US', 'en', 'ja'])
  })
})

describe('getAcceptLanguage', () => {
  test('basic', () => {
    const mockRequest = {
      headers: {
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as IncomingMessage
    expect(getHeaderLanguage(mockRequest)).toBe('en-US')
  })

  test('any language', () => {
    const mockRequest = {
      headers: {
        'accept-language': '*',
      },
    } as IncomingMessage
    expect(getHeaderLanguage(mockRequest)).toBe('')
  })

  test('empty', () => {
    const mockRequest = {
      headers: {},
    } as IncomingMessage
    expect(getHeaderLanguage(mockRequest)).toBe('')
  })

  test('custom header', () => {
    // @ts-ignore: for mocking
    const mockRequest = {
      headers: {
        'x-inlitfy-language': 'en-US,en,ja',
      },
    } as IncomingMessage
    expect(
      getHeaderLanguage(mockRequest, {
        name: 'x-inlitfy-language',
        parser: (header) => header.split(','),
      }),
    ).toEqual('en-US')
  })
})

describe('getHeaderLocales', () => {
  test('basic', () => {
    const mockRequest = {
      headers: {
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as IncomingMessage
    expect(getHeaderLocales(mockRequest).map((locale) => locale.baseName))
      .toEqual(['en-US', 'en', 'ja'])
  })

  test('any language', () => {
    const mockRequest = {
      headers: {
        'accept-language': '*',
      },
    } as IncomingMessage
    expect(getHeaderLocales(mockRequest)).toEqual([])
  })

  test('empty', () => {
    const mockRequest = {
      headers: {},
    } as IncomingMessage
    expect(getHeaderLocales(mockRequest)).toEqual([])
  })

  test('custom header', () => {
    // @ts-ignore: for mocking
    const mockRequest = {
      headers: {
        'x-inlitfy-language': 'en-US,en,ja',
      },
    } as IncomingMessage
    expect(
      getHeaderLocales(mockRequest, {
        name: 'x-inlitfy-language',
        parser: (header) => header.split(','),
      }).map((locale) => locale.baseName),
    ).toEqual(['en-US', 'en', 'ja'])
  })
})

describe('tryHeaderLocales', () => {
  test('success', () => {
    const mockRequest = {
      headers: {
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as IncomingMessage
    expect(tryHeaderLocales(mockRequest)!.map((locale) => locale.baseName))
      .toEqual(['en-US', 'en', 'ja'])
  })

  test('failed', () => {
    const mockRequest = {
      headers: {
        'accept-language': 'hoge',
      },
    } as IncomingMessage
    expect(tryHeaderLocales(mockRequest)).toBeNull()
  })
})

describe('getHeaderLocale', () => {
  test('basic', () => {
    const mockRequest = {
      headers: {
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as IncomingMessage
    const locale = getHeaderLocale(mockRequest)

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
    const locale = getHeaderLocale(mockRequest)

    expect(locale.baseName).toEqual(DEFAULT_LANG_TAG)
  })

  test('specify default language', () => {
    const mockRequest = {
      headers: {
        'accept-language': '*',
      },
    } as IncomingMessage
    const locale = getHeaderLocale(mockRequest, { lang: 'ja-JP' })

    expect(locale.baseName).toEqual('ja-JP')
  })

  test('RangeError', () => {
    const mockRequest = {
      headers: {
        'accept-language': 's',
      },
    } as IncomingMessage
    expect(() => getHeaderLocale(mockRequest, { lang: 'ja-JP' })).toThrowError(
      RangeError,
    )
  })
})

describe('tryHeaderLocale', () => {
  test('success', () => {
    const mockRequest = {
      headers: {
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as IncomingMessage
    const locale = tryHeaderLocale(mockRequest)!

    expect(locale.baseName).toEqual('en-US')
    expect(locale.language).toEqual('en')
    expect(locale.region).toEqual('US')
  })

  test('failed', () => {
    const mockRequest = {
      headers: {
        'accept-language': 's',
      },
    } as IncomingMessage
    expect(tryHeaderLocale(mockRequest)).toBeNull()
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

  test('custom header', () => {
    // @ts-ignore: for mocking
    const mockRequest = {
      headers: {
        'x-inlitfy-language': 'en-US,en,ja',
      },
    } as IncomingMessage
    expect(
      getHeaderLocale(mockRequest, {
        name: 'x-inlitfy-language',
        parser: (header) => header.split(','),
      }).toString(),
    ).toEqual('en-US')
  })
})

describe('tryCookieLocale', () => {
  test('success', () => {
    const mockRequest = {
      headers: {
        cookie: `${DEFAULT_COOKIE_NAME}=en-US`,
      },
    } as IncomingMessage
    const locale = tryCookieLocale(mockRequest)!

    expect(locale.baseName).toEqual('en-US')
    expect(locale.language).toEqual('en')
    expect(locale.region).toEqual('US')
  })

  test('failed', () => {
    const mockRequest = {
      headers: {
        cookie: 'intlify_locale=f',
      },
    } as IncomingMessage

    expect(tryCookieLocale(mockRequest, { name: 'intlify_locale' })).toBeNull()
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

test('getPathLocale', async () => {
  const server = createServer((req, res) => {
    const locale = getPathLocale(req)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ locale: locale.toString() }))
  })
  const request = supertest(server)
  const result = await request.get('/en-US/foo')
  expect(result.body).toEqual({ locale: 'en-US' })
})

describe('tryPathLocale', () => {
  test('success', async () => {
    const server = createServer((req, res) => {
      const locale = tryPathLocale(req)!
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ locale: locale.toString() }))
    })
    const request = supertest(server)
    const result = await request.get('/en-US/foo')
    expect(result.body).toEqual({ locale: 'en-US' })
  })

  test('failed', async () => {
    const server = createServer((req, res) => {
      const locale = tryPathLocale(req)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ locale }))
    })
    const request = supertest(server)
    const result = await request.get('/s/foo')
    expect(result.body).toEqual({ locale: null })
  })
})

test('getQueryLocale', async () => {
  const server = createServer((req, res) => {
    const locale = getQueryLocale(req, { name: 'lang' })
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ locale: locale.toString() }))
  })
  const request = supertest(server)
  const result = await request.get('/?lang=ja')
  expect(result.body).toEqual({ locale: 'ja' })
})

describe('tryQueryLocale', () => {
  test('success', async () => {
    const server = createServer((req, res) => {
      const locale = tryQueryLocale(req, { name: 'lang' })!
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ locale: locale.toString() }))
    })
    const request = supertest(server)
    const result = await request.get('/?lang=ja')
    expect(result.body).toEqual({ locale: 'ja' })
  })

  test('failed', async () => {
    const server = createServer((req, res) => {
      const locale = tryQueryLocale(req, { name: 'lang' })
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ locale }))
    })
    const request = supertest(server)
    const result = await request.get('/?lang=j')
    expect(result.body).toEqual({ locale: null })
  })
})
