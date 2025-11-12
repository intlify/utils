[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [hono](../index.md) / getHeaderLocale

# Function: getHeaderLocale()

```ts
function getHeaderLocale(context, options): Locale;
```

get locale from header

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `Context` | A Context \| Hono context |
| `options` | `HeaderOptions` & `object` | The HeaderOptions \| header options object. `lang` option is `en-US` as default, you must specify the language tag with the [BCP 47 syntax](https://datatracker.ietf.org/doc/html/rfc4646#section-2.1). `name` option is `accept-language` as default, and `parser` option is `parseDefaultHeader` as default. |

## Returns

`Locale`

A first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`.

## Description

wrap language tag with Intl.Locale \| locale, languages tags will be parsed from `accept-language` header as default.

## Example

example for Hono:

```ts
import { Hono } from 'hono'
import { getHeaderLocale } from '@intlify/utils/hono'

const app = new Hono()
app.use('/', c => {
  const locale = getHeaderLocale(c)
  // ...
  return c.text(`accepted language: ${locale.toString()}`)
})
```

## Throws

Throws the `RangeError` if `lang` option or header are not a well-formed BCP 47 language tag.
