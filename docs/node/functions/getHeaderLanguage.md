[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [node](../index.md) / getHeaderLanguage

# Function: getHeaderLanguage()

```ts
function getHeaderLanguage(request, options): string;
```

get language from header

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `IncomingMessage` | The IncomingMessage \| request |
| `options` | `HeaderOptions` | The HeaderOptions \| header options object |

## Returns

`string`

The **first language tag** of header, if header is not exists, or `*` (any language), return empty string.

## Description

parse header string, default `accept-language`. if you use `accept-language`, this function returns the **first language tag** of `accept-language` header.

## Example

example for Node.js request:

```ts
import { createServer } from 'node:http'
import { getHeaderLanguage } from '@intlify/utils/node'

const server = createServer((req, res) => {
  const langTag = getHeaderLanguage(req)
  // ...
  res.writeHead(200)
  res.end(`detect accpect-language: ${langTag}`)
})
```
