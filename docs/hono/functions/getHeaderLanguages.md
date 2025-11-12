[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [hono](../index.md) / getHeaderLanguages

# ~~Function: getHeaderLanguages()~~

```ts
function getHeaderLanguages(context, options): string[];
```

get languages from header

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `Context` | A Context \| Hono context |
| `options` | `HeaderOptions` | The HeaderOptions \| header options object. `name` option is `accept-language` as default. |

## Returns

`string`[]

An array of language tags, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.

## Description

parse header string, default `accept-language` header

## Example

example for Hono

```ts
import { Hono } from 'hono'
import { getHeaderLanguages } from '@intlify/utils/hono'

const app = new Hono()
app.use('/', c => {
  const langTags = getHeaderLanguages(c)
  // ...
  return c.text(`accepted languages: ${acceptLanguages.join(', ')}`)
})
```

## Deprecated

since v2. Use `getHeaderLanguages` of `@intlify/utils` instead.
