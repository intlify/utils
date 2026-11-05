# Function: getHeaderLocale()

get locale from header

## Signature

```ts
export function getHeaderLocale(request: Request, options: HeaderOptions & { lang?: string } = {}): Intl.Locale
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `request` | `Request` | The request |
| `options` | `HeaderOptions & { lang?: string }` | The header options object. `lang` option is `en-US` as default, you must specify the language tag with the [BCP 47 syntax](https://datatracker.ietf.org/doc/html/rfc4646#section-2.1). `name` option is `accept-language` as default, and `parser` option is `parseDefaultHeader` as default. _(optional, default: {})_ |

## Returns

`Intl.Locale` — The first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`.

## Throws

- `RangeError` — Throws the `RangeError` if `lang` option or header are not a well-formed BCP 47 language tag.

## Examples

```ts
example for Web API request on Bun:

import { getHeaderLocale } from '@intlify/utils'

Bun.serve({
  port: 8080,
  fetch(req) {
    const locale = getHeaderLocale(req)
    // ...
    return new Response(`accpected locale: ${locale.toString()}`)
  },
})
```

## Tags

- `@description` — wrap language tag with locale, languages tags will be parsed from `accept-language` header as default.
