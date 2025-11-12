[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [node](../index.md) / getHeaderLanguages

# Function: getHeaderLanguages()

```ts
function getHeaderLanguages(request, options): string[];
```

get languages from header

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `IncomingMessage` | The IncomingMessage \| request |
| `options` | `HeaderOptions` | The HeaderOptions \| header options object. `name` option is `accept-language` as default. |

## Returns

`string`[]

The array of language tags, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array.

## Description

parse header string, default `accept-language` header

## Example

example for Node.js request:

```ts
import { createServer } from 'node:http'
import { getHeaderLanguages } from '@intlify/utils/node'

const server = createServer((req, res) => {
  const langTags = getHeaderLanguages(req)
  // ...
  res.writeHead(200)
  res.end(`detect accpect-languages: ${langTags.join(', ')}`)
})
```
