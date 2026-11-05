# Function: parseAcceptLanguage()

parse `accept-language` header string

## Signature

```ts
export function parseAcceptLanguage(value: string): string[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `value` | `string` | The accept-language header string |

## Returns

`string[]` — The array of language tags, if `*` (any language) or empty string is detected, return an empty array.
