# Function: tryHeaderLocales()

try to get locales from header

## Signature

```ts
export function tryHeaderLocales(request: IncomingMessage, options: HeaderOptions = {}): Intl.Locale[] | null
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `request` | `IncomingMessage` | The request |
| `options` | `HeaderOptions` | The header options object _(optional, default: {})_ |

## Returns

`Intl.Locale[] | null` — The locales that wrapped from header, if you use `accept-language` header and `*` (any language) or empty string is detected, return an empty array. if header are not a well-formed BCP 47 language tag, return `null`.

## Tags

- `@description` — wrap language tags with locale, languages tags will be parsed from `accept-language` header as default. Unlike [getHeaderLocales](/docs/node/functions/getHeaderLocales.md), this function does not throw an error if the locale cannot be obtained, this function returns `null`.
