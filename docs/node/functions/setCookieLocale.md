[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [node](../index.md) / setCookieLocale

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
| `response` | `OutgoingMessage` | The OutgoingMessage \| response |
| `locale` | `string` \| `Locale` | The locale value |
| `options` | `CookieOptions` | The CookieOptions \| cookie options, `name` option is `i18n_locale` as default |

## Returns

`void`

## Example

example for Node.js response:

```ts
import { createServer } from 'node:http'
import { setCookieLocale } from '@intlify/utils/node'

const server = createServer((req, res) => {
  setCookieLocale(res, 'ja-JP')
  // ...
})
```

## Throws

Throws the `SyntaxError` if `locale` is invalid.
