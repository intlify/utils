[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [hono](../index.md) / getHeaderLocales

# Function: getHeaderLocales()

```ts
function getHeaderLocales(context, options): Locale[];
```

get locales from header

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `Context` | A Context \| Hono context |
| `options` | `HeaderOptions` | The HeaderOptions \| header options object |

## Returns

`Locale`[]

Some locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.

## Description

wrap language tags with Intl.Locale \| locale, languages tags will be parsed from `accept-language` header as default.

## Example

example for Hono:

```ts
import { Hono } from 'hono'
import { getHeaderLocales } from '@intlify/utils/hono'

const app = new Hono()
app.use('/', c => {
  const locales = getHeaderLocales(c)
  // ...
  return c.text(`accepted locales: ${locales.map(locale => locale.toString()).join(', ')}`)
})
```

## Throws

Throws the `RangeError` if header are not a well-formed BCP 47 language tag.
