# Function: setCookieLocale()

set locale to the response `Set-Cookie` header.

## Signature

```ts
export function setCookieLocale(response: OutgoingMessage, locale: string | Intl.Locale, options: CookieOptions = {}): void
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `response` | `OutgoingMessage` | The response |
| `locale` | `string \| Intl.Locale` | The locale value |
| `options` | `CookieOptions` | The cookie options, `name` option is `i18n_locale` as default _(optional, default: {})_ |

## Returns

`void`

## Throws

- `SyntaxError` — Throws the `SyntaxError` if `locale` is invalid.
- `TypeError` — Throws the `TypeError` if the cookie attributes are invalid for RFC 6265bis, e.g. `sameSite: 'none'` without `secure`.

## Examples

example for Node.js response:

```ts
import { createServer } from 'node:http'
import { setCookieLocale } from '@intlify/utils/node'

const server = createServer((req, res) => {
  setCookieLocale(res, 'ja-JP')
  // ...
})
```
