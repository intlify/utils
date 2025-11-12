[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [hono](../index.md) / setCookieLocale

# Function: setCookieLocale()

```ts
function setCookieLocale(
   context, 
   locale, 
   options): void;
```

set locale to the response `Set-Cookie` header.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `Context` | A Context \| Hono context |
| `locale` | `string` \| `Locale` | A locale value |
| `options` | `CookieOptions` & `object` | The CookieOptions \| cookie options, `name` option is `i18n_locale` as default |

## Returns

`void`

## Example

example for Hono:

```ts
import { Hono } from 'hono'
import { setCookieLocale } from '@intlify/utils/hono'

const app = new Hono()
app.use('/', c => {
  setCookieLocale(c, 'ja-JP')
  // ...
})
```

## Throws

Throws the `SyntaxError` if `locale` is invalid.
