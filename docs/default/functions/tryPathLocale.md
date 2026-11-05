# Function: tryPathLocale()

try to get the locale from the path

## Signature

```ts
export function tryPathLocale(request: Request, options: PathOptions = {}): Intl.Locale | null
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `request` | `Request` | the request |
| `options` | `PathOptions` | the path options object _(optional, default: {})_ |

## Returns

`Intl.Locale | null` — The locale that resolved from path. if the language in the path, that is not a well-formed BCP 47 language tag, return `null`.

## Tags

- `@description` — Unlike [`getPathLocale`](/docs/default/functions/getPathLocale.md), this function does not throw an error if the locale cannot be obtained, this function returns `null`.
