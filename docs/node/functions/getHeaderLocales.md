# Function: getHeaderLocales()

get locales from header

## Signature

```ts
export function getHeaderLocales(request: IncomingMessage, options: HeaderOptions = {}): Intl.Locale[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `request` | `IncomingMessage` | The request |
| `options` | `HeaderOptions` | The header options object _(optional, default: {})_ |

## Returns

`Intl.Locale[]` — The locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.

## Throws

- `RangeError` — Throws the `RangeError` if header are not a well-formed BCP 47 language tag.

## Examples

example for Node.js request:

```ts
import { createServer } from 'node:http'
import { getHeaderLocales } from '@intlify/utils/node'

const server = createServer((req, res) => {
  const locales = getHeaderLocales(req)
  // ...
  res.writeHead(200)
  res.end(`accpected locales: ${locales.map(locale => locale.toString()).join(', ')}`)
})
```

## Tags

- `@description` — wrap language tags with locale, languages tags will be parsed from `accept-language` header as default.
