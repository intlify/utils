[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [default](../index.md) / setCookieLocale

# Function: setCookieLocale()

```ts
function setCookieLocale(
   response, 
   locale, 
   options): void;
```

set locale to the response `Set-Cookie` header.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `response` | `Response` | The Response \| response |
| `locale` | `string` \| `Locale` | The locale value |
| `options` | `CookieOptions` | The CookieOptions \| cookie options, `name` option is `i18n_locale` as default |

## Returns

`void`

## Example

example for Web API response on Bun:

```ts
import { setCookieLocale } from '@intlify/utils/web'

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

## Throws

Throws the `SyntaxError` if `locale` is invalid.
