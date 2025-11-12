[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [hono](../index.md) / getHeaderLanguage

# ~~Function: getHeaderLanguage()~~

```ts
function getHeaderLanguage(context, options): string;
```

get language from header

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `Context` | A Context \| Hono context |
| `options` | `HeaderOptions` | The HeaderOptions \| header options object |

## Returns

`string`

A **first language tag** of header, if header is not exists, or `*` (any language), return empty string.

## Description

parse header string, default `accept-language`. if you use `accept-language`, this function returns the **first language tag** of `accept-language` header.

## Example

example for Hone:

```ts
import { Hono } from 'hono'
import { getHeaderLanguage } from '@intlify/utils/hono'

const app = new Hono()
app.use('/', c => {
  const langTag = getHeaderLanguage(c)
  // ...
  return c.text(`accepted language: ${langTag}`)
})
```

## Deprecated

since v2. Use `getHeaderLanguage` of `@intlify/utils` instead.
