[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [default](../index.md) / getHeaderLanguage

# Function: getHeaderLanguage()

```ts
function getHeaderLanguage(request, options?): string;
```

get language from header

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `Request` | The Request \| request |
| `options` | `HeaderOptions` | The HeaderOptions \| header options object |

## Returns

`string`

The **first language tag** of header, if header is not exists, or `*` (any language), return empty string.

## Description

parse header string, default `accept-language`. if you use `accept-language`, this function returns the **first language tag** of `accept-language` header.

## Example

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
