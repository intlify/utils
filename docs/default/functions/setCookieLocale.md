# Function: setCookieLocale()

set locale to the response `Set-Cookie` header.

## Signature

```ts
export function setCookieLocale(response: { readonly headers: Headers }, locale: string | Intl.Locale, options: CookieOptions = {}): void
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `response` | `{ readonly headers: Headers }` | The response, or an object that has the headers, e.g. `event.res` of h3 v2 |
| `locale` | `string \| Intl.Locale` | The locale value |
| `options` | `CookieOptions` | The cookie options, `name` option is `i18n_locale` as default _(optional, default: {})_ |
| `response.headers` | `Headers` |  |

## Returns

`void`

## Throws

- `SyntaxError` — Throws the `SyntaxError` if `locale` is invalid.
- `TypeError` — Throws the `TypeError` if the cookie attributes are invalid for RFC 6265bis, e.g. `sameSite: 'none'` without `secure`.

## Examples

example for Web API response on Bun:

```ts
import { setCookieLocale } from '@intlify/utils'

Bun.serve({
  port: 8080,
  fetch(req) {
    const res = new Response('こんにちは、世界！')
    setCookieLocale(res, 'ja-JP')
    // ...
    return res
  },
})
```

example for the response of h3 v2:

```ts
import { H3 } from 'h3'
import { setCookieLocale } from '@intlify/utils'

const app = new H3().get('/', event => {
  setCookieLocale(event.res, 'ja-JP')
  return 'こんにちは、世界！'
})
```
