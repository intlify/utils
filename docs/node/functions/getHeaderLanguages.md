# Function: getHeaderLanguages()

get languages from header

## Signature

```ts
export function getHeaderLanguages(request: IncomingMessage, options: HeaderOptions = {}): string[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `request` | `IncomingMessage` | The request |
| `options` | `HeaderOptions` | The header options object. `name` option is `accept-language` as default. _(optional, default: {})_ |

## Returns

`string[]` — The array of language tags, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.

## Examples

example for Node.js request:

```ts
import { createServer } from 'node:http'
import { getHeaderLanguages } from '@intlify/utils/node'

const server = createServer((req, res) => {
  const langTags = getHeaderLanguages(req)
  // ...
  res.writeHead(200)
  res.end(`detect accpect-languages: ${langTags.join(', ')}`)
})
```

## Tags

- `@description` — parse header string, default `accept-language` header
