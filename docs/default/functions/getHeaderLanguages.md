# Function: getHeaderLanguages()

get languages from header

## Signature

```ts
export function getHeaderLanguages(request: Request, options: HeaderOptions = {}): string[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `request` | `Request` | The request |
| `options` | `HeaderOptions` | The header options object. `name` option is `accept-language` as default. _(optional, default: {})_ |

## Returns

`string[]` — The array of language tags, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.

## Examples

example for Web API request on Cloudflare Workers:

```ts
import { getHeaderLanguages } from '@intlify/utils'

export default {
  fetch(request: Request) {
    const langTags = getHeaderLanguages(request)
    // ...
    return new Response(`accepted languages: ${langTags.join(', ')}`)
  }
}
```

## Tags

- `@description` — parse header string, default `accept-language` header
