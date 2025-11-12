[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [default](../index.md) / getHeaderLanguages

# Function: getHeaderLanguages()

```ts
function getHeaderLanguages(request, options): string[];
```

get languages from header

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `Request` | The Request \| request |
| `options` | `HeaderOptions` | The HeaderOptions \| header options object. `name` option is `accept-language` as default. |

## Returns

`string`[]

The array of language tags, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.

## Description

parse header string, default `accept-language` header

## Example

example for Web API request on Deno:

```ts
import { getHeaderLanguages } from 'https://esm.sh/@intlify/utils/web'

Deno.serve({
  port: 8080,
}, (req) => {
  const langTags = getHeaderLanguages(req)
  // ...
  return new Response(`accepted languages: ${langTags.join(', ')}`
})
```
