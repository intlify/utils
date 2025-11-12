[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [node](../index.md) / getHeaderLocale

# Function: getHeaderLocale()

```ts
function getHeaderLocale(request, options): Locale;
```

get locale from header

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `IncomingMessage` | The IncomingMessage \| request |
| `options` | `HeaderOptions` & `object` | The HeaderOptions \| header options object. `lang` option is `en-US` as default, you must specify the language tag with the [BCP 47 syntax](https://datatracker.ietf.org/doc/html/rfc4646#section-2.1). `name` option is `accept-language` as default, and `parser` option is `parseDefaultHeader` as default. |

## Returns

`Locale`

The first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`.

## Description

wrap language tag with Intl.Locale \| locale, languages tags will be parsed from `accept-language` header as default.

## Example

example for Node.js request:

```ts
import { createServer } from 'node:http'
import { getHeaderLocale } from '@intlify/utils/node'

const server = createServer((req, res) => {
  const locale = getHeaderLocale(req)
  // ...
  res.writeHead(200)
  res.end(`accpected locale: ${locale.toString()}`)
})
```

## Throws

Throws the `RangeError` if `lang` option or header are not a well-formed BCP 47 language tag.
