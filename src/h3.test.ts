import { describe, expect, test } from 'vitest'
import { getAcceptLanguages, getCookieLocale, getLocale } from './h3.ts'
import { DEFAULT_COOKIE_NAME, DEFAULT_LANG_TAG } from './constants.ts'

import type { H3Event } from 'h3'

describe('getAcceptLanguages', () => {
  test('basic', () => {
    const eventMock = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
          },
        },
      },
    } as H3Event
    expect(getAcceptLanguages(eventMock)).toEqual(['en-US', 'en', 'ja'])
  })

  test('any language', () => {
    const eventMock = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': '*',
          },
        },
      },
    } as H3Event
    expect(getAcceptLanguages(eventMock)).toEqual([])
  })

  test('empty', () => {
    const eventMock = {
      node: {
        req: {
          method: 'GET',
          headers: {},
        },
      },
    } as H3Event
    expect(getAcceptLanguages(eventMock)).toEqual([])
  })
})

describe('getLocale', () => {
  test('basic', () => {
    const eventMock = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': 'en-US,en;q=0.9,ja;q=0.8',
          },
        },
      },
    } as H3Event
    const locale = getLocale(eventMock)

    expect(locale.baseName).toEqual('en-US')
    expect(locale.language).toEqual('en')
    expect(locale.region).toEqual('US')
  })

  test('accept-language is any language', () => {
    const eventMock = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': '*',
          },
        },
      },
    } as H3Event
    const locale = getLocale(eventMock)

    expect(locale.baseName).toEqual(DEFAULT_LANG_TAG)
  })

  test('specify default language', () => {
    const eventMock = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': '*',
          },
        },
      },
    } as H3Event
    const locale = getLocale(eventMock, 'ja-JP')

    expect(locale.baseName).toEqual('ja-JP')
  })

  test('RangeError', () => {
    const eventMock = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': 's',
          },
        },
      },
    } as H3Event

    expect(() => getLocale(eventMock, 'ja-JP')).toThrowError(RangeError)
  })
})

describe('getCookieLocale', () => {
  test('basic', () => {
    const eventMock = {
      node: {
        req: {
          method: 'GET',
          headers: {
            cookie: `${DEFAULT_COOKIE_NAME}=ja-US`,
          },
        },
      },
    } as H3Event
    const locale = getCookieLocale(eventMock)

    expect(locale.baseName).toEqual('ja-US')
    expect(locale.language).toEqual('ja')
    expect(locale.region).toEqual('US')
  })

  test('cookie is empty', () => {
    const eventMock = {
      node: {
        req: {
          method: 'GET',
          headers: {},
        },
      },
    } as H3Event
    const locale = getCookieLocale(eventMock)

    expect(locale.baseName).toEqual(DEFAULT_LANG_TAG)
  })

  test('specify default language', () => {
    const eventMock = {
      node: {
        req: {
          method: 'GET',
          headers: {},
        },
      },
    } as H3Event
    const locale = getCookieLocale(eventMock, { lang: 'ja-JP' })

    expect(locale.baseName).toEqual('ja-JP')
  })

  test('specify cookie name', () => {
    const eventMock = {
      node: {
        req: {
          method: 'GET',
          headers: {
            cookie: 'intlify_locale=fr-FR',
          },
        },
      },
    } as H3Event
    const locale = getCookieLocale(eventMock, { name: 'intlify_locale' })

    expect(locale.baseName).toEqual('fr-FR')
  })

  test('RangeError', () => {
    const eventMock = {
      node: {
        req: {
          method: 'GET',
          headers: {
            cookie: 'intlify_locale=f',
          },
        },
      },
    } as H3Event

    expect(() => getCookieLocale(eventMock, { name: 'intlify_locale' }))
      .toThrowError(RangeError)
  })
})
