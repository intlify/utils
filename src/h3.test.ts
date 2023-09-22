import { beforeEach, describe, expect, test } from 'vitest'
import { createApp, eventHandler, toNodeListener } from 'h3'
import supertest from 'supertest'
import {
  getAcceptLanguage,
  getAcceptLanguages,
  getCookieLocale,
  getLocale,
  setCookieLocale,
} from './h3.ts'
import { DEFAULT_COOKIE_NAME, DEFAULT_LANG_TAG } from './constants.ts'

import type { App, H3Event } from 'h3'
import type { SuperTest, Test } from 'supertest'

describe('getAcceptLanguages', () => {
  test('basic', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
          },
        },
      },
    } as H3Event
    expect(getAcceptLanguages(mockEvent)).toEqual(['en-US', 'en', 'ja'])
  })

  test('any language', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': '*',
          },
        },
      },
    } as H3Event
    expect(getAcceptLanguages(mockEvent)).toEqual([])
  })

  test('empty', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {},
        },
      },
    } as H3Event
    expect(getAcceptLanguages(mockEvent)).toEqual([])
  })
})

describe('getAcceptLanguage', () => {
  test('basic', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
          },
        },
      },
    } as H3Event
    expect(getAcceptLanguage(mockEvent)).toEqual('en-US')
  })

  test('any language', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': '*',
          },
        },
      },
    } as H3Event
    expect(getAcceptLanguage(mockEvent)).toEqual('')
  })

  test('empty', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {},
        },
      },
    } as H3Event
    expect(getAcceptLanguage(mockEvent)).toEqual('')
  })
})

describe('getLocale', () => {
  test('basic', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
          },
        },
      },
    } as H3Event
    const locale = getLocale(mockEvent)

    expect(locale.baseName).toEqual('en-US')
    expect(locale.language).toEqual('en')
    expect(locale.region).toEqual('US')
  })

  test('accept-language is any language', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': '*',
          },
        },
      },
    } as H3Event
    const locale = getLocale(mockEvent)

    expect(locale.baseName).toEqual(DEFAULT_LANG_TAG)
  })

  test('specify default language', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': '*',
          },
        },
      },
    } as H3Event
    const locale = getLocale(mockEvent, 'ja-JP')

    expect(locale.baseName).toEqual('ja-JP')
  })

  test('RangeError', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': 's',
          },
        },
      },
    } as H3Event

    expect(() => getLocale(mockEvent, 'ja-JP')).toThrowError(RangeError)
  })
})

describe('getCookieLocale', () => {
  test('basic', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            cookie: `${DEFAULT_COOKIE_NAME}=ja-US`,
          },
        },
      },
    } as H3Event
    const locale = getCookieLocale(mockEvent)

    expect(locale.baseName).toEqual('ja-US')
    expect(locale.language).toEqual('ja')
    expect(locale.region).toEqual('US')
  })

  test('cookie is empty', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {},
        },
      },
    } as H3Event
    const locale = getCookieLocale(mockEvent)

    expect(locale.baseName).toEqual(DEFAULT_LANG_TAG)
  })

  test('specify default language', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {},
        },
      },
    } as H3Event
    const locale = getCookieLocale(mockEvent, { lang: 'ja-JP' })

    expect(locale.baseName).toEqual('ja-JP')
  })

  test('specify cookie name', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            cookie: 'intlify_locale=fr-FR',
          },
        },
      },
    } as H3Event
    const locale = getCookieLocale(mockEvent, { name: 'intlify_locale' })

    expect(locale.baseName).toEqual('fr-FR')
  })

  test('RangeError', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            cookie: 'intlify_locale=f',
          },
        },
      },
    } as H3Event

    expect(() => getCookieLocale(mockEvent, { name: 'intlify_locale' }))
      .toThrowError(RangeError)
  })
})

describe('setCookieLocale', () => {
  let app: App
  let request: SuperTest<Test>

  beforeEach(() => {
    app = createApp({ debug: false })
    request = supertest(toNodeListener(app))
  })

  test('specify Locale instance', async () => {
    app.use(
      '/',
      eventHandler((event) => {
        const locale = new Intl.Locale('ja-JP')
        setCookieLocale(event, locale)
        return '200'
      }),
    )
    const result = await request.get('/')
    expect(result.headers['set-cookie']).toEqual([
      'i18n_locale=ja-JP; Path=/',
    ])
  })

  test('specify language tag', async () => {
    app.use(
      '/',
      eventHandler((event) => {
        setCookieLocale(event, 'ja-JP')
        return '200'
      }),
    )
    const result = await request.get('/')
    expect(result.headers['set-cookie']).toEqual([
      'i18n_locale=ja-JP; Path=/',
    ])
  })

  test('specify cookie name', async () => {
    app.use(
      '/',
      eventHandler((event) => {
        setCookieLocale(event, 'ja-JP', { name: 'intlify_locale' })
        return '200'
      }),
    )
    const result = await request.get('/')
    expect(result.headers['set-cookie']).toEqual([
      'intlify_locale=ja-JP; Path=/',
    ])
  })

  test('Syntax Error', () => {
    const eventMock = {
      node: {
        req: {
          method: 'GET',
          headers: {},
        },
      },
    } as H3Event

    expect(() => setCookieLocale(eventMock, 'j'))
      .toThrowError(/locale is invalid: j/)
  })
})
