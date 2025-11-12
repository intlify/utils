[**@intlify/utils**](../../index.md)

***

[@intlify/utils](../../index.md) / [default](../index.md) / parseAcceptLanguage

# Function: parseAcceptLanguage()

```ts
function parseAcceptLanguage(value): string[];
```

parse `accept-language` header string

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | The accept-language header string |

## Returns

`string`[]

The array of language tags, if `*` (any language) or empty string is detected, return an empty array.
