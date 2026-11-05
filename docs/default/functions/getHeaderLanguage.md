# Function: getHeaderLanguage()

get language from header

## Signature

```ts
export function getHeaderLanguage(request: Request, options: HeaderOptions = {}): string
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `request` | `Request` | The request |
| `options` | `HeaderOptions` | The header options object _(optional, default: {})_ |

## Returns

`string` — The **first language tag** of header, if header is not exists, or `*` (any language), return empty string.

## Examples

example for Web API request on Cloudflare Workers:

```ts
import { getHeaderLanguage } from '@intlify/utils'

export default {
  fetch(request: Request) {
    const langTag = getHeaderLanguage(request)
    // ...
    return new Response(`accepted language: ${langTag}`)
  }
}
```

## Tags

- `@description` — parse header string, default `accept-language`. if you use `accept-language`, this function returns the **first language tag** of `accept-language` header.
