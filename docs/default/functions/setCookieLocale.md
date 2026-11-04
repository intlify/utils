[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [default](../index.md) / setCookieLocale

# Function: setCookieLocale()

```ts
function setCookieLocale(
   response, 
   locale, 
   options?): void;
```

set locale to the response `Set-Cookie` header.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `response` | \{ `headers`: `Headers`; \} | The Response \| response, or an object that has the Headers \| headers, e.g. `event.res` of h3 v2 |
| `response.headers` | `Headers` | - |
| `locale` | `string` \| `Locale` | The locale value |
| `options` | `CookieOptions` | The CookieOptions \| cookie options, `name` option is `i18n_locale` as default |

## Returns

`void`

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

## Throws

Throws the `SyntaxError` if `locale` is invalid.

## Throws

Throws the `TypeError` if the cookie attributes are invalid for RFC 6265bis, e.g. `sameSite: 'none'` without `secure`.
