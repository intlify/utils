[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [h3](../index.md) / getHeaderLanguage

# ~~Function: getHeaderLanguage()~~

```ts
function getHeaderLanguage(event, options): string;
```

get language from header

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `H3Event` | The H3Event \| H3 event |
| `options` | `HeaderOptions` | The HeaderOptions \| header options object |

## Returns

`string`

The **first language tag** of header, if header is not exists, or `*` (any language), return empty string.

## Description

parse header string, default `accept-language`. if you use `accept-language`, this function returns the **first language tag** of `accept-language` header.

## Example

example for h3:

```ts
import { createApp, eventHandler } from 'h3'
import { getAcceptLanguage } from '@intlify/utils/h3'

const app = createApp()
app.use(eventHandler(event) => {
  const langTag = getHeaderLanguage(event)
  // ...
  return `accepted language: ${langTag}`
})
```

## Deprecated

since v2. Use `getHeaderLanguage` of `@intlify/utils` instead.
