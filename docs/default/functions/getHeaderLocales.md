[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [default](../index.md) / getHeaderLocales

# Function: getHeaderLocales()

```ts
function getHeaderLocales(request, options): Locale[];
```

get locales from header

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `Request` | The Request \| request |
| `options` | `HeaderOptions` | The HeaderOptions \| header options object |

## Returns

`Locale`[]

The locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.

## Description

wrap language tags with Intl.Locale \| locale, languages tags will be parsed from `accept-language` header as default.

## Example

example for Web API request on Bun:

```ts
import { getHeaderLocales } from '@intlify/utils/web'

Bun.serve({
  port: 8080,
  fetch(req) {
    const locales = getHeaderLocales(req)
    // ...
    return new Response(`accpected locales: ${locales.map(locale => locale.toString()).join(', ')}`)
  },
})
```

## Throws

Throws the `RangeError` if header are not a well-formed BCP 47 language tag.
