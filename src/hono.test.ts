// @vitest-environment miniflare
import { describe, expect, test } from 'vitest'
import { parseAcceptLanguage } from './shared.ts'
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
} from './hono.ts'
import { DEFAULT_COOKIE_NAME, DEFAULT_LANG_TAG } from './constants.ts'
import { Hono } from 'hono'

import type { Context } from 'hono'

describe('getHeaderLanguages', () => {
  test('basic', () => {
    const mockContext = {
      req: {
        header: (_name) => 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as Context
    expect(getHeaderLanguages(mockContext)).toEqual(['en-US', 'en', 'ja'])
  })

  test('any language', () => {
    const mockContext = {
      req: {
        header: (_name) => '*',
      },
    } as Context
    expect(getHeaderLanguages(mockContext)).toEqual([])
  })

  test('empty', () => {
    const mockContext = {
      req: {
        header: (_name) => undefined,
      },
    } as Context
    expect(getHeaderLanguages(mockContext)).toEqual([])
  })

  test('parse option', () => {
    const mockContext = {
      req: {
        header: (_name) => 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as Context
    expect(getHeaderLanguages(mockContext, { parser: parseAcceptLanguage }))
      .toEqual(['en-US', 'en', 'ja'])
  })

  test('custom header', () => {
    const mockContext = {
      req: {
        header: (_name) => 'en-US,en,ja',
      },
    } as Context
    expect(
      getHeaderLanguages(mockContext, {
        name: 'x-inlitfy-language',
        parser: (header) => header.split(','),
      }),
    ).toEqual(['en-US', 'en', 'ja'])
  })
})

describe('getAcceptLanguage', () => {
  test('basic', () => {
    const mockContext = {
      req: {
        header: (_name) => 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as Context
    expect(getHeaderLanguage(mockContext)).toEqual('en-US')
  })

  test('any language', () => {
    const mockContext = {
      req: {
        header: (_name) => '*',
      },
    } as Context
    expect(getHeaderLanguage(mockContext)).toEqual('')
  })

  test('empty', () => {
    const mockContext = {
      req: {
        header: (_name) => undefined,
      },
    } as Context
    expect(getHeaderLanguage(mockContext)).toEqual('')
  })

  test('custom header', () => {
    const mockContext = {
      req: {
        header: (_name) => 'en-US,en,ja',
      },
    } as Context
    expect(
      getHeaderLanguage(mockContext, {
        name: 'x-inlitfy-language',
        parser: (header) => header.split(','),
      }),
    ).toEqual('en-US')
  })
})

describe('getHeaderLocales', () => {
  test('basic', () => {
    const mockContext = {
      req: {
        header: (_name) => 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as Context
    expect(getHeaderLocales(mockContext).map((locale) => locale.baseName))
      .toEqual(['en-US', 'en', 'ja'])
  })

  test('any language', () => {
    const mockContext = {
      req: {
        header: (_name) => '*',
      },
    } as Context
    expect(getHeaderLocales(mockContext)).toEqual([])
  })

  test('empty', () => {
    const mockContext = {
      req: {
        header: (_name) => undefined,
      },
    } as Context
    expect(getHeaderLocales(mockContext)).toEqual([])
  })

  test('custom header', () => {
    const mockContext = {
      req: {
        header: (_name) => 'en-US,en,ja',
      },
    } as Context
    expect(
      getHeaderLocales(mockContext, {
        name: 'x-inlitfy-language',
        parser: (header) => header.split(','),
      }).map((locale) => locale.baseName),
    ).toEqual(['en-US', 'en', 'ja'])
  })
})

describe('tryHeaderLocales', () => {
  test('success', () => {
    const mockContext = {
      req: {
        header: (_name) => 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as Context
    expect(tryHeaderLocales(mockContext)!.map((locale) => locale.baseName))
      .toEqual(['en-US', 'en', 'ja'])
  })

  test('failed', () => {
    const mockContext = {
      req: {
        header: (_name) => 'hoge',
      },
    } as Context
    expect(tryHeaderLocales(mockContext)).toBeNull()
  })
})

describe('getHeaderLocale', () => {
  test('basic', () => {
    const mockContext = {
      req: {
        header: (_name) => 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as Context
    const locale = getHeaderLocale(mockContext)

    expect(locale.baseName).toEqual('en-US')
    expect(locale.language).toEqual('en')
    expect(locale.region).toEqual('US')
  })

  test('accept-language is any language', () => {
    const mockContext = {
      req: {
        header: (_name) => '*',
      },
    } as Context
    const locale = getHeaderLocale(mockContext)

    expect(locale.baseName).toEqual(DEFAULT_LANG_TAG)
  })

  test('specify default language', () => {
    const mockContext = {
      req: {
        header: (_name) => '*',
      },
    } as Context
    const locale = getHeaderLocale(mockContext, { lang: 'ja-JP' })

    expect(locale.baseName).toEqual('ja-JP')
  })

  test('RangeError', () => {
    const mockContext = {
      req: {
        header: (_name) => 'x',
      },
    } as Context

    expect(() => getHeaderLocale(mockContext, { lang: 'ja-JP' })).toThrowError(
      RangeError,
    )
  })

  test('custom header', () => {
    const mockContext = {
      req: {
        header: (_name) => 'en-US,en,ja',
      },
    } as Context
    expect(
      getHeaderLocale(mockContext, {
        name: 'x-inlitfy-language',
        parser: (header) => header.split(','),
      }).toString(),
    ).toEqual('en-US')
  })
})

describe('tryHeaderLocale', () => {
  test('success', () => {
    const mockContext = {
      req: {
        header: (_name) => 'en-US,en;q=0.9,ja;q=0.8',
      },
    } as Context
    const locale = tryHeaderLocale(mockContext)!

    expect(locale.baseName).toEqual('en-US')
    expect(locale.language).toEqual('en')
    expect(locale.region).toEqual('US')
  })

  test('failed', () => {
    const mockContext = {
      req: {
        header: (_name) => 'x',
      },
    } as Context

    expect(tryHeaderLocale(mockContext)).toBeNull()
  })
})

describe('getCookieLocale', () => {
  test('basic', () => {
    const mockContext = {
      req: {
        raw: {
          headers: {
            get: (_name) => `${DEFAULT_COOKIE_NAME}=ja-US`,
          },
        },
      },
    } as Context
    const locale = getCookieLocale(mockContext)

    expect(locale.baseName).toEqual('ja-US')
    expect(locale.language).toEqual('ja')
    expect(locale.region).toEqual('US')
  })

  test('cookie is empty', () => {
    const mockContext = {
      req: {
        raw: {
          headers: {
            get: (_name) => '',
          },
        },
      },
    } as Context
    const locale = getCookieLocale(mockContext)

    expect(locale.baseName).toEqual(DEFAULT_LANG_TAG)
  })

  test('specify default language', () => {
    const mockContext = {
      req: {
        raw: {
          headers: {
            get: (_name) => '',
          },
        },
      },
    } as Context
    const locale = getCookieLocale(mockContext, { lang: 'ja-JP' })

    expect(locale.baseName).toEqual('ja-JP')
  })

  test('specify cookie name', () => {
    const mockContext = {
      req: {
        raw: {
          headers: {
            get: (_name) => 'intlify_locale=fr-FR',
          },
        },
      },
    } as Context
    const locale = getCookieLocale(mockContext, { name: 'intlify_locale' })

    expect(locale.baseName).toEqual('fr-FR')
  })

  test('RangeError', () => {
    const mockContext = {
      req: {
        raw: {
          headers: {
            get: (_name) => 'intlify_locale=f',
          },
        },
      },
    } as Context

    expect(() => getCookieLocale(mockContext, { name: 'intlify_locale' }))
      .toThrowError(RangeError)
  })
})

describe('tryCookieLocale', () => {
  test('success', () => {
    const mockContext = {
      req: {
        raw: {
          headers: {
            get: (_name) => `${DEFAULT_COOKIE_NAME}=en-US`,
          },
        },
      },
    } as Context
    const locale = tryCookieLocale(mockContext)!

    expect(locale.baseName).toEqual('en-US')
    expect(locale.language).toEqual('en')
    expect(locale.region).toEqual('US')
  })

  test('failed', () => {
    const mockContext = {
      req: {
        raw: {
          headers: {
            get: (_name) => 'intlify_locale=f',
          },
        },
      },
    } as Context

    expect(tryCookieLocale(mockContext, { name: 'intlify_locale' })).toBeNull()
  })
})

describe('setCookieLocale', () => {
  test('specify Locale instance', async () => {
    const app = new Hono()
    app.get('/', (c) => {
      const locale = new Intl.Locale('ja-JP')
      setCookieLocale(c, locale, { name: DEFAULT_COOKIE_NAME, path: '/' })
      return c.text(locale.toString())
    })
    const res = await app.request('http://localhost/')
    expect(res.headers.getSetCookie()).toEqual([
      `${DEFAULT_COOKIE_NAME}=ja-JP; Path=/`,
    ])
  })

  test('specify language tag', async () => {
    const app = new Hono()
    app.get('/', (c) => {
      setCookieLocale(c, 'ja-JP', { name: DEFAULT_COOKIE_NAME, path: '/' })
      return c.text('')
    })
    const res = await app.request('http://localhost/')
    expect(res.headers.getSetCookie()).toEqual([
      `${DEFAULT_COOKIE_NAME}=ja-JP; Path=/`,
    ])
  })

  test('specify cookie name', async () => {
    const app = new Hono()
    app.get('/', (c) => {
      setCookieLocale(c, 'ja-JP', { name: 'intlify_locale', path: '/' })
      return c.text('')
    })
    const res = await app.request('http://localhost/')
    expect(res.headers.getSetCookie()).toEqual([
      `intlify_locale=ja-JP; Path=/`,
    ])
  })

  test('Syntax Error', () => {
    const mockContext = {
      req: {
        raw: {
          headers: {
            get: (_name) => '',
          },
        },
      },
    } as Context

    expect(() => setCookieLocale(mockContext, 'j'))
      .toThrowError(/locale is invalid: j/)
  })
})

test('getPathLocale', async () => {
  const app = new Hono()
  app.get('*', (c) => {
    return c.json({ locale: getPathLocale(c).toString() })
  })
  const res = await app.request('http://localhost/en/foo')
  const result = await res.json()
  expect(result).toEqual({ locale: 'en' })
})

describe('tryPathLocale', () => {
  test('success', async () => {
    const app = new Hono()
    app.get('*', (c) => {
      return c.json({ locale: tryPathLocale(c)!.toString() })
    })
    const res = await app.request('http://localhost/en/foo')
    const result = await res.json()
    expect(result).toEqual({ locale: 'en' })
  })

  test('failed', async () => {
    const app = new Hono()
    app.get('*', (c) => {
      return c.json({ locale: tryPathLocale(c) })
    })
    const res = await app.request('http://localhost/e/foo')
    const result = await res.json()
    expect(result).toEqual({ locale: null })
  })
})

test('getQueryLocale', async () => {
  const app = new Hono()
  app.get('/', (c) => {
    return c.json({ locale: getQueryLocale(c).toString() })
  })
  const res = await app.request('http://localhost/?locale=ja')
  const result = await res.json()
  expect(result).toEqual({ locale: 'ja' })
})

describe('tryQueryLocale', () => {
  test('success', async () => {
    const app = new Hono()
    app.get('/', (c) => {
      return c.json({ locale: tryQueryLocale(c)!.toString() })
    })
    const res = await app.request('http://localhost/?locale=ja')
    const result = await res.json()
    expect(result).toEqual({ locale: 'ja' })
  })

  test('failed', async () => {
    const app = new Hono()
    app.get('/', (c) => {
      return c.json({ locale: tryQueryLocale(c) })
    })
    const res = await app.request('http://localhost/?locale=s')
    const result = await res.json()
    expect(result).toEqual({ locale: null })
  })
})
