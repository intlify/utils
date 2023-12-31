import { beforeEach, describe, expect, test } from 'vitest'
import { createApp, eventHandler, toNodeListener } from 'h3'
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
} from './h3.ts'
import { parseAcceptLanguage } from './shared.ts'
import { DEFAULT_COOKIE_NAME, DEFAULT_LANG_TAG } from './constants.ts'

import type { App, H3Event } from 'h3'
import type { SuperTest, Test } from 'supertest'

describe('getHeaderLanguages', () => {
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
    expect(getHeaderLanguages(mockEvent)).toEqual(['en-US', 'en', 'ja'])
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
    expect(getHeaderLanguages(mockEvent)).toEqual([])
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
    expect(getHeaderLanguages(mockEvent)).toEqual([])
  })

  test('parse option', () => {
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
    expect(getHeaderLanguages(mockEvent, { parser: parseAcceptLanguage }))
      .toEqual(['en-US', 'en', 'ja'])
  })

  test('custom header', () => {
    // @ts-ignore: for mocking
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'x-inlitfy-language': 'en-US,en,ja',
          },
        },
      },
    } as H3Event
    expect(
      getHeaderLanguages(mockEvent, {
        name: 'x-inlitfy-language',
        parser: (header) => header.split(','),
      }),
    ).toEqual(['en-US', 'en', 'ja'])
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
    expect(getHeaderLanguage(mockEvent)).toEqual('en-US')
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
    expect(getHeaderLanguage(mockEvent)).toEqual('')
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
    expect(getHeaderLanguage(mockEvent)).toEqual('')
  })

  test('custom header', () => {
    // @ts-ignore: for mocking
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'x-inlitfy-language': 'en-US,en,ja',
          },
        },
      },
    } as H3Event
    expect(
      getHeaderLanguage(mockEvent, {
        name: 'x-inlitfy-language',
        parser: (header) => header.split(','),
      }),
    ).toEqual('en-US')
  })
})

describe('getHeaderLocales', () => {
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
    expect(getHeaderLocales(mockEvent).map((locale) => locale.baseName))
      .toEqual(['en-US', 'en', 'ja'])
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
    expect(getHeaderLocales(mockEvent)).toEqual([])
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
    expect(getHeaderLocales(mockEvent)).toEqual([])
  })

  test('custom header', () => {
    // @ts-ignore: for mocking
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'x-inlitfy-language': 'en-US,en,ja',
          },
        },
      },
    } as H3Event
    expect(
      getHeaderLocales(mockEvent, {
        name: 'x-inlitfy-language',
        parser: (header) => header.split(','),
      }).map((locale) => locale.baseName),
    ).toEqual(['en-US', 'en', 'ja'])
  })
})

describe('tryHeaderLocales', () => {
  test('success', () => {
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
    expect(tryHeaderLocales(mockEvent)!.map((locale) => locale.baseName))
      .toEqual(['en-US', 'en', 'ja'])
  })

  test('failed', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'accept-language': 'hoge',
          },
        },
      },
    } as H3Event
    expect(tryHeaderLocales(mockEvent)).toBeNull()
  })
})

describe('getHeaderLocale', () => {
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
    const locale = getHeaderLocale(mockEvent)

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
    const locale = getHeaderLocale(mockEvent)

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
    const locale = getHeaderLocale(mockEvent, { lang: 'ja-JP' })

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

    expect(() => getHeaderLocale(mockEvent, { lang: 'ja-JP' })).toThrowError(
      RangeError,
    )
  })

  test('custom header', () => {
    // @ts-ignore: for mocking
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            'x-inlitfy-language': 'en-US,en,ja',
          },
        },
      },
    } as H3Event
    expect(
      getHeaderLocale(mockEvent, {
        name: 'x-inlitfy-language',
        parser: (header) => header.split(','),
      }).toString(),
    ).toEqual('en-US')
  })
})

describe('tryHeaderLocale', () => {
  test('success', () => {
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
    const locale = tryHeaderLocale(mockEvent)!

    expect(locale.baseName).toEqual('en-US')
    expect(locale.language).toEqual('en')
    expect(locale.region).toEqual('US')
  })

  test('failed', () => {
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

    expect(tryHeaderLocale(mockEvent)).toBeNull()
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

describe('tryCookieLocale', () => {
  test('success', () => {
    const mockEvent = {
      node: {
        req: {
          method: 'GET',
          headers: {
            cookie: `${DEFAULT_COOKIE_NAME}=en-US`,
          },
        },
      },
    } as H3Event
    const locale = tryCookieLocale(mockEvent)!

    expect(locale.baseName).toEqual('en-US')
    expect(locale.language).toEqual('en')
    expect(locale.region).toEqual('US')
  })

  test('failed', () => {
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

    expect(tryCookieLocale(mockEvent, { name: 'intlify_locale' })).toBeNull()
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

test('getPathLocale', async () => {
  const app = createApp({ debug: false })
  const request = supertest(toNodeListener(app))

  app.use(
    '/',
    eventHandler((event) => {
      return { locale: getPathLocale(event).toString() }
    }),
  )
  const res = await request.get('/en/foo')
  expect(res.body).toEqual({ locale: 'en' })
})

describe('tryPathLocale', () => {
  test('success', async () => {
    const app = createApp({ debug: false })
    const request = supertest(toNodeListener(app))

    app.use(
      '/',
      eventHandler((event) => {
        return { locale: tryPathLocale(event)!.toString() }
      }),
    )
    const res = await request.get('/en/foo')
    expect(res.body).toEqual({ locale: 'en' })
  })

  test('failed', async () => {
    const app = createApp({ debug: false })
    const request = supertest(toNodeListener(app))

    app.use(
      '/',
      eventHandler((event) => {
        return { locale: tryPathLocale(event) }
      }),
    )
    const res = await request.get('/s/foo')
    expect(res.body).toEqual({ locale: null })
  })
})

test('getQueryLocale', async () => {
  const app = createApp({ debug: false })
  const request = supertest(toNodeListener(app))

  app.use(
    '/',
    eventHandler((event) => {
      return { locale: getQueryLocale(event).toString() }
    }),
  )
  const res = await request.get('/?locale=ja')
  expect(res.body).toEqual({ locale: 'ja' })
})

describe('tryQueryLocale', () => {
  test('success', async () => {
    const app = createApp({ debug: false })
    const request = supertest(toNodeListener(app))

    app.use(
      '/',
      eventHandler((event) => {
        return { locale: tryQueryLocale(event)!.toString() }
      }),
    )
    const res = await request.get('/?locale=ja')
    expect(res.body).toEqual({ locale: 'ja' })
  })

  test('failed', async () => {
    const app = createApp({ debug: false })
    const request = supertest(toNodeListener(app))

    app.use(
      '/',
      eventHandler((event) => {
        return { locale: tryQueryLocale(event) }
      }),
    )
    const res = await request.get('/?locale=j')
    expect(res.body).toEqual({ locale: null })
  })
})
