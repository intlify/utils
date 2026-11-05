# Function: tryHeaderLocale()

try to get locale from header

## Signature

```ts
export function tryHeaderLocale(request: IncomingMessage, options: HeaderOptions & { lang?: string } = {}): Intl.Locale | null
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `request` | `IncomingMessage` | The request |
| `options` | `HeaderOptions & { lang?: string }` | The header options object _(optional, default: {})_ |

## Returns

`Intl.Locale | null` — The first locale that resolved from header string. if you use `accept-language` header and `*` (any language) or empty string is detected, return `en-US`. if `lang` option or header are not a well-formed BCP 47 language tag, return `null`.

## Tags

- `@description` — wrap language tag with locale, languages tags will be parsed from `accept-language` header as default. Unlike [getHeaderLocale](/docs/node/functions/getHeaderLocale.md), this function does not throw an error if the locale cannot be obtained, this function returns `null`.
