# Function: tryCookieLocale()

try to get locale from cookie

## Signature

```ts
export function tryCookieLocale(request: IncomingMessage, options: CookieLocaleOptions = {}): Intl.Locale | null
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `request` | `IncomingMessage` | The request |
| `options` | `CookieLocaleOptions` | The cookie locale options _(optional, default: {})_ |

## Returns

`Intl.Locale | null` — The locale that resolved from cookie. if `lang` option or cookie name value are not a well-formed BCP 47 language tag, return `null`.

## Tags

- `@description` — Unlike [getCookieLocale](/docs/node/functions/getCookieLocale.md), this function does not throw an error if the locale cannot be obtained, this function returns `null`.
